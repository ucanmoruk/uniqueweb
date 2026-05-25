# Unique Analyse Bilgi Ağacı Üretimi

Bu proje ürün, test ve mevzuat sayfalarını veri dosyasından otomatik üretir.

## Yeni Ürün Ekleme

1. `data/products/` altında yeni bir JSON dosyası oluşturun.
2. `retinol-serum.json` dosyasını kopyalayıp ürün adı, URL, başlıklar, testler, mevzuat ve CTA alanlarını değiştirin.
3. Aşağıdaki komutu çalıştırın:

```bash
npm run generate
```

Script otomatik olarak şu sayfaları üretir:

- `/urunler/{urun-slug}/`
- `/testler/{test-slug}/`
- `/mevzuat/{mevzuat-slug}/`
- `/bilgi-agaci/`

## Yeni Ülke / Pazar Mevzuatı Ekleme

1. `data/markets/cosmetics-markets.json` dosyasındaki `markets` listesine yeni ülke veya pazar objesi ekleyin.
2. `slug`, `name`, `regulationName`, `applicationDate`, `requirements`, `documents`, `timeline` ve `sources` alanlarını doldurun.
3. `npm run generate` komutunu çalıştırın.

Script otomatik olarak şu sayfaları üretir:

- `/mevzuat/`
- `/mevzuat/ulkeler/{ulke-slug}/`

## Test Kütüphanesini Güncelleme

1. Kaynak listedeki test hizmetlerini fiyat bilgisi olmadan yeniden almak için şu komutu çalıştırın:

```bash
npm run import:tests:pentyllabs
```

2. `data/tests/test-library.json` dosyasındaki kategori, metot veya açıklama alanlarını gerekirse düzenleyin.
3. `npm run generate` komutuyla `/testler/` sayfasını yeniden üretin.

## Mantık

Her ürün üçlü bir SEO akışına sahiptir:

- Ürün sayfası: ürün için test ve belgelendirme ihtiyaçları.
- Test sayfası: laboratuvar metodu, cihaz, prosedür ve raporlama otoritesi.
- Ürüne ait mevzuat sayfası: hedef pazar, ÜTS/CPNP/PIF/CPSR ve operasyonel süreç.
- Genel mevzuat kütüphanesi: ülke bazlı yönetmelik adı, uygulama tarihi, bildirim yolu ve gereklilikler.
- Test kütüphanesi: hizmet adı, metot, açıklama, tahmini süre ve numune bilgisi.

Sayfalar birbirine iç linklerle bağlanır. Kullanıcı Google, site içi kart, satış linki veya bilgi ağacı indeksinden hangi sayfaya düşerse düşsün hizmet talebine yönlendirilir.
