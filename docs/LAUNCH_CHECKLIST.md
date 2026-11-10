# Launch checklist

This covers the steps to take the new site live on Netlify at `www.saiaarogya.hospital` (roadmap §12 Phase 5, off-site plan §9). Tick each item as it is done.

## 1. Before launch: content

- [ ] Resolve the **High** items in `docs/CONTENT_TODO.md`: phone (C1), email (C2), emergency number (C3), OPD hours (C4, C5, O1), doctor visiting days (R2), donation link (S1).
- [ ] `npm run todo:scan`: review what is still a placeholder. Anything left shows as a visible TODO box, so decide whether it is acceptable at launch.
- [ ] Hospital sign-off on the Refund and Privacy policies (L1, L2).

## 2. Netlify setup

- [ ] Create a Netlify site from the Git repository (branch `main`). The build settings are read from `netlify.toml` (`npm run build` → `dist`).
- [ ] **Environment variables** (Site configuration → Environment variables):
  - [ ] `VITE_WEB3FORMS_ACCESS_KEY`: from https://web3forms.com, created **with the official hospital email**. Enquiries and volunteer sign-ups are sent there.
  - [ ] `VITE_GA_ID`: GA4 measurement ID (optional). Analytics loads only after a visitor accepts the cookie notice.
- [ ] Trigger a deploy and check the deploy log ends with `[vite-react-ssg] Build finished.`
- [ ] **CMS logins**: Site configuration → Identity → **Enable Identity**. Set Registration to **Invite only**, then Services → **Enable Git Gateway**. Invite each staff editor by email.
  - If Netlify Identity is unavailable for the account, switch `backend` in `public/admin/config.yml` to `github` and set up a GitHub OAuth app (see the Decap CMS docs).
- [ ] Open `/admin/` and log in with an invited account. Make a test edit (e.g. a doctor's timing), publish it, and confirm the live site updates.

## 3. Domain & redirects

- [ ] Add the custom domain `www.saiaarogya.hospital` (and the bare `saiaarogya.hospital` → `www` redirect) in Netlify → Domain management.
- [ ] Update DNS at the registrar. Who manages the DNS is still to be confirmed (CONTENT_TODO G4).
- [ ] HTTPS certificate issued (automatic on Netlify).
- [ ] Check the 301 redirects from `public/_redirects` on the live domain:
  - [ ] `/donormanagement` → `/support-us/donate/`
  - [ ] `/terms` → `/policies/terms/`
  - [ ] `/privacypolicy` → `/policies/privacy/`
  - [ ] `/refundpolicy` → `/policies/refund/`
- [ ] Cancel or downgrade the Wix plan **only after** the new site has been live and verified for a few days.

## 4. Test on the live site

- [ ] Send a test message from **Contact** and from **Volunteer**, and confirm it arrives in the hospital inbox.
- [ ] Tap-to-call works on an Android phone (utility bar, mobile bottom bar, contact page).
- [ ] **Directions** opens Google Maps at the correct place. If the pin is wrong, fix `mapUrl` / `mapEmbedUrl` in Site settings and add coordinates (C8).
- [ ] Share the home page link on WhatsApp and check the preview shows the title, description and photo.
- [ ] Run Google's **Rich Results Test** (https://search.google.com/test/rich-results) on:
  - [ ] `/`: Hospital
  - [ ] `/doctors/dr-raghuram/`: Physician
  - [ ] `/patient-guide/faqs/`: FAQ
- [ ] Run **PageSpeed Insights** (https://pagespeed.web.dev/) on `/`, `/doctors/` and `/contact/` (mobile).

## 5. Search engines

- [ ] **Google Search Console**: add the property `https://www.saiaarogya.hospital/` and verify it with a DNS TXT record.
- [ ] Submit the sitemap: `https://www.saiaarogya.hospital/sitemap.xml`.
- [ ] Request indexing for the Home, Doctors, Departments and Patient Guide pages.
- [ ] Bing Webmaster Tools: import from Search Console.
- [ ] **When Telugu is translated:** the `/te/` pages go live automatically (`TELUGU_READY`). Re-submit the sitemap, which will then include them with hreflang.

## 6. Off-site visibility (§9)

| Channel | Action | Done |
|---|---|---|
| **Google Business Profile** | Create or claim "Sai Aarogya Hospital, Bapatla". Category **Hospital**; add hours, phone, website link and photos of the entrance and signage | [ ] |
| **Google Maps** | Check the pin location; add entrance and signage photos | [ ] |
| **Sai Sujala Sravanthi website** | Link from *Programmes → Healthcare → Sai Aarogya Hospital* to this site, and link back from About (fill `trust.url` in Site settings) | [ ] |
| **SMSIMSR / Sanjeevani sites** | Ask for reciprocal links; fill the network URLs in About (A1) | [ ] |
| **Quora** | Helpful answers to local questions (e.g. "free hospitals near Bapatla") linking to department pages | [ ] |
| **WhatsApp** | A shareable OPD timings card and camp announcements linking to `/patient-guide/opd-timings/` | [ ] |
| **YouTube / Instagram** | Short patient-story and camp videos (with consent), linked from Impact | [ ] |

## 7. Handover

- [ ] Give the staff editors `docs/STAFF_GUIDE.md`.
- [ ] Agree who maintains which content, and in which languages (§14 Q10).
