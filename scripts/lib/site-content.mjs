// Shared, single-source site content: contact details, accreditation info,
// the footer, the Google Maps embed and the canonical/OpenGraph/Twitter meta
// block. Imported by the page generators and by the static-page injector so
// each fragment is defined exactly once.

import { SITE_ORIGIN } from "./site-schema.mjs";

export const CONTACT = {
  legalName: "Unique Analiz Belgelendirme ve Gözetim Hizmetleri Ltd. Şti.",
  address: "Atatürk Mah. Hadımköy Yolu Cd. No:10 İç Kapı No:7, 34516 Esenyurt/İstanbul",
  phoneDisplay: "0540 886 16 27",
  phoneHref: "+905408861627",
  email: "info@uniqueanalyse.com",
  mapsQuery: "Atatürk Mah. Hadımköy Yolu Cd. No:10 Esenyurt İstanbul"
};

export const TURKAK = {
  fileNo: "AB-2015-T",
  body: "Türk Akreditasyon Kurumu (TÜRKAK)",
  standard: "ISO/IEC 17025",
  // TODO: AB-2015-T kaydının tam TÜRKAK ASIST doğrulama linkini buraya yapıştırın.
  // Tüm sayfalardaki doğrulama bağlantısı bu tek satırdan beslenir.
  verificationUrl: "https://secure.turkak.org.tr/AkrediteKuruluslar/AkrediteKuruluslarAra"
};

// One-line accreditation summary used in footers and trust copy.
export const ACCREDITATION_LINE = `${TURKAK.body} tarafından ${TURKAK.standard} kapsamında akredite · Akreditasyon No: ${TURKAK.fileNo}`;

const indentLines = (value, spaces) => {
  const pad = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => (line ? `${pad}${line}` : ""))
    .join("\n");
};

export const footerHtml = (indentSpaces = 0) =>
  indentLines(
    `<footer class="site-footer">
  <img src="/assets/unique-analyse-logo.png" alt="Unique Analyse" />
  <div class="footer-info">
    <p class="footer-accreditation">${ACCREDITATION_LINE}</p>
    <address class="footer-contact">
      <span class="footer-legal">${CONTACT.legalName}</span>
      <span>${CONTACT.address}</span>
      <span class="footer-links"><a href="tel:${CONTACT.phoneHref}">${CONTACT.phoneDisplay}</a> · <a href="mailto:${CONTACT.email}">${CONTACT.email}</a></span>
    </address>
  </div>
  <span class="footer-copy">© 2026 Unique Analyse</span>
</footer>`,
    indentSpaces
  );

export const mapsEmbedHtml = (indentSpaces = 0) =>
  indentLines(
    `<div class="map-embed">
  <iframe
    title="Unique Analyse konum haritası"
    src="https://www.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&output=embed"
    width="100%"
    height="320"
    style="border:0"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    allowfullscreen
  ></iframe>
</div>`,
    indentSpaces
  );

const escapeAttr = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

// Canonical + OpenGraph + Twitter card block.
// canonicalPath is a site-absolute path beginning with "/" (e.g. "/testler/").
export const metaTagsHtml = (
  { canonicalPath = "/", title = "", description = "", image, type = "website" } = {},
  indentSpaces = 0
) => {
  const url = `${SITE_ORIGIN}${canonicalPath}`;
  const ogImage = image || `${SITE_ORIGIN}/assets/lab-hero.jpg`;
  const t = escapeAttr(title);
  const d = escapeAttr(description);
  return indentLines(
    `<link rel="canonical" href="${url}" />
<meta property="og:type" content="${type}" />
<meta property="og:site_name" content="Unique Analyse" />
<meta property="og:locale" content="tr_TR" />
<meta property="og:title" content="${t}" />
<meta property="og:description" content="${d}" />
<meta property="og:url" content="${url}" />
<meta property="og:image" content="${ogImage}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${t}" />
<meta name="twitter:description" content="${d}" />
<meta name="twitter:image" content="${ogImage}" />`,
    indentSpaces
  );
};
