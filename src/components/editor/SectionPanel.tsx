import { PencilLine } from "lucide-react";
import type { ReactNode } from "react";
import { useResumeStore } from "../../store";
import type { SectionTitles } from "../../types";

interface SectionPanelProps {
  title: string;
  description: string;
  headingKey?: keyof SectionTitles;
  action?: ReactNode;
  children: ReactNode;
}

export function SectionPanel({ title, description, headingKey, action, children }: SectionPanelProps) {
  const heading = useResumeStore((s) => (headingKey ? s.data.titles[headingKey] : ""));
  const setTitle = useResumeStore((s) => s.setTitle);

  return (
    <>
      <header className="panel-head">
        <div className="grow">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {action}
      </header>
      <div className="panel-body">
        {headingKey && (
          <div className="heading-edit">
            <PencilLine size={14} />
            <label htmlFor={`heading-${headingKey}`}>Heading in resume</label>
            <input
              id={`heading-${headingKey}`}
              value={heading}
              onChange={(e) => setTitle(headingKey, e.target.value)}
              placeholder="Section heading"
              spellCheck={false}
            />
          </div>
        )}
        {children}
      </div>
    </>
  );
}
