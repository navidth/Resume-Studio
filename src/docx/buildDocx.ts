import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Footer,
  HeadingLevel,
  LevelFormat,
  Packer,
  PageNumber,
  Paragraph,
  TabStopType,
  TextRun,
  type IRunOptions,
  type ParagraphChild,
} from "docx";
import type { ResumeData } from "../types";
import { normalizeUrl } from "../utils/text";

// Palette & metrics (identical to the PDF renderer, expressed in Word units).
const NAVY = "14284B";
const ACCENT = "2F5D8C";
const INK = "1F2933";
const BODY = "333D4A";
const MUTED = "5F6B7A";
const RULE = "BFCBDA";
const FONT = "Calibri";

const PAGE_W = 11906; // A4 in twips
const PAGE_H = 16838;
const MARGIN_X = 920;
const CONTENT_W = PAGE_W - 2 * MARGIN_X;
const RIGHT_TAB = [{ type: TabStopType.RIGHT, position: CONTENT_W }];

const has = (v: string | undefined | null): v is string => Boolean(v && v.trim());

const run = (text: string, opts: Omit<IRunOptions, "text" | "children"> = {}) => new TextRun({ text, ...opts });
const sep = () => run("  |  ", { color: RULE, size: 18 });

const link = (text: string, href: string, opts: Omit<IRunOptions, "text" | "children"> = {}) =>
  new ExternalHyperlink({ link: normalizeUrl(href), children: [run(text, { color: ACCENT, ...opts })] });

const sectionHeading = (text: string) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [run(text)] });

const bullet = (text: string, { keepNext = false } = {}) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 30 },
    keepNext,
    children: [run(text)],
  });

const entryHeader = (left: ParagraphChild[], right: ParagraphChild[], { first = true } = {}) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    tabStops: RIGHT_TAB,
    spacing: { before: first ? 0 : 170 },
    children: [...left, run("\t"), ...right],
  });

const entrySub = (children: ParagraphChild[]) => new Paragraph({ spacing: { after: 50 }, keepNext: true, children });

const groupHeader = (
  groupName: string,
  tech: string,
  { first, linkText, linkUrl }: { first: boolean; linkText: string; linkUrl: string },
) =>
  new Paragraph({
    keepNext: true,
    tabStops: RIGHT_TAB,
    spacing: { before: first ? 10 : 90, after: 30 },
    children: [
      run(groupName, { bold: true, color: NAVY }),
      ...(has(tech) ? [run("  |  ", { color: RULE }), run(tech, { italics: true, color: MUTED })] : []),
      ...(has(linkText) ? [run("\t"), link(linkText, linkUrl || linkText, { size: 19 })] : []),
    ],
  });

const dateRun = (text: string) => run(text, { bold: false, color: MUTED, size: 19 });

const labelRow = (label: string, value: string) =>
  new Paragraph({
    spacing: { after: 35 },
    children: [...(has(label) ? [run(`${label.trim()}: `, { bold: true, color: NAVY })] : []), run(value)],
  });

export function buildDocx(data: ResumeData): Document {
  const { personal: p, titles } = data;
  const name = p.name || "Resume";
  const children: Paragraph[] = [];

  // ---------- Header ----------
  children.push(new Paragraph({ heading: HeadingLevel.TITLE, children: [run(p.name || "Your Name")] }));

  if (has(p.headline) || has(p.headlineStack)) {
    const parts: ParagraphChild[] = [];
    if (has(p.headline)) parts.push(run(p.headline, { bold: true, color: ACCENT, size: 25 }));
    if (has(p.headline) && has(p.headlineStack)) parts.push(run("   |   ", { color: RULE, size: 25 }));
    if (has(p.headlineStack)) parts.push(run(p.headlineStack, { color: ACCENT, size: 25 }));
    children.push(new Paragraph({ spacing: { after: 70 }, children: parts }));
  }

  const contact: ParagraphChild[] = [];
  const pushContact = (node: ParagraphChild) => {
    if (contact.length) contact.push(sep());
    contact.push(node);
  };
  if (has(p.location)) pushContact(run(p.location, { color: MUTED, size: 18 }));
  if (has(p.phone)) pushContact(run(p.phone, { color: MUTED, size: 18 }));
  if (has(p.email)) pushContact(link(p.email.trim(), `mailto:${p.email.trim()}`, { size: 18 }));
  if (has(p.linkedin)) pushContact(link(p.linkedin.trim(), p.linkedin, { size: 18 }));
  if (has(p.github)) pushContact(link(p.github.trim(), p.github, { size: 18 }));
  if (has(p.website)) pushContact(link(p.website.trim(), p.website, { size: 18 }));
  children.push(
    new Paragraph({
      spacing: { after: 40 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: NAVY, space: 8 } },
      children: contact,
    }),
  );

  // ---------- Summary ----------
  if (has(data.summary)) {
    children.push(sectionHeading(titles.summary), new Paragraph({ children: [run(data.summary)] }));
  }

  // ---------- Skills ----------
  const skills = data.skills.filter((r) => has(r.label) || has(r.items));
  if (skills.length) {
    children.push(sectionHeading(titles.skills));
    for (const r of skills) children.push(labelRow(r.label, r.items));
  }

  // ---------- Experience ----------
  const experience = data.experience.filter((j) => has(j.title) || has(j.company));
  if (experience.length) {
    children.push(sectionHeading(titles.experience));
    experience.forEach((job, i) => {
      const sub: ParagraphChild[] = [];
      if (has(job.company)) sub.push(run(job.company, { bold: true, color: ACCENT }));
      if (has(job.location)) sub.push(run(`  ·  ${job.location}`, { color: MUTED }));
      if (has(job.note)) sub.push(run(`  ·  ${job.note}`, { italics: true, color: MUTED }));
      if (has(job.linkText)) sub.push(run("  ·  ", { color: MUTED }), link(job.linkText, job.linkUrl || job.linkText));
      children.push(entryHeader([run(job.title)], has(job.dates) ? [dateRun(job.dates)] : [], { first: i === 0 }));
      if (sub.length) children.push(entrySub(sub));

      const jobBullets = job.bullets.filter(has);
      children.push(...jobBullets.map((b) => bullet(b)));

      // Each product group stays on one page: chain keepNext through all but its last bullet.
      job.groups
        .filter((g) => has(g.name) || g.bullets.some(has))
        .forEach((g, gi) => {
          const bullets = g.bullets.filter(has);
          children.push(
            groupHeader(g.name, g.tech, { first: gi === 0 && jobBullets.length === 0, linkText: g.linkText, linkUrl: g.linkUrl }),
            ...bullets.map((b, bi) => bullet(b, { keepNext: bi < bullets.length - 1 })),
          );
        });
    });
  }

  // ---------- Projects ----------
  const projects = data.projects.filter((pr) => has(pr.name));
  if (projects.length) {
    children.push(sectionHeading(titles.projects));
    projects.forEach((pr, i) => {
      const left: ParagraphChild[] = [run(pr.name)];
      if (has(pr.tech)) {
        left.push(run("  |  ", { bold: false, color: RULE }), run(pr.tech, { bold: false, italics: true, color: MUTED }));
      }
      const right: ParagraphChild[] = has(pr.linkText) ? [link(pr.linkText, pr.linkUrl || pr.linkText, { bold: false, size: 19 })] : [];
      children.push(entryHeader(left, right, { first: i === 0 }), ...pr.bullets.filter(has).map((b) => bullet(b)));
    });
  }

  // ---------- Education ----------
  const education = data.education.filter((e) => has(e.degree) || has(e.school));
  if (education.length) {
    children.push(sectionHeading(titles.education));
    education.forEach((e, i) => {
      const sub: ParagraphChild[] = [];
      if (has(e.school)) sub.push(run(e.school, { bold: true, color: ACCENT }));
      if (has(e.location)) sub.push(run(`  ·  ${e.location}`, { color: MUTED }));
      children.push(entryHeader([run(e.degree)], has(e.dates) ? [dateRun(e.dates)] : [], { first: i === 0 }));
      if (sub.length) children.push(entrySub(sub));
      if (has(e.details)) children.push(new Paragraph({ spacing: { after: 40 }, children: [run(e.details)] }));
    });
  }

  // ---------- Courses ----------
  const courses = data.courses.filter(has);
  if (courses.length) {
    children.push(
      sectionHeading(titles.courses),
      new Paragraph({
        // Non-breaking spaces keep each course name on one line when the list wraps.
        children: courses
          .map((c) => c.replace(/ /g, " "))
          .flatMap((c, i) => (i === 0 ? [run(c)] : [run("   ·   ", { color: MUTED }), run(c)])),
      }),
    );
  }

  // ---------- Additional information ----------
  const languages = data.languages.filter((l) => has(l.name));
  const additional = data.additional.filter((a) => has(a.label) || has(a.value));
  if (languages.length || additional.length) {
    const rows: Array<[string, string]> = [];
    if (languages.length) {
      rows.push([
        "Languages",
        languages.map((l) => (has(l.level) ? `${l.name.trim()} (${l.level.trim()})` : l.name.trim())).join(", "),
      ]);
    }
    for (const a of additional) rows.push([a.label, a.value]);
    // One line ("Languages: …   ·   Military Service: …") keeps the section compact; matches the PDF.
    children.push(
      sectionHeading(titles.additional),
      new Paragraph({
        spacing: { after: 35 },
        children: rows.flatMap(([label, value], i) => [
          ...(i > 0 ? [run("   ·   ", { color: MUTED })] : []),
          ...(has(label) ? [run(`${label.trim()}: `, { bold: true, color: NAVY })] : []),
          run(value),
        ]),
      }),
    );
  }

  // ---------- Document ----------
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          run(`${name}  ·  Page `, { color: MUTED, size: 16 }),
          new TextRun({ children: [PageNumber.CURRENT], color: MUTED, size: 16 }),
          run(" of ", { color: MUTED, size: 16 }),
          new TextRun({ children: [PageNumber.TOTAL_PAGES], color: MUTED, size: 16 }),
        ],
      }),
    ],
  });

  return new Document({
    creator: name,
    lastModifiedBy: name,
    title: has(p.headline) ? `${name} – ${p.headline} Resume` : `${name} Resume`,
    subject: has(p.headline) ? `Resume – ${p.headline}` : "Resume",
    description: `Resume of ${name}${has(p.headline) ? `, ${p.headline}` : ""}`,
    styles: {
      default: {
        document: {
          run: { font: FONT, size: 20, color: BODY },
          paragraph: { spacing: { after: 0, line: 250 } },
        },
      },
      paragraphStyles: [
        {
          id: "Title",
          name: "Title",
          basedOn: "Normal",
          next: "Normal",
          run: { font: FONT, size: 50, bold: true, color: NAVY },
          paragraph: { spacing: { after: 20, line: 240 } },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          // No letter-spacing: tracked caps extract as "P R O F I L E" in many ATS parsers.
          run: { font: FONT, size: 22, bold: true, color: NAVY, allCaps: true },
          paragraph: {
            spacing: { before: 220, after: 90 },
            keepNext: true,
            outlineLevel: 0,
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 3 } },
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { font: FONT, size: 21, bold: true, color: INK },
          paragraph: { spacing: { before: 40, after: 10 }, keepNext: true, outlineLevel: 1 },
        },
      ],
    },
    numbering: {
      config: [
        {
          reference: "bullets",
          levels: [
            {
              level: 0,
              format: LevelFormat.BULLET,
              text: "•",
              alignment: AlignmentType.LEFT,
              style: {
                paragraph: { indent: { left: 300, hanging: 200 } },
                run: { color: ACCENT },
              },
            },
          ],
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: PAGE_W, height: PAGE_H },
            margin: { top: 760, bottom: 760, left: MARGIN_X, right: MARGIN_X, footer: 360 },
          },
        },
        footers: { default: footer },
        children,
      },
    ],
  });
}

export const docxToBlob = (data: ResumeData): Promise<Blob> => Packer.toBlob(buildDocx(data));
