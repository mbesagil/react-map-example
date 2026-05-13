# Araç Takip ve Coğrafi Sınır (Geofencing) Sistemi

Bu proje, gerçek zamanlı araç takibi, gelişmiş coğrafi sınır (geofencing) analitiği ve çoklu araç kontrol mekanizmalarını içeren bir web uygulamasıdır.

## 🚀 Projede Neler Yapıldı?

Proje süresince temel bir harita uygulamasından tam kapsamlı bir filo yönetim simülasyonuna geçiş yapıldı:

- **Canlı Araç Takibi:** Araçların harita üzerinde gerçek zamanlı hareket simülasyonu.
- **Çoklu Araç Kontrolü:** Araçları tekli veya toplu olarak başlatma, durdurma, silme ve hızlarını anlık olarak değiştirme yeteneği.
- **Gelişmiş Coğrafi Sınır (Geofencing):** 
    - Harita üzerinde manuel poligon çizimi.
    - Bölge arama motoru ile hazır alanların (Örn: Konya, Ankara) yüklenmesi.
    - Araçların poligonun içinde/dışında olma durumunun anlık analizi.
- **Özel Harita Kontrolleri:** Leaflet'in standart kontrolleri yerine MUI tabanlı modern ve şık Zoom ile Çizim araçları geliştirildi.
- **Kullanıcı Arayüzü:** 
    - Landing Page (Karşılama Sayfası) ve Dashboard yapısı.
    - Koyu ve Aydınlık mod desteği.
    - Tamamen duyarlı (responsive) tasarım.
- **Uluslararasılaştırma (i18n):** Türkçe ve İngilizce dillerine tam destek.
- **Hata Yönetimi:** DOM hiyerarşisi hataları ve performans darboğazları için optimizasyonlar.

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** React 19, Vite
- **Harita:** Leaflet, React-Leaflet, Leaflet-Draw
- **UI/UX:** Material UI (MUI), TailwindCSS
- **State Yönetimi:** Zustand (Modular Slices & Persistence)
- **Dil Desteği:** i18next
- **Navigasyon:** React Router Dom
- **Dağıtım/Container:** Docker, Nginx

## 🏁 Nasıl Başlatılır?

### 1. Yerel Geliştirme Ortamı

Projeyi yerel makinenizde çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev
```
Uygulama varsayılan olarak `http://localhost:5173` adresinde çalışacaktır.

### 2. Docker ile Çalıştırma

Projeyi Docker üzerinde production provası olarak çalıştırmak için:

```bash
# İmajı oluşturun ve konteyneri başlatın
docker-compose up --build
```
Uygulamaya `http://localhost:8080` adresinden erişebilirsiniz.

## 📁 Proje Yapısı

- `src/components`: Harita, Araç ve Bölge bileşenleri.
- `src/store`: Zustand dilimleri (slices) ile merkezi state yönetimi.
- `src/hooks`: Araç mantığı ve geofencing için özel hooklar.
- `src/pages`: Landing ve Dashboard sayfaları.
- `src/utils`: Coğrafi hesaplamalar ve hareket simülasyonu algoritmaları.

