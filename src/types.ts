export interface Link {
  text: string;
  url: string;
}

export interface Personal {
  name: string;
  headline: string;
  headlineStack: string;
  location: string;
  phone: string;
  email: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface SkillRow {
  id: string;
  label: string;
  items: string;
}

export interface ProductGroup {
  id: string;
  name: string;
  tech: string;
  linkText: string;
  linkUrl: string;
  bullets: string[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  note: string;
  dates: string;
  linkText: string;
  linkUrl: string;
  bullets: string[];
  groups: ProductGroup[];
}

export interface Project {
  id: string;
  name: string;
  tech: string;
  linkText: string;
  linkUrl: string;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  school: string;
  location: string;
  dates: string;
  details: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string;
}

export interface ExtraRow {
  id: string;
  label: string;
  value: string;
}

export interface SectionTitles {
  summary: string;
  skills: string;
  experience: string;
  projects: string;
  education: string;
  courses: string;
  additional: string;
}

export interface ResumeData {
  personal: Personal;
  summary: string;
  skills: SkillRow[];
  experience: Job[];
  projects: Project[];
  education: EducationItem[];
  courses: string[];
  languages: LanguageItem[];
  additional: ExtraRow[];
  titles: SectionTitles;
}

export type SectionKey =
  | "personal"
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "courses"
  | "languages"
  | "additional";
