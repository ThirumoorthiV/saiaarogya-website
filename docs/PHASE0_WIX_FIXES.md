# Phase 0 — Quick fixes on the current Wix site

**Purpose:** improve the live site at https://www.saiaarogya.hospital/ while the new site is being built (roadmap §12, Phase 0).
**Where:** Wix Editor, by whoever manages the Wix account. None of these need code.
**Time:** about 1 day of editing.

Each fix links to the problem number in the requirements gap table (§2.2).

## 1. Headings and SEO (gaps #8, #9)

| # | Page | Fix | How to do it in Wix |
|---|---|---|---|
| 1.1 | Home | Make the hero headline **"Quality Secondary Care, Accessible to All, Free of Charge"** the page's only **H1**. It is H3 now. | Select the text → *Edit Text* → change the style to *Heading 1*. |
| 1.2 | Home, About, Contact | Change **"Subscribe To Our Newsletter"** from H1 to a paragraph or H3. It is currently the only H1 on Home and also appears as H1 on About. | Select the text → set the style to *Paragraph 1* or *Heading 3*. |
| 1.3 | Home | Add a meta description: *"Quality secondary care, accessible to all, free of charge. Find a doctor, OPD timings and directions to Sai Aarogya Hospital in Bapatla, Andhra Pradesh."* | *Pages* → Home → ⋯ → *SEO basics* → *Meta description*. |
| 1.4 | About / Contact / Donations | Add a unique meta description to each page (140–160 characters). You can copy them from `src/lib/pageMeta.ts` in the new site. | Same place as 1.3. |
| 1.5 | All | Add alt text to images. The 6 images with empty alt are: the hero decorative image, the "Contact Us" side image, and 4 testimonial photos. Replace file-name alts such as "shared image (1).jpg" with a description, e.g. *"A doctor consulting an elderly patient"*. | Click the image → *Settings* → *What's in the image?* |
| 1.6 | All | Structured data: rename the `LocalBusiness` from the Trust to **Sai Aarogya Hospital**, or add a `Hospital` type. | *Settings* → *SEO* → *Structured data markup*. |

## 2. Contact details (gaps #6, #7)

| # | Fix |
|---|---|
| 2.1 | Choose **one** official email and use it everywhere. Today the site uses three: `info@saisujalasravanthi.com` (footer), `info@saisujalasravanthi.in` (Donations page) and `saisujalasravanthi@gmail.com` (Home/About/Contact "Contact Us" block). **The Trust needs to decide which one — see CONTENT_TODO #C2.** |
| 2.2 | Choose **one** main phone number. Today the footer says **+91 84999 91259** and the "Contact Us" block says **+91 9660000996**. **The Trust needs to decide — see CONTENT_TODO #C1.** |
| 2.3 | Make every phone number tap-to-call: select the text → *Link* → *Phone* → enter the number. |
| 2.4 | Contact page: add the address, phone, email and a Google Map (*Add* → *Contact & Forms* → *Google Maps*). |

## 3. Visual bugs (gaps #11, #12, #13)

| # | Fix |
|---|---|
| 3.1 | Remove the letter-by-letter heading animations, which show broken text while scrolling: select each heading → *Animation* → *None*. |
| 3.2 | "Resident Doctors" and "The Founder" headings wrap onto two lines. Widen the text box, or reduce the font size by one step. |
| 3.3 | Footer: the copyright line is cut off. Widen the text box. Also change **© 2025** to **© 2026**. |
| 3.4 | Mobile: remove the large blank gap. In the mobile editor, find the empty strip and delete the hidden/empty element or reduce the section height. |
| 3.5 | Readability: change light-grey body text on cream cards to **#5E5450** or darker. |

## 4. Template content left on the live site

| # | Fix |
|---|---|
| 4.1 | The Home page HTML still contains **Wix template placeholder testimonials** ("Jamie Lane", "Max Johnson", "Jesse Neimus", "Drew Carlyle", "Describe the team member here…") and stock doctor cards ("Dr. John Doe", "Dr. Olivia", "Dr. Katherine", "Dr. Johnson"). If they are visible anywhere, including on mobile, **delete them**. They harm trust. |
| 4.2 | The "Building a World-Class Multi-Speciality Centre" section is in the page but not clearly visible. Decide whether to publish it or delete it (see CONTENT_TODO #A6). |

## 5. Navigation (gap #5)

| # | Fix |
|---|---|
| 5.1 | Add a **Doctors** anchor link (to the doctor section on Home) and a **Departments** anchor link to the menu, so patients can reach them in one tap. |
