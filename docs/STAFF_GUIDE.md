# Staff guide: updating the website

This guide is for hospital and Trust staff. You can change doctors, timings, departments, stories and photos yourself. **No developer is needed.**

## 1. Logging in

1. Go to **https://www.saiaarogya.hospital/admin/**
2. Click **Login with Netlify Identity** and sign in with the email address you were invited with.
   - First time? Open the invitation email, click the link and choose a password.
3. You will see the **Collections** list on the left.

> Every time you press **Publish**, the website rebuilds itself. Changes appear on the live site in about **1–2 minutes**.

## 2. What you can edit

| Collection | What it controls | Common tasks |
|---|---|---|
| **Doctors** | Doctor cards, the doctor directory, doctor profile pages, the visiting schedule | Add a doctor, change visiting days, upload a photo, hide a doctor who has left |
| **OPD timings** | The department timetable on *Patient Guide → OPD timings* and on each department page | Add or change a day and time |
| **Departments** | The 10 department tiles and pages | Write the summary and description, list services |
| **Site settings** | Phone, emergency number, email, address, general OPD hours (drives the **Open now** badge), holiday notice, donation link | Change the phone number, post a holiday notice |
| **Stories & camp updates** | *Our Impact* → Patient stories, Camps & updates | Post a camp report with photos |
| **Gallery** | *Our Impact* → Gallery | Add photos |
| **Impact numbers** | The maroon numbers band on the Home and Impact pages | Update "Patients served" and its "as of" date |
| **FAQs** | Questions and answers on the Patient Guide, Support Us and department pages | Answer a question |
| **About page** | Story, history timeline, trustees, network links | Add a trustee's bio |
| **Policies** | Terms, Privacy, Refund | Update legal text |

## 3. Step by step

### Change a doctor's visiting days
1. **Doctors** → **All doctors**.
2. Click the doctor's row (e.g. *Dr Raghuram — cardiology*) to open it.
3. **Visiting days**: choose the days, or choose **Daily**.
4. **Consultation time**: e.g. `10:00 AM – 1:00 PM`.
5. Click **Publish** (top of the page).

### Add a new doctor
1. **Doctors** → **All doctors** → **Add doctors** (at the top of the list).
2. Fill in **Name** (e.g. `Dr A Kumar`) and **URL slug** (e.g. `dr-a-kumar`: lowercase, hyphens, no spaces).
3. Choose the **Department**, **Type** (Resident or Consultant) and **Sort order** (lower numbers appear first).
4. **Photo**: upload a square photo, at least 600×600 px and under 150 KB, with a plain background.
5. **Publish**.

> Do **not** change the **URL slug** of an existing doctor or department. Links shared on WhatsApp and Google would stop working.

### Set the OPD hours (this turns on the "Open now" badge)
1. **Site settings** → **Contact details & OPD hours**.
2. **General OPD hours** → **Add**: choose the days, and enter **Opens** `09:00` and **Closes** `16:00` in 24-hour format.
3. Fill in **OPD summary (top bar)**, e.g. `Mon–Sat, 9 AM – 4 PM`.
4. **Publish**.

### Post a holiday notice
**Site settings** → **Holiday notice** → type the message → **Publish**. Clear the text afterwards to remove it.

### Add a patient story
1. **Stories & camp updates** → **Add**.
2. Category **Patient**. Write the title and paragraphs, and upload a cover photo with a description.
3. Tick **Written consent received** *only* if you have the patient's signed consent. **Stories without consent are never shown.**
4. **Publish**.

## 4. "TODO" boxes on the site

A dashed maroon **TODO** box means the information has not been confirmed yet. Fill in the matching field in the CMS and the box disappears. The full list is in `docs/CONTENT_TODO.md`.

## 5. Rules

- **Never** put patient medical details, reports or diagnoses on the website.
- Use **one** phone number and **one** email everywhere. They live in **Site settings**.
- Photos: WebP or JPEG, under 150 KB for doctor photos and under 300 KB for others.
- Describe every photo (the *caption* or *description* field). This helps blind visitors and Google.

## 6. Help

- The website was built by the project's UI/UX designer, Thiru. Contact them for anything the CMS can't do.
- Technical details are in `README.md` (for developers).
