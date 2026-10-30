'use client';

import React from 'react';
import { ArrowRight, Lock, Mic, BookOpen, CheckCircle2, Unlock } from 'lucide-react';
import { Language, UILocale } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';
import {
  daysLeftLabel,
  formatPrice,
  getFreeLanguages,
  getMonthlyPrice,
  isFreeLanguage,
} from '@/lib/subscription';
import { PricingSection } from '@/components/PricingSection';

interface LanguageSelectorProps {
  languages: Language[];
  onSelectLanguage: (language: Language) => void;
  uiLocale: UILocale;
  masteredWordsCount: number;
  hasAccess: (id: Language['id']) => boolean;
  daysLeft: (id: Language['id']) => number;
}

const HERO_CARDS = [
  { flag: '🇺🇿', text: 'Salom', sub: "O'zbek", cls: 'top-2 left-2', tilt: '-6deg', delay: '0s' },
  { flag: '🇷🇺', text: 'Привет', sub: 'Русский', cls: 'top-10 right-0', tilt: '5deg', delay: '0.8s' },
  { flag: '🇬🇧', text: 'Hello', sub: 'English', cls: 'top-[9.5rem] left-14', tilt: '3deg', delay: '1.6s' },
  { flag: '🇯🇵', text: 'こんにちは', sub: '日本語', cls: 'bottom-16 right-2', tilt: '-4deg', delay: '2.4s' },
  { flag: '🇫🇷', text: 'Bonjour', sub: 'Français', cls: 'bottom-0 left-4', tilt: '6deg', delay: '3.2s' },
] as const;

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function LanguageSelector({
  languages,
  onSelectLanguage,
  uiLocale,
  masteredWordsCount,
  hasAccess,
  daysLeft,
}: LanguageSelectorProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;

  const freeLanguages = getFreeLanguages(languages);
  const premiumLanguages = languages.filter((l) => !isFreeLanguage(l.id));

  const difficultyLabel = (d: Language['difficulty']) =>
    d === 'Oson' ? t.diffEasy : d === "O'rta" ? t.diffMid : t.diffHard;

  const masteredLabel =
    uiLocale === 'ru' ? 'освоено слов' : uiLocale === 'en' ? 'words mastered' : "o'zlashtirilgan so'z";

  const heroLead =
    uiLocale === 'ru'
      ? 'Откройте мир на новых языках:'
      : uiLocale === 'en'
        ? 'Explore the world in new languages:'
        : 'Dunyoni yangi tillarda kashf eting:';

  return (
    <div className="space-y-16 sm:space-y-24 pb-8">
      {/* ───────── HERO ───────── */}
      <section className="relative rounded-3xl overflow-hidden border border-ink-200 dark:border-ink-800 bg-white/60 dark:bg-[#14122a]/60">
        <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden />
        <div className="bg-dotgrid absolute inset-0 opacity-60 pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" aria-hidden />

        <div className="relative grid lg:grid-cols-[1.2fr_0.8fr] gap-8 items-center px-5 sm:px-10 lg:px-14 py-12 sm:py-16 lg:py-20">
          <div className="space-y-6">
            <h1 className="font-display text-3xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-semibold text-ink-900 dark:text-white text-balance">
              {heroLead}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-iris-600 via-iris-500 to-ember-500">
                LingoSphere
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-600 dark:text-ink-300 leading-relaxed max-w-xl">
              {t.heroDesc}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={() => scrollToId('free-languages')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-ink-900 dark:bg-white text-white dark:text-ink-900 font-bold text-sm hover:opacity-90 transition-opacity"
              >
                {t.ctaFree}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToId('pricing')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-ink-300 dark:border-ink-700 text-ink-800 dark:text-ink-100 font-bold text-sm hover:bg-ink-100 dark:hover:bg-ink-800/60 transition-colors"
              >
                {t.ctaPricing}
              </button>
            </div>

            <dl className="pt-4 flex flex-wrap gap-x-8 gap-y-4">
              <div>
                <dt className="sr-only">{t.statLanguages}</dt>
                <dd className="font-display text-2xl font-semibold text-ink-900 dark:text-white tabular-nums">
                  {languages.length}
                  <span className="block font-sans text-xs font-semibold text-ink-500 dark:text-ink-400 mt-0.5">
                    {t.statLanguages}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.statWords}</dt>
                <dd className="font-display text-2xl font-semibold text-ink-900 dark:text-white">
                  1,000+
                  <span className="block font-sans text-xs font-semibold text-ink-500 dark:text-ink-400 mt-0.5">
                    {t.statWords}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="sr-only">{t.statFree}</dt>
                <dd className="font-display text-2xl font-semibold text-ember-600 dark:text-ember-400 tabular-nums">
                  {freeLanguages.length}
                  <span className="block font-sans text-xs font-semibold text-ink-500 dark:text-ink-400 mt-0.5">
                    {t.statFree}
                  </span>
                </dd>
              </div>
              {masteredWordsCount > 0 && (
                <div>
                  <dt className="sr-only">{masteredLabel}</dt>
                  <dd className="font-display text-2xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {masteredWordsCount}
                    <span className="block font-sans text-xs font-semibold text-ink-500 dark:text-ink-400 mt-0.5">
                      {masteredLabel}
                    </span>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Suzuvchi salomlashuv kartochkalari */}
          <div className="relative hidden lg:block h-[23rem]" aria-hidden>
            {HERO_CARDS.map((card) => (
              <div
                key={card.text}
                className={`floaty absolute ${card.cls} flex items-center gap-3 pl-3.5 pr-5 py-3 rounded-2xl bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-700 shadow-xl shadow-iris-900/10`}
                style={{ '--tilt': card.tilt, animationDelay: card.delay } as React.CSSProperties}
              >
                <span className="text-3xl leading-none">{card.flag}</span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink-900 dark:text-white leading-tight">
                    {card.text}
                  </p>
                  <p className="text-[11px] font-semibold text-ink-500 dark:text-ink-400">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Imkoniyatlar chizig'i */}
        <div className="relative border-t border-ink-200 dark:border-ink-800 px-5 sm:px-10 lg:px-14 py-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-ink-600 dark:text-ink-300">
          <span className="flex items-center gap-1.5">
            <Mic className="w-4 h-4 text-ember-500 shrink-0" />
            {t.feat2}
          </span>
          <span className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-iris-500 shrink-0" />
            {t.feat1}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            {t.feat4}
          </span>
        </div>
      </section>

      {/* ───────── BEPUL TILLAR ───────── */}
      <section id="free-languages" className="scroll-mt-24 space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">
            {t.freeTitle}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-400 leading-relaxed">{t.freeDesc}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {freeLanguages.map((lang) => (
            <button
              key={lang.id}
              type="button"
              onClick={() => onSelectLanguage(lang)}
              className="group relative text-left overflow-hidden rounded-3xl border border-ink-200 dark:border-ink-800 bg-white dark:bg-[#14122a] p-6 hover:border-iris-400 dark:hover:border-iris-500 hover:shadow-xl hover:shadow-iris-600/10 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-5xl leading-none select-none group-hover:scale-110 transition-transform origin-left">
                  {lang.flag}
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">
                  {t.freeBadge}
                </span>
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold text-ink-900 dark:text-white">{lang.name}</h3>
              <p className="text-sm font-semibold text-ink-500 dark:text-ink-400">{lang.localName}</p>
              <p className="mt-3 text-sm text-ink-600 dark:text-ink-400 leading-relaxed line-clamp-2">
                {lang.description}
              </p>

              <div className="mt-5 pt-4 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-xs font-semibold text-ink-500 dark:text-ink-400">
                <span>
                  {difficultyLabel(lang.difficulty)} · {lang.learners}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-iris-600 dark:text-iris-400 group-hover:translate-x-0.5 transition-transform">
                  {t.startLearning}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ───────── PREMIUM TILLAR ───────── */}
      <section id="premium-languages" className="scroll-mt-24 space-y-6">
        <div className="max-w-2xl space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white">
            {t.premiumTitle}
          </h2>
          <p className="text-sm sm:text-base text-ink-600 dark:text-ink-400 leading-relaxed">{t.premiumDesc}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 grid-language-cards">
          {premiumLanguages.map((lang) => {
            const unlocked = hasAccess(lang.id);
            const left = daysLeft(lang.id);
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => onSelectLanguage(lang)}
                className={`group text-left rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
                  unlocked
                    ? 'bg-white dark:bg-[#14122a] border-emerald-300/70 dark:border-emerald-800/70 hover:border-emerald-500'
                    : 'bg-white dark:bg-[#14122a] border-ink-200 dark:border-ink-800 hover:border-iris-400 dark:hover:border-iris-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-3xl leading-none select-none transition-all ${
                      unlocked ? '' : 'grayscale-[0.55] opacity-80 group-hover:grayscale-0 group-hover:opacity-100'
                    }`}
                  >
                    {lang.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-extrabold text-ink-900 dark:text-white truncate">{lang.name}</h3>
                    <p className="text-xs font-semibold text-ink-500 dark:text-ink-400 truncate">{lang.localName}</p>
                  </div>
                  {unlocked ? (
                    <Unlock className="w-4 h-4 shrink-0 text-emerald-500" />
                  ) : (
                    <Lock className="w-4 h-4 shrink-0 text-ink-400 group-hover:text-iris-500 transition-colors" />
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-ink-500 dark:text-ink-400 truncate">
                    {difficultyLabel(lang.difficulty)}
                  </span>
                  {unlocked ? (
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-right">
                      {daysLeftLabel(left, uiLocale)}
                    </span>
                  ) : (
                    <span className="font-bold text-ink-900 dark:text-white tabular-nums whitespace-nowrap">
                      {formatPrice(getMonthlyPrice(lang))}
                      <span className="font-semibold text-ink-500 dark:text-ink-400">{t.perMonth}</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ───────── NARXLAR ───────── */}
      <PricingSection
        languages={languages}
        uiLocale={uiLocale}
        hasAccess={hasAccess}
        onSelectLanguage={onSelectLanguage}
      />
    </div>
  );
}
