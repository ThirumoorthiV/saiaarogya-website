# Sai Aarogya Hospital, Bapatla — website

A patient-first website for Sai Aarogya Hospital, Bapatla, a unit of Sri Sathya Sai Sujala Sravanthi Trust. It is built from `Sai_Aarogya_Hospital_Website_Requirements_Analysis.md` (v1.0), which is the single source of truth for this project.

**Stack (§7):** React 18 · TypeScript · Vite · Tailwind CSS · Lucide React · React Router. English only.

**Design:** a modern, maroon-only design system with no orange.
- Plus Jakarta Sans for headings and Inter for body text, both self-hosted.
- Soft rounded cards and pill buttons.
- Dropdown navigation and custom dropdowns, all with a light-maroon (`maroon-100`) hover and focus state.
- The colour tokens are in `tailwind.config.ts`.
- **Pre-rendering:** every route is pre-rendered to static HTML with `vite-react-ssg`.
- **Content:** JSON files in `src/content/`, edited with Decap CMS.
- **Hosting:** Vercel. `vercel.json` holds the redirects and headers; `api/` holds the server functions (Razorpay donations → Frappe, CMS GitHub login).
- **Forms:** sent through [Web3Forms](https://web3forms.com). Set `VITE_WEB3FORMS_ACCESS_KEY` (see `.env.example`). Forms also work without JavaScript.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies (Node 20+) |
| `npm run dev` | Start the dev server with server-side rendering at http://localhost:5173 |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, with no emit |
| `npm run build` | Pre-render every page to `dist/`, and write `sitemap.xml`, `robots.txt` and `404.html` |
| `npm run check` | lint + typecheck + build + meta check + structured-data check + TODO scan (run before every commit) |
| `npm run check:schema` | Validate the JSON-LD on every page (Hospital, Physician, FAQPage, BreadcrumbList…) |
| `npm run a11y` | axe-core WCAG 2.1 A/AA audit of every built page at 360 and 1440 px, plus a keyboard skip-link check |
| `npm run check:meta` | Check that each built page has one H1, a unique title, and a 140–160 character description |
| `npm run qa` | Open every built page in Chrome at 360, 768 and 1440 px and check for overflow, H1, alt text and console errors (`--shots <dir>` saves screenshots) |
| `npm run todo:scan` | List every content placeholder and check each is documented in `docs/CONTENT_TODO.md` |
| `npm run images -- <dir>` | Convert original photos to optimised WebP in `public/images/` |

## Project structure

```
src/
├── components/
│   ├── layout/     TopBar, Header + NavDropdown, Footer, MobileActionBar, Breadcrumbs, PageHero
│   ├── ui/         Button, Badge, Select (custom dropdown), Field, Accordion, Todo, Section, …
│   ├── home/       Hero, QuickActions, ImpactBand, DoctorCarousel
│   ├── sections/   Shared sections (VisitUs, ContactDetails, NetworkCards, SupportCta, FaqList…)
│   └── seo/        <Seo> (title, description, canonical, Open Graph, JSON-LD)
├── content/        CMS collections as JSON (requirements §10) + typed loaders
├── lib/            staticPaths, pageMeta, navigation (menus), schema (JSON-LD)
├── pages/          One module per route (exports `Component`)
├── types/          Data model types
├── routes.tsx      Route table
└── main.tsx
docs/
├── CONTENT_TODO.md      Every placeholder waiting for information from the hospital
├── LAUNCH_CHECKLIST.md  Vercel, domain, Search Console, Google Business Profile, off-site (§9)
├── STAFF_GUIDE.md       How hospital staff update content in the CMS
└── PHASE0_WIX_FIXES.md  Quick fixes for the current Wix site
public/
├── admin/               Decap CMS (config.yml = content collections)
├── _redirects           301s from old Wix URLs
└── fonts/, images/      Self-hosted fonts and optimised images
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
- [x] Phase 4 — About, Impact, Stories, Gallery, Support Us, Policies
- [x] Phase 5 — Redirects, analytics + cookie notice, performance, launch docs (`docs/LAUNCH_CHECKLIST.md`, `docs/STAFF_GUIDE.md`)
- [x] Redesign — modern maroon-only design, dropdown navigation, English only (branch `redesign`)
