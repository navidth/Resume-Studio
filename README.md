# Resume Studio

A small single-page app that builds an ATS-friendly résumé from a form and exports it as **PDF** and **Word (.docx)**.
Both exports share one template (single column, real text, standard headings, no letter-spacing), the same one used
for the hand-built résumés in the parent folder.

## Run

```bash
npm install
npm run dev        # http://localhost:5180
npm run build      # production build in dist/
npm run preview    # serve dist/ locally
```

Everything runs in the browser. There is no backend, and your data never leaves the machine:
the résumé is auto-saved to `localStorage` and can be backed up / restored as JSON from the **⋯** menu.

## Features

- Sections: personal details, summary, skills (category rows), work experience (with named products / sub-projects
  under each role), projects, education, courses, languages, additional information (e.g. military service).
- Add, reorder, duplicate and delete entries; one bullet per line in "Highlights".
- Each section heading is editable ("Heading in resume").
- Live PDF preview (debounced), page counter with a warning above two pages.
- **Download PDF** (also `Ctrl/Cmd + S`), **Download Word**, **Export / Import JSON**, **Load sample**, **Start blank**.
- Responsive: three-pane layout on desktop, Edit / Preview switch on phones.

## Stack

| Concern         | Library                                          |
| --------------- | ------------------------------------------------ |
| UI              | React 18, TypeScript, Vite, plain CSS tokens     |
| State           | Zustand (+ `persist`)                            |
| PDF             | `@react-pdf/renderer` (fonts: Carlito, metric-compatible with Calibri) |
| Word            | `docx`                                           |
| Icons           | `lucide-react`                                   |

## Layout of the code

```
src/
  types.ts                 resume data model
  defaultData.ts           empty + sample résumé
  store.ts                 zustand store, list actions, JSON normalisation
  pdf/ResumePdf.tsx        PDF template (react-pdf)
  docx/buildDocx.ts        Word template (docx) – mirrors the PDF styles
  components/
    TopBar.tsx             brand, status, downloads, JSON menu
    editor/                section rail + one panel per section
    preview/PdfPreview.tsx debounced render, double-buffered iframe, page count
public/fonts/              Carlito TTFs (OFL)
```

To change the look of the résumé itself, edit the palette / spacing constants at the top of
`src/pdf/ResumePdf.tsx` and `src/docx/buildDocx.ts` together so the two exports stay identical.
