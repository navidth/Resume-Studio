import { pdf } from "@react-pdf/renderer";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { EditorPanel, SectionRail } from "./components/editor/Editor";
import { PdfPreview } from "./components/preview/PdfPreview";
import { TopBar, type View } from "./components/TopBar";
import { docxToBlob } from "./docx/buildDocx";
import { ResumePdf } from "./pdf/ResumePdf";
import { normalizeData, useResumeStore } from "./store";
import type { SectionKey } from "./types";
import { downloadBlob, safeFileStem } from "./utils/download";

interface Toast {
  id: number;
  kind: "ok" | "error";
  text: string;
}

export default function App() {
  const data = useResumeStore((s) => s.data);
  const savedAt = useResumeStore((s) => s.savedAt);
  const { setData, resetEmpty, loadSample } = useResumeStore();

  const [section, setSection] = useState<SectionKey>("personal");
  const [view, setView] = useState<View>("edit");
  const [busy, setBusy] = useState({ pdf: false, docx: false });
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((kind: Toast["kind"], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const stem = safeFileStem(data.personal.name, data.personal.headline) + "_Resume";

  const downloadPdf = async () => {
    setBusy((b) => ({ ...b, pdf: true }));
    try {
      const blob = await pdf(<ResumePdf data={data} />).toBlob();
      downloadBlob(blob, `${stem}.pdf`);
      toast("ok", "PDF downloaded");
    } catch (e) {
      toast("error", `PDF export failed: ${(e as Error).message}`);
    } finally {
      setBusy((b) => ({ ...b, pdf: false }));
    }
  };

  const downloadDocx = async () => {
    setBusy((b) => ({ ...b, docx: true }));
    try {
      const blob = await docxToBlob(data);
      downloadBlob(blob, `${stem}.docx`);
      toast("ok", "Word document downloaded");
    } catch (e) {
      toast("error", `Word export failed: ${(e as Error).message}`);
    } finally {
      setBusy((b) => ({ ...b, docx: false }));
    }
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${stem}.json`);
    toast("ok", "Backup JSON downloaded");
  };

  const importJson = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text());
      setData(normalizeData(parsed));
      toast("ok", `Imported ${file.name}`);
    } catch {
      toast("error", "That file is not a valid resume JSON");
    }
  };

  const reset = () => {
    if (window.confirm("Start from a blank resume? Your current content will be replaced (export a JSON backup first if you need it).")) {
      resetEmpty();
      setSection("personal");
      toast("ok", "Started a blank resume");
    }
  };

  const sample = () => {
    if (window.confirm("Replace the current content with the sample resume?")) {
      loadSample();
      toast("ok", "Sample resume loaded");
    }
  };

  // Ctrl/Cmd + S downloads the PDF instead of the browser's "save page".
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void downloadPdf();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div className="app" data-view={view}>
      <TopBar
        view={view}
        onViewChange={setView}
        onDownloadPdf={downloadPdf}
        onDownloadDocx={downloadDocx}
        onExportJson={exportJson}
        onImportJson={importJson}
        onLoadSample={sample}
        onReset={reset}
        busy={busy}
        savedAt={savedAt}
      />
      <main className="workspace">
        <SectionRail active={section} onSelect={(k) => { setSection(k); setView("edit"); }} />
        <EditorPanel section={section} />
        <PdfPreview data={data} />
      </main>

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind === "error" ? "error" : ""}`}>
            {t.kind === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
