'use client';

import React, { useState } from 'react';
import {
  Volume2,
  Mic,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ArrowRight,
} from 'lucide-react';
import { Language, QuizQuestion, UILocale } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';
import {
  speakText,
  playSound,
  checkPronunciation,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
} from '@/lib/speech';

interface QuizArenaProps {
  language: Language;
  questions: QuizQuestion[];
  uiLocale: UILocale;
  soundEnabled: boolean;
  onRewardXP: (amount: number, id: string) => void;
}

export function QuizArena({
  language,
  questions,
  uiLocale,
  soundEnabled,
  onRewardXP,
}: QuizArenaProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const safeQuestions = questions && questions.length > 0 ? questions : [
    {
      id: 'default-1',
      type: 'choice' as const,
      question: `${language.name} tilini o'rganish sizga qanchalik yoqmoqda?`,
      options: ['Juda zo\'r', 'Yaxshi', 'Qiziqarli', 'Maroqli'],
      correctAnswer: 'Juda zo\'r',
      explanation: 'Har kuni mashq qilish til o\'rganishda eng muhim qoidadir!',
    }
  ];

  const currentQ = safeQuestions[currentIndex] || safeQuestions[0];

  const handlePlayAudio = () => {
    if (!currentQ.targetWord) return;
    playSound('click', soundEnabled);
    speakText(currentQ.targetWord, language.speechCode, 0.9);
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      playSound('success', soundEnabled);
      onRewardXP(20, `quiz-${currentQ.id}`);
    } else {
      playSound('error', soundEnabled);
    }
  };

  const handleSpeechAnswer = () => {
    if (isAnswered || !currentQ.targetWord) return;
    playSound('click', soundEnabled);

    if (!isSpeechRecognitionSupported()) {
      const matched = window.confirm(
        `Brauzerda mikrofondan qabul qilish cheklangan. '${currentQ.targetWord}' so'zini to'g'ri aytdingiz deb hisoblansinmi?`
      );
      if (matched) {
        handleSelectOption(currentQ.correctAnswer);
      } else {
        handleSelectOption('Xato');
      }
      return;
    }

    try {
      const recognition = createSpeechRecognition(language.speechCode);
      if (!recognition) return;

      setIsSpeaking(true);
      recognition.onresult = (event: any) => {
        setIsSpeaking(false);
        const transcript =
          event.results && event.results[0] && event.results[0][0]
            ? event.results[0][0].transcript
            : '';
        setSpokenTranscript(transcript);

        const { isCorrect } = checkPronunciation(transcript, currentQ.targetWord!);
        if (isCorrect) {
          handleSelectOption(currentQ.correctAnswer);
        } else {
          handleSelectOption('Xato javob');
        }
      };

      recognition.onerror = () => {
        setIsSpeaking(false);
        handleSelectOption('Ovoz eshitilmadi');
      };

      recognition.onend = () => {
        setIsSpeaking(false);
      };

      recognition.start();
    } catch {
      setIsSpeaking(false);
    }
  };

  const handleNext = () => {
    playSound('click', soundEnabled);
    if (currentIndex < safeQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setSpokenTranscript('');
    } else {
      setIsCompleted(true);
      playSound('reward', soundEnabled);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsCompleted(false);
    setSpokenTranscript('');
  };

  if (isCompleted) {
    const percentage = Math.round((score / safeQuestions.length) * 100);

    return (
      <div className="max-w-md mx-auto bg-white dark:bg-[#14122a] rounded-3xl border border-ink-200 dark:border-ink-800 p-8 text-center space-y-6 shadow-sm transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-ember-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-2xl font-black text-ink-900 dark:text-white">
            {t.congratulations}
          </h3>
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {language.name} bo&apos;yicha test muvaffaqiyatli yakunlandi!
          </p>
        </div>

        <div className="p-4 bg-ink-50 dark:bg-ink-900 rounded-2xl border border-ink-100 dark:border-ink-800 flex items-center justify-around">
          <div>
            <span className="text-2xl font-black text-ink-900 dark:text-white tabular-nums">
              {score} / {safeQuestions.length}
            </span>
            <p className="text-xs text-ink-500 dark:text-ink-400">To&apos;g&apos;ri javoblar</p>
          </div>
          <div className="w-px h-8 bg-ink-200 dark:bg-ink-800" />
          <div>
            <span className="text-2xl font-black text-ember-600 dark:text-ember-400 tabular-nums">
              {percentage}%
            </span>
            <p className="text-xs text-ink-500 dark:text-ink-400">Muvaffaqiyat</p>
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-iris-600 to-ember-600 text-white font-bold hover:from-iris-700 hover:to-ember-700 transition-colors shadow-xs text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Testni qayta topshirish</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between text-xs font-bold text-ink-600 dark:text-ink-400 px-1">
        <span>
          Savol {currentIndex + 1} / {safeQuestions.length}
        </span>
        <span className="text-ember-600 dark:text-ember-400 font-black">Ball: {score}</span>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-[#14122a] rounded-3xl border border-ink-200 dark:border-ink-800 p-6 sm:p-8 space-y-6 shadow-xs transition-colors">
        <h4 className="text-lg sm:text-xl font-black text-ink-900 dark:text-white text-center leading-snug">
          {currentQ.question}
        </h4>

        {/* Audio / Speech Trigger if type is listen or speak */}
        {currentQ.type === 'listen' && (
          <div className="text-center py-2">
            <button
              onClick={handlePlayAudio}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-iris-50 dark:bg-iris-950/40 text-iris-700 dark:text-iris-300 border border-iris-200 dark:border-iris-800 hover:bg-iris-100 transition-colors font-bold text-sm"
            >
              <Volume2 className="w-5 h-5 text-iris-600 dark:text-iris-400" />
              <span>Audioni eshitish</span>
            </button>
          </div>
        )}

        {currentQ.type === 'speak' && (
          <div className="text-center py-4 space-y-2">
            <button
              onClick={handleSpeechAnswer}
              disabled={isSpeaking || isAnswered}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm shadow-sm transition-all ${
                isSpeaking
                  ? 'bg-ember-600 text-white animate-pulse'
                  : 'bg-gradient-to-r from-iris-600 to-ember-600 text-white hover:from-iris-700 hover:to-ember-700'
              }`}
            >
              <Mic className="w-5 h-5" />
              <span>{isSpeaking ? 'Eshitilmoqda...' : 'Mikrofon orqali ayting'}</span>
            </button>

            {spokenTranscript && (
              <p className="text-xs text-ink-500 dark:text-ink-400 font-mono">
                Siz aytgan so&apos;z: &ldquo;{spokenTranscript}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {currentQ.options.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrect = option === currentQ.correctAnswer;

            let buttonStyle = 'bg-ink-50 dark:bg-ink-900 border-ink-200 dark:border-ink-800 text-ink-800 dark:text-ink-200 hover:bg-ink-100 dark:hover:bg-ink-800';

            if (isAnswered) {
              if (isCorrect) {
                buttonStyle = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-300';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 text-rose-800 dark:text-rose-200';
              } else {
                buttonStyle = 'bg-ink-50/50 dark:bg-ink-900/40 border-ink-100 dark:border-ink-900 text-ink-400';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(option)}
                disabled={isAnswered}
                className={`p-3.5 rounded-xl border text-left text-sm font-bold transition-all duration-150 flex items-center justify-between ${buttonStyle}`}
              >
                <span>{option}</span>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Next Button */}
        {isAnswered && (
          <div className="space-y-4 pt-4 border-t border-ink-100 dark:border-ink-800">
            <p className="text-xs sm:text-sm text-ink-600 dark:text-ink-300 leading-relaxed bg-ink-50 dark:bg-ink-900 p-3 rounded-xl border border-ink-100 dark:border-ink-800">
              <span className="font-bold text-ink-900 dark:text-white">Izoh: </span>
              {currentQ.explanation}
            </p>

            <button
              onClick={handleNext}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-ink-900 dark:bg-ink-800 text-white font-bold hover:bg-ink-800 dark:hover:bg-ink-700 transition-colors text-sm"
            >
              <span>{currentIndex < safeQuestions.length - 1 ? 'Keyingi savol' : 'Natijani ko\'rish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
