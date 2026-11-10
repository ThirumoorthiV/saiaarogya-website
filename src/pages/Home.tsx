import { CheckCircle2, MessageSquareQuote } from "lucide-react";
import { Head } from "vite-react-ssg";
import { about, departments, stories } from "@/content";
import { getPageMeta } from "@/lib/pageMeta";
import { hospitalSchema } from "@/lib/schema";
import { Seo } from "@/components/seo/Seo";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Hero } from "@/components/home/Hero";
import { QuickActions } from "@/components/home/QuickActions";
import { ImpactBand } from "@/components/home/ImpactBand";
import { DoctorCarousel } from "@/components/home/DoctorCarousel";
import { DepartmentCard } from "@/components/departments/DepartmentCard";
import { NetworkCards } from "@/components/sections/NetworkCards";
import { VisitUs } from "@/components/sections/VisitUs";
import { SupportCta } from "@/components/sections/SupportCta";
import { StoryCard } from "@/components/impact/StoryCard";

/** Homepage — requirements §5.1 (sections 1–10; utility strip and footer are in the layout). */
export function Component() {
  const meta = getPageMeta("/");
  const patientStories = stories.filter((s) => s.category === "Patient").slice(0, 3);
  return (
    <>
      <Seo title={meta.title} fullTitle description={meta.description} path="/" imageAlt="Inpatient ward at Sai Aarogya Hospital, Bapatla" schema={[hospitalSchema()]} />
      <Head>
        <link
          rel="preload"
          as="image"
          href="/images/consultation.webp"
          imageSrcSet="/images/consultation-sm.webp 640w, /images/consultation.webp 1040w"
          imageSizes="(min-width: 1024px) 45vw, 100vw"
          fetchPriority="high"
        />
      </Head>

      <Hero />
      <QuickActions />
      <ImpactBand />

      <Section
        id="departments"
        eyebrow="Departments"
        title="Specialist care under one roof"
        intro="Sai Aarogya Hospital - Bapatla is your one-stop solution for quality healthcare. Our skilled doctors offer a wide range of services, from general care to specialised treatments like dentistry and paediatrics and more – all absolutely free."
        action={
          <ButtonLink to="/departments/" variant="ghost">
            All departments
          </ButtonLink>
        }
      >
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {departments.map((d) => (
            <li key={d.slug}>
              <DepartmentCard department={d} />
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="doctors"
        tone="white"
        eyebrow="Our doctors"
        title="Meet our doctors"
        intro="Resident doctors and visiting consultants across our specialities."
        action={
          <ButtonLink to="/doctors/" variant="ghost">
            All doctors
          </ButtonLink>
        }
      >
        <DoctorCarousel />
      </Section>

      <Section id="about">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <img
              src="/images/hospital-ward-sm.webp"
              srcSet="/images/hospital-ward-sm.webp 800w, /images/hospital-ward.webp 1600w"
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt="Inpatient ward at Sai Aarogya Hospital with rows of clean hospital beds"
              width={800}
              height={600}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-4xl object-cover shadow-lift"
            />
            <img
              src="/images/opd-waiting-area.webp"
              alt="Patients waiting in the OPD corridor"
              width={1280}
              height={640}
              loading="lazy"
              className="absolute -bottom-8 -right-3 hidden w-1/2 rounded-3xl border-[6px] border-ink-50 object-cover shadow-lift md:block"
            />
          </div>
          <div>
            <p className="eyebrow">About us</p>
            <h2 id="about-title" className="text-h2 mt-4">
              Rooted in selfless service
            </h2>
            <p className="mt-5 text-lg text-ink-700">{about.intro[1]}</p>
            <ul className="mt-6 space-y-3">
              {["A unit of Sri Sathya Sai Sujala Sravanthi Trust", "Under the Sri Madhusudan Sai Global Humanitarian Mission", "Inaugurated on 13 December 2024"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-ink-900">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-maroon-700" aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <ButtonLink to="/about/" variant="soft">
                Our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      <Section
        id="network"
        tone="white"
        eyebrow="Our network"
        title="Part of a larger mission"
        intro="Sai Aarogya Hospital works alongside other healthcare initiatives of the Sri Madhusudan Sai Global Humanitarian Mission."
      >
        <NetworkCards />
      </Section>

      <Section
        id="stories"
        eyebrow="Patient stories"
        title="Voices from our patients"
        action={
          <ButtonLink to="/impact/stories/" variant="ghost">
            All stories
          </ButtonLink>
        }
      >
        {patientStories.length ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {patientStories.map((s) => (
              <li key={s.slug}>
                <StoryCard story={s} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="surface flex flex-col gap-5 p-6 md:flex-row md:items-center md:p-8">
            <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-maroon-50 text-maroon-700">
              <MessageSquareQuote className="h-7 w-7" aria-hidden />
            </span>
            <p className="flex-1 text-ink-700">Stories from our patients will be shared here soon.</p>
          </div>
        )}
      </Section>

      <Section id="visit" tone="white" eyebrow="Visit us" title="Find us at Khajipalem, Bapatla">
        <VisitUs />
      </Section>

      <SupportCta />
    </>
  );
}
