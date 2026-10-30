'use client';

import React, { useState } from 'react';
import { Volume2, BookOpen, Check } from 'lucide-react';
import { GrammarLesson, Language, UILocale } from '@/lib/types';
import { speakText, playSound } from '@/lib/speech';

interface GrammarGuideProps {
  language: Language;
  lessons: GrammarLesson[];
  uiLocale: UILocale;
  soundEnabled: boolean;
}

export function GrammarGuide({
  language,
  lessons,
  soundEnabled,
}: GrammarGuideProps) {
  const [playingSentence, setPlayingSentence] = useState<string | null>(null);

  const handleSpeakSentence = (sentence: string) => {
    playSound('click', soundEnabled);
    setPlayingSentence(sentence);
    speakText(
      sentence,
      language.speechCode,
      0.9,
      () => setPlayingSentence(null),
      () => setPlayingSentence(null)
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white">
          {language.name} Grammatikasi
        </h3>
        <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
          Asosiy qoidalar, gap tuzilishi va namunaviy gaplar bilan tanishing.
        </p>
      </div>

      <div className="space-y-6">
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white dark:bg-[#14122a] rounded-2xl border border-ink-200 dark:border-ink-800 p-5 sm:p-7 shadow-xs space-y-4 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gradient-to-tr from-iris-600 to-ember-600 text-white rounded-xl shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-ink-900 dark:text-white">
                  {lesson.title}
                </h4>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 bg-ink-100 dark:bg-ink-800 text-ink-700 dark:text-ink-300 rounded-lg">
                Daraja: {lesson.level}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-700 dark:text-ink-300 leading-relaxed">
              {lesson.explanation}
            </p>

            {/* Key Points */}
            <div className="bg-ink-50 dark:bg-ink-900/80 rounded-xl p-4 border border-ink-100 dark:border-ink-800 space-y-2">
              <p className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider">
                Asosiy Qoidalar:
              </p>
              <ul className="space-y-1.5 text-xs text-ink-700 dark:text-ink-300">
                {lesson.keyPoints.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Examples with audio */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-ink-900 dark:text-white uppercase tracking-wider">
                Namunaviy Gaplar (Eshiting):
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {lesson.examples.map((ex, exIdx) => {
                  const isPlaying = playingSentence === ex.target;
                  return (
                    <div
                      key={exIdx}
                      onClick={() => handleSpeakSentence(ex.target)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                        isPlaying
                          ? 'border-iris-500 bg-iris-50/40 dark:bg-iris-950/40 ring-1 ring-iris-300'
                          : 'border-ink-200 dark:border-ink-800 bg-white dark:bg-ink-900 hover:border-ember-500/50'
                      }`}
                    >
                      <div className="pr-2">
                        <p className="text-xs sm:text-sm font-bold text-ink-900 dark:text-white">
                          {ex.target}
                        </p>
                        <p className="text-xs text-ink-500 dark:text-ink-400">{ex.translation}</p>
                      </div>

                      <button
                        type="button"
                        className="p-1.5 rounded-lg text-ink-400 hover:text-iris-600 dark:hover:text-iris-400 shrink-0"
                        title="Ovozli eshitish"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
