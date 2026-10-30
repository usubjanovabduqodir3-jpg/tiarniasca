'use client';

import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { AlphabetLetter, Language, UILocale } from '@/lib/types';
import { speakText, playSound } from '@/lib/speech';

interface AlphabetViewProps {
  language: Language;
  letters: AlphabetLetter[];
  uiLocale: UILocale;
  soundEnabled: boolean;
}

export function AlphabetView({
  language,
  letters,
  soundEnabled,
}: AlphabetViewProps) {
  const [playingId, setPlayingId] = useState<string | null>(null);

  const handlePlayLetter = (letter: AlphabetLetter) => {
    playSound('click', soundEnabled);
    setPlayingId(letter.id);
    speakText(
      letter.char,
      language.speechCode,
      0.85,
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  const handlePlayExample = (e: React.MouseEvent, letter: AlphabetLetter) => {
    e.stopPropagation();
    playSound('click', soundEnabled);
    setPlayingId(letter.id);
    speakText(
      letter.exampleWord,
      language.speechCode,
      0.9,
      () => setPlayingId(null),
      () => setPlayingId(null)
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white">
          {language.name} Alifbosi
        </h3>
        <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-400">
          Harflar ustiga bosib ularning talaffuzini eshiting va misol so&apos;zlar orqali mustahkamlang.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {letters.map((letter) => {
          const isPlaying = playingId === letter.id;

          return (
            <div
              key={letter.id}
              onClick={() => handlePlayLetter(letter)}
              className={`bg-white dark:bg-[#14122a] rounded-2xl border p-4 text-center cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                isPlaying
                  ? 'border-ember-500 bg-ember-50/20 dark:bg-ember-950/20 ring-2 ring-ember-400'
                  : 'border-ink-200 dark:border-ink-800 hover:border-iris-500/50'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-black text-ink-900 dark:text-white mb-1">
                {letter.char}{' '}
                <span className="text-ink-400 dark:text-ink-500 font-semibold text-2xl">
                  {letter.lowercase}
                </span>
              </div>

              <div className="text-xs font-mono font-bold text-iris-600 dark:text-iris-400 mb-2">
                {letter.ipa}
              </div>

              <div
                onClick={(e) => handlePlayExample(e, letter)}
                className="pt-2 border-t border-ink-100 dark:border-ink-800 flex items-center justify-between text-left group"
              >
                <div className="overflow-hidden pr-1">
                  <p className="text-xs font-bold text-ink-800 dark:text-ink-200 truncate group-hover:text-ember-500">
                    {letter.exampleWord}
                  </p>
                  <p className="text-[10px] text-ink-500 dark:text-ink-400 truncate">
                    {letter.exampleTranslation}
                  </p>
                </div>
                <Volume2 className="w-3.5 h-3.5 text-ink-400 group-hover:text-ember-500 shrink-0" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
