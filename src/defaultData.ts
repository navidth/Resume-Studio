import type { ResumeData, SectionTitles } from "./types";
import { uid } from "./utils/id";

export const DEFAULT_TITLES: SectionTitles = {
  summary: "Professional Summary",
  skills: "Technical Skills",
  experience: "Professional Experience",
  projects: "Projects",
  education: "Education",
  courses: "Courses & Training",
  additional: "Additional Information",
};

export const emptyResume = (): ResumeData => ({
  personal: {
    name: "",
    headline: "",
    headlineStack: "",
    location: "",
    phone: "",
    email: "",
    linkedin: "",
    github: "",
    website: "",
  },
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  courses: [],
  languages: [],
  additional: [],
  titles: { ...DEFAULT_TITLES },
});

export const sampleResume = (): ResumeData => ({
  personal: {
    name: "Navid Taheri",
    headline: "Senior Front-End Engineer",
    headlineStack: "React  ·  Next.js  ·  TypeScript",
    location: "Tehran, Iran",
    phone: "+98 910 487 3278",
    email: "navidtaheri32@gmail.com",
    linkedin: "linkedin.com/in/navid-taheri-6b78a4286",
    github: "github.com/navidth",
    website: "",
  },
  summary:
    "Senior Front-End Engineer with 4+ years of experience building data-intensive web applications with " +
    "React, Next.js, and TypeScript, including GIS and 3D visualization platforms, a 3D digital twin, real-time satellite " +
    "monitoring, and an enterprise AI assistant. Specialized in map and 3D interfaces (MapLibre GL, Leaflet, " +
    "Three.js, Cesium), real-time data over WebSocket, micro-frontend architecture with Module Federation, and " +
    "state management with Redux Toolkit, Zustand, and TanStack Query. Ensures quality through automated testing, " +
    "GitLab CI/CD, Sentry, and code review, with full-stack working knowledge of Node.js, FastAPI, and MongoDB.",
  skills: [
    { id: uid(), label: "Languages", items: "JavaScript (ES6+), TypeScript, HTML5, CSS3" },
    { id: uid(), label: "Frameworks & Forms", items: "React, Next.js (App Router, SSR/SSG), React Hook Form, Zod" },
    { id: uid(), label: "State & Data Fetching", items: "Redux Toolkit, Zustand, TanStack Query (React Query)" },
    { id: uid(), label: "Maps, 3D & Data Viz", items: "MapLibre GL, Leaflet.js, Three.js, Cesium, Recharts, GeoJSON, KML, Shapefile, GeoTIFF, DXF" },
    { id: uid(), label: "UI & Styling", items: "Tailwind CSS, Material UI (MUI), Ant Design, Bootstrap, Responsive & RTL Design, Accessibility (a11y)" },
    { id: uid(), label: "Quality & Process", items: "Jest, Vitest, React Testing Library, Sentry, Code Review, Agile/Scrum" },
    { id: uid(), label: "Web Platform", items: "REST APIs, WebSocket, PWA, Web Workers, i18n (i18next), SEO, Web Security, Performance Optimization" },
    { id: uid(), label: "Build & DevOps", items: "Vite, Webpack, Module Federation (Micro-Frontends), GitLab CI/CD, Docker, Docker Swarm, Git, Vercel" },
    { id: uid(), label: "Backend (Working Knowledge)", items: "Node.js, Express, Python, FastAPI, MongoDB, PostgreSQL" },
  ],
  experience: [
    {
      id: uid(),
      title: "Senior Front-End Engineer",
      company: "Ghadir Iranian",
      location: "",
      note: "Sole front-end developer, owning architecture through delivery",
      dates: "Apr 2026 – Present",
      linkText: "",
      linkUrl: "",
      bullets: [],
      groups: [
        {
          id: uid(),
          name: "Mining Project Management & GIS Platform",
          tech: "React, TypeScript, Vite, Redux Toolkit, MapLibre GL, Three.js",
          linkText: "",
          linkUrl: "",
          bullets: [
            "Architected and built a mining project management platform covering portfolio and project dashboards, WBS-based work packages, a Gantt-style project board, contracts and finance, and user and organization management.",
            "Developed a Three.js 3D viewer for terrain and geological models (DWG, DXF, OBJ, Datamine, GeoTIFF, Shapefile, KML, GeoJSON) with UTM support, clipping, wireframe/transparency modes, and Web Worker parsing of large models.",
            "Built 2D/3D map monitoring with MapLibre GL, including satellite basemaps, project boundary, map-index, and topography layers, plus filtering by operation type and status.",
            "Delivered KPI dashboards with Recharts (progress vs. plan, variance, status breakdowns) and a multi-step project wizard with React Hook Form and Zod, fully RTL with Jalali dates.",
            "Improved startup time with route-level code splitting, route-aware preloading, and early data prefetching.",
          ],
        },
        {
          id: uid(),
          name: "3D Digital Twin",
          tech: "Three.js, Web Workers, Python",
          linkText: "",
          linkUrl: "",
          bullets: [
            "Built a web-based 3D digital twin with live sensor data, animated equipment, and click-to-select equipment with detailed info panels, served by a custom Python server.",
            "Locked down delivery with a strict hash-based CSP, clickjacking protection, and hardened security headers.",
          ],
        },
        {
          id: uid(),
          name: "Enterprise AI Assistant",
          tech: "Next.js (App Router), TypeScript, TanStack Query, PWA",
          linkText: "",
          linkUrl: "",
          bullets: [
            "Built the entire front end of an enterprise AI assistant for company financial data, with Markdown-rendered answers, source citations, response feedback, chat history, voice input, and file attachments.",
            "Added data-access transparency, live service health status, admin-managed suggested questions, and PWA install.",
          ],
        },
      ],
    },
    {
      id: uid(),
      title: "Front-End Engineer",
      company: "Space Omid",
      location: "Tehran, Iran",
      note: "",
      dates: "Aug 2024 – Apr 2026",
      linkText: "",
      linkUrl: "",
      bullets: [
        "Developed four production products with React, TypeScript, and Redux Toolkit, building modular, component-based UIs with multi-language support (i18next, next-intl).",
        "Hardened front-end security with XSS prevention, a Content Security Policy (CSP), and HTTPS-only delivery.",
        "Containerized front-end apps with Docker and helped deploy them to staging and testing via Docker Swarm.",
      ],
      groups: [
        {
          id: uid(),
          name: "Fazayesh – Precision Agriculture",
          tech: "React, Module Federation, Leaflet.js, Socket.IO",
          linkText: "fazayesh.spaceomid.com",
          linkUrl: "https://fazayesh.spaceomid.com/",
          bullets: [
            "Architected the app as Module Federation micro-frontends, loading independently built remotes into a host shell.",
            "Built real-time satellite monitoring of farms, streaming remote-sensing indices (NDVI, NDMI, RGB imagery) over WebSocket onto interactive Leaflet.js maps.",
            "Delivered weather forecasts, agro-meteorological recommendations, and index-history charts for a platform with 10,000 user accounts and 1,400+ registered farms (115,000+ hectares).",
          ],
        },
        {
          id: uid(),
          name: "Fazabin – Satellite Imagery Platform",
          tech: "React, MUI, Leaflet.js, Zustand",
          linkText: "fazabin.spaceomid.com",
          linkUrl: "https://fazabin.spaceomid.com/",
          bullets: [
            "Built map-based search across free and commercial satellite imagery by area of interest, a new-imagery ordering flow by area and date, and an analytics catalog.",
          ],
        },
        {
          id: uid(),
          name: "Satellite IoT Platform",
          tech: "Next.js, React, Redux Toolkit",
          linkText: "iot.spaceomid.com",
          linkUrl: "https://iot.spaceomid.com/",
          bullets: [
            "Built satellite modem registration and management, a live packet explorer with filtering across 400,000+ received packets, and selectable telemetry charts (battery, altitude, position).",
            "Added live map tracking of satellites and received packets, plus a developer portal with API keys and documentation.",
          ],
        },
        {
          id: uid(),
          name: "Corporate Website",
          tech: "Next.js, next-intl, MUI",
          linkText: "spaceomid.com",
          linkUrl: "https://spaceomid.com/",
          bullets: [
            "Built the bilingual (Persian/English) company website with product pages, an interactive mission timeline, news, and a “send your name to space” campaign sign-up.",
          ],
        },
      ],
    },
    {
      id: uid(),
      title: "Front-End Developer (Contract)",
      company: "Ghoreyab Setare Soheil",
      location: "",
      note: "",
      dates: "2023 – 2024",
      linkText: "ghoreyab.ir",
      linkUrl: "https://ghoreyab.ir/",
      bullets: [
        "Developed a lottery and news web application with Next.js and Tailwind CSS.",
        "Implemented data fetching, listing, and detail pages with SEO-friendly routing and a responsive UI.",
      ],
      groups: [],
    },
    {
      id: uid(),
      title: "Front-End Developer",
      company: "RayaSadr",
      location: "Damghan, Iran",
      note: "",
      dates: "May 2022 – Nov 2023",
      linkText: "",
      linkUrl: "",
      bullets: [
        "Designed and delivered internal web applications for organizations, including power plant systems and university dashboards, with a strong focus on usability and stability.",
        "Contributed to the UI and data presentation of an AI project estimating combined-cycle power plant production.",
      ],
      groups: [],
    },
  ],
  projects: [
    {
      id: uid(),
      name: "ExamificatioN – English Learning Platform",
      tech: "Next.js (App Router), Redux Toolkit, Tailwind CSS",
      linkText: "2.144.27.2:3000",
      linkUrl: "http://2.144.27.2:3000/",
      bullets: [
        "Built the front end of a Persian (RTL) English-learning platform: CEFR placement test (A1–C2), personalized learning paths, leveled courses with free/paid access, online assignments, and progress reports.",
        "Delivered SSG/ISR, JSON-LD structured data, next/image optimization, dark mode, and Redux Toolkit state.",
      ],
    },
    {
      id: uid(),
      name: "E-Commerce Online Store (Personal Project)",
      tech: "Next.js, Redux Toolkit, Node.js, MongoDB",
      linkText: "dubsshop.vercel.app",
      linkUrl: "https://dubsshop.vercel.app/",
      bullets: [
        "Built a full-stack online store with the Next.js App Router, Node.js, and MongoDB, covering product listing, product details, shopping cart, and checkout.",
        "Used SSR/SSG and image optimization for fast, SEO-friendly pages; managed state with Redux Toolkit.",
      ],
    },
  ],
  education: [
    { id: uid(), degree: "M.Sc. in Software Engineering", school: "Touran University", location: "", dates: "Oct 2026 – Present", details: "" },
    { id: uid(), degree: "B.Sc. in Computer Engineering", school: "University of Damghan", location: "Damghan, Iran", dates: "Oct 2019 – Dec 2024", details: "" },
  ],
  courses: [
    "JavaScript & TypeScript (SabzLearn)",
    "Redux & Redux Toolkit (SabzLearn)",
    "Node.js & MongoDB (NeonLearn)",
    "Python (Maktabkhooneh)",
    "FastAPI (git.ir, 2025)",
  ],
  languages: [
    { id: uid(), name: "Persian", level: "Native" },
    { id: uid(), name: "English", level: "Intermediate" },
  ],
  additional: [{ id: uid(), label: "Military Service", value: "Educational Exemption" }],
  titles: { ...DEFAULT_TITLES },
});
