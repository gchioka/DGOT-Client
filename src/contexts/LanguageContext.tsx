import { createContext, useContext, useState, type ReactNode } from "react";
import { translations, type Lang, type TranslationKey } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const STORAGE_KEY = "dgot-lang";

function detectLang(): Lang {
  if (typeof window === "undefined") return "pt";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "en" || saved === "pt" || saved === "es") return saved;
  return "pt";
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback to English so a missing provider never crashes the app
    return {
      lang: "pt" as Lang,
      setLang: (_: Lang) => {},
      t: (key: TranslationKey) => translations.pt[key],
    };
  }
  return ctx;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectLang);

  const setLang = (newLang: Lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
    }
    setLangState(newLang);
  };

  const t = (key: TranslationKey): string => translations[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
