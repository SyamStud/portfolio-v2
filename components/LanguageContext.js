'use client';

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext(undefined);

function getCookie(name) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value};expires=${expires};path=/;SameSite=Lax`;
}

export function LanguageProvider({ children, initialLang = 'en' }) {
  const [language, setLanguageState] = useState(initialLang);

  // On mount, read cookie preference
  useEffect(() => {
    const saved = getCookie('lang');
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    setCookie('lang', lang);
    // Update html lang attribute
    document.documentElement.lang = lang;
  }, []);

  // Translation function
  const t = useCallback(
    (key, params) => {
      const str = translations[language]?.[key] || translations.en?.[key] || key;
      if (!params) return str;
      // Replace {key} with params
      return str.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`);
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
