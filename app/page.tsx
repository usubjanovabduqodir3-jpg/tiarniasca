'use client';

import React, { useState, useEffect } from 'react';
import {
  LANGUAGES,
  ALPHABETS,
  GRAMMAR_LESSONS,
  QUIZ_QUESTIONS,
  UI_TRANSLATIONS,
  getVocabularyForLanguage,
} from '@/data/languagesData';
import { ActiveTab, Language, ThemeMode, UILocale, VocabWord } from '@/lib/types';
import { Navbar } from '@/components/Navbar';
import { LanguageSelector } from '@/components/LanguageSelector';
import { VocabularyDeck } from '@/components/VocabularyDeck';
import { PronunciationStudio } from '@/components/PronunciationStudio';
import { AlphabetView } from '@/components/AlphabetView';
import { GrammarGuide } from '@/components/GrammarGuide';
import { QuizArena } from '@/components/QuizArena';
import { PaywallModal } from '@/components/PaywallModal';
import { daysLeftLabel, formatDate, isFreeLanguage, useSubscriptions } from '@/lib/subscription';
import {
  BookOpen,
  Mic,
  Languages as LanguagesIcon,
  HelpCircle,
  Sparkles,
  Crown,
  Gift,
} from 'lucide-react';

const STORAGE_KEY = 'lingosphere_user_progress_v2';
const THEME_KEY = 'lingosphere_theme_mode';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('words');
  const [uiLocale, setUiLocale] = useState<UILocale>('uz');
  const [activePracticeWord, setActivePracticeWord] = useState<VocabWord | null>(null);

  // Obunalar: 3 ta til (uz, ru, en) bepul, qolganlari obuna orqali ochiladi
  const subs = useSubscriptions();
  const [paywallLanguage, setPaywallLanguage] = useState<Language | null>(null);

  // Theme, XP va progress: serverdagi HTML bilan mos kelishi uchun avval standart qiymatlar,
  // brauzer yuklangach (effectda) localStorage'dan o'qiladi.
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [xp, setXp] = useState<number>(100);
  const [streakDays, setStreakDays] = useState<number>(4);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
    } catch {
      // ignore
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.xp === 'number') setXp(parsed.xp);
        if (typeof parsed.streakDays === 'number') setStreakDays(parsed.streakDays);
        if (Array.isArray(parsed.masteredIds)) setMasteredIds(parsed.masteredIds);
        if (typeof parsed.soundEnabled === 'boolean') setSoundEnabled(parsed.soundEnabled);
      }
    } catch {
      // ignore
    }
    setStorageLoaded(true);
  }, []);

  // Synchronize 'dark' class on html document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    // Saqlangan mavzuni standart qiymat bilan ustiga yozib yubormaslik uchun yuklanishini kutamiz
    if (!storageLoaded) return;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme, storageLoaded]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Save progress
  const saveProgress = (newXp: number, newMastered: string[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          xp: newXp,
          streakDays,
          masteredIds: newMastered,
          soundEnabled,
        })
      );
    } catch {
      // LocalStorage fallback
    }
  };

  const handleRewardXP = (amount: number, wordOrQuizId: string) => {
    setXp((prev) => {
      const updated = prev + amount;
      const updatedMastered = masteredIds.includes(wordOrQuizId)
        ? masteredIds
        : [...masteredIds, wordOrQuizId];
      setMasteredIds(updatedMastered);
      saveProgress(updated, updatedMastered);
      return updated;
    });
  };

  const handleToggleMastered = (wordId: string) => {
    const isMastered = masteredIds.includes(wordId);
    const updated = isMastered
      ? masteredIds.filter((id) => id !== wordId)
      : [...masteredIds, wordId];

    setMasteredIds(updated);
    const updatedXp = isMastered ? xp : xp + 10;
    setXp(updatedXp);
    saveProgress(updatedXp, updated);
  };

  const startLanguage = (lang: Language) => {
    setPaywallLanguage(null);
    setSelectedLanguage(lang);
    setActiveTab('words');
    const words = getVocabularyForLanguage(lang.id);
    if (words && words.length > 0) {
      setActivePracticeWord(words[0]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectLanguage = (lang: Language) => {
    if (!subs.hasAccess(lang.id)) {
      setPaywallLanguage(lang);
      return;
    }
    startLanguage(lang);
  };

  // Obuna muddati tugasa, premium til yopiladi va taklif oynasi ochiladi
  useEffect(() => {
    if (selectedLanguage && subs.ready && !subs.hasAccess(selectedLanguage.id)) {
      setPaywallLanguage(selectedLanguage);
      setSelectedLanguage(null);
    }
  }, [selectedLanguage, subs.ready, subs.hasAccess]);

  const handleCancelSubscription = (lang: Language) => {
    const message = (UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz).cancelConfirm;
    if (window.confirm(message)) {
      setSelectedLanguage(null);
      subs.cancel(lang.id);
    }
  };

  const handleGoPricing = () => {
    setSelectedLanguage(null);
    window.setTimeout(() => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleOpenPracticeForWord = (word: VocabWord) => {
    setActivePracticeWord(word);
    setActiveTab('practice');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;
  const currentLangId = selectedLanguage ? selectedLanguage.id : 'en';
  const currentWords = getVocabularyForLanguage(currentLangId);
  const currentAlphabet = ALPHABETS[currentLangId] || ALPHABETS.en;
  const currentGrammar = GRAMMAR_LESSONS[currentLangId] || GRAMMAR_LESSONS.en;
  const currentQuiz = QUIZ_QUESTIONS[currentLangId] || QUIZ_QUESTIONS.en;

  const currentPracticeWord =
    activePracticeWord && currentWords.some((w) => w.id === activePracticeWord.id)
      ? activePracticeWord
      : currentWords[0];

  const tabs = [
    { id: 'words', label: t.wordsTab, icon: BookOpen },
    { id: 'practice', label: t.practiceTab, icon: Mic },
    { id: 'alphabet', label: t.alphabetTab, icon: LanguagesIcon },
    { id: 'grammar', label: t.grammarTab, icon: Sparkles },
    { id: 'quiz', label: t.quizTab, icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''} bg-ink-50 dark:bg-[#0b0a1a] text-ink-900 dark:text-ink-100 flex flex-col font-sans transition-colors duration-200 selection:bg-ember-500 selection:text-white`}>
      {/* Navigation Header */}
      <Navbar
        selectedLanguage={selectedLanguage}
        onBackToHome={() => setSelectedLanguage(null)}
        onOpenPricing={handleGoPricing}
        activeSubscriptions={subs.activeCount}
        uiLocale={uiLocale}
        onLocaleChange={setUiLocale}
        xp={xp}
        streakDays={streakDays}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto app-container py-6 sm:py-8">
        {!selectedLanguage ? (
          /* View 1: Language Selection (12 World Languages) */
          <LanguageSelector
            languages={LANGUAGES}
            onSelectLanguage={handleSelectLanguage}
            uiLocale={uiLocale}
            masteredWordsCount={masteredIds.length}
            hasAccess={subs.hasAccess}
            daysLeft={subs.daysLeft}
          />
        ) : (
          /* View 2: Active Language Learning Section (1000+ words) */
          <div className="space-y-6">
            {/* Til sarlavhasi va obuna holati */}
            <div className="relative overflow-hidden bg-white dark:bg-[#14122a] rounded-3xl border border-ink-200 dark:border-ink-800 p-5 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-colors">
              <div className="hero-glow absolute inset-0 pointer-events-none opacity-70" aria-hidden />

              <div className="relative flex items-center gap-4 min-w-0">
                <span className="text-5xl sm:text-6xl leading-none select-none">{selectedLanguage.flag}</span>
                <div className="min-w-0">
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink-900 dark:text-white">
                    {selectedLanguage.name}
                  </h2>
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-ink-500 dark:text-ink-400">
                    {selectedLanguage.localName}
                    <span className="mx-1.5">·</span>
                    <span className="text-iris-600 dark:text-iris-400 font-mono">{selectedLanguage.speechCode}</span>
                    <span className="mx-1.5">·</span>
                    <span className="text-ember-600 dark:text-ember-400">
                      {currentWords.length} {t.wordsCount}
                    </span>
                  </p>

                  {isFreeLanguage(selectedLanguage.id) ? (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <Gift className="w-3.5 h-3.5" />
                      {t.freeLanguage}
                    </p>
                  ) : (
                    <p className="mt-2 inline-flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs font-bold text-iris-700 dark:text-iris-300">
                      <Crown className="w-3.5 h-3.5" />
                      <span>{t.subActive}</span>
                      <span className="text-ink-400">·</span>
                      <span>{daysLeftLabel(subs.daysLeft(selectedLanguage.id), uiLocale)}</span>
                      {subs.getRecord(selectedLanguage.id) && (
                        <>
                          <span className="text-ink-400">·</span>
                          <span className="font-semibold text-ink-500 dark:text-ink-400">
                            {t.renewsOn}: {formatDate(subs.getRecord(selectedLanguage.id)!.expiresAt, uiLocale)}
                          </span>
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>

              <div className="relative flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('practice')}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-iris-600 to-ember-500 hover:from-iris-700 hover:to-ember-600 text-white font-bold rounded-xl text-xs shadow-md shadow-iris-600/25 transition-all hover:scale-[1.02]"
                >
                  <Mic className="w-4 h-4" />
                  <span>{t.practiceVoice}</span>
                </button>
                {!isFreeLanguage(selectedLanguage.id) && (
                  <button
                    type="button"
                    onClick={() => handleCancelSubscription(selectedLanguage)}
                    className="px-3 py-2.5 text-xs font-semibold rounded-xl text-ink-500 dark:text-ink-400 hover:text-ember-700 dark:hover:text-ember-300 hover:bg-ink-100 dark:hover:bg-ink-800 transition-colors"
                  >
                    {t.cancelSub}
                  </button>
                )}
              </div>
            </div>

            {/* Bo'limlar (chiziqli tablar) */}
            <div className="flex items-center gap-1 border-b border-ink-200 dark:border-ink-800 overflow-x-auto scrollbar-none">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as ActiveTab)}
                    className={`tab-pill-btn relative flex items-center gap-2 px-3 sm:px-4 py-3 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 transition-colors ${
                      isActive
                        ? 'text-iris-700 dark:text-iris-300'
                        : 'text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-iris-600 to-ember-500" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents */}
            <div className="pt-2">
              {activeTab === 'words' && (
                <VocabularyDeck
                  language={selectedLanguage}
                  words={currentWords}
                  uiLocale={uiLocale}
                  masteredIds={masteredIds}
                  onToggleMastered={handleToggleMastered}
                  onOpenPractice={handleOpenPracticeForWord}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'practice' && (
                <PronunciationStudio
                  key={currentPracticeWord.id}
                  language={selectedLanguage}
                  words={currentWords}
                  activeWord={currentPracticeWord}
                  onSelectWord={setActivePracticeWord}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                  onRewardXP={handleRewardXP}
                />
              )}

              {activeTab === 'alphabet' && (
                <AlphabetView
                  language={selectedLanguage}
                  letters={currentAlphabet}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'grammar' && (
                <GrammarGuide
                  language={selectedLanguage}
                  lessons={currentGrammar}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizArena
                  language={selectedLanguage}
                  questions={currentQuiz}
                  uiLocale={uiLocale}
                  soundEnabled={soundEnabled}
                  onRewardXP={handleRewardXP}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-ink-200 dark:border-ink-800 bg-white/60 dark:bg-[#14122a]/60 py-8 mt-16 text-xs text-ink-500 dark:text-ink-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-display font-semibold text-ink-800 dark:text-ink-200">
            © {new Date().getFullYear()} Lingo<span className="text-iris-600 dark:text-iris-400">Sphere</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-semibold">
            <span className="text-ember-600 dark:text-ember-400">{LANGUAGES.length} {t.statLanguages}</span>
            <span>·</span>
            <span className="text-iris-600 dark:text-iris-400">1,000+ {t.statWords}</span>
            <span>·</span>
            <span>Web Speech API</span>
          </div>
        </div>
      </footer>

      {/* Obuna taklifi oynasi */}
      <PaywallModal
        language={paywallLanguage}
        uiLocale={uiLocale}
        onClose={() => setPaywallLanguage(null)}
        onSubscribe={subs.subscribe}
        onStartLearning={startLanguage}
      />
    </div>
  );
}
