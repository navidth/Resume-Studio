import { Font } from "@react-pdf/renderer";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");
const font = (file: string) => `${base}/fonts/${file}`;

let registered = false;

/** Carlito is metric-compatible with Calibri, so the PDF matches the Word export line for line. */
export function registerFonts(): void {
  if (registered) return;
  registered = true;
  Font.register({
    family: "Carlito",
    fonts: [
      { src: font("Carlito-Regular.ttf"), fontWeight: 400, fontStyle: "normal" },
      { src: font("Carlito-Bold.ttf"), fontWeight: 700, fontStyle: "normal" },
      { src: font("Carlito-Italic.ttf"), fontWeight: 400, fontStyle: "italic" },
      { src: font("Carlito-BoldItalic.ttf"), fontWeight: 700, fontStyle: "italic" },
    ],
  });
  // Resumes read better without hyphenated line breaks.
  Font.registerHyphenationCallback((word) => [word]);
}
