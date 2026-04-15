'use client';

import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-stone-200 bg-white/60 backdrop-blur-sm overflow-hidden text-[11px] font-semibold tracking-wider uppercase">
      <button
        onClick={() => setLanguage('en')}
        className={`cursor-pointer px-2.5 py-1.5 transition-all duration-200 ${
          language === 'en'
            ? 'bg-stone-900 text-white'
            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('id')}
        className={`cursor-pointer px-2.5 py-1.5 transition-all duration-200 ${
          language === 'id'
            ? 'bg-stone-900 text-white'
            : 'text-stone-400 hover:text-stone-700 hover:bg-stone-50'
        }`}
        aria-label="Switch to Indonesian"
      >
        ID
      </button>
    </div>
  );
}
