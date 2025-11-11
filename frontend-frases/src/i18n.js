import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
  .use(HttpApi) // Carga traducciones desde la carpeta /public/locales
  .use(initReactI18next) // Pasa i18n a react-i18next
  .init({
    // Idioma por defecto
    fallbackLng: 'es', 
    debug: true, // (Opcional: ponlo en 'false' en producción)
    
    // Dónde encontrar los archivos JSON
    backend: {
      loadPath: '/locales/{{lng}}/translation.json',
    },

    // React ya escapa los valores, así que esto es seguro
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;