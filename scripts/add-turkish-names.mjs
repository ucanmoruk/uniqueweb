// One-off data patch: adds a Turkish equivalent (nameTr) to every service in
// data/tests/test-library.json. English names are kept; nameTr is the Turkish
// karşılık shown in the list subtitle and used in detail title/meta. Re-running
// is safe — it only sets the field from the map below.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const testsFile = path.join(rootDir, "data", "tests", "test-library.json");

const namesTr = {
  "1-month-accelerated-stability-and-compatibility": "1 Aylık Hızlandırılmış Stabilite ve Uyumluluk Testi",
  "1-4-dioxane": "1,4-Dioksan Analizi",
  "26-allergens-analysis-by-gc-ms": "26 Alerjen Analizi (GC/MS)",
  "3-month-accelerated-stability-and-compatibility": "3 Aylık Hızlandırılmış Stabilite ve Uyumluluk Testi",
  "50-subject-hript-testing-normal-skin": "50 Denekli HRIPT Testi – Normal Cilt",
  "50-subject-hript-testing-sensitive-skin": "50 Denekli HRIPT Testi – Hassas Cilt",
  "6-month-accelerated-stability-and-compatibility": "6 Aylık Hızlandırılmış Stabilite ve Uyumluluk Testi",
  "acrylamide-testing": "Akrilamid Analizi",
  "adsorbable-organic-fluorine-aof-testing-epa-method-1621": "Adsorbe Edilebilir Organik Flor (AOF) Analizi – EPA Metot 1621",
  "aerobic-biodegradability-testing-oecd-301b-co-evolution-test": "Aerobik Biyobozunurluk Testi (OECD 301B – CO₂ Salınım Testi)",
  "alcohol-content-testing": "Alkol Miktarı Tayini",
  "amazon-compliance-smart-screening-panel": "Amazon Uyumluluk Akıllı Tarama Paneli",
  "anaerobic-biodegradability-testing-oecd-311": "Anaerobik Biyobozunurluk Testi (OECD 311)",
  "asbestos-analysis-by-plm": "Asbest Analizi (PLM)",
  "asbestos-analysis-by-tem": "Asbest Analizi (TEM)",
  "astm-d820-total-phosphorus": "ASTM D820 – Toplam Fosfor",
  "benzalkonium-chloride-bzk-testing-by-hplc-dad": "Benzalkonyum Klorür (BZK) Analizi (HPLC-DAD)",
  "benzene-testing-by-gc-ms": "Benzen Analizi (GC-MS)",
  "btex-testing-by-hs-gc-ms": "BTEX Analizi (HS-GC-MS)",
  "california-cleaning-product-right-to-know-act-review-sb-258": "California Temizlik Ürünü Bilgi Edinme Yasası İncelemesi (SB-258)",
  "california-proposition-65-ingredient-review": "California Proposition 65 İçerik İncelemesi",
  "california-safe-cosmetics-review": "California Güvenli Kozmetik İncelemesi",
  "cocamide-dea": "Kokamid DEA Analizi",
  "color-odor-and-appearance-evaluation": "Renk, Koku ve Görünüm Değerlendirmesi",
  "consumer-use-test-20-panelists": "Tüketici Kullanım Testi (20 Panelist)",
  "diethanolamine-dea-content-testing": "Dietanolamin (DEA) Miktar Tayini",
  "differential-scanning-calorimetry-dsc-analysis": "Diferansiyel Taramalı Kalorimetri (DSC) Analizi",
  "ethylene-oxide-testing-by-headspace-gc-ms": "Etilen Oksit Analizi (Headspace GC/MS)",
  "eu-cosmetic-label-review": "AB Kozmetik Etiket İncelemesi",
  "eu-cpnp-registration-service": "AB CPNP Bildirim Hizmeti",
  "eu-pif-creation-service": "AB PIF (Ürün Bilgi Dosyası) Hazırlama Hizmeti",
  "eu-pif-review-service": "AB PIF İnceleme Hizmeti",
  "eu-uk-cosmetic-product-safety-report-cpsr": "AB/UK Kozmetik Ürün Güvenlik Raporu (CPSR)",
  "firepoint-astm-d92": "Yanma Noktası – ASTM D92",
  "flame-extension-and-ignition-distance-testing": "Alev Uzaması ve Tutuşma Mesafesi Testi",
  "flame-extension-testing-do-30-canada": "Alev Uzaması Testi (DO-30, Kanada)",
  "flash-and-fire-point-astm-d92": "Parlama ve Yanma Noktası – ASTM D92",
  "flash-and-fire-point-testing-astm-d1310": "Parlama ve Yanma Noktası Testi – ASTM D1310",
  "flash-point-testing-astm-d3828": "Parlama Noktası Testi – ASTM D3828",
  "flash-point-testing-astm-d93": "Parlama Noktası Testi – ASTM D93",
  "flash-point-testing-astm-d92": "Parlama Noktası Testi – ASTM D92",
  "flashpoint-testing-astm-d56-tag-closed-cup": "Parlama Noktası Testi – ASTM D56 (Tag Kapalı Kap)",
  "formulation-health-score-add-on": "Formülasyon Sağlık Skoru™ Ek Hizmeti",
  "free-formaldehyde-testing-by-hplc": "Serbest Formaldehit Analizi (HPLC)",
  "ftir-fingerprinting": "FTIR Parmak İzi Analizi",
  "gc-fid-fingerprinting": "GC-FID Parmak İzi Analizi",
  "gluten-free-testing": "Glutensiz (Gluten Free) Analizi",
  "heavy-metals-testing-iso-21392": "Ağır Metal Analizi – ISO 21392",
  "heavy-metals-testing-usp": "Ağır Metal Analizi – USP",
  "iso-11930-preservative-effectiveness-test-pet-no-suitability": "ISO 11930 Koruyucu Etkinlik Testi (PET) – Uygunluk Testsiz",
  "iso-11930-preservative-effectiveness-test-pet-with-suitability": "ISO 11930 Koruyucu Etkinlik Testi (PET) – Uygunluk Testli",
  "lead-content-testing-by-icp-ms": "Kurşun Miktar Tayini (ICP-MS)",
  "mercury-content": "Cıva Miktarı Tayini",
  "methanol-content-testing-by-gc-ms": "Metanol Miktar Tayini (GC/MS)",
  "parabens-free-testing-by-hplc-uv": "Paraben İçermez (Parabens Free) Analizi (HPLC-UV)",
  "pfas-testing": "PFAS Analizi",
  "ph-value-analysis-astm-e70": "pH Değeri Analizi – ASTM E70",
  "ph-eur-5-1-3-preservative-effectiveness-test-pet": "Ph. Eur. 5.1.3 Koruyucu Etkinlik Testi (PET)",
  "phenoxyethanol-assay-by-hplc": "Fenoksietanol Miktar Tayini (HPLC)",
  "phthalates-testing-by-gc-ms": "Ftalat Analizi (GC-MS)",
  "potassium-sorbate-assay-by-hplc": "Potasyum Sorbat Miktar Tayini (HPLC)",
  "shelf-life-pao-assessment": "Raf Ömrü ve PAO Değerlendirmesi",
  "sls-and-sles-testing": "SLS ve SLES Analizi",
  "sodium-benzoate-testing": "Sodyum Benzoat Analizi",
  "soy-free-testing-by-elisa-assay": "Soya İçermez (Soy Free) Analizi (ELISA)",
  "substances-of-very-high-concern-svhc-screening": "Yüksek Önem Arz Eden Maddeler (SVHC) Taraması",
  "sulfate-free-testing-by-ion-chromatography-ic": "Sülfat İçermez (Sulfate Free) Analizi (İyon Kromatografisi - IC)",
  "supervised-in-use-test-under-dermatological-ophthalmological-control": "Dermatolojik ve Oftalmolojik Kontrol Altında Kullanım Testi",
  "supervised-in-use-test-under-dermatological-control": "Dermatolojik Kontrol Altında Kullanım Testi",
  "supervised-in-use-test-under-gynecological-control": "Jinekolojik Kontrol Altında Kullanım Testi",
  "supervised-in-use-test-under-ophthalmological-control": "Oftalmolojik Kontrol Altında Kullanım Testi",
  "time-kill-testing": "Time-Kill (Öldürme Süresi) Testi",
  "total-fluorine-content-testing": "Toplam Flor Miktarı Tayini",
  "total-organic-fluorine-tof-testing-en-14582": "Toplam Organik Flor (TOF) Analizi – EN 14582",
  "uk-cosmetic-label-review": "Birleşik Krallık Kozmetik Etiket İncelemesi",
  "uk-cosmetic-registration-service": "Birleşik Krallık Kozmetik Kayıt Hizmeti",
  "us-cosmetics-mocra-toxicological-risk-assessment-tra": "ABD Kozmetik MoCRA Toksikolojik Risk Değerlendirmesi (TRA)",
  "us-ingredient-review-cosmetics": "ABD İçerik İncelemesi (Kozmetik)",
  "us-label-review-cosmetics": "ABD Etiket İncelemesi (Kozmetik)",
  "us-mocra-company-registration-form-5066": "ABD MoCRA Firma Kaydı (Form 5066)",
  "us-mocra-product-registration-form-5067": "ABD MoCRA Ürün Kaydı (Form 5067)",
  "us-safety-data-sheet-sds-creation": "ABD Güvenlik Bilgi Formu (SDS) Hazırlama",
  "usp-antimicrobial-effectiveness-test-pet-no-suitability": "USP Antimikrobiyal Etkinlik Testi (PET) – Uygunluk Testsiz",
  "usp-antimicrobial-effectiveness-test-pet-with-suitability": "USP Antimikrobiyal Etkinlik Testi (PET) – Uygunluk Testli",
  "usp-burkholderia-cepacia-complex-bcc-testing": "USP Burkholderia cepacia Kompleksi (BCC) Testi",
  "usp-microbial-enumeration-test-total-aerobic-microbial-count-yeast-and-mold-count": "USP Mikrobiyal Sayım Testi (Toplam Aerobik Mikrobiyal Sayım ve Maya/Küf Sayımı)",
  "usp-microbial-enumeration-specified-organisms-suitability-test": "USP Mikrobiyal Sayım ve Belirli Mikroorganizmalar (Uygunluk Testi)",
  "usp-microbial-limits-testing-total-count-pathogen-screening": "USP Mikrobiyal Limit Testi (Toplam Sayım ve Patojen Taraması)",
  "uv-vis-absorption-spectra": "UV-VIS Absorpsiyon Spektrumu",
  "vapor-pressure-testing-astm-e1719": "Buhar Basıncı Testi (ASTM E1719)",
  "voc-content-testing-carb-method-310": "VOC (Uçucu Organik Bileşen) Miktarı – CARB Metot 310",
  "volatile-nitrosamines-testing": "Uçucu Nitrozamin Analizi",
  "water-activity": "Su Aktivitesi",
  "water-activity-testing-aoac-978-18": "Su Aktivitesi Testi (AOAC 978.18)"
};

const data = JSON.parse(await readFile(testsFile, "utf8"));
let patched = 0;
const missing = [];

data.services = data.services.map((service) => {
  const nameTr = namesTr[service.slug];
  if (!nameTr) {
    missing.push(service.slug);
    return service;
  }
  patched += 1;
  // Insert nameTr right after name, and ensure an `accredited` flag exists (default false).
  const { slug, name, nameTr: _prevTr, accredited: prevAccredited, ...rest } = service;
  return { slug, name, nameTr, accredited: prevAccredited ?? false, ...rest };
});

await writeFile(testsFile, `${JSON.stringify(data, null, 2)}\n`, "utf8");
console.log(`Patched ${patched} services with nameTr.`);
if (missing.length) console.log(`Missing Turkish name for: ${missing.join(", ")}`);
