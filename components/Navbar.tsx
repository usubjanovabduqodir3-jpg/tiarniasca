'use client';

import React from 'react';
import { Volume2, VolumeX, Flame, Award, Globe, ArrowLeft, Moon, Sun, Crown } from 'lucide-react';
import { Language, ThemeMode, UILocale } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';

interface NavbarProps {
  selectedLanguage: Language | null;
  onBackToHome: () => void;
  onOpenPricing: () => void;
  uiLocale: UILocale;
  onLocaleChange: (locale: UILocale) => void;
  xp: number;
  streakDays: number;
  activeSubscriptions: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export function Navbar({
  selectedLanguage,
  onBackToHome,
  onOpenPricing,
  uiLocale,
  onLocaleChange,
  xp,
  streakDays,
  activeSubscriptions,
  soundEnabled,
  onToggleSound,
  theme,
  onToggleTheme,
}: NavbarProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;

  return (
    <header className="sticky top-0 z-40 w-full bg-ink-50/85 dark:bg-[#0b0a1a]/85 backdrop-blur-xl border-b border-ink-200/80 dark:border-ink-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Chap: Logo va orqaga */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          {selectedLanguage && (
            <button
              onClick={onBackToHome}
              className="flex items-center gap-1.5 text-sm font-semibold text-ink-700 dark:text-ink-300 hover:text-iris-600 dark:hover:text-iris-400 transition-colors p-2 -ml-1 rounded-xl hover:bg-ink-100 dark:hover:bg-ink-800"
              title={t.backToHome}
              aria-label={t.backToHome}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden md:inline text-xs">{t.backToHome}</span>
            </button>
          )}

          <button onClick={onBackToHome} className="flex items-center gap-2.5 text-left focus:outline-none group">
            {/* Sfera belgisi */}
            <span
              className="relative w-9 h-9 rounded-full bg-gradient-to-br from-iris-500 via-iris-600 to-ember-500 flex items-center justify-center shadow-md shadow-iris-600/30 group-hover:scale-105 transition-transform"
              aria-hidden
            >
              <span className="absolute inset-[5px] rounded-full border border-white/50" />
              <span className="relative text-white font-display font-bold text-sm">L</span>
            </span>
            <span className="nav-brand-title max-[339px]:hidden font-display text-base sm:text-lg font-semibold tracking-tight whitespace-nowrap text-ink-900 dark:text-white">
              Lingo<span className="text-iris-600 dark:text-iris-400">Sphere</span>
            </span>
          </button>

          {/* Asosiy havolalar (kompyuterda) */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <button
              onClick={onBackToHome}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800/70 transition-colors"
            >
              {t.navLanguages}
            </button>
            <button
              onClick={onOpenPricing}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-ink-600 dark:text-ink-300 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800/70 transition-colors"
            >
              {t.navPricing}
            </button>
          </nav>
        </div>

        {/* O'ng: statistika va sozlamalar */}
        <div className="flex items-center gap-1 sm:gap-2 header-actions min-w-0">
          {/* Obuna / narxlar */}
          <button
            onClick={onOpenPricing}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeSubscriptions > 0
                ? 'bg-iris-100 dark:bg-iris-900/50 text-iris-700 dark:text-iris-200 hover:bg-iris-200 dark:hover:bg-iris-900'
                : 'bg-ink-900 dark:bg-white text-white dark:text-ink-900 hover:opacity-90'
            }`}
            title={t.navPricing}
            aria-label={t.navPricing}
          >
            <Crown className="w-3.5 h-3.5 shrink-0" />
            {activeSubscriptions > 0 ? (
              <span className="tabular-nums">
                {activeSubscriptions}
                <span className="hidden sm:inline"> · {t.statusActive}</span>
              </span>
            ) : (
              <span className="hidden sm:inline">{t.navPricing}</span>
            )}
          </button>

          {/* XP */}
          <div className="flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-1.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold tabular-nums">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{xp}</span>
            <span className="hidden lg:inline text-[11px] text-amber-600 dark:text-amber-400 font-semibold">XP</span>
          </div>

          {/* Seriya */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-ember-100/80 dark:bg-ember-950/50 text-ember-800 dark:text-ember-300 text-xs font-bold tabular-nums">
            <Flame className="w-3.5 h-3.5 text-ember-600 dark:text-ember-400 shrink-0" />
            <span>{streakDays}</span>
          </div>

          {/* Tungi rejim */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-ink-700 dark:text-amber-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
            title={theme === 'dark' ? "Yorug' rejimga o'tish" : "Qorong'u (Dark) rejimga o'tish"}
            aria-label="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          </button>

          {/* Ovoz effektlari */}
          <button
            onClick={onToggleSound}
            className={`hidden sm:block p-2 rounded-xl transition-colors hover:bg-ink-100 dark:hover:bg-ink-800 ${
              soundEnabled ? 'text-iris-600 dark:text-iris-400' : 'text-ink-400'
            }`}
            title={soundEnabled ? "Ovoz effektlarini o'chirish" : 'Ovoz effektlarini yoqish'}
            aria-label="Sound Toggle"
          >
            {soundEnabled ? <Volume2 className="w-[18px] h-[18px]" /> : <VolumeX className="w-[18px] h-[18px]" />}
          </button>

          {/* Interfeys tili */}
          <div className="relative flex items-center rounded-xl p-0.5 bg-ink-100 dark:bg-ink-900 text-xs font-medium">
            <Globe className="w-3.5 h-3.5 text-ink-400 ml-1.5 mr-0.5 hidden lg:block" />
            {(['uz', 'en', 'ru'] as UILocale[]).map((loc) => (
              <button
                key={loc}
                onClick={() => onLocaleChange(loc)}
                className={`px-1 sm:px-2 py-1 rounded-lg transition-all uppercase text-[11px] font-extrabold ${
                  uiLocale === loc
                    ? 'bg-white dark:bg-ink-700 text-iris-700 dark:text-white shadow-xs'
                    : 'text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
