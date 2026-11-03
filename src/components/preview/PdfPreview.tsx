import { usePDF } from "@react-pdf/renderer";
import { AlertCircle, ExternalLink, FileText, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDebounced } from "../../hooks/useDebounced";
import { ResumePdf } from "../../pdf/ResumePdf";
import type { ResumeData } from "../../types";

/** Count pages without a PDF parser: react-pdf writes one "/Type /Page" dictionary per page. */
async function countPages(blob: Blob): Promise<number> {
  const text = await blob.text();
  return (text.match(/\/Type\s*\/Page(?!s)/g) ?? []).length;
}

export function PdfPreview({ data }: { data: ResumeData }) {
  const debounced = useDebounced(data, 550);
  const doc = useMemo(() => <ResumePdf data={debounced} />, [debounced]);
  const [instance, update] = usePDF({ document: doc });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    update(doc);
  }, [doc, update]);

  // Double-buffer the iframe so the old page stays visible until the new PDF has loaded.
  const [shown, setShown] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [pages, setPages] = useState<number | null>(null);

  useEffect(() => {
    if (!instance.url || instance.loading) return;
    setPending((p) => (instance.url === shown ? p : instance.url));
    if (instance.blob) countPages(instance.blob).then(setPages).catch(() => setPages(null));
  }, [instance.url, instance.loading, instance.blob, shown]);

  useEffect(() => {
    if (!pending) return;
    // Fallback in case the iframe never fires onLoad (some PDF plugins).
    const t = setTimeout(() => commit(), 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

  const commit = () => {
    setPending((p) => {
      if (p) setShown(p);
      return null;
    });
  };

  const viewerParams = "#toolbar=0&navpanes=0&scrollbar=1&view=FitH";
  const busy = instance.loading || pending !== null || debounced !== data;

  return (
    <section className="preview" aria-label="Preview">
      <div className="preview-bar">
        <FileText size={16} />
        <strong>Live preview</strong>
        <span className={`pill ${busy ? "busy" : pages && pages > 2 ? "warn" : "ok"}`}>
          {busy ? (
            <>
              <Loader2 size={12} className="spin" /> Updating
            </>
          ) : pages ? (
            `${pages} ${pages === 1 ? "page" : "pages"}`
          ) : (
            "Ready"
          )}
        </span>
        {pages !== null && pages > 2 && !busy && <span className="pill warn">Aim for 1–2 pages</span>}
        <span className="topbar-spacer" />
        {shown && (
          <a className="btn btn-ghost btn-sm" href={shown} target="_blank" rel="noreferrer">
            <ExternalLink size={14} />
            <span className="btn-text">Open in new tab</span>
          </a>
        )}
      </div>
      <div className="preview-stage">
        {!shown && !instance.error && (
          <div className="preview-empty">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
              <Loader2 size={16} className="spin" /> Rendering your resume…
            </span>
          </div>
        )}
        {shown && <iframe key={shown} title="Resume PDF" src={shown + viewerParams} />}
        {pending && pending !== shown && (
          <iframe key={pending} title="Resume PDF (loading)" src={pending + viewerParams} data-hidden="true" onLoad={commit} />
        )}
        {instance.error && (
          <div className="preview-error" role="alert">
            <AlertCircle size={14} style={{ verticalAlign: -2, marginRight: 6 }} />
            Could not render the PDF: {String(instance.error)}
          </div>
        )}
      </div>
    </section>
  );
}
