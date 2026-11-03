export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Give the browser a tick to start the download before revoking.
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export function safeFileStem(name: string, headline: string): string {
  const base = `${name || "Resume"} ${headline || ""}`.trim();
  return base.replace(/[^\w\s-]/g, "").replace(/\s+/g, "_") || "Resume";
}
