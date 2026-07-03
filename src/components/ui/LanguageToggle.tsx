'use client';

import { useI18n } from '@/lib/i18n';
import { Globe } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, toggleLang } = useI18n();

  return (
    <button
      onClick={toggleLang}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-accent"
      style={{ color: 'oklch(70% 0 0)' }}
      title={lang === 'en' ? 'تغییر به فارسی' : 'Switch to English'}
    >
      <Globe className="h-3.5 w-3.5" />
      {lang === 'en' ? 'فارسی' : 'English'}
    </button>
  );
}
