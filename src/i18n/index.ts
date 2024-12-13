/* eslint-disable @typescript-eslint/no-floating-promises */
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import english from './locales/en.json';
import spanish from './locales/es.json';
import portuguese from './locales/pt.json';

const resources = {
  en: {
    translation: {
      ...english,
    },
  },
  es: {
    translation: {
      ...spanish,
    },
  },
  pt: {
    translation: {
      ...portuguese,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
