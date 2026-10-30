'use client';

import React, { useEffect, useState } from 'react';
import { X, Check, Lock, PartyPopper, ShieldCheck } from 'lucide-react';
import { Language, UILocale } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';
import {
  PAYMENTS_DEMO_MODE,
  formatPrice,
  getMonthlyPrice,
} from '@/lib/subscription';

interface PaywallModalProps {
  language: Language | null;
  uiLocale: UILocale;
  onClose: () => void;
  onSubscribe: (language: Language) => Promise<void>;
  /** Obuna faollashgandan keyin "Boshlash" bosilganda */
  onStartLearning: (language: Language) => void;
}

export function PaywallModal({
  language,
  uiLocale,
  onClose,
  onSubscribe,
  onStartLearning,
}: PaywallModalProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  // Boshqa til tanlanganda holatni tiklash
  useEffect(() => {
    setProcessing(false);
    setDone(false);
  }, [language?.id]);

  // Esc bilan yopish + fon scrollini bloklash
  useEffect(() => {
    if (!language) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [language, onClose]);

  if (!language) return null;

  const price = getMonthlyPrice(language);
  const features = [t.feat1, t.feat2, t.feat3, t.feat4, t.feat5];

  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      await onSubscribe(language);
      setDone(true);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <button
        type="button"
        aria-label={t.modalClose}
        onClick={onClose}
        className="absolute inset-0 bg-ink-950/70 backdrop-blur-sm animate-fade-in cursor-default"
      />

      <div className="animate-modal-in relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto bg-white dark:bg-[#14122a] rounded-t-3xl sm:rounded-3xl border border-ink-200 dark:border-ink-800 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label={t.modalClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-xl text-ink-500 hover:text-ink-900 dark:hover:text-white hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {done ? (
          /* Muvaffaqiyat holati */
          <div className="p-7 sm:p-8 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <PartyPopper className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 id="paywall-title" className="font-display text-xl font-semibold text-ink-900 dark:text-white">
                {t.modalSuccessTitle}
              </h2>
              <p className="text-sm text-ink-600 dark:text-ink-400">
                <span className="text-xl mr-1.5">{language.flag}</span>
                {language.name} · {t.modalSuccessDesc}
              </p>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                autoFocus
                onClick={() => onStartLearning(language)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-iris-600 to-ember-500 hover:from-iris-700 hover:to-ember-600 text-white font-bold text-sm shadow-lg shadow-iris-600/25 transition-all"
              >
                {t.modalStart}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-ink-600 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
              >
                {t.modalLater}
              </button>
            </div>
          </div>
        ) : (
          /* Taklif holati */
          <div>
            <div className="relative px-7 pt-8 pb-6 text-center overflow-hidden">
              <div className="hero-glow absolute inset-0 pointer-events-none" aria-hidden />
              <div className="relative">
                <div className="text-6xl leading-none select-none drop-shadow-sm">{language.flag}</div>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ember-600 dark:text-ember-400 inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  {t.modalEyebrow}
                </p>
                <h2 id="paywall-title" className="mt-1.5 font-display text-2xl font-semibold text-ink-900 dark:text-white">
                  {language.name}
                </h2>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{language.localName}</p>

                <div className="mt-5 flex items-baseline justify-center gap-2">
                  <span className="font-display text-5xl font-bold text-ink-900 dark:text-white tabular-nums">
                    {formatPrice(price)}
                  </span>
                  <span className="text-sm font-semibold text-ink-500 dark:text-ink-400">{t.modalPeriod}</span>
                </div>
              </div>
            </div>

            <div className="px-7 pb-7 space-y-5">
              <ul className="space-y-2.5">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-700 dark:text-ink-300">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-iris-100 dark:bg-iris-900/60 text-iris-600 dark:text-iris-300 flex items-center justify-center">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                autoFocus
                onClick={handleSubscribe}
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-iris-600 to-ember-500 hover:from-iris-700 hover:to-ember-600 disabled:opacity-70 disabled:cursor-wait text-white font-bold text-sm shadow-lg shadow-iris-600/25 transition-all"
              >
                {processing ? t.modalProcessing : `${t.modalCta} · ${formatPrice(price)}`}
              </button>

              {PAYMENTS_DEMO_MODE && (
                <p className="flex items-start gap-2 text-xs leading-relaxed text-ink-500 dark:text-ink-400">
                  <ShieldCheck className="w-4 h-4 shrink-0 mt-px text-ink-400" />
                  <span>{t.modalDemo}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
