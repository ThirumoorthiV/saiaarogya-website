import { Head } from "vite-react-ssg";
import { useLang, localizePath } from "@/i18n/LangContext";
import { SITE_URL } from "@/lib/staticPaths";

interface SeoProps {
  /** Page title without the site suffix. Use `fullTitle` to override completely. */
  title: string;
  fullTitle?: boolean;
  /** 140–160 characters (§8) */
  description: string;
  /** English path of the page, e.g. "/about/" */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  /** JSON-LD objects; null entries are skipped */
  schema?: (Record<string, unknown> | null)[];
  noindex?: boolean;
}

const SUFFIX = "Sai Aarogya Hospital, Bapatla";

/**
 * Per-page <head>: unique title + description, canonical, hreflang (EN/TE),
 * Open Graph + Twitter tags for WhatsApp/Facebook previews, and JSON-LD.
 */
export function Seo({ title, fullTitle, description, path, image = "/images/og-default.jpg", imageAlt, type = "website", schema = [], noindex }: SeoProps) {
  const lang = useLang();
  const fullT = fullTitle ? title : `${title} | ${SUFFIX}`;
  const canonical = `${SITE_URL}${localizePath(path, lang)}`;
  const enUrl = `${SITE_URL}${path}`;
  const teUrl = `${SITE_URL}${localizePath(path, "te")}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;

  return (
    <Head>
      <html lang={lang === "te" ? "te" : "en"} />
      <title>{fullT}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="en-IN" href={enUrl} />
      <link rel="alternate" hrefLang="te-IN" href={teUrl} />
      <link rel="alternate" hrefLang="x-default" href={enUrl} />

      <meta property="og:site_name" content="Sai Aarogya Hospital" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullT} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content={imageAlt ?? "Sai Aarogya Hospital, Bapatla"} />
      <meta property="og:locale" content={lang === "te" ? "te_IN" : "en_IN"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullT} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />

      {lang === "te" ? (
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Telugu:wght@400;500&display=swap" />
      ) : null}

      {schema
        .filter((s): s is Record<string, unknown> => Boolean(s))
        .map((s, i) => (
          <script key={i} type="application/ld+json">
            {JSON.stringify(s)}
          </script>
        ))}
    </Head>
  );
}
