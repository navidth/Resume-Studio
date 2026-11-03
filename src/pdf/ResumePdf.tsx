import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ComponentProps, ReactNode } from "react";
import type { ResumeData } from "../types";
import { normalizeUrl } from "../utils/text";
import { registerFonts } from "./fonts";

registerFonts();

// Palette shared with the Word export (see docx/buildDocx.ts).
const NAVY = "#14284B";
const ACCENT = "#2F5D8C";
const INK = "#1F2933";
const BODY = "#333D4A";
const MUTED = "#5F6B7A";
const RULE = "#BFCBDA";

// Word twips → PDF points (1 pt = 20 twips).
const MARGIN_X = 46;
const MARGIN_Y = 38;

const s = StyleSheet.create({
  page: {
    fontFamily: "Carlito",
    fontSize: 10,
    lineHeight: 1.25,
    color: BODY,
    paddingTop: MARGIN_Y,
    paddingBottom: MARGIN_Y + 10,
    paddingHorizontal: MARGIN_X,
  },
  name: { fontSize: 25, fontWeight: 700, color: NAVY, lineHeight: 1.1, marginBottom: 2 },
  // Header lines are single Text nodes so separators keep their spaces in ATS text extraction.
  headlineRow: { fontSize: 12.5, marginBottom: 4 },
  headline: { fontWeight: 700, color: ACCENT },
  headlineSep: { color: RULE },
  headlineStack: { color: ACCENT },
  contactWrap: {
    paddingBottom: 5,
    borderBottomWidth: 1.5,
    borderBottomColor: NAVY,
    marginBottom: 2,
  },
  contact: { fontSize: 9, color: MUTED },
  contactSep: { color: RULE },
  link: { color: ACCENT, textDecoration: "none" },

  h1: {
    fontSize: 11,
    fontWeight: 700,
    color: NAVY,
    textTransform: "uppercase",
    marginTop: 11,
    marginBottom: 4.5,
    paddingBottom: 1.5,
    borderBottomWidth: 0.75,
    borderBottomColor: RULE,
  },
  body: { color: BODY },

  skillRow: { flexDirection: "row", marginBottom: 1.75 },
  skillLabel: { fontWeight: 700, color: NAVY },

  entry: { marginTop: 8.5 },
  entryFirst: { marginTop: 0 },
  entryHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  entryTitle: { fontSize: 10.5, fontWeight: 700, color: INK, flexGrow: 1, flexShrink: 1, paddingRight: 8 },
  entryDates: { fontSize: 9.5, color: MUTED, flexShrink: 0 },
  entrySub: { marginTop: 0.5, marginBottom: 2.5, flexDirection: "row", flexWrap: "wrap" },
  company: { fontWeight: 700, color: ACCENT },
  muted: { color: MUTED },
  mutedItalic: { color: MUTED, fontStyle: "italic" },

  group: { marginTop: 4.5 },
  groupFirst: { marginTop: 0.5 },
  groupHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 1.5 },
  groupTitleWrap: { flexDirection: "row", flexWrap: "wrap", flexGrow: 1, flexShrink: 1, paddingRight: 8 },
  groupName: { fontWeight: 700, color: NAVY },
  groupLink: { fontSize: 9.5, color: ACCENT, textDecoration: "none", flexShrink: 0 },

  bullet: { flexDirection: "row", paddingLeft: 5, marginBottom: 1.5 },
  bulletDot: { width: 10, color: ACCENT },
  bulletText: { flex: 1 },

  inlineList: { flexDirection: "row", flexWrap: "wrap" },

  footer: {
    position: "absolute",
    left: MARGIN_X,
    right: MARGIN_X,
    bottom: 18,
    fontSize: 8,
    color: MUTED,
    textAlign: "right",
  },
});

const has = (v: string | undefined | null) => Boolean(v && v.trim());

const Sep = () => <Text style={s.contactSep}>{"  |  "}</Text>;

type LinkStyle = ComponentProps<typeof Link>["style"];

const A = ({ href, children, style }: { href: string; children: ReactNode; style?: LinkStyle }) => (
  <Link src={normalizeUrl(href)} style={style ? [s.link, style] : s.link}>
    {children}
  </Link>
);

const H1 = ({ children }: { children: string }) => (
  <Text style={s.h1} minPresenceAhead={40}>
    {children}
  </Text>
);

const Bullet = ({ text }: { text: string }) => (
  <View style={s.bullet}>
    <Text style={s.bulletDot}>•</Text>
    <Text style={s.bulletText}>{text}</Text>
  </View>
);

export function ResumePdf({ data }: { data: ResumeData }) {
  const { personal: p, titles } = data;
  const contactParts: ReactNode[] = [];
  const push = (node: ReactNode) => {
    if (contactParts.length) contactParts.push(<Sep key={`sep-${contactParts.length}`} />);
    contactParts.push(node);
  };
  if (has(p.location)) push(<Text key="loc">{p.location}</Text>);
  if (has(p.phone)) push(<Text key="phone">{p.phone}</Text>);
  if (has(p.email)) push(<A key="email" href={`mailto:${p.email.trim()}`}>{p.email.trim()}</A>);
  if (has(p.linkedin)) push(<A key="li" href={p.linkedin}>{p.linkedin.trim()}</A>);
  if (has(p.github)) push(<A key="gh" href={p.github}>{p.github.trim()}</A>);
  if (has(p.website)) push(<A key="web" href={p.website}>{p.website.trim()}</A>);

  const skills = data.skills.filter((r) => has(r.label) || has(r.items));
  const experience = data.experience.filter((j) => has(j.title) || has(j.company));
  const projects = data.projects.filter((pr) => has(pr.name));
  const education = data.education.filter((e) => has(e.degree) || has(e.school));
  const courses = data.courses.filter(has);
  const languages = data.languages.filter((l) => has(l.name));
  const additional = data.additional.filter((a) => has(a.label) || has(a.value));
  const extraRows: Array<[string, string]> = [];
  if (languages.length) {
    extraRows.push([
      "Languages",
      languages.map((l) => (has(l.level) ? `${l.name.trim()} (${l.level.trim()})` : l.name.trim())).join(", "),
    ]);
  }
  for (const a of additional) extraRows.push([a.label, a.value]);

  const title = `${p.name || "Resume"}${has(p.headline) ? ` – ${p.headline}` : ""}`;

  return (
    <Document title={title} author={p.name} subject={has(p.headline) ? `Resume – ${p.headline}` : "Resume"} creator="Resume Studio">
      <Page size="A4" style={s.page}>
        {/* Header */}
        <Text style={s.name}>{p.name || "Your Name"}</Text>
        {(has(p.headline) || has(p.headlineStack)) && (
          <Text style={s.headlineRow}>
            {has(p.headline) && <Text style={s.headline}>{p.headline}</Text>}
            {has(p.headline) && has(p.headlineStack) && <Text style={s.headlineSep}>{"   |   "}</Text>}
            {has(p.headlineStack) && <Text style={s.headlineStack}>{p.headlineStack}</Text>}
          </Text>
        )}
        <View style={s.contactWrap}>
          <Text style={s.contact}>{contactParts}</Text>
        </View>

        {/* Summary */}
        {has(data.summary) && (
          <View>
            <H1>{titles.summary}</H1>
            <Text style={s.body}>{data.summary}</Text>
          </View>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <View>
            <H1>{titles.skills}</H1>
            {skills.map((r) => (
              <Text key={r.id} style={{ marginBottom: 1.75 }}>
                {has(r.label) && <Text style={s.skillLabel}>{`${r.label.trim()}: `}</Text>}
                <Text>{r.items}</Text>
              </Text>
            ))}
          </View>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <View>
            <H1>{titles.experience}</H1>
            {experience.map((job, i) => (
              <View key={job.id} style={i === 0 ? s.entryFirst : s.entry}>
                <View wrap={false} minPresenceAhead={30}>
                  <View style={s.entryHead}>
                    <Text style={s.entryTitle}>{job.title}</Text>
                    {has(job.dates) && <Text style={s.entryDates}>{job.dates}</Text>}
                  </View>
                  <Text style={s.entrySub}>
                    {has(job.company) && <Text style={s.company}>{job.company}</Text>}
                    {has(job.location) && <Text style={s.muted}>{`  ·  ${job.location}`}</Text>}
                    {has(job.note) && <Text style={s.mutedItalic}>{`  ·  ${job.note}`}</Text>}
                    {has(job.linkText) && (
                      <Text style={s.muted}>
                        {"  ·  "}
                        <A href={job.linkUrl || job.linkText}>{job.linkText}</A>
                      </Text>
                    )}
                  </Text>
                </View>
                {job.bullets.filter(has).map((b, bi) => (
                  <Bullet key={bi} text={b} />
                ))}
                {job.groups
                  .filter((g) => has(g.name) || g.bullets.some(has))
                  .map((g, gi) => (
                    <View key={g.id} wrap={false} style={gi === 0 && job.bullets.filter(has).length === 0 ? s.groupFirst : s.group}>
                      <View style={s.groupHead}>
                        <Text style={s.groupTitleWrap}>
                          <Text style={s.groupName}>{g.name}</Text>
                          {has(g.tech) && <Text style={s.contactSep}>{"  |  "}</Text>}
                          {has(g.tech) && <Text style={s.mutedItalic}>{g.tech}</Text>}
                        </Text>
                        {has(g.linkText) && (
                          <A href={g.linkUrl || g.linkText} style={s.groupLink}>
                            {g.linkText}
                          </A>
                        )}
                      </View>
                      {g.bullets.filter(has).map((b, bi) => (
                        <Bullet key={bi} text={b} />
                      ))}
                    </View>
                  ))}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <View>
            <H1>{titles.projects}</H1>
            {projects.map((pr, i) => (
              <View key={pr.id} style={i === 0 ? s.entryFirst : s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>
                    {pr.name}
                    {has(pr.tech) && <Text style={{ fontWeight: 400, color: RULE }}>{"  |  "}</Text>}
                    {has(pr.tech) && <Text style={{ fontWeight: 400, fontStyle: "italic", color: MUTED, fontSize: 10 }}>{pr.tech}</Text>}
                  </Text>
                  {has(pr.linkText) && (
                    <A href={pr.linkUrl || pr.linkText} style={s.groupLink}>
                      {pr.linkText}
                    </A>
                  )}
                </View>
                <View style={{ marginTop: 1.5 }}>
                  {pr.bullets.filter(has).map((b, bi) => (
                    <Bullet key={bi} text={b} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education.length > 0 && (
          <View>
            <H1>{titles.education}</H1>
            {education.map((e, i) => (
              <View key={e.id} style={i === 0 ? s.entryFirst : s.entry} wrap={false}>
                <View style={s.entryHead}>
                  <Text style={s.entryTitle}>{e.degree}</Text>
                  {has(e.dates) && <Text style={s.entryDates}>{e.dates}</Text>}
                </View>
                <Text style={s.entrySub}>
                  {has(e.school) && <Text style={s.company}>{e.school}</Text>}
                  {has(e.location) && <Text style={s.muted}>{`  ·  ${e.location}`}</Text>}
                </Text>
                {has(e.details) && <Text style={{ marginBottom: 2 }}>{e.details}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* Courses */}
        {courses.length > 0 && (
          <View>
            <H1>{titles.courses}</H1>
            <Text>
              {courses.map((c, i) => (
                <Text key={i}>
                  {i > 0 && <Text style={s.muted}>{"   ·   "}</Text>}
                  <Text>{c.replace(/ /g, " ")}</Text>
                </Text>
              ))}
            </Text>
          </View>
        )}

        {/* Additional information */}
        {extraRows.length > 0 && (
          <View>
            <H1>{titles.additional}</H1>
            {/* Single line: "Languages: …   ·   Military Service: …" (matches the Word export). */}
            <Text style={{ marginBottom: 1.75 }}>
              {extraRows.map(([label, value], i) => (
                <Text key={i}>
                  {i > 0 && <Text style={s.muted}>{"   ·   "}</Text>}
                  {has(label) && <Text style={s.skillLabel}>{`${label.trim()}: `}</Text>}
                  <Text>{value}</Text>
                </Text>
              ))}
            </Text>
          </View>
        )}

        <Text
          style={s.footer}
          fixed
          render={({ pageNumber, totalPages }) => `${p.name || "Resume"}  ·  Page ${pageNumber} of ${totalPages}`}
        />
      </Page>
    </Document>
  );
}
