export type LanguageId =
  | 'en'
  | 'uz'
  | 'ru'
  | 'tr'
  | 'ar'
  | 'es'
  | 'de'
  | 'fr'
  | 'ja'
  | 'ko'
  | 'zh'
  | 'it'
  | 'pt'
  | 'hi'
  | 'id'
  | 'pl'
  | 'nl'
  | 'fa'
  | 'kk'
  | 'az';

export type UILocale = 'uz' | 'en' | 'ru';
export type ThemeMode = 'light' | 'dark';

export interface Language {
  id: LanguageId;
  name: string;
  localName: string;
  flag: string;
  speechCode: string; // e.g. 'en-US', 'tr-TR', 'ja-JP'
  fallbackSpeechCode?: string;
  difficulty: 'Oson' | "O'rta" | 'Yuqori';
  learners: string;
  description: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
}

export interface AlphabetLetter {
  id: string;
  char: string;
  lowercase: string;
  ipa: string;
  exampleWord: string;
  exampleTranslation: string;
  phoneticNote?: string;
}

export interface VocabWord {
  id: string;
  word: string;
  translation: string;
  transcription: string;
  category: string;
  categoryLabel: string;
  example: string;
  exampleTranslation: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: string;
  explanation: string;
  keyPoints: string[];
  examples: {
    target: string;
    translation: string;
    highlight?: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  type: 'choice' | 'listen' | 'speak';
  question: string;
  targetWord?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface UserProgress {
  xp: number;
  streakDays: number;
  lastPracticeDate: string;
  masteredWordIds: string[];
  passedPronunciations: string[];
  completedQuizzes: string[];
  soundEnabled: boolean;
  theme: ThemeMode;
}

export type ActiveTab = 'words' | 'alphabet' | 'practice' | 'grammar' | 'quiz';
