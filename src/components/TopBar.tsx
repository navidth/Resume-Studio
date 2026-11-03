import { Download, Eye, FileDown, FileJson, FileText, LayoutTemplate, MoreHorizontal, PencilLine, RotateCcw, Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui";

export type View = "edit" | "preview";

interface TopBarProps {
  view: View;
  onViewChange: (v: View) => void;
  onDownloadPdf: () => void;
  onDownloadDocx: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onLoadSample: () => void;
  onReset: () => void;
  busy: { pdf: boolean; docx: boolean };
  savedAt: number;
}

const timeLabel = (ts: number) =>
  new Date(ts).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });

export function TopBar({ view, onViewChange, onDownloadPdf, onDownloadDocx, onExportJson, onImportJson, onLoadSample, onReset, busy, savedAt }: TopBarProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => menuRef.current?.removeAttribute("open");

  return (
    <header className="topbar">
      <div className="brand">
        <div className="brand-mark" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M5 6h14M5 12h14M5 18h8" />
          </svg>
        </div>
        <div className="brand-text">
          <span className="brand-title">Resume Studio</span>
          <span className="brand-sub">ATS-friendly résumé builder · PDF &amp; Word</span>
        </div>
      </div>

      <div className="segmented" role="group" aria-label="View">
        <button type="button" aria-pressed={view === "edit"} onClick={() => onViewChange("edit")}>
          <PencilLine size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
          Edit
        </button>
        <button type="button" aria-pressed={view === "preview"} onClick={() => onViewChange("preview")}>
          <Eye size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
          Preview
        </button>
      </div>

      <span className="topbar-spacer" />

      <span className="topbar-status" title="Your resume is saved in this browser's local storage">
        <span className="dot" /> Saved locally · {timeLabel(savedAt)}
      </span>

      <div className="topbar-actions">
        <details className="menu" ref={menuRef}>
          <summary className="btn btn-outline-light" aria-label="More actions" title="More actions">
            <MoreHorizontal size={16} />
          </summary>
          <div className="menu-panel">
            <button type="button" className="menu-item" onClick={() => { closeMenu(); fileRef.current?.click(); }}>
              <Upload size={15} /> Import JSON…
            </button>
            <button type="button" className="menu-item" onClick={() => { closeMenu(); onExportJson(); }}>
              <FileJson size={15} /> Export JSON (backup)
            </button>
            <div className="menu-sep" />
            <button type="button" className="menu-item" onClick={() => { closeMenu(); onLoadSample(); }}>
              <LayoutTemplate size={15} /> Load sample resume
            </button>
            <button type="button" className="menu-item danger" onClick={() => { closeMenu(); onReset(); }}>
              <RotateCcw size={15} /> Start from blank…
            </button>
          </div>
        </details>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onImportJson(f);
            e.target.value = "";
          }}
        />
        <Button variant="outline-light" icon={<FileText size={16} />} loading={busy.docx} onClick={onDownloadDocx} title="Download as Word (.docx)">
          Word
        </Button>
        <Button variant="light" icon={busy.pdf ? <Download size={16} /> : <FileDown size={16} />} loading={busy.pdf} onClick={onDownloadPdf} title="Download as PDF">
          Download PDF
        </Button>
      </div>
    </header>
  );
}
