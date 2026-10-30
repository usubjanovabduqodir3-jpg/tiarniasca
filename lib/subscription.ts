'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Language, LanguageId, UILocale } from '@/lib/types';

/* ------------------------------------------------------------------ *
 *  OBUNA SOZLAMALARI — narx va bepul tillarni faqat shu yerdan o'zgartiring
 * ------------------------------------------------------------------ */

/** Hamma imkoniyatlari bilan bepul bo'lgan tillar */
export const FREE_LANGUAGE_IDS: LanguageId[] = ['uz', 'ru', 'en'];

/** Oylik narx (USD): tilning murakkabligiga qarab $10 dan $20 gacha */
export const PRICE_BY_DIFFICULTY: Record<Language['difficulty'], number> = {
  Oson: 10,
  "O'rta": 15,
  Yuqori: 20,
};

/** Obuna necha kun amal qiladi */
export const SUBSCRIPTION_DAYS = 30;

export const MIN_PRICE = Math.min(...Object.values(PRICE_BY_DIFFICULTY));
export const MAX_PRICE = Math.max(...Object.values(PRICE_BY_DIFFICULTY));

const STORAGE_KEY = 'lingosphere_subscriptions_v1';
const DAY_MS = 24 * 60 * 60 * 1000;

export interface SubscriptionRecord {
  startedAt: number;
  expiresAt: number;
}

export type SubscriptionMap = Partial<Record<LanguageId, SubscriptionRecord>>;

/* ------------------------------------------------------------------ *
 *  Yordamchi funksiyalar
 * ------------------------------------------------------------------ */

export function isFreeLanguage(id: LanguageId): boolean {
  return FREE_LANGUAGE_IDS.includes(id);
}

/** Bepul til uchun 0, premium til uchun oylik narx */
export function getMonthlyPrice(language: Language): number {
  return isFreeLanguage(language.id) ? 0 : PRICE_BY_DIFFICULTY[language.difficulty];
}

export function formatPrice(amount: number): string {
  return `$${amount}`;
}

export function daysLeftLabel(days: number, locale: UILocale): string {
  if (locale === 'ru') return `Осталось ${days} дн.`;
  if (locale === 'en') return `${days} ${days === 1 ? 'day' : 'days'} left`;
  return `${days} kun qoldi`;
}

const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];

export function formatDate(timestamp: number, locale: UILocale): string {
  const d = new Date(timestamp);
  // Brauzerlarda o'zbek locale yaxshi qo'llab-quvvatlanmaydi, shuning uchun qo'lda formatlaymiz
  if (locale === 'uz') return `${d.getDate()}-${UZ_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  const tag = locale === 'ru' ? 'ru-RU' : 'en-US';
  try {
    return new Intl.DateTimeFormat(tag, { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

/** Bepul tillar: FREE_LANGUAGE_IDS dagi tartibda (O'zbek, Rus, Ingliz) */
export function getFreeLanguages(languages: Language[]): Language[] {
  return FREE_LANGUAGE_IDS.map((id) => languages.find((l) => l.id === id)).filter(
    (l): l is Language => Boolean(l)
  );
}

function readStorage(): SubscriptionMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as SubscriptionMap) : {};
  } catch {
    return {};
  }
}

function writeStorage(map: SubscriptionMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    // LocalStorage mavjud emas — e'tiborsiz qoldiramiz
  }
}

/* ------------------------------------------------------------------ *
 *  TO'LOV INTEGRATSIYASI UCHUN JOY
 *
 *  Hozir demo rejim: tugma bosilganda obuna shu brauzerda faollashadi.
 *  Haqiqiy to'lov uchun startCheckout ichida Payme / Click / Uzum yoki
 *  Stripe sessiyasini serverda yarating, foydalanuvchini to'lov sahifasiga
 *  yo'naltiring va obunani faqat to'lov serveridan webhook kelgandan
 *  keyin (backend orqali) faollashtiring.
 * ------------------------------------------------------------------ */
export const PAYMENTS_DEMO_MODE = true;

export async function startCheckout(_language: Language): Promise<{ ok: boolean }> {
  // TODO: backend'dan checkout URL oling va window.location.assign(url) qiling.
  return { ok: true };
}

/* ------------------------------------------------------------------ *
 *  React hook
 * ------------------------------------------------------------------ */

export function useSubscriptions() {
  const [subs, setSubs] = useState<SubscriptionMap>({});
  const [ready, setReady] = useState(false);
  const [now, setNow] = useState(0);

  // Brauzerda yuklash (SSR bilan mos kelmaslik muammosidan qochish uchun effectda)
  useEffect(() => {
    setSubs(readStorage());
    setNow(Date.now());
    setReady(true);
    const timer = window.setInterval(() => setNow(Date.now()), 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  const getRecord = useCallback(
    (id: LanguageId): SubscriptionRecord | null => {
      const rec = subs[id];
      return rec && rec.expiresAt > now ? rec : null;
    },
    [subs, now]
  );

  const hasAccess = useCallback(
    (id: LanguageId): boolean => isFreeLanguage(id) || getRecord(id) !== null,
    [getRecord]
  );

  const daysLeft = useCallback(
    (id: LanguageId): number => {
      const rec = getRecord(id);
      return rec ? Math.max(1, Math.ceil((rec.expiresAt - now) / DAY_MS)) : 0;
    },
    [getRecord, now]
  );

  const subscribe = useCallback(async (language: Language) => {
    if (isFreeLanguage(language.id)) return;
    const result = await startCheckout(language);
    if (!result.ok) return;
    const start = Date.now();
    setSubs((prev) => {
      const next: SubscriptionMap = {
        ...prev,
        [language.id]: { startedAt: start, expiresAt: start + SUBSCRIPTION_DAYS * DAY_MS },
      };
      writeStorage(next);
      return next;
    });
    setNow(start);
  }, []);

  const cancel = useCallback((id: LanguageId) => {
    setSubs((prev) => {
      const next = { ...prev };
      delete next[id];
      writeStorage(next);
      return next;
    });
  }, []);

  const activeCount = (Object.keys(subs) as LanguageId[]).filter((id) => getRecord(id)).length;

  return { ready, subs, activeCount, getRecord, hasAccess, daysLeft, subscribe, cancel };
}
