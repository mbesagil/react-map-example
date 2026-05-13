import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_title": "Vehicle Management",
      "vehicles": "Vehicles",
      "add": "Add",
      "no_vehicles": "No vehicles yet.",
      "loading_data": "Loading Data...",
      "click_map_target": "Click on map to set target",
      "search_region": "Search region...",
      "no_results": "No results found.",
      "active_region": "Active Region",
      "clear_area": "Clear Area",
      "analytics": "Analytics",
      "inside": "Inside",
      "outside": "Outside",
      "moving": "moving",
      "idle": "idle",
      "arrived": "arrived",
      "plate": "Plate",
      "speed": "Speed",
      "status": "Status",
      "inside_polygon": "Inside Polygon",
      "standard": "Standard",
      "satellite": "Satellite",
      "add_vehicle": "Add Vehicle",
      "vehicle_name": "Vehicle Name",
      "cancel": "Cancel",
      "latitude": "Latitude",
      "longitude": "Longitude",
      "car": "Car",
      "motorcycle": "Motorcycle",
      "service": "Service",
      "truck": "Truck",
      "vehicle_type": "Vehicle Type"
    }
  },
  tr: {
    translation: {
      "app_title": "Araç Takip Sistemi",
      "vehicles": "Araçlar",
      "add": "Ekle",
      "no_vehicles": "Henüz araç yok.",
      "loading_data": "Veriler Yükleniyor...",
      "click_map_target": "Hedef belirlemek için haritaya tıklayın",
      "search_region": "Bölge ara...",
      "no_results": "Sonuç bulunamadı.",
      "active_region": "Aktif Bölge",
      "clear_area": "Alanı Temizle",
      "analytics": "Analiz",
      "inside": "İçeride",
      "outside": "Dışarıda",
      "moving": "hareketli",
      "idle": "beklemede",
      "arrived": "ulaştı",
      "plate": "Plaka",
      "speed": "Hız",
      "status": "Durum",
      "inside_polygon": "Poligon İçinde",
      "standard": "Standart",
      "satellite": "Uydu",
      "add_vehicle": "Araç Ekle",
      "vehicle_name": "Araç Adı",
      "cancel": "İptal",
      "latitude": "Enlem",
      "longitude": "Boylam",
      "car": "Araba",
      "motorcycle": "Motor",
      "service": "Servis",
      "truck": "Kamyon",
      "vehicle_type": "Araç Tipi"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
