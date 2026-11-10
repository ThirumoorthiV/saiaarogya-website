import { Head } from "vite-react-ssg";
import { SITE_URL } from "@/lib/staticPaths";

interface SeoProps {
  /** Page title without the site suffix (use fullTitle to override completely). */
  title: string;
  fullTitle?: boolean;
  /** 140–160 characters (§8) */
  description: string;
  /** Page path, e.g. "/about/" */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  /** JSON-LD objects; null entries are skipped */
  schema?: (Record<string, unknown> | null)[];
  noindex?: boolean;
}

const SUFFIX = "Sai Aarogya Hospital, Bapatla";

/** Per-page <head>: unique title + description, canonical, Open Graph / Twitter (WhatsApp previews), JSON-LD. */
export function Seo({ title, fullTitle, description, path, image = "/images/og-default.jpg", imageAlt, type = "website", schema = [], noindex }: SeoProps) {
  const fullT = fullTitle ? title : `${title} | ${SUFFIX}`;
  const url = `${SITE_URL}${path}`;
  const img = image.startsWith("http") ? image : `${SITE_URL}${image}`;
  return (
    <Head>
      <html lang="en" />
      <title>{fullT}</title>
      <meta name="description" content={description} />
      {noindex ? <meta name="robots" content="noindex, follow" /> : null}
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content="Sai Aarogya Hospital" />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullT} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content={imageAlt ?? "Sai Aarogya Hospital, Bapatla"} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullT} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
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
