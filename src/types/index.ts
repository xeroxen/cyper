// Core data models for the typing practice app

export interface KeywordStats {
  keyword: string;
  language: string;
  accuracy: number; // percentage
  averageSpeed: number; // ms per character
  totalAttempts: number;
  errors: number;
  lastPracticed: Date;
  nextReview: Date;
  reviewInterval: number; // days
  masteryLevel: 'weak' | 'learning' | 'familiar' | 'mastered';
}

export interface SessionResult {
  id: string;
  date: Date;
  language: string;
  duration: number; // seconds
  wpm: number;
  accuracy: number;
  keywordPerformance: KeywordStats[];
}

export interface Performance {
  keyword: string;
  correct: boolean;
  speed: number; // ms per character
  timestamp: Date;
}

export interface UserSettings {
  soundEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large';
  testDuration: 30 | 60 | 120; // seconds
  theme: 'dark' | 'light';
}

export interface TestMode {
  type: 'quick' | 'focused' | 'recap' | 'custom';
  language?: string;
  duration?: number;
  keywords?: string[];
}

export interface Language {
  id: string;
  name: string;
  keywords: string[];
  patterns: CodePattern[];
}

export interface CodePattern {
  template: string;
  keywords: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
}

export interface TestGenerationOptions {
  language: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mode: TestMode;
  duration: number;
}

export interface TypingState {
  isActive: boolean;
  currentText: string;
  userInput: string;
  currentIndex: number;
  startTime: Date | null;
  errors: number;
  wpm: number;
  accuracy: number;
}

export interface KeywordPerformance {
  keyword: string;
  attempts: number;
  correct: number;
  averageSpeed: number;
  lastAttempt: Date;
}
