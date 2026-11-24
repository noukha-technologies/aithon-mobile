import i18n, { LanguageDetectorAsyncModule } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { mmkvStorage } from '@utils/storage';
import en from './locales/en.json';
import tn from './locales/tn.json';

const LANGUAGE_KEY = 'user-language';

const languageDetector: LanguageDetectorAsyncModule = {
  type: 'languageDetector',
  async: true,
  detect: async () => {
    try {
      const savedLanguage = await mmkvStorage.getItem(LANGUAGE_KEY);
      return savedLanguage || 'en';
    } catch (error) {
      console.log('Error detecting language:', error);
      return 'en';
    }
  },
  init: () => {},
  cacheUserLanguage: async (lng: string) => {
    try {
      await mmkvStorage.setItem(LANGUAGE_KEY, lng);
    } catch (error) {
      console.log('Error caching language:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      tn: { translation: tn },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
export { LANGUAGE_KEY };