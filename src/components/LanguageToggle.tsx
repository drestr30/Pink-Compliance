import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
      className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
    >
      <Languages size={20} />
      <span>{language.toUpperCase()}</span>
    </button>
  );
}