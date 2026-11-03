import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  EducationItem,
  ExtraRow,
  Job,
  LanguageItem,
  Personal,
  ProductGroup,
  Project,
  ResumeData,
  SectionTitles,
  SkillRow,
} from "./types";
import { DEFAULT_TITLES, emptyResume, sampleResume } from "./defaultData";
import { uid } from "./utils/id";

export type ListKey = "skills" | "experience" | "projects" | "education" | "languages" | "additional";

type ListItem<K extends ListKey> = ResumeData[K] extends Array<infer T> ? T : never;

export const blankSkill = (): SkillRow => ({ id: uid(), label: "", items: "" });
export const blankGroup = (): ProductGroup => ({ id: uid(), name: "", tech: "", linkText: "", linkUrl: "", bullets: [] });
export const blankJob = (): Job => ({
  id: uid(),
  title: "",
  company: "",
  location: "",
  note: "",
  dates: "",
  linkText: "",
  linkUrl: "",
  bullets: [],
  groups: [],
});
export const blankProject = (): Project => ({ id: uid(), name: "", tech: "", linkText: "", linkUrl: "", bullets: [] });
export const blankEducation = (): EducationItem => ({ id: uid(), degree: "", school: "", location: "", dates: "", details: "" });
export const blankLanguage = (): LanguageItem => ({ id: uid(), name: "", level: "" });
export const blankExtra = (): ExtraRow => ({ id: uid(), label: "", value: "" });

const moveInArray = <T,>(arr: T[], index: number, dir: -1 | 1): T[] => {
  const target = index + dir;
  if (index < 0 || target < 0 || target >= arr.length) return arr;
  const copy = arr.slice();
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
};

interface ResumeState {
  data: ResumeData;
  savedAt: number;

  setData: (data: ResumeData) => void;
  resetEmpty: () => void;
  loadSample: () => void;

  setPersonal: (patch: Partial<Personal>) => void;
  setSummary: (summary: string) => void;
  setTitle: (key: keyof SectionTitles, value: string) => void;
  setCourses: (courses: string[]) => void;

  addItem: <K extends ListKey>(key: K, item: ListItem<K>) => void;
  updateItem: <K extends ListKey>(key: K, id: string, patch: Partial<ListItem<K>>) => void;
  removeItem: (key: ListKey, id: string) => void;
  moveItem: (key: ListKey, id: string, dir: -1 | 1) => void;
  duplicateItem: (key: ListKey, id: string) => void;

  addGroup: (jobId: string) => void;
  updateGroup: (jobId: string, groupId: string, patch: Partial<ProductGroup>) => void;
  removeGroup: (jobId: string, groupId: string) => void;
  moveGroup: (jobId: string, groupId: string, dir: -1 | 1) => void;
}

/** Fill in any fields missing from an imported / older JSON so the UI never sees undefined. */
export function normalizeData(input: unknown): ResumeData {
  const base = emptyResume();
  if (!input || typeof input !== "object") return base;
  const src = input as Partial<ResumeData>;
  const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
  const withId = <T extends { id?: string }>(v: T): T => ({ ...v, id: v.id || uid() });

  return {
    personal: { ...base.personal, ...(src.personal ?? {}) },
    summary: typeof src.summary === "string" ? src.summary : "",
    skills: arr<SkillRow>(src.skills).map((s) => withId({ ...blankSkill(), ...s })),
    experience: arr<Job>(src.experience).map((j) =>
      withId({
        ...blankJob(),
        ...j,
        bullets: arr<string>(j.bullets),
        groups: arr<ProductGroup>(j.groups).map((g) => withId({ ...blankGroup(), ...g, bullets: arr<string>(g.bullets) })),
      }),
    ),
    projects: arr<Project>(src.projects).map((p) => withId({ ...blankProject(), ...p, bullets: arr<string>(p.bullets) })),
    education: arr<EducationItem>(src.education).map((e) => withId({ ...blankEducation(), ...e })),
    courses: arr<string>(src.courses).filter((c) => typeof c === "string"),
    languages: arr<LanguageItem>(src.languages).map((l) => withId({ ...blankLanguage(), ...l })),
    additional: arr<ExtraRow>(src.additional).map((a) => withId({ ...blankExtra(), ...a })),
    titles: { ...DEFAULT_TITLES, ...(src.titles ?? {}) },
  };
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => {
      const update = (fn: (d: ResumeData) => ResumeData) =>
        set((s) => ({ data: fn(s.data), savedAt: Date.now() }));

      return {
        data: sampleResume(),
        savedAt: Date.now(),

        setData: (data) => set({ data: normalizeData(data), savedAt: Date.now() }),
        resetEmpty: () => set({ data: emptyResume(), savedAt: Date.now() }),
        loadSample: () => set({ data: sampleResume(), savedAt: Date.now() }),

        setPersonal: (patch) => update((d) => ({ ...d, personal: { ...d.personal, ...patch } })),
        setSummary: (summary) => update((d) => ({ ...d, summary })),
        setTitle: (key, value) => update((d) => ({ ...d, titles: { ...d.titles, [key]: value } })),
        setCourses: (courses) => update((d) => ({ ...d, courses })),

        addItem: (key, item) => update((d) => ({ ...d, [key]: [...(d[key] as unknown[]), item] })),
        updateItem: (key, id, patch) =>
          update((d) => ({
            ...d,
            [key]: (d[key] as Array<{ id: string }>).map((it) => (it.id === id ? { ...it, ...patch } : it)),
          })),
        removeItem: (key, id) =>
          update((d) => ({ ...d, [key]: (d[key] as Array<{ id: string }>).filter((it) => it.id !== id) })),
        moveItem: (key, id, dir) =>
          update((d) => {
            const list = d[key] as Array<{ id: string }>;
            return { ...d, [key]: moveInArray(list, list.findIndex((it) => it.id === id), dir) };
          }),
        duplicateItem: (key, id) =>
          update((d) => {
            const list = d[key] as Array<{ id: string }>;
            const idx = list.findIndex((it) => it.id === id);
            if (idx < 0) return d;
            const clone = structuredClone(list[idx]) as { id: string; groups?: Array<{ id: string }> };
            clone.id = uid();
            if (clone.groups) clone.groups = clone.groups.map((g) => ({ ...g, id: uid() }));
            const copy = list.slice();
            copy.splice(idx + 1, 0, clone);
            return { ...d, [key]: copy };
          }),

        addGroup: (jobId) =>
          update((d) => ({
            ...d,
            experience: d.experience.map((j) => (j.id === jobId ? { ...j, groups: [...j.groups, blankGroup()] } : j)),
          })),
        updateGroup: (jobId, groupId, patch) =>
          update((d) => ({
            ...d,
            experience: d.experience.map((j) =>
              j.id === jobId ? { ...j, groups: j.groups.map((g) => (g.id === groupId ? { ...g, ...patch } : g)) } : j,
            ),
          })),
        removeGroup: (jobId, groupId) =>
          update((d) => ({
            ...d,
            experience: d.experience.map((j) =>
              j.id === jobId ? { ...j, groups: j.groups.filter((g) => g.id !== groupId) } : j,
            ),
          })),
        moveGroup: (jobId, groupId, dir) =>
          update((d) => ({
            ...d,
            experience: d.experience.map((j) =>
              j.id === jobId
                ? { ...j, groups: moveInArray(j.groups, j.groups.findIndex((g) => g.id === groupId), dir) }
                : j,
            ),
          })),
      };
    },
    {
      name: "resume-studio:v1",
      version: 1,
      partialize: (s) => ({ data: s.data, savedAt: s.savedAt }),
      merge: (persisted, current) => {
        const p = persisted as Partial<ResumeState> | undefined;
        return { ...current, data: p?.data ? normalizeData(p.data) : current.data, savedAt: p?.savedAt ?? current.savedAt };
      },
    },
  ),
);
