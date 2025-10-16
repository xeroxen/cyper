import { KeywordStats } from '@/types';
import { loadKeywordStats, saveKeywordStats } from '../storage/localStorage';

// Base intervals for spaced repetition (in days)
const BASE_INTERVALS = [1, 3, 7, 14, 30];
const MAX_INTERVAL = 30;

export const calculateNextReview = (keyword: KeywordStats, correct: boolean): Date => {
  const now = new Date();
  
  if (correct) {
    // Increase interval (double it, but cap at MAX_INTERVAL)
    const newInterval = Math.min(keyword.reviewInterval * 2, MAX_INTERVAL);
    keyword.reviewInterval = newInterval;
    return new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
  } else {
    // Reset to 1 day
    keyword.reviewInterval = 1;
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
};

export const getKeywordsDueForReview = (language: string): KeywordStats[] => {
  const stats = loadKeywordStats();
  const now = new Date();
  
  return stats.filter(k => 
    k.language === language && 
    k.nextReview <= now
  );
};

export const getWeakKeywords = (language: string, daysBack: number = 7): KeywordStats[] => {
  const stats = loadKeywordStats();
  const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  
  return stats.filter(k => 
    k.language === language && 
    (k.masteryLevel === 'weak' || k.accuracy < 80) &&
    k.lastPracticed >= cutoffDate
  );
};

export const getKeywordsByMasteryLevel = (language: string, level: KeywordStats['masteryLevel']): KeywordStats[] => {
  const stats = loadKeywordStats();
  
  return stats.filter(k => 
    k.language === language && 
    k.masteryLevel === level
  );
};

export const updateKeywordReviewSchedule = (keyword: string, language: string, correct: boolean): void => {
  const stats = loadKeywordStats();
  const keywordStat = stats.find(k => k.keyword === keyword && k.language === language);
  
  if (keywordStat) {
    keywordStat.nextReview = calculateNextReview(keywordStat, correct);
    keywordStat.lastPracticed = new Date();
    
    // Update mastery level based on performance
    if (correct) {
      if (keywordStat.masteryLevel === 'weak') {
        keywordStat.masteryLevel = 'learning';
      } else if (keywordStat.masteryLevel === 'learning') {
        keywordStat.masteryLevel = 'familiar';
      } else if (keywordStat.masteryLevel === 'familiar' && keywordStat.accuracy >= 95) {
        keywordStat.masteryLevel = 'mastered';
      }
    } else {
      // Demote mastery level if incorrect
      if (keywordStat.masteryLevel === 'mastered') {
        keywordStat.masteryLevel = 'familiar';
      } else if (keywordStat.masteryLevel === 'familiar') {
        keywordStat.masteryLevel = 'learning';
      } else if (keywordStat.masteryLevel === 'learning') {
        keywordStat.masteryLevel = 'weak';
      }
    }
    
    saveKeywordStats(stats);
  }
};

export const getReviewSchedule = (language: string): {
  dueToday: KeywordStats[];
  dueThisWeek: KeywordStats[];
  mastered: KeywordStats[];
  weak: KeywordStats[];
} => {
  const stats = loadKeywordStats();
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const languageStats = stats.filter(k => k.language === language);
  
  return {
    dueToday: languageStats.filter(k => k.nextReview <= now),
    dueThisWeek: languageStats.filter(k => k.nextReview <= oneWeekFromNow && k.nextReview > now),
    mastered: languageStats.filter(k => k.masteryLevel === 'mastered'),
    weak: languageStats.filter(k => k.masteryLevel === 'weak')
  };
};

export const needsWeeklyRecap = (): boolean => {
  const lastReview = localStorage.getItem('typing_last_full_review');
  if (!lastReview) return true;
  
  const lastReviewDate = new Date(lastReview);
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  return lastReviewDate <= oneWeekAgo;
};

export const markWeeklyRecapCompleted = (): void => {
  localStorage.setItem('typing_last_full_review', new Date().toISOString());
};

export const getSpacedRepetitionStats = (language: string): {
  totalKeywords: number;
  mastered: number;
  learning: number;
  weak: number;
  dueToday: number;
  averageAccuracy: number;
} => {
  const stats = loadKeywordStats();
  const languageStats = stats.filter(k => k.language === language);
  const now = new Date();
  
  const mastered = languageStats.filter(k => k.masteryLevel === 'mastered').length;
  const learning = languageStats.filter(k => k.masteryLevel === 'learning' || k.masteryLevel === 'familiar').length;
  const weak = languageStats.filter(k => k.masteryLevel === 'weak').length;
  const dueToday = languageStats.filter(k => k.nextReview <= now).length;
  
  const averageAccuracy = languageStats.length > 0 
    ? languageStats.reduce((sum, k) => sum + k.accuracy, 0) / languageStats.length 
    : 0;
  
  return {
    totalKeywords: languageStats.length,
    mastered,
    learning,
    weak,
    dueToday,
    averageAccuracy
  };
};
