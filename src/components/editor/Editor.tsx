import { AlignLeft, BookOpen, Briefcase, FolderGit2, GraduationCap, Info, Languages, User, Wrench } from "lucide-react";
import type { ReactNode } from "react";
import { useShallow } from "zustand/react/shallow";
import { useResumeStore } from "../../store";
import type { SectionKey } from "../../types";
import {
  AdditionalSection,
  CoursesSection,
  EducationSection,
  ExperienceSection,
  LanguagesSection,
  PersonalSection,
  ProjectsSection,
  SkillsSection,
  SummarySection,
} from "./sections";

interface NavItem {
  key: SectionKey;
  label: string;
  icon: ReactNode;
}

export const NAV: NavItem[] = [
  { key: "personal", label: "Personal", icon: <User size={17} /> },
  { key: "summary", label: "Summary", icon: <AlignLeft size={17} /> },
  { key: "skills", label: "Skills", icon: <Wrench size={17} /> },
  { key: "experience", label: "Experience", icon: <Briefcase size={17} /> },
  { key: "projects", label: "Projects", icon: <FolderGit2 size={17} /> },
  { key: "education", label: "Education", icon: <GraduationCap size={17} /> },
  { key: "courses", label: "Courses", icon: <BookOpen size={17} /> },
  { key: "languages", label: "Languages", icon: <Languages size={17} /> },
  { key: "additional", label: "Additional", icon: <Info size={17} /> },
];

export function SectionRail({ active, onSelect }: { active: SectionKey; onSelect: (k: SectionKey) => void }) {
  const counts = useResumeStore(
    useShallow((s) => ({
    skills: s.data.skills.length,
    experience: s.data.experience.length,
    projects: s.data.projects.length,
    education: s.data.education.length,
    courses: s.data.courses.filter((c) => c.trim()).length,
    languages: s.data.languages.length,
    additional: s.data.additional.length,
    })),
  );

  return (
    <nav className="rail" aria-label="Resume sections">
      <div className="rail-label">Sections</div>
      {NAV.map((item) => {
        const n = (counts as Record<string, number | undefined>)[item.key];
        return (
          <button
            key={item.key}
            type="button"
            className="rail-item"
            aria-current={active === item.key}
            onClick={() => onSelect(item.key)}
            title={item.label}
          >
            {item.icon}
            <span className="label">{item.label}</span>
            {typeof n === "number" && <span className="count">{n}</span>}
          </button>
        );
      })}
      <div className="rail-footer">Changes are saved in this browser automatically.</div>
    </nav>
  );
}

export function EditorPanel({ section }: { section: SectionKey }) {
  return (
    <section className="editor" aria-label="Editor">
      {section === "personal" && <PersonalSection />}
      {section === "summary" && <SummarySection />}
      {section === "skills" && <SkillsSection />}
      {section === "experience" && <ExperienceSection />}
      {section === "projects" && <ProjectsSection />}
      {section === "education" && <EducationSection />}
      {section === "courses" && <CoursesSection />}
      {section === "languages" && <LanguagesSection />}
      {section === "additional" && <AdditionalSection />}
    </section>
  );
}
