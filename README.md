# Sai Aarogya Hospital, Bapatla — website

A patient-first website for Sai Aarogya Hospital, Bapatla, a unit of Sri Sathya Sai Sujala Sravanthi Trust. It is built from `Sai_Aarogya_Hospital_Website_Requirements_Analysis.md` (v1.0), which is the single source of truth for this project.

**Stack (§7):** React 18 · TypeScript · Vite · Tailwind CSS · Lucide React · React Router.
- **Pre-rendering:** every route is pre-rendered to static HTML with `vite-react-ssg`, in English and under `/te/`.
- **Content:** JSON files in `src/content/`, edited with Decap CMS.
- **Hosting:** Netlify, which also handles redirects and CMS logins.
- **Forms:** sent through [Web3Forms](https://web3forms.com). Set `VITE_WEB3FORMS_ACCESS_KEY` (see `.env.example`). Forms also work without JavaScript.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 20+) |
| `npm run dev` | Start the dev server with server-side rendering at http://localhost:5173 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, with no emit |
| `npm run build` | Pre-render every page to `dist/`, and write `sitemap.xml`, `robots.txt` and `404.html` |
| `npm run check` | lint + typecheck + build + SEO meta check (run before every commit) |
| `npm run check:meta` | Check that each built page has one H1, a unique title, and a 140–160 character description |
| `npm run qa` | Open every built page in Chrome at 360, 768 and 1440 px and check for overflow, H1, alt text and console errors (`--shots <dir>` saves screenshots) |
| `npm run todo:scan` | List every content placeholder and check each is documented in `docs/CONTENT_TODO.md` |
| `npm run images -- <dir>` | Convert original photos to optimised WebP in `public/images/` |

## Project structure

```
src/
├── components/
│   ├── layout/     Header, Footer, UtilityBar, MobileActionBar, Breadcrumbs, PageHeader
│   ├── ui/         Button, Card, Badge, Accordion, Todo, Section, …
│   ├── sections/   Page sections (Hero, QuickActions, ImpactCounters, …)
│   └── seo/        <Seo> (title, description, canonical, hreflang, Open Graph, JSON-LD)
├── content/        CMS collections as JSON (requirements §10) + typed loaders
├── i18n/           en.json, te.json, language context (URL-driven: /te/ prefix)
├── lib/            staticPaths (every route), pageMeta (titles/descriptions), schema (JSON-LD)
├── pages/          One module per route (exports `Component`)
├── types/          Data model types
├── routes.tsx      Route table (mounted under / and /te)
└── main.tsx
docs/
├── CONTENT_TODO.md      Every placeholder waiting for information from the hospital
└── PHASE0_WIX_FIXES.md  Quick fixes for the current Wix site
```

## Content rules

- **Nothing is invented.** Text comes from the current site (https://www.saiaarogya.hospital/), word for word where possible. Anything unconfirmed is `null` or empty in `src/content/*.json`, and the page shows a visible **TODO** box (`<Todo id="…">`).
- When a value is filled in, its TODO box disappears automatically.
- Every placeholder id is listed in `docs/CONTENT_TODO.md`. `npm run todo:scan` fails if one is missing.

## Roadmap progress (§12)

- [x] Phase 0 — Quick-fix checklist for the current Wix site (`docs/PHASE0_WIX_FIXES.md`)
- [x] Phase 1 — Foundation: project setup, design system, layout, routing for the full sitemap, SEO component, content model
- [x] Phase 2 — Patient essentials: Home, Patient Guide, Contact
- [x] Phase 3 — Departments & Doctors, CMS admin, schema markup
- [ ] Phase 4 — About, Impact, Stories, Gallery, Support Us
- [ ] Phase 5 — Telugu, redirects, analytics, launch QA
