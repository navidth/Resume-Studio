/** Split a textarea value into trimmed, non-empty lines (one bullet per line). */
export const linesToList = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

export const listToLines = (list: string[]): string => list.join("\n");

/** Normalise user-entered URLs so hyperlinks always work. */
export const normalizeUrl = (url: string): string => {
  const u = url.trim();
  if (!u) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(u)) return u;
  return `https://${u}`;
};

export const stripProtocol = (url: string): string =>
  url.replace(/^https?:\/\/(www\.)?/i, "").replace(/\/$/, "");
