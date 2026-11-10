# Content TODO — information needed from the Hospital / Trust

Everything on the new site that was **not** on the current website is shown as a visible **TODO** placeholder (dashed orange box). Nothing has been made up. This file lists every placeholder, where it appears and how to fill it in.

- **How to fill a placeholder:** edit the named field in the CMS (`/admin/`), or the JSON file in `src/content/`. When the value is filled in, the TODO box disappears automatically.
- **Code ids** (in backticks) match `data-todo="…"` in the HTML. Run `npm run todo:scan` to list every placeholder still in use.
- Source of existing content: live review of https://www.saiaarogya.hospital/ on 10 Nov 2026.

---

## C. Contact & site settings (`src/content/site-settings.json`)

| # | Item | Code id | Where it shows | Current state | Needed |
|---|---|---|---|---|---|
| C1 | **Official main phone number** | `phone-confirm` | Utility bar, footer, contact, mobile Call button, schema | Using **+91 84999 91259** (footer "Mobile No" on every page of the current site). The "Contact Us" block on the current site shows a different number, **+91 9660000996**. | Confirm which is the main number. Should the other be listed (e.g. as OPD desk)? |
| C2 | **Official email** | `email-confirm` | Footer, contact, schema | Using **info@saisujalasravanthi.com** (current footer). The current site also uses `info@saisujalasravanthi.in` (donations) and `saisujalasravanthi@gmail.com` (Contact Us block). | Pick one (requirements §14 Q2). |
| C3 | **Emergency / ambulance number** | `emergency-number` | Utility bar (every page), Patient Guide | `emergencyPhone: null` | Is emergency care offered? Number? (§14 Q3) |
| C4 | **OPD summary line** | `opd-summary` | Utility bar (every page) | `opdSummary: null` | e.g. "Mon–Sat, 9 AM – 4 PM" |
| C5 | **General OPD hours** | `opd-hours` | "Open now" badge, OPD Timings page, Hospital schema `openingHoursSpecification` | `opdHours: []` — badge hidden | Days + opening/closing time (§14 Q4) |
| C6 | **Holiday notice** | — | OPD Timings page | `holidayNotice: null` | Optional; fill when needed |
| C7 | **WhatsApp number** | `whatsapp` | Contact page | `whatsapp: null` | If available |
| C8 | **Map pin / coordinates** | `geo` | Hospital schema, map accuracy | `geo: null`; map uses an address search | Latitude/longitude of the main entrance (from Google Maps) |
| C9 | **Trust website URL** | `trust-url` | About, footer | `trust.url: null` | Official URL of Sri Sathya Sai Sujala Sravanthi Trust |

## D. Departments (`src/content/departments.json`)

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| D1 | Summaries for **General Surgery, Cardiology, Dermatology, Urology** | `department-summary` | `summary: null`. These four are not on the current site's department cards; they come from the consultant list. | One-line summary each (§11). Also: full departments or visiting consultant services? (§14 Q6) |
| D2 | **Department descriptions** (all 10) | `department-description` | `description: []` | 1–2 paragraphs per department |
| D3 | **Services & conditions treated** | `department-services` | 6 departments use the items named in the current site's one-line summaries. The 4 new departments are empty. | Confirm and expand the list for each |
| D4 | **Paediatrics doctor** | `department-no-doctor` | The current site lists **no doctor** for Paediatrics | Which doctor covers Paediatrics? |
| D5 | **Department FAQs** | — | None | Optional, per department |
| D6 | "General Medicine" naming | — | The current site calls this card "General Services"; the requirements use "General Medicine" | Confirm the name |

## R. Doctors (`src/content/doctors.json`)

All 12 doctors, with names and qualifications exactly as on the current site.

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| R1 | **Doctor photos** (all 12) | `doctor-photo` | `photo: null` — initials shown instead | Photos with a consistent background and framing, square, at least 600×600 (§11) |
| R2 | **Visiting days** (all 12) | `doctor-visiting-days` | `visitingDays: []` | e.g. "Daily" (residents?) or "Mon & Thu" |
| R3 | **Consultation timing** (all 12) | `doctor-timing` | `timing: null` | e.g. "10:00 AM – 1:00 PM" |
| R4 | **Languages spoken** (all 12) | `doctor-languages` | `languages: []` | e.g. Telugu, English |
| R5 | Spelling check | — | "Dr Sindhu Sr", "MD, DMPDF", "MD-DM" copied as written | Confirm spelling and qualifications |

## O. OPD timings (`src/content/opd-timings.json`)

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| O1 | **OPD timetable** per department and day | `opd-timetable` | `items: []` | Department · day · start · end (§11, §14 Q4) |

## P. Patient Guide

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| P1 | **How to reach**: landmarks, nearest bus stop, route from Bapatla town | `directions` | Not on current site | Short directions text |
| P2 | **Registration process** | `registration-confirm` | The 3 steps and "what to bring" list come from the requirements document (§5.5) | Confirm they match the real process |
| P3 | **Facilities** (lab, pharmacy, wards, X-ray…) | `facilities` | Photos show a ward, a dental chair and new medical equipment | Confirmed list of facilities (§11) |
| P4 | **FAQ answers**: appointment? emergency care? free medicines? attendant? | `faq-answer` | Only "Is everything really free?" has an answer (from the current site) | Answers for the other 4 questions |
| P5 | **Bed count** | `bed-count` | Current site says "30-50 bedded facilities" | Exact current number (§14 Q5) |

## I. Impact (`impact-stats.json`, `stories.json`, `gallery.json`)

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| I1 | **Patients served** number + "as of" date | `impact-number` | `value: null` | Number and date |
| I2 | **Beds** number | `impact-number` | `value: null` | (same as P5) |
| I3 | "As of" date for all stats | `impact-as-of` | `asOfDate: null` | Date |
| I4 | **Patient stories** (3–5) with written consent | `patient-stories` | None. The current site's testimonials are Wix template placeholders ("Jamie Lane", etc.) and were **not** reused. | Stories + consent forms (§11) |
| I5 | **Medical camps & updates** | `camp-updates` | None | Dated posts with photos |
| I6 | **More photos**: exterior, entrance, OPD, staff, camps, events | `gallery-photos` | 6 hospital photos from the current site | Professional or good phone photos (§11) |
| I7 | Video (optional) | — | None | YouTube link of a patient story |

## A. About (`src/content/about.json`)

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| A1 | **Network links**: SMSIMSR, Sanjeevani Hospitals, Sai Swasthya Wellness Centres | `network-url` | `url: null` | Official URLs (gap #16) |
| A2 | Date of the Aravinda Ashramam start | `timeline-start-date` | Shown as "Early years" | Year the 20-bed hospital started |
| A3 | Advisors' bios (Hari Umakanta Rao, K V Rambabu) and Dr Narsaraju's bio | `governance-bio` | Name only on the current site | Optional one-line bios |
| A4 | Roles of trustees (Chairman, etc.) | — | Only Kalyan Chakravarthy Konduri has a stated role (Trustee and Secretary) | Optional |
| A5 | Hospital photo for the About hero | — | Using the ward photo | Exterior photo preferred |
| A6 | **"Building a World-Class Multi-Speciality Centre"** | `multi-speciality` | Copied into `about.json` with `published: false` | Publish or remove? (§14 Q7) |

## S. Support Us / donations

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| S1 | **Online donation link for Indian donors** | `donation-link` | The current site shows "For Indian Donors - Indian Passport Holders", but the link is loaded by a Wix widget and is not in the page source | URL of the payment page (§5.7 "keep existing Indian donor link") |
| S2 | **Impact per contribution** (e.g. "₹X covers a day of OPD medicines") | `donation-impact` | None | Real figures from the Trust |
| S3 | **Tax exemption** (80G?) | `tax-exemption` | None | Yes/no, registration number, how receipts are issued (§14 Q9) |
| S4 | **How funds are used** | `fund-use` | None | Short statement or annual report link |
| S5 | **Volunteer roles** | `volunteer-roles` | None | List of medical / non-medical roles |
| S6 | Donation FAQ answers: tax-exempt? receipts? | `faq-answer` | Not answered | Answers |

## L. Legal / policies (`src/content/policies.json`)

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| L1 | **Refund Policy** is e-commerce boilerplate (shipping, perishable items, warranties) | `policy-review` | Copied word for word from the current site | Review: does this make sense for donations? |
| L2 | **Privacy Policy** mentions collecting "job title" and "promotional emails"; it does not cover the new enquiry/volunteer forms | `policy-review` | Copied word for word | Review and update for the new forms (no medical data is collected) |

## T. Telugu (§3.1 goal 4, §13 #10)

| # | Item | Code id | Current state | Needed |
|---|---|---|---|---|
| T1 | **Telugu translations**: all UI strings (`src/i18n/te.json`, same keys as `en.json`, 207 strings), the `te` fields in the content files (59 fields), and the page titles and descriptions in `src/lib/pageMeta.ts` | `telugu-translation` | Empty. `/te/` pages work but show English with a notice, and are kept out of Google (noindex, no hreflang, not in the sitemap) until `te.json` has translations. Then they go live automatically. `npm run i18n:status` shows progress. | Professional translation: Home, Departments, Doctors, Patient Guide and Contact at minimum (§13 #10) |

## G. Technical setup (Phase 5)

| # | Item | Code id | Needed |
|---|---|---|---|
| G1 | **Google Analytics 4 measurement ID** | `analytics-id` | Set `VITE_GA_ID` in Netlify environment variables |
| G2 | **Web3Forms access key** — the contact form cannot send until this is set. Create a free key at https://web3forms.com **using the official hospital email** (submissions are emailed there), then set `VITE_WEB3FORMS_ACCESS_KEY` in Netlify → Site settings → Environment variables and redeploy | `form-access-key` | Access key + confirm which inbox receives enquiries |
| G3 | **Logo source file (SVG)** and official colours | — | The site uses the logo PNG from the current website (§11) |
| G4 | **Domain / DNS access** for launch | — | Who manages `saiaarogya.hospital` DNS? |
