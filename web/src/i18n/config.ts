import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const loadLocale = async (lang: string, translations: unknown) => {
  try {
    i18n.addResourceBundle(lang, "translation", translations);
    i18n.changeLanguage(lang);
  } catch (error) {
    console.error("Failed to load translations:", error);
  }
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  debug: false,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Important if you want to handle loading states manually
  },
});

export { i18n, loadLocale };
