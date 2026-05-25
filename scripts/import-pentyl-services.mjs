import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outFile = path.join(rootDir, "data", "tests", "test-library.json");
const sourceUrl = "https://www.pentyllabs.com/all-services/";

const stripHtml = (value = "") =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#036;/g, "$")
    .replace(/&#8211;|&ndash;/g, "–")
    .replace(/&#8212;|&mdash;/g, "—")
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&#8242;/g, "'")
    .replace(/&#8482;/g, "™")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

const slugify = (value) =>
  value
    .toLocaleLowerCase("tr")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const categories = [
  {
    key: "stabilite",
    label: "Stabilite ve raf ömrü",
    keywords: ["stability", "shelf life", "pao", "compatibility", "formulation health"]
  },
  {
    key: "mikrobiyoloji",
    label: "Mikrobiyoloji ve koruyucu etkinlik",
    keywords: ["preservative", "pet", "usp <51>", "usp 51", "usp <60>", "usp <61>", "usp <62>", "microbial", "time kill", "water activity"]
  },
  {
    key: "klinik-saha",
    label: "Klinik, saha ve kullanım çalışmaları",
    keywords: ["hript", "consumer use", "supervised in-use", "dermatological", "ophthalmological", "gynecological", "panelists"]
  },
  {
    key: "alevlenebilirlik",
    label: "Alevlenebilirlik ve fiziksel güvenlik",
    keywords: ["flash", "fire point", "flame", "flammability", "ignition distance"]
  },
  {
    key: "mevzuat-uygunluk",
    label: "Mevzuat, etiket ve dosya uygunluğu",
    keywords: ["label", "registration", "cpnp", "pif", "cpsr", "sds", "mocra", "ingredient review", "proposition", "sb-258", "safe cosmetics", "svhc", "amazon compliance", "toxicological risk"]
  },
  {
    key: "biyobozunurluk",
    label: "Biyobozunurluk",
    keywords: ["biodegradability", "oecd 301", "oecd 311"]
  },
  {
    key: "kimyasal-analiz",
    label: "Kimyasal analiz ve kontaminant taraması",
    keywords: [
      "dioxane",
      "allergens",
      "acrylamide",
      "aof",
      "alcohol",
      "asbestos",
      "phosphorus",
      "benzalkonium",
      "benzene",
      "btex",
      "cocamide",
      "diethanolamine",
      "ethylene oxide",
      "formaldehyde",
      "heavy metals",
      "lead",
      "mercury",
      "methanol",
      "parabens",
      "pfas",
      "phenoxyethanol",
      "phthalates",
      "potassium sorbate",
      "sls",
      "sles",
      "sodium benzoate",
      "sulfate",
      "fluorine",
      "nitrosamines",
      "voc"
    ]
  },
  {
    key: "kalite-kontrol",
    label: "Kalite kontrol ve fizikokimyasal testler",
    keywords: ["color", "odor", "appearance", "dsc", "ftir", "gc-fid fingerprinting", "gluten", "pH", "uv-vis", "vapor pressure", "soy free"]
  }
];

const methodPatterns = [
  /ISO\s?\d+(?:-\d+)?:?\d*/gi,
  /USP\s?<\d+>(?:\/<\d+>)?/gi,
  /USP\s?\d+/gi,
  /Ph\.?\s?Eur\.?\s?\d+(?:\.\d+)*/gi,
  /ASTM\s?[A-Z]\d+/gi,
  /OECD(?:\sTest\sNo\.?)?\s?\d+[A-Z]?/gi,
  /EPA\sMethod\s[\dA-Z/-]+/gi,
  /CARB\sMethod\s\d+/gi,
  /EN\s?\d+/gi,
  /AOAC\s?\d+(?:\.\d+)*/gi,
  /Headspace[-\s]?GC\/?MS/gi,
  /HS[-\s]?GC[-\s]?MS/gi,
  /GC[-\/]?MS/gi,
  /GC[-\s]?FID/gi,
  /GC[-\s]?TEA/gi,
  /HPLC[-\s]?MS\/?MS/gi,
  /HPLC[-\s]?DAD/gi,
  /HPLC[-\s]?UV/gi,
  /\bHPLC\b/gi,
  /\bICP[-\s]?MS\b/gi,
  /\bFTIR\b/gi,
  /\bELISA\b/gi,
  /Ion Chromatography|\bIC\b/gi,
  /\bDSC\b/gi,
  /\bPLM\b/gi,
  /\bTEM\b/gi,
  /UV[-\s]?VIS/gi,
  /\bHRIPT\b/gi,
  /\bCPNP\b/gi,
  /\bSCPN\b/gi,
  /\bPIF\b/gi,
  /\bCPSR\b/gi,
  /\bSDS\b/gi,
  /\bMoCRA\b/gi,
  /\bSB[-\s]?258\b/gi,
  /Proposition\s65/gi
];

const titleCaseMethod = (value) =>
  value
    .replace(/\s+/g, " ")
    .replace(/gc\/ms/gi, "GC/MS")
    .replace(/gc-ms/gi, "GC-MS")
    .replace(/hplc/gi, "HPLC")
    .replace(/icp-ms/gi, "ICP-MS")
    .replace(/ftir/gi, "FTIR")
    .replace(/elisa/gi, "ELISA")
    .replace(/uv-vis/gi, "UV-VIS")
    .replace(/mocra/gi, "MoCRA")
    .trim();

const extractMethods = (service) => {
  const haystack = `${service.name} ${service.sourceDescription}`;
  const found = new Set();
  for (const pattern of methodPatterns) {
    for (const match of haystack.matchAll(pattern)) {
      found.add(titleCaseMethod(match[0]));
    }
  }
  return [...found];
};

const inferCategory = (service) => {
  const haystack = `${service.name} ${service.sourceDescription}`.toLocaleLowerCase("en");
  return (
    categories.find((category) =>
      category.keywords.some((keyword) => haystack.includes(keyword.toLocaleLowerCase("en")))
    ) || categories.at(-1)
  );
};

const describeService = (service, category, methods) => {
  const methodText = methods.length ? `${methods.join(", ")} metodolojisiyle` : "uygun laboratuvar protokolüyle";
  const name = service.name.replace(/\s+/g, " ").trim();

  if (category.key === "stabilite") {
    return `${name}, ürünün sıcaklık, zaman, ambalaj ve saklama koşullarında fiziksel/kimyasal davranışını izlemek için kullanılır. Raf ömrü, PAO ve saha dayanımı kararlarını destekler.`;
  }
  if (category.key === "mikrobiyoloji") {
    return `${name}, ürünün mikrobiyal yükünü, koruyucu sistem performansını veya hedef mikroorganizma riskini değerlendirmek için uygulanır. Güvenlik dosyası ve batch serbest bırakma kararını güçlendirir.`;
  }
  if (category.key === "klinik-saha") {
    return `${name}, ürünün hedef kullanıcı grubunda tolerans, irritasyon, kullanım uyumu veya algılanan performans verisini toplamak için planlanır. Reklam iddiası ve tüketici güveni için kanıt üretir.`;
  }
  if (category.key === "alevlenebilirlik") {
    return `${name}, ürünün parlama, yanma veya aerosol davranışını standart test yaklaşımıyla değerlendirir. Taşıma, etiket ve güvenlik sınıflandırması için teknik veri sağlar.`;
  }
  if (category.key === "mevzuat-uygunluk") {
    return `${name}, hedef pazarın etiket, bildirim, dosya veya içerik uygunluğu beklentilerini kontrol eder. Laboratuvar raporlarıyla birlikte pazara çıkış kararını okunabilir hale getirir.`;
  }
  if (category.key === "biyobozunurluk") {
    return `${name}, formül veya hammaddenin biyolojik parçalanabilirlik profilini takip eder. Çevresel iddia, deterjan/kozmetik dosyası ve sürdürülebilirlik beyanı için veri üretir.`;
  }
  if (category.key === "kalite-kontrol") {
    return `${name}, ürünün fizikokimyasal kimliğini, görünümünü veya kalite kontrol parametresini doğrulamak için uygulanır. Batch karşılaştırma ve hammadde kabul süreçlerinde referans veri sağlar.`;
  }
  return `${name}, ${methodText} ilgili bileşen, safsızlık veya kontaminant seviyesini kontrol eder. Formül güvenliği, mevzuat uygunluğu ve kalite kontrol kararları için nicel kanıt sağlar.`;
};

const toService = (row) => {
  const nameMatch = row.match(/<a href='([^']+)'\s+title='([^']*)'\s+class='wcpt-title[^']*'\s*>([\s\S]*?)<\/a>/);
  if (!nameMatch) return null;
  const descriptionMatch = row.match(/<div class="wcpt-excerpt[^\"]*">([\s\S]*?)<\/div>/);
  const attrs = Object.fromEntries(
    [...row.matchAll(/data-wcpt-taxonomy="([^"]+)"[\s\S]*?<div class="wcpt-attribute-term"[^>]*>([\s\S]*?)<\/div>/g)].map(
      (match) => [match[1], stripHtml(match[2])]
    )
  );
  const service = {
    sourceUrl: nameMatch[1],
    name: stripHtml(nameMatch[3]),
    sourceDescription: stripHtml(descriptionMatch?.[1] || ""),
    turnaroundTime: attrs.pa_turnaround_time || "",
    sampleSize: attrs.pa_sample_size || ""
  };
  const methods = extractMethods(service);
  const category = inferCategory(service);
  return {
    slug: slugify(service.name),
    name: service.name,
    category: category.key,
    categoryLabel: category.label,
    methods: methods.length ? methods : ["Ürün özelinde doğrulanacak metot"],
    description: describeService(service, category, methods),
    turnaroundTime: service.turnaroundTime,
    sampleSize: service.sampleSize,
    sourceUrl: service.sourceUrl
  };
};

const response = await fetch(sourceUrl, {
  headers: {
    "user-agent": "Mozilla/5.0"
  }
});

if (!response.ok) {
  throw new Error(`Could not fetch ${sourceUrl}: ${response.status}`);
}

const html = await response.text();
const rows = [...html.matchAll(/<tr\b[\s\S]*?data-wcpt-product-id="\d+"[\s\S]*?<\/tr>/g)].map((match) => match[0]);
const services = rows.map(toService).filter(Boolean);

if (services.length < 90) {
  throw new Error(`Expected around 94 services, found ${services.length}`);
}

const data = {
  source: {
    name: "Pentyl Labs all services",
    url: sourceUrl,
    importedAt: new Date().toISOString().slice(0, 10),
    note: "Fiyat bilgileri aktarılmadı. Açıklamalar Unique Analyse diliyle yeniden yazıldı."
  },
  categories: categories.map(({ key, label }) => ({ key, label })),
  services
};

await mkdir(path.dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");

console.log(`Imported ${services.length} services to ${outFile}`);
