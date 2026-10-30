/**
 * Web Speech API & Web Audio Utilities for LingoSphere
 */

export interface SpeechRecognitionResultState {
  isSupported: boolean;
  transcript: string;
  isCorrect: boolean;
  confidence: number;
  error?: string;
}

// Clean and normalize strings for robust comparison
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics for phonetic comparison
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?"'«»]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Levenshtein similarity metric (0 to 1)
export function calculateSimilarity(str1: string, str2: string): number {
  const s1 = normalizeText(str1);
  const s2 = normalizeText(str2);

  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.92;

  const track = Array(s2.length + 1)
    .fill(null)
    .map(() => Array(s1.length + 1).fill(null));

  for (let i = 0; i <= s1.length; i += 1) {
    track[0][i] = i;
  }
  for (let j = 0; j <= s2.length; j += 1) {
    track[j][0] = j;
  }

  for (let j = 1; j <= s2.length; j += 1) {
    for (let i = 1; i <= s1.length; i += 1) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      track[j][i] = Math.min(
        track[j][i - 1] + 1, // deletion
        track[j - 1][i] + 1, // insertion
        track[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = track[s2.length][s1.length];
  const maxLen = Math.max(s1.length, s2.length);
  return Math.max(0, 1 - distance / maxLen);
}

// Check if user's spoken utterance matches target word
export function checkPronunciation(
  spoken: string,
  target: string,
  threshold: number = 0.72
): { isCorrect: boolean; similarity: number } {
  const normSpoken = normalizeText(spoken);
  const normTarget = normalizeText(target);

  if (normSpoken === normTarget) {
    return { isCorrect: true, similarity: 1.0 };
  }

  // If spoken phrase contains target word directly
  const spokenWords = normSpoken.split(' ');
  const targetWords = normTarget.split(' ');

  if (targetWords.length === 1 && spokenWords.includes(normTarget)) {
    return { isCorrect: true, similarity: 0.95 };
  }

  const similarity = calculateSimilarity(normSpoken, normTarget);
  return {
    isCorrect: similarity >= threshold,
    similarity,
  };
}

// Text-to-Speech (TTS)
export function speakText(
  text: string,
  langCode: string,
  rate: number = 0.9,
  onEnd?: () => void,
  onError?: (err: unknown) => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onError) onError(new Error('Speech Synthesis not supported'));
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any currently playing audio

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;
    utterance.rate = Math.max(0.5, Math.min(1.5, rate));
    utterance.pitch = 1.0;

    // Try finding the exact matching language voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const exactVoice = voices.find(
        (v) => v.lang.toLowerCase() === langCode.toLowerCase()
      );
      const prefixVoice = voices.find((v) =>
        v.lang.toLowerCase().startsWith(langCode.substring(0, 2).toLowerCase())
      );
      if (exactVoice) {
        utterance.voice = exactVoice;
      } else if (prefixVoice) {
        utterance.voice = prefixVoice;
      }
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
    }
    if (onError) {
      utterance.onerror = (e) => onError(e);
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Error in speakText:', err);
    if (onError) onError(err);
    return false;
  }
}

// Stop any active speech
export function stopSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Web Audio API synthesized audio sound effects (No external asset dependency)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playSound(
  type: 'success' | 'error' | 'click' | 'reward',
  enabled: boolean = true
): void {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  if (type === 'success') {
    // Joyful major ascending third chord (C5 -> E5 -> G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.001, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.36);
    });
  } else if (type === 'error') {
    // Soft low dual buzzer
    [220, 196].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.001, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.18, now + i * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.26);
    });
  } else if (type === 'reward') {
    // Fanfare arpeggio
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.07);

      gain.gain.setValueAtTime(0.001, now + i * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.25, now + i * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.07);
      osc.stop(now + i * 0.07 + 0.46);
    });
  } else if (type === 'click') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }
}

// Check speech recognition support
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    'SpeechRecognition' in window ||
    'webkitSpeechRecognition' in window ||
    'mozSpeechRecognition' in window ||
    'msSpeechRecognition' in window
  );
}

// Create Speech Recognition instance safely
export function createSpeechRecognition(langCode: string): any {
  if (typeof window === 'undefined') return null;

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition ||
    (window as any).mozSpeechRecognition ||
    (window as any).msSpeechRecognition;

  if (!SpeechRecognitionClass) {
    return null;
  }

  const recognition = new SpeechRecognitionClass();
  recognition.lang = langCode;
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 3;

  return recognition;
}
