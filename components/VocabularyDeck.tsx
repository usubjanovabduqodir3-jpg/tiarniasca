'use client';

import React, { useState, useMemo } from 'react';
import {
  Volume2,
  Mic,
  CheckCircle2,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  X,
} from 'lucide-react';
import { Language, UILocale, VocabWord } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';
import { VOCAB_CATEGORIES } from '@/data/vocabularyBank';
import { speakText, playSound } from '@/lib/speech';

interface VocabularyDeckProps {
  language: Language;
  words: VocabWord[];
  uiLocale: UILocale;
  masteredIds: string[];
  onToggleMastered: (wordId: string) => void;
  onOpenPractice: (word: VocabWord) => void;
  soundEnabled: boolean;
}

const WORDS_PER_PAGE = 24;

export function VocabularyDeck({
  language,
  words,
  uiLocale,
  masteredIds,
  onToggleMastered,
  onOpenPractice,
  soundEnabled,
}: VocabularyDeckProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);

  // Filter words by category, level, and search query
  const filteredWords = useMemo(() => {
    let result = words;

    if (selectedCategory !== 'all') {
      result = result.filter((w) => w.category === selectedCategory);
    }

    if (selectedLevel !== 'all') {
      result = result.filter((w) => w.level === selectedLevel);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(q) ||
          w.translation.toLowerCase().includes(q) ||
          w.example.toLowerCase().includes(q)
      );
    }

    return result;
  }, [words, selectedCategory, selectedLevel, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / WORDS_PER_PAGE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedWords = useMemo(() => {
    const start = (validCurrentPage - 1) * WORDS_PER_PAGE;
    return filteredWords.slice(start, start + WORDS_PER_PAGE);
  }, [filteredWords, validCurrentPage]);

  const handleSpeak = (word: VocabWord) => {
    playSound('click', soundEnabled);
    setSpeakingWordId(word.id);
    speakText(
      word.word,
      language.speechCode,
      0.9,
      () => setSpeakingWordId(null),
      () => setSpeakingWordId(null)
    );
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    playSound('click', soundEnabled);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Top Search & Filter Bar */}
      <div className="bg-white dark:bg-[#14122a] rounded-2xl border border-ink-200 dark:border-ink-800 p-4 shadow-xs space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Real-time Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-ink-50 dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-ink-900 dark:text-white placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-iris-500"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-ink-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Level Filter (A1, A2, B1, B2) */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 bg-ink-100 dark:bg-ink-900 p-1 rounded-xl border border-ink-200 dark:border-ink-800 text-xs">
            <span className="text-[11px] font-bold text-ink-500 dark:text-ink-400 px-2 hidden md:inline">
              Daraja:
            </span>
            {['all', 'A1', 'A2', 'B1', 'B2'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setCurrentPage(1);
                  playSound('click', soundEnabled);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-iris-600 text-white shadow-xs'
                    : 'text-ink-600 dark:text-ink-400 hover:text-ink-900 dark:hover:text-white'
                }`}
              >
                {lvl === 'all' ? 'Barchasi' : lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <Filter className="w-3.5 h-3.5 text-ink-400 mr-1 shrink-0" />
          {VOCAB_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                  playSound('click', soundEnabled);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-iris-600 to-ember-600 text-white shadow-xs font-bold'
                    : 'bg-ink-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 hover:bg-ink-200 dark:hover:bg-ink-800'
                }`}
              >
                <span>{uiLocale === 'en' ? cat.labelEn : cat.labelUz}</span>
              </button>
            );
          })}
        </div>

        {/* Counter Info Banner */}
        <div className="flex items-center justify-between text-xs text-ink-500 dark:text-ink-400 pt-1 border-t border-ink-100 dark:border-ink-800/60">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-iris-600 dark:text-iris-400" />
            <span>
              Jami <strong className="text-ink-900 dark:text-white">{filteredWords.length}</strong> ta so&apos;z topildi
            </span>
          </div>
          <div>
            <span>
              {t.page} <strong className="text-ink-900 dark:text-white">{validCurrentPage}</strong> {t.of} {totalPages}
            </span>
          </div>
        </div>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 vocab-grid">
        {paginatedWords.map((word) => {
          const isMastered = masteredIds.includes(word.id);
          const isSpeaking = speakingWordId === word.id;

          return (
            <div
              key={word.id}
              className={`relative bg-white dark:bg-[#14122a] rounded-2xl border p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                isMastered
                  ? 'border-emerald-400/80 dark:border-emerald-500/60 bg-emerald-50/20 dark:bg-emerald-950/10'
                  : 'border-ink-200 dark:border-ink-800 hover:border-iris-500/50'
              }`}
            >
              {/* Card Top: Word, Transcription, Level & Bookmark */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg sm:text-xl font-black text-ink-900 dark:text-white tracking-tight truncate">
                        {word.word}
                      </h4>
                      {isSpeaking && (
                        <div className="flex items-center gap-0.5 shrink-0">
                          <span className="w-1 bg-ember-600 rounded-full eq-bar-1" />
                          <span className="w-1 bg-iris-600 rounded-full eq-bar-2" />
                          <span className="w-1 bg-ember-600 rounded-full eq-bar-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-mono text-iris-600 dark:text-iris-400 tracking-wide block mt-0.5">
                      {word.transcription}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-400 rounded-md">
                      {word.level}
                    </span>
                    <button
                      onClick={() => {
                        onToggleMastered(word.id);
                        playSound('success', soundEnabled);
                      }}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMastered
                          ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 hover:bg-emerald-200'
                          : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800'
                      }`}
                      title={isMastered ? "O'zlashtirilgan" : "O'zlashtirilgan deb belgilash"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Translation in Uzbek */}
                <p className="text-sm font-bold text-ink-800 dark:text-ink-200 mb-3">
                  {word.translation}
                </p>

                {/* Example sentence */}
                <div className="p-2.5 bg-ink-50 dark:bg-ink-900/90 rounded-xl text-xs space-y-1 mb-4 border border-ink-100 dark:border-ink-800/80">
                  <p className="font-medium text-ink-700 dark:text-ink-300 italic">
                    &ldquo;{word.example}&rdquo;
                  </p>
                  <p className="text-ink-500 dark:text-ink-400">
                    {word.exampleTranslation}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Listen & Practice */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-ink-100 dark:border-ink-800">
                <button
                  type="button"
                  onClick={() => handleSpeak(word)}
                  disabled={isSpeaking}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    isSpeaking
                      ? 'bg-iris-50 dark:bg-iris-950/40 text-iris-700 dark:text-iris-300 border-iris-300 animate-pulse'
                      : 'bg-white dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800 hover:bg-ink-50 dark:hover:bg-ink-800'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-iris-600 dark:text-iris-400" />
                  <span>{t.listenAudio}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('click', soundEnabled);
                    onOpenPractice(word);
                  }}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-gradient-to-r from-iris-600 to-ember-600 hover:from-iris-700 hover:to-ember-700 text-white shadow-xs transition-all hover:scale-[1.02]"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>{t.practiceVoice}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWords.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-[#14122a] rounded-2xl border border-ink-200 dark:border-ink-800 space-y-2">
          <p className="text-sm font-semibold text-ink-700 dark:text-ink-300">
            Mos keluvchi so&apos;z topilmadi
          </p>
          <p className="text-xs text-ink-500">
            Qidiruv so&apos;zini o&apos;zgartirib yoki toifalardan birini tanlab ko&apos;ring.
          </p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-4">
          <button
            onClick={() => handlePageChange(Math.max(1, validCurrentPage - 1))}
            disabled={validCurrentPage === 1}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              validCurrentPage > 1
                ? 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                : 'opacity-40 border-ink-100 dark:border-ink-900 text-ink-400 cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Oldingi</span>
          </button>

          {/* Quick Page Jump Selector */}
          <div className="flex items-center gap-1 px-2 text-xs font-bold text-ink-700 dark:text-ink-300">
            <span className="text-iris-600 dark:text-iris-400">{validCurrentPage}</span>
            <span className="text-ink-400">/</span>
            <span>{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(Math.min(totalPages, validCurrentPage + 1))}
            disabled={validCurrentPage === totalPages}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-colors ${
              validCurrentPage < totalPages
                ? 'bg-white dark:bg-ink-900 border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                : 'opacity-40 border-ink-100 dark:border-ink-900 text-ink-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Keyingi</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
