import i18n from "../i18/config";

export type SupportLanguage = "en" | "ja";

const supportLangs = ["en", "ja"];

export const setUILanguage = (lang: string | null) => {
  const newLang = lang && supportLangs.includes(lang) ? lang : "en";
  i18n.changeLanguage(newLang);
  document.documentElement.lang = newLang;
  localStorage.setItem("lang", newLang);
};
