// Single source of truth for site-wide JSON-LD structured data.
// Imported by the page generators and the static-page injector so the schema
// is defined once and never copied per page.

export const SITE_ORIGIN = "https://www.uniqueanalyse.com";
export const ORG_ID = `${SITE_ORIGIN}/#organization`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "TestingLaboratory"],
  "@id": ORG_ID,
  name: "Unique Analiz Belgelendirme ve Gözetim Hizmetleri Limited Şirketi",
  alternateName: "Unique Analyse",
  url: `${SITE_ORIGIN}/`,
  logo: `${SITE_ORIGIN}/assets/unique-analyse-logo.png`,
  image: `${SITE_ORIGIN}/assets/lab-hero.jpg`,
  description:
    "Kozmetik ağırlıklı çalışan, TÜRKAK tarafından ISO/IEC 17025 kapsamında akredite edilmiş deney laboratuvarı. Test hizmetlerinin yanında kozmetik danışmanlığı, mevzuat ve pazara hazırlık desteği sunar.",
  email: "info@uniqueanalyse.com",
  telephone: "+905408861627",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Atatürk Mah., Hadımköy Yolu Cd. No:10 İç Kapı No:7",
    addressLocality: "Esenyurt",
    addressRegion: "İstanbul",
    postalCode: "34516",
    addressCountry: "TR"
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 41.0,
    longitude: 28.6
  },
  hasCredential: {
    "@type": "EducationalOccupationalCredential",
    credentialCategory: "Akreditasyon",
    name: "TÜRKAK ISO/IEC 17025 Deney Laboratuvarı Akreditasyonu",
    recognizedBy: {
      "@type": "Organization",
      name: "Türk Akreditasyon Kurumu (TÜRKAK)",
      url: "https://www.turkak.org.tr/"
    },
    identifier: "AB-2015-T"
  },
  knowsAbout: [
    "Kozmetik ürün analizi",
    "Mikrobiyolojik analiz",
    "Koruyucu etkinlik testi (ISO 11930)",
    "Stabilite ve raf ömrü testi",
    "Fizikokimyasal analiz",
    "Ağır metal analizi",
    "Deterjan testleri",
    "Hammadde uygunluk kontrolü",
    "Kozmetik mevzuat danışmanlığı"
  ],
  areaServed: ["TR", "EU"],
  sameAs: []
};

// Escape so the JSON can live safely inside an HTML <script> element.
const escapeForScript = (json) =>
  json.replaceAll("<", "\\u003c").replaceAll(">", "\\u003e").replaceAll("&", "\\u0026");

// Render a schema object as an indented <script type="application/ld+json"> block.
// Every line carries `indentSpaces` of leading whitespace so the block can be
// dropped directly before </head> without further reformatting.
export const renderJsonLd = (data, indentSpaces = 4) => {
  const pad = " ".repeat(indentSpaces);
  const body = escapeForScript(JSON.stringify(data, null, 2))
    .split("\n")
    .map((line) => `${pad}${line}`)
    .join("\n");
  return `${pad}<script type="application/ld+json">\n${body}\n${pad}</script>`;
};

export const organizationJsonLd = (indentSpaces = 4) =>
  renderJsonLd(organizationSchema, indentSpaces);

// Build a Service schema for a single test from the test-library record.
export const buildServiceSchema = (service) => {
  const methods = (service.methods || []).join(" · ");
  const additionalProperty = [
    methods && { "@type": "PropertyValue", name: "Metot", value: methods },
    service.turnaroundTime && {
      "@type": "PropertyValue",
      name: "Test süresi",
      value: service.turnaroundTime
    },
    service.sampleSize && {
      "@type": "PropertyValue",
      name: "Numune gerekliliği",
      value: service.sampleSize
    }
  ].filter(Boolean);

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.categoryLabel,
    description: service.description,
    url: `${SITE_ORIGIN}/testler/analiz/${service.slug}/`,
    provider: { "@id": ORG_ID },
    areaServed: ["TR", "EU"],
    ...(additionalProperty.length ? { additionalProperty } : {})
  };
};

export const serviceJsonLd = (service, indentSpaces = 4) =>
  renderJsonLd(buildServiceSchema(service), indentSpaces);
