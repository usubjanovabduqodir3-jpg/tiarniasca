'use client';

import React from 'react';
import { Check, Gift } from 'lucide-react';
import { Language, UILocale } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';
import { PRICE_BY_DIFFICULTY, formatPrice, getFreeLanguages, isFreeLanguage } from '@/lib/subscription';

interface PricingSectionProps {
  languages: Language[];
  uiLocale: UILocale;
  hasAccess: (id: Language['id']) => boolean;
  onSelectLanguage: (language: Language) => void;
}

export function PricingSection({ languages, uiLocale, hasAccess, onSelectLanguage }: PricingSectionProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;

  const premium = languages.filter((l) => !isFreeLanguage(l.id));
  const free = getFreeLanguages(languages);

  const tiers: {
    key: string;
    name: string;
    note: string;
    price: number;
    items: Language[];
    highlight?: boolean;
  }[] = [
    { key: 'free', name: t.planFreeName, note: t.planFreeNote, price: 0, items: free, highlight: true },
    {
      key: 'easy',
      name: t.tierEasyName,
      note: t.diffEasy,
      price: PRICE_BY_DIFFICULTY.Oson,
      items: premium.filter((l) => l.difficulty === 'Oson'),
    },
    {
      key: 'mid',
      name: t.tierMidName,
      note: t.diffMid,
      price: PRICE_BY_DIFFICULTY["O'rta"],
      items: premium.filter((l) => l.difficulty === "O'rta"),
    },
    {
      key: 'hard',
      name: t.tierHardName,
      note: t.diffHard,
      price: PRICE_BY_DIFFICULTY.Yuqori,
      items: premium.filter((l) => l.difficulty === 'Yuqori'),
    },
  ];

  const features = [t.feat1, t.feat2, t.feat3, t.feat4, t.feat5];

  return (
    <section id="pricing" className="scroll-mt-24 space-y-8">
      <div className="max-w-2xl space-y-2">
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-ink-900 dark:text-white text-balance">
          {t.pricingTitle}
        </h2>
        <p className="text-sm sm:text-base text-ink-600 dark:text-ink-400 leading-relaxed">{t.pricingDesc}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map((tier) => (
          <div
            key={tier.key}
            className={`flex flex-col rounded-3xl border p-5 sm:p-6 transition-colors ${
              tier.highlight
                ? 'bg-iris-600 text-white border-iris-600 shadow-xl shadow-iris-600/20'
                : 'bg-white dark:bg-[#14122a] border-ink-200 dark:border-ink-800'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3
                className={`text-sm font-bold ${
                  tier.highlight ? 'text-iris-100' : 'text-ink-700 dark:text-ink-300'
                }`}
              >
                {tier.name}
              </h3>
              {tier.highlight && <Gift className="w-4 h-4 text-iris-200" />}
            </div>

            <div className="mt-3 flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-bold tabular-nums">
                {tier.price === 0 ? '$0' : formatPrice(tier.price)}
              </span>
              <span
                className={`text-xs font-semibold ${
                  tier.highlight ? 'text-iris-200' : 'text-ink-500 dark:text-ink-400'
                }`}
              >
                {tier.price === 0 ? tier.note : t.perMonth}
              </span>
            </div>

            <ul className="mt-5 space-y-1.5 flex-1">
              {tier.items.map((lang) => {
                const unlocked = hasAccess(lang.id);
                return (
                  <li key={lang.id}>
                    <button
                      type="button"
                      onClick={() => onSelectLanguage(lang)}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 -mx-2.5 rounded-lg text-left text-sm font-semibold transition-colors ${
                        tier.highlight
                          ? 'hover:bg-white/10'
                          : 'hover:bg-ink-100 dark:hover:bg-ink-800/70'
                      }`}
                    >
                      <span className="text-lg leading-none">{lang.flag}</span>
                      <span className="flex-1 truncate">{lang.name}</span>
                      {unlocked && !tier.highlight && (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" strokeWidth={3} />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-ink-200 dark:border-ink-800 bg-ink-100/60 dark:bg-[#14122a] p-5 sm:p-6">
        <h3 className="text-sm font-bold text-ink-900 dark:text-white mb-4">{t.pricingIncludesTitle}</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-300">
              <Check className="w-4 h-4 mt-0.5 shrink-0 text-iris-600 dark:text-iris-400" strokeWidth={3} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
