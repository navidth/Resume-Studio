import {
  BookOpen,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Info,
  Languages,
  Layers,
  Lightbulb,
  Plus,
  Trash2,
  Wrench,
} from "lucide-react";
import {
  blankEducation,
  blankExtra,
  blankLanguage,
  blankProject,
  blankSkill,
  blankJob,
  useResumeStore,
} from "../../store";
import { Button, EmptyState, IconButton, LinesField, TextField } from "../ui";
import { ItemCard } from "./ItemCard";
import { SectionPanel } from "./SectionPanel";

/* ------------------------------------------------------------------ */
/* Personal                                                            */
/* ------------------------------------------------------------------ */
export function PersonalSection() {
  const p = useResumeStore((s) => s.data.personal);
  const set = useResumeStore((s) => s.setPersonal);

  return (
    <SectionPanel title="Personal details" description="Name, headline and the contact line at the top of the resume.">
      <div className="card">
        <div className="card-body grid">
          <TextField className="span-2" label="Full name" value={p.name} onChange={(v) => set({ name: v })} placeholder="Navid Taheri" />
          <TextField label="Headline" value={p.headline} onChange={(v) => set({ headline: v })} placeholder="Senior Front-End Engineer" />
          <TextField
            label="Core stack"
            optional
            value={p.headlineStack}
            onChange={(v) => set({ headlineStack: v })}
            placeholder="React  ·  Next.js  ·  TypeScript"
            hint="Shown next to the headline."
          />
          <TextField label="Location" value={p.location} onChange={(v) => set({ location: v })} placeholder="Tehran, Iran" />
          <TextField label="Phone" value={p.phone} onChange={(v) => set({ phone: v })} placeholder="+98 9xx xxx xxxx" type="tel" />
          <TextField label="Email" value={p.email} onChange={(v) => set({ email: v })} placeholder="name@example.com" type="email" />
          <TextField label="LinkedIn" optional value={p.linkedin} onChange={(v) => set({ linkedin: v })} placeholder="linkedin.com/in/username" />
          <TextField label="GitHub" optional value={p.github} onChange={(v) => set({ github: v })} placeholder="github.com/username" />
          <TextField label="Website" optional value={p.website} onChange={(v) => set({ website: v })} placeholder="yoursite.dev" />
        </div>
      </div>
      <div className="tip">
        <Lightbulb size={15} />
        <span>Links are written without “https://” in the resume and still open correctly in the PDF and Word files.</span>
      </div>
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */
export function SummarySection() {
  const summary = useResumeStore((s) => s.data.summary);
  const setSummary = useResumeStore((s) => s.setSummary);
  const words = summary.trim() ? summary.trim().split(/\s+/).length : 0;

  return (
    <SectionPanel title="Professional summary" description="Three to five sentences: seniority, domain, core stack, and what you are known for." headingKey="summary">
      <div className="card">
        <div className="card-body">
          <TextField
            label="Summary"
            multiline
            rows={8}
            value={summary}
            onChange={setSummary}
            placeholder="Senior Front-End Engineer with 4+ years of experience building…"
            hint={`${words} words · aim for 70–110`}
          />
        </div>
      </div>
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */
export function SkillsSection() {
  const skills = useResumeStore((s) => s.data.skills);
  const { addItem, updateItem, removeItem, moveItem } = useResumeStore();

  const add = () => addItem("skills", blankSkill());

  return (
    <SectionPanel
      title="Technical skills"
      description="Grouped rows: a category label followed by a comma-separated list."
      headingKey="skills"
      action={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={add}>
          Add row
        </Button>
      }
    >
      {skills.length === 0 ? (
        <EmptyState
          icon={<Wrench size={26} />}
          title="No skill rows yet"
          text="Group skills by category, e.g. “Frameworks: React, Next.js, Vue”."
          action={<Button variant="soft" size="sm" icon={<Plus size={15} />} onClick={add}>Add first row</Button>}
        />
      ) : (
        <div className="stack">
          {skills.map((row, i) => (
            <div className="rowline" key={row.id}>
              <TextField label="Category" value={row.label} onChange={(v) => updateItem("skills", row.id, { label: v })} placeholder="Frameworks" />
              <TextField label="Skills" value={row.items} onChange={(v) => updateItem("skills", row.id, { items: v })} placeholder="React, Next.js, TypeScript" />
              <RowActions index={i} total={skills.length} onMove={(d) => moveItem("skills", row.id, d)} onRemove={() => removeItem("skills", row.id)} />
            </div>
          ))}
          <div className="add-row">
            <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add another row</Button>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}

function RowActions({ index, total, onMove, onRemove }: { index: number; total: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  return (
    <div className="row-actions">
      <IconButton label="Move up" onClick={() => onMove(-1)} disabled={index === 0}>
        <span aria-hidden>↑</span>
      </IconButton>
      <IconButton label="Move down" onClick={() => onMove(1)} disabled={index === total - 1}>
        <span aria-hidden>↓</span>
      </IconButton>
      <IconButton label="Delete" danger onClick={onRemove}>
        <Trash2 size={15} />
      </IconButton>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Experience                                                          */
/* ------------------------------------------------------------------ */
export function ExperienceSection() {
  const jobs = useResumeStore((s) => s.data.experience);
  const { addItem, updateItem, removeItem, moveItem, duplicateItem, addGroup, updateGroup, removeGroup, moveGroup } = useResumeStore();

  const add = () => addItem("experience", blankJob());

  return (
    <SectionPanel
      title="Work experience"
      description="Most recent first. Each role can have general highlights and named products or sub-projects."
      headingKey="experience"
      action={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={add}>
          Add role
        </Button>
      }
    >
      {jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase size={26} />}
          title="No roles yet"
          text="Add your current or most recent position first."
          action={<Button variant="soft" size="sm" icon={<Plus size={15} />} onClick={add}>Add first role</Button>}
        />
      ) : (
        <div className="stack">
          {jobs.map((job, i) => (
            <ItemCard
              key={job.id}
              title={job.title}
              placeholder="New role"
              subtitle={[job.company, job.dates].filter(Boolean).join("  ·  ")}
              index={i}
              total={jobs.length}
              onMove={(d) => moveItem("experience", job.id, d)}
              onRemove={() => removeItem("experience", job.id)}
              onDuplicate={() => duplicateItem("experience", job.id)}
            >
              <div className="grid">
                <TextField label="Job title" value={job.title} onChange={(v) => updateItem("experience", job.id, { title: v })} placeholder="Senior Front-End Engineer" />
                <TextField label="Company" value={job.company} onChange={(v) => updateItem("experience", job.id, { company: v })} placeholder="Company name" />
                <TextField label="Dates" value={job.dates} onChange={(v) => updateItem("experience", job.id, { dates: v })} placeholder="Apr 2026 – Present" />
                <TextField label="Location" optional value={job.location} onChange={(v) => updateItem("experience", job.id, { location: v })} placeholder="Tehran, Iran" />
                <TextField
                  className="span-2"
                  label="Role note"
                  optional
                  value={job.note}
                  onChange={(v) => updateItem("experience", job.id, { note: v })}
                  placeholder="Sole front-end developer, owning architecture through delivery"
                />
                <TextField label="Company link text" optional value={job.linkText} onChange={(v) => updateItem("experience", job.id, { linkText: v })} placeholder="company.com" />
                <TextField label="Company link URL" optional value={job.linkUrl} onChange={(v) => updateItem("experience", job.id, { linkUrl: v })} placeholder="https://company.com" />
                <LinesField
                  className="span-2"
                  label="Highlights"
                  lines={job.bullets}
                  onChange={(lines) => updateItem("experience", job.id, { bullets: lines })}
                  placeholder={"Developed four production products with React…\nHardened front-end security with…"}
                  hint="One bullet per line. Start each with a strong verb and include measurable results."
                  rows={4}
                />
              </div>

              <div className="subblock">
                <div className="subblock-head">
                  <div>
                    <h4>
                      <Layers size={14} /> Products &amp; sub-projects
                    </h4>
                    <p>Optional named groups under this role, each with its own tech line, link and bullets.</p>
                  </div>
                  <Button variant="soft" size="sm" icon={<Plus size={14} />} onClick={() => addGroup(job.id)}>
                    Add product
                  </Button>
                </div>
                {job.groups.map((g, gi) => (
                  <ItemCard
                    key={g.id}
                    title={g.name}
                    placeholder="New product"
                    subtitle={g.tech}
                    index={gi}
                    total={job.groups.length}
                    onMove={(d) => moveGroup(job.id, g.id, d)}
                    onRemove={() => removeGroup(job.id, g.id)}
                  >
                    <div className="grid">
                      <TextField label="Product name" value={g.name} onChange={(v) => updateGroup(job.id, g.id, { name: v })} placeholder="Fazayesh – Precision Agriculture" />
                      <TextField label="Tech stack" optional value={g.tech} onChange={(v) => updateGroup(job.id, g.id, { tech: v })} placeholder="React, Leaflet.js, Socket.IO" />
                      <TextField label="Link text" optional value={g.linkText} onChange={(v) => updateGroup(job.id, g.id, { linkText: v })} placeholder="product.example.com" />
                      <TextField label="Link URL" optional value={g.linkUrl} onChange={(v) => updateGroup(job.id, g.id, { linkUrl: v })} placeholder="https://product.example.com" />
                      <LinesField
                        className="span-2"
                        label="Highlights"
                        lines={g.bullets}
                        onChange={(lines) => updateGroup(job.id, g.id, { bullets: lines })}
                        placeholder="Built real-time satellite monitoring of farms…"
                        hint="One bullet per line."
                        rows={3}
                      />
                    </div>
                  </ItemCard>
                ))}
              </div>
            </ItemCard>
          ))}
          <div className="add-row">
            <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add another role</Button>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Projects                                                            */
/* ------------------------------------------------------------------ */
export function ProjectsSection() {
  const projects = useResumeStore((s) => s.data.projects);
  const { addItem, updateItem, removeItem, moveItem, duplicateItem } = useResumeStore();
  const add = () => addItem("projects", blankProject());

  return (
    <SectionPanel
      title="Projects"
      description="Personal or open-source work that shows skills your jobs do not."
      headingKey="projects"
      action={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={add}>
          Add project
        </Button>
      }
    >
      {projects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 size={26} />}
          title="No projects yet"
          text="Side projects with a live link carry real weight with reviewers."
          action={<Button variant="soft" size="sm" icon={<Plus size={15} />} onClick={add}>Add first project</Button>}
        />
      ) : (
        <div className="stack">
          {projects.map((pr, i) => (
            <ItemCard
              key={pr.id}
              title={pr.name}
              placeholder="New project"
              subtitle={pr.tech}
              index={i}
              total={projects.length}
              onMove={(d) => moveItem("projects", pr.id, d)}
              onRemove={() => removeItem("projects", pr.id)}
              onDuplicate={() => duplicateItem("projects", pr.id)}
            >
              <div className="grid">
                <TextField className="span-2" label="Project name" value={pr.name} onChange={(v) => updateItem("projects", pr.id, { name: v })} placeholder="E-Commerce Online Store (Personal Project)" />
                <TextField className="span-2" label="Tech stack" optional value={pr.tech} onChange={(v) => updateItem("projects", pr.id, { tech: v })} placeholder="Next.js, Redux Toolkit, Node.js, MongoDB" />
                <TextField label="Link text" optional value={pr.linkText} onChange={(v) => updateItem("projects", pr.id, { linkText: v })} placeholder="myshop.vercel.app" />
                <TextField label="Link URL" optional value={pr.linkUrl} onChange={(v) => updateItem("projects", pr.id, { linkUrl: v })} placeholder="https://myshop.vercel.app" />
                <LinesField
                  className="span-2"
                  label="Highlights"
                  lines={pr.bullets}
                  onChange={(lines) => updateItem("projects", pr.id, { bullets: lines })}
                  placeholder="Built a full-stack online store with…"
                  hint="One bullet per line."
                />
              </div>
            </ItemCard>
          ))}
          <div className="add-row">
            <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add another project</Button>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */
export function EducationSection() {
  const education = useResumeStore((s) => s.data.education);
  const { addItem, updateItem, removeItem, moveItem } = useResumeStore();
  const add = () => addItem("education", blankEducation());

  return (
    <SectionPanel
      title="Education"
      description="Degrees in reverse chronological order."
      headingKey="education"
      action={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={add}>
          Add degree
        </Button>
      }
    >
      {education.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={26} />}
          title="No education yet"
          text="Add your highest or most recent degree first."
          action={<Button variant="soft" size="sm" icon={<Plus size={15} />} onClick={add}>Add first degree</Button>}
        />
      ) : (
        <div className="stack">
          {education.map((e, i) => (
            <ItemCard
              key={e.id}
              title={e.degree}
              placeholder="New degree"
              subtitle={[e.school, e.dates].filter(Boolean).join("  ·  ")}
              index={i}
              total={education.length}
              onMove={(d) => moveItem("education", e.id, d)}
              onRemove={() => removeItem("education", e.id)}
            >
              <div className="grid">
                <TextField className="span-2" label="Degree" value={e.degree} onChange={(v) => updateItem("education", e.id, { degree: v })} placeholder="B.Sc. in Computer Engineering" />
                <TextField label="Institution" value={e.school} onChange={(v) => updateItem("education", e.id, { school: v })} placeholder="University of Damghan" />
                <TextField label="Dates" value={e.dates} onChange={(v) => updateItem("education", e.id, { dates: v })} placeholder="Oct 2019 – Dec 2024" />
                <TextField label="Location" optional value={e.location} onChange={(v) => updateItem("education", e.id, { location: v })} placeholder="Damghan, Iran" />
                <TextField label="Details" optional value={e.details} onChange={(v) => updateItem("education", e.id, { details: v })} placeholder="Thesis topic, GPA, honours…" />
              </div>
            </ItemCard>
          ))}
          <div className="add-row">
            <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add another degree</Button>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Courses                                                             */
/* ------------------------------------------------------------------ */
export function CoursesSection() {
  const courses = useResumeStore((s) => s.data.courses);
  const setCourses = useResumeStore((s) => s.setCourses);

  return (
    <SectionPanel title="Courses & training" description="Short, one per line. Rendered as a compact inline list." headingKey="courses">
      <div className="card">
        <div className="card-body">
          <LinesField
            label="Courses"
            lines={courses}
            onChange={setCourses}
            rows={6}
            placeholder={"JavaScript & TypeScript (SabzLearn)\nNode.js & MongoDB (NeonLearn)"}
            hint="Include the provider and, where useful, the year."
          />
        </div>
      </div>
      <div className="tip">
        <BookOpen size={15} />
        <span>Leave this empty to hide the section from the resume.</span>
      </div>
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Languages                                                           */
/* ------------------------------------------------------------------ */
export function LanguagesSection() {
  const languages = useResumeStore((s) => s.data.languages);
  const { addItem, updateItem, removeItem, moveItem } = useResumeStore();
  const add = () => addItem("languages", blankLanguage());

  return (
    <SectionPanel
      title="Languages"
      description="Shown as one line under Additional Information, e.g. “Persian (Native), English (Intermediate)”."
      action={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={add}>
          Add language
        </Button>
      }
    >
      {languages.length === 0 ? (
        <EmptyState
          icon={<Languages size={26} />}
          title="No languages yet"
          text="List your native language first, then others with a level."
          action={<Button variant="soft" size="sm" icon={<Plus size={15} />} onClick={add}>Add first language</Button>}
        />
      ) : (
        <div className="stack">
          {languages.map((l, i) => (
            <div className="rowline two" key={l.id}>
              <TextField label="Language" value={l.name} onChange={(v) => updateItem("languages", l.id, { name: v })} placeholder="English" />
              <TextField label="Level" value={l.level} onChange={(v) => updateItem("languages", l.id, { level: v })} placeholder="Intermediate / B2 / Native" />
              <RowActions index={i} total={languages.length} onMove={(d) => moveItem("languages", l.id, d)} onRemove={() => removeItem("languages", l.id)} />
            </div>
          ))}
          <div className="add-row">
            <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add another language</Button>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}

/* ------------------------------------------------------------------ */
/* Additional information                                              */
/* ------------------------------------------------------------------ */
export function AdditionalSection() {
  const rows = useResumeStore((s) => s.data.additional);
  const { addItem, updateItem, removeItem, moveItem } = useResumeStore();
  const add = () => addItem("additional", blankExtra());

  return (
    <SectionPanel
      title="Additional information"
      description="Label / value rows such as military service, certifications or availability."
      headingKey="additional"
      action={
        <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={add}>
          Add row
        </Button>
      }
    >
      {rows.length === 0 ? (
        <EmptyState
          icon={<Info size={26} />}
          title="No extra rows"
          text="Iranian employers usually expect military service status here."
          action={<Button variant="soft" size="sm" icon={<Plus size={15} />} onClick={add}>Add first row</Button>}
        />
      ) : (
        <div className="stack">
          {rows.map((r, i) => (
            <div className="rowline" key={r.id}>
              <TextField label="Label" value={r.label} onChange={(v) => updateItem("additional", r.id, { label: v })} placeholder="Military Service" />
              <TextField label="Value" value={r.value} onChange={(v) => updateItem("additional", r.id, { value: v })} placeholder="Educational Exemption" />
              <RowActions index={i} total={rows.length} onMove={(d) => moveItem("additional", r.id, d)} onRemove={() => removeItem("additional", r.id)} />
            </div>
          ))}
          <div className="add-row">
            <Button variant="ghost" size="sm" icon={<Plus size={15} />} onClick={add}>Add another row</Button>
          </div>
        </div>
      )}
    </SectionPanel>
  );
}
