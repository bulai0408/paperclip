import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from "./locales/zh.json";
import en from "./locales/en.json";

const LANGUAGE_KEY = "paperclip.language";

function getStoredLanguage(): string {
  if (typeof window === "undefined") return "zh";
  try {
    return window.localStorage.getItem(LANGUAGE_KEY) ?? "zh";
  } catch {
    return "zh";
  }
}

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export function changeLanguage(lang: string) {
  i18n.changeLanguage(lang);
  try {
    window.localStorage.setItem(LANGUAGE_KEY, lang);
  } catch {
    // Ignore storage failures
  }
}

export default i18n;
