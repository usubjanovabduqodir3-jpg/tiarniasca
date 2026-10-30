'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Language, UILocale, VocabWord } from '@/lib/types';
import { UI_TRANSLATIONS } from '@/data/languagesData';
import {
  speakText,
  stopSpeech,
  playSound,
  checkPronunciation,
  createSpeechRecognition,
  isSpeechRecognitionSupported,
} from '@/lib/speech';

interface PronunciationStudioProps {
  language: Language;
  words: VocabWord[];
  activeWord: VocabWord;
  onSelectWord: (word: VocabWord) => void;
  uiLocale: UILocale;
  soundEnabled: boolean;
  onRewardXP: (amount: number, wordId: string) => void;
}

export function PronunciationStudio({
  language,
  words,
  activeWord,
  onSelectWord,
  uiLocale,
  soundEnabled,
  onRewardXP,
}: PronunciationStudioProps) {
  const t = UI_TRANSLATIONS[uiLocale] || UI_TRANSLATIONS.uz;

  const [isListening, setIsListening] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [hasPermissionError, setHasPermissionError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');
  const [showManualFallback, setShowManualFallback] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Clean up any ongoing audio or speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
      stopSpeech();
    };
  }, []);

  const currentIndex = words.findIndex((w) => w.id === activeWord.id);
  const prevWord = currentIndex > 0 ? words[currentIndex - 1] : null;
  const nextWord = currentIndex < words.length - 1 ? words[currentIndex + 1] : null;

  // Listen to the word (Text-to-Speech)
  const handleListen = (rate: number = speechRate) => {
    playSound('click', soundEnabled);
    setIsPlayingTTS(true);
    speakText(
      activeWord.word,
      language.speechCode,
      rate,
      () => setIsPlayingTTS(false),
      () => setIsPlayingTTS(false)
    );
  };

  // Start Speech Recognition
  const startListening = () => {
    playSound('click', soundEnabled);
    setFeedbackStatus('idle');
    setRecognizedText('');
    setErrorMessage('');
    setHasPermissionError(false);

    if (!isSpeechRecognitionSupported()) {
      setShowManualFallback(true);
      setErrorMessage(
        "Ushbu brauzerda Web Speech API mikrofon orqali qabul qilishni to'liq qo'llab-quvvatlamaydi (Chrome, Edge yoki Safari tavsiya etiladi). Simulyatsiya rejimi yoqildi."
      );
      return;
    }

    try {
      const recognition = createSpeechRecognition(language.speechCode);
      if (!recognition) {
        setShowManualFallback(true);
        return;
      }

      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        setIsListening(false);
        const transcript =
          event.results && event.results[0] && event.results[0][0]
            ? event.results[0][0].transcript
            : '';

        setRecognizedText(transcript);
        evaluateSpokenText(transcript);
      };

      recognition.onerror = (event: any) => {
        setIsListening(false);
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed') {
          setHasPermissionError(true);
          setErrorMessage(
            "Mikrofonga ruxsat berilmadi. Iltimos, brauzeringiz manzil satridagi qulf belgisini bosib, mikrofonni yoqing."
          );
        } else if (event.error === 'no-speech') {
          setErrorMessage("Ovoz eshitilmadi. Iltimos, mikrofonga yaqinroq kelib qaytadan gapiring.");
          setFeedbackStatus('error');
        } else {
          setErrorMessage(`Xatolik: ${event.error}. Qaytadan urinib ko'ring.`);
          setFeedbackStatus('error');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err: any) {
      setIsListening(false);
      console.error('Error starting recognition:', err);
      setShowManualFallback(true);
      setErrorMessage("Mikrofonni faollashtirishda xatolik yuz berdi. Qaytadan urinib ko'ring.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  const evaluateSpokenText = (text: string) => {
    if (!text.trim()) {
      setFeedbackStatus('error');
      setErrorMessage("Ovoz aniqlanmadi, qaytadan urinib ko'ring.");
      playSound('error', soundEnabled);
      return;
    }

    const { isCorrect } = checkPronunciation(text, activeWord.word);

    if (isCorrect) {
      setFeedbackStatus('success');
      playSound('success', soundEnabled);
      onRewardXP(15, activeWord.id);
    } else {
      setFeedbackStatus('error');
      playSound('error', soundEnabled);
    }
  };

  const handleManualCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setRecognizedText(manualInput);
    evaluateSpokenText(manualInput);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Target Word Main Card */}
      <div className="relative bg-white dark:bg-[#14122a] rounded-3xl border border-ink-200 dark:border-ink-800 p-6 sm:p-10 shadow-sm text-center overflow-hidden transition-colors">
        {/* Subtle decorative background auras in Blue & Red */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-iris-100 dark:bg-iris-900/30 rounded-full blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-ember-100 dark:bg-ember-900/30 rounded-full blur-3xl opacity-60 pointer-events-none" />

        {/* Header navigation between words */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <button
            onClick={() => prevWord && onSelectWord(prevWord)}
            disabled={!prevWord}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
              prevWord
                ? 'bg-ink-50 dark:bg-ink-900 border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                : 'opacity-40 border-ink-100 dark:border-ink-900 text-ink-400 cursor-not-allowed'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Oldingi</span>
          </button>

          <span className="text-xs font-bold text-ink-500 dark:text-ink-400">
            {currentIndex + 1} / {words.length} {t.wordsCount}
          </span>

          <button
            onClick={() => nextWord && onSelectWord(nextWord)}
            disabled={!nextWord}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
              nextWord
                ? 'bg-ink-50 dark:bg-ink-900 border-ink-200 dark:border-ink-800 text-ink-700 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-800'
                : 'opacity-40 border-ink-100 dark:border-ink-900 text-ink-400 cursor-not-allowed'
            }`}
          >
            <span className="hidden sm:inline">Keyingi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Word Display */}
        <div className="space-y-3 my-6 relative z-10">
          <h2 className="voice-studio-target-word text-3xl sm:text-5xl font-black tracking-tight text-ink-900 dark:text-white">
            {activeWord.word}
          </h2>

          <div className="flex items-center justify-center gap-2">
            <span className="text-sm sm:text-base font-mono font-bold text-iris-600 dark:text-iris-400 tracking-wider">
              {activeWord.transcription}
            </span>
          </div>

          <p className="text-base sm:text-lg font-bold text-ink-800 dark:text-ink-200">
            {activeWord.translation}
          </p>

          <p className="text-xs sm:text-sm text-ink-500 dark:text-ink-400 max-w-md mx-auto italic">
            &ldquo;{activeWord.example}&rdquo; — {activeWord.exampleTranslation}
          </p>
        </div>

        {/* Speed & Listen Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 pb-6 relative z-10">
          {/* TTS Listen Button */}
          <button
            type="button"
            onClick={() => handleListen(speechRate)}
            disabled={isPlayingTTS || isListening}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
              isPlayingTTS
                ? 'bg-iris-50 dark:bg-iris-950/60 text-iris-700 dark:text-iris-300 border-iris-300 ring-2 ring-iris-100 dark:ring-iris-900 animate-pulse'
                : 'bg-ink-50 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-ink-200 dark:border-ink-800 hover:bg-ink-100 dark:hover:bg-ink-800'
            }`}
          >
            <Volume2 className="w-4 h-4 text-iris-600 dark:text-iris-400" />
            <span>{isPlayingTTS ? 'Ovoz yangramoqda...' : t.listenAudio}</span>
          </button>

          {/* Speed Selector */}
          <div className="flex items-center bg-ink-100 dark:bg-ink-900 rounded-xl p-1 border border-ink-200 dark:border-ink-800 text-xs font-bold">
            <button
              onClick={() => {
                setSpeechRate(0.75);
                handleListen(0.75);
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                speechRate === 0.75
                  ? 'bg-white dark:bg-ink-800 text-iris-600 dark:text-iris-400 shadow-xs'
                  : 'text-ink-600 dark:text-ink-400'
              }`}
            >
              0.75x
            </button>
            <button
              onClick={() => {
                setSpeechRate(1.0);
                handleListen(1.0);
              }}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                speechRate === 1.0
                  ? 'bg-white dark:bg-ink-800 text-iris-600 dark:text-iris-400 shadow-xs'
                  : 'text-ink-600 dark:text-ink-400'
              }`}
            >
              1.0x
            </button>
          </div>
        </div>

        {/* Primary Interactive Speaking Button (Microphone) */}
        <div className="py-6 flex flex-col items-center justify-center relative z-10">
          <div className="relative flex items-center justify-center">
            {/* Pulsating animation rings while listening */}
            {isListening && (
              <>
                <span className="absolute w-28 h-28 rounded-full bg-ember-500 opacity-25 animate-audio-pulse" />
                <span className="absolute w-36 h-36 rounded-full bg-iris-500 opacity-20 animate-ping" />
              </>
            )}

            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`voice-mic-circle w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
                isListening
                  ? 'bg-ember-600 text-white shadow-ember-500/50 scale-105 ring-4 ring-ember-300 dark:ring-ember-900'
                  : 'bg-gradient-to-tr from-iris-600 to-ember-600 text-white hover:from-iris-700 hover:to-ember-700 shadow-iris-500/30 hover:scale-105'
              }`}
              title={isListening ? "To'xtatish" : "Gapirib ko'rish"}
            >
              {isListening ? (
                <MicOff className="w-8 h-8 sm:w-10 sm:h-10 animate-pulse" />
              ) : (
                <Mic className="w-8 h-8 sm:w-10 sm:h-10" />
              )}
            </button>
          </div>

          <p className="mt-4 text-xs sm:text-sm font-bold text-ink-700 dark:text-ink-300">
            {isListening ? (
              <span className="text-ember-600 dark:text-ember-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-ember-600 animate-ping" />
                {t.listeningStatus} {t.speakNow}
              </span>
            ) : (
              t.speakingPrompt
            )}
          </p>
        </div>

        {/* Pronunciation Feedback Banners */}
        {feedbackStatus === 'success' && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-2 font-black text-base sm:text-lg">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>{t.correctFeedback}</span>
            </div>
            <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
              Talaffuzingiz a&apos;lo darajada bo&apos;ldi! <span className="font-bold text-amber-500">+15 XP</span> berildi.
            </p>
            {recognizedText && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                Eshitilgan so&apos;z: &ldquo;{recognizedText}&rdquo;
              </p>
            )}

            {nextWord && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onSelectWord(nextWord)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <span>{t.nextWord}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {feedbackStatus === 'error' && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-2 font-black text-base sm:text-lg">
              <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              <span>{t.incorrectFeedback}</span>
            </div>

            {recognizedText ? (
              <div className="text-xs space-y-1">
                <p className="text-ink-600 dark:text-ink-400">
                  Siz aytgan so&apos;z: <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">&ldquo;{recognizedText}&rdquo;</span>
                </p>
                <p className="text-ink-600 dark:text-ink-400">
                  Kutilgan to&apos;g&apos;ri so&apos;z: <span className="font-bold text-ink-900 dark:text-white font-mono">&ldquo;{activeWord.word}&rdquo;</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-rose-700 dark:text-rose-300">{errorMessage || 'Ovoz yaxshi eshitilmadi.'}</p>
            )}

            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={startListening}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.retryBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => handleListen(0.75)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-ink-900 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-bold hover:bg-rose-50 dark:hover:bg-ink-800 transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Sekin eshitish (0.75x)</span>
              </button>
            </div>
          </div>
        )}

        {/* Permission Error */}
        {hasPermissionError && (
          <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Manual Speech Test / Simulation Accordion */}
      <div className="bg-ink-50 dark:bg-[#14122a] rounded-2xl border border-ink-200 dark:border-ink-800 p-4 text-xs text-ink-600 dark:text-ink-400 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-ink-800 dark:text-ink-200">
            <Info className="w-4 h-4 text-iris-600 dark:text-iris-400" />
            <span>Mikrofon yoki matn orqali tekshirish yordamchisi</span>
          </div>
          <button
            onClick={() => setShowManualFallback(!showManualFallback)}
            className="text-iris-600 dark:text-iris-400 hover:underline font-bold"
          >
            {showManualFallback ? 'Yashirish' : 'Ochish'}
          </button>
        </div>

        {showManualFallback && (
          <form onSubmit={handleManualCheck} className="space-y-2 pt-2 border-t border-ink-200 dark:border-ink-800">
            <p className="text-ink-500 dark:text-ink-400">
              Agar mikrofoningiz ishlamasa yoki shovqinli joyda bo&apos;lsangiz, so&apos;zni shu yerga yozib tekshirishingiz mumkin:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder={`Masalan: ${activeWord.word}`}
                className="flex-1 bg-white dark:bg-ink-900 border border-ink-200 dark:border-ink-800 rounded-lg px-3 py-2 text-xs text-ink-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-iris-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-iris-600 to-ember-600 text-white font-bold rounded-lg hover:from-iris-700 hover:to-ember-700 text-xs"
              >
                Tekshirish
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
