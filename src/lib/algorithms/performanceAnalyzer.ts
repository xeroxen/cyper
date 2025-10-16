import { KeywordStats, Performance, SessionResult, TypingState } from '@/types';
import { updateKeywordStats, addSessionResult } from '../storage/localStorage';
import { updateKeywordReviewSchedule } from './spacedRepetition';

export const analyzeTypingPerformance = (
  state: TypingState,
  performances: Performance[]
): {
  wpm: number;
  accuracy: number;
  keywordStats: KeywordStats[];
} => {
  const duration = state.startTime ? (Date.now() - state.startTime.getTime()) / 1000 : 1;
  const wpm = calculateWPM(state.userInput.length, duration);
  const accuracy = calculateAccuracy(state.userInput, state.currentText);
  
  // Analyze keyword performance
  const keywordStats = analyzeKeywordPerformance(performances);
  
  return {
    wpm,
    accuracy,
    keywordStats
  };
};

export const calculateWPM = (characters: number, durationSeconds: number): number => {
  if (durationSeconds === 0) return 0;
  const words = characters / 5; // Standard: 5 characters = 1 word
  const minutes = durationSeconds / 60;
  return Math.round(words / minutes);
};

export const calculateAccuracy = (userInput: string, targetText: string): number => {
  if (targetText.length === 0) return 100;
  
  const minLength = Math.min(userInput.length, targetText.length);
  let correctChars = 0;
  
  for (let i = 0; i < minLength; i++) {
    if (userInput[i] === targetText[i]) {
      correctChars++;
    }
  }
  
  return Math.round((correctChars / targetText.length) * 100);
};

export const analyzeKeywordPerformance = (performances: Performance[]): KeywordStats[] => {
  const keywordMap = new Map<string, Performance[]>();
  
  // Group performances by keyword
  performances.forEach(perf => {
    if (!keywordMap.has(perf.keyword)) {
      keywordMap.set(perf.keyword, []);
    }
    keywordMap.get(perf.keyword)!.push(perf);
  });
  
  const keywordStats: KeywordStats[] = [];
  
  // Analyze each keyword
  keywordMap.forEach((perfs, keyword) => {
    const correctCount = perfs.filter(p => p.correct).length;
    const accuracy = (correctCount / perfs.length) * 100;
    const averageSpeed = perfs.reduce((sum, p) => sum + p.speed, 0) / perfs.length;
    
    const stat: KeywordStats = {
      keyword,
      language: 'unknown', // Will be set by caller
      accuracy,
      averageSpeed,
      totalAttempts: perfs.length,
      errors: perfs.length - correctCount,
      lastPracticed: new Date(),
      nextReview: new Date(),
      reviewInterval: 1,
      masteryLevel: determineMasteryLevel(accuracy)
    };
    
    keywordStats.push(stat);
  });
  
  return keywordStats;
};

export const determineMasteryLevel = (accuracy: number): KeywordStats['masteryLevel'] => {
  if (accuracy >= 95) return 'mastered';
  if (accuracy >= 85) return 'familiar';
  if (accuracy >= 70) return 'learning';
  return 'weak';
};

export const trackKeywordUsage = (
  text: string,
  userInput: string,
  language: string
): Performance[] => {
  const performances: Performance[] = [];
  const keywords = extractKeywordsFromText(text, language);
  
  keywords.forEach(keyword => {
    const keywordPositions = findKeywordPositions(text, keyword);
    
    keywordPositions.forEach(pos => {
      const userChar = userInput[pos] || '';
      const targetChar = text[pos];
      const correct = userChar === targetChar;
      const speed = calculateTypingSpeed(pos, userInput, text);
      
      performances.push({
        keyword,
        correct,
        speed,
        timestamp: new Date()
      });
    });
  });
  
  return performances;
};

export const extractKeywordsFromText = (text: string, language: string): string[] => {
  // This would need to be implemented based on the language keywords
  // For now, return a simple implementation
  const commonKeywords = [
    'if', 'else', 'for', 'while', 'function', 'const', 'let', 'var',
    'return', 'class', 'import', 'export', 'async', 'await', 'try', 'catch'
  ];
  
  return commonKeywords.filter(keyword => text.includes(keyword));
};

export const findKeywordPositions = (text: string, keyword: string): number[] => {
  const positions: number[] = [];
  let index = text.indexOf(keyword);
  
  while (index !== -1) {
    positions.push(index);
    index = text.indexOf(keyword, index + 1);
  }
  
  return positions;
};

export const calculateTypingSpeed = (
  position: number,
  userInput: string,
  targetText: string
): number => {
  // Simple implementation - in reality, this would track timing per character
  return Math.random() * 100 + 50; // Mock speed in ms
};

export const saveSessionResults = (
  sessionResult: SessionResult,
  performances: Performance[]
): void => {
  // Update keyword stats
  performances.forEach(perf => {
    updateKeywordStats(perf.keyword, sessionResult.language, perf);
    updateKeywordReviewSchedule(perf.keyword, sessionResult.language, perf.correct);
  });
  
  // Save session result
  addSessionResult(sessionResult);
};

export const getPerformanceInsights = (keywordStats: KeywordStats[]): {
  weakestKeywords: KeywordStats[];
  strongestKeywords: KeywordStats[];
  improvementAreas: string[];
  recommendations: string[];
} => {
  const weakestKeywords = keywordStats
    .filter(k => k.masteryLevel === 'weak')
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);
  
  const strongestKeywords = keywordStats
    .filter(k => k.masteryLevel === 'mastered')
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5);
  
  const improvementAreas = weakestKeywords.map(k => k.keyword);
  
  const recommendations: string[] = [];
  
  if (weakestKeywords.length > 0) {
    recommendations.push(`Focus on practicing: ${weakestKeywords.slice(0, 3).map(k => k.keyword).join(', ')}`);
  }
  
  if (strongestKeywords.length > 0) {
    recommendations.push(`Great job with: ${strongestKeywords.slice(0, 3).map(k => k.keyword).join(', ')}`);
  }
  
  const averageAccuracy = keywordStats.reduce((sum, k) => sum + k.accuracy, 0) / keywordStats.length;
  if (averageAccuracy < 80) {
    recommendations.push('Consider slowing down to improve accuracy');
  } else if (averageAccuracy > 95) {
    recommendations.push('Try increasing your typing speed');
  }
  
  return {
    weakestKeywords,
    strongestKeywords,
    improvementAreas,
    recommendations
  };
};
