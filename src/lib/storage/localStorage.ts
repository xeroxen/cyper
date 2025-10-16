import { KeywordStats, SessionResult, UserSettings, Performance } from '@/types';

const STORAGE_KEYS = {
  KEYWORD_STATS: 'typing_keyword_stats',
  SESSION_HISTORY: 'typing_sessions',
  USER_SETTINGS: 'typing_settings',
  LAST_REVIEW: 'typing_last_full_review'
};

// Keyword Stats Management
export const loadKeywordStats = (): KeywordStats[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KEYWORD_STATS);
    if (!data) return [];
    
    const stats = JSON.parse(data);
    // Convert date strings back to Date objects
    return stats.map((stat: any) => ({
      ...stat,
      lastPracticed: new Date(stat.lastPracticed),
      nextReview: new Date(stat.nextReview)
    }));
  } catch (error) {
    console.error('Error loading keyword stats:', error);
    return [];
  }
};

export const saveKeywordStats = (stats: KeywordStats[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.KEYWORD_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving keyword stats:', error);
  }
};

export const updateKeywordStats = (keyword: string, language: string, performance: Performance): void => {
  const stats = loadKeywordStats();
  const existing = stats.find(k => k.keyword === keyword && k.language === language);
  
  if (existing) {
    // Update existing stats
    const newAttempts = existing.totalAttempts + 1;
    const newErrors = performance.correct ? existing.errors : existing.errors + 1;
    const newAccuracy = ((newAttempts - newErrors) / newAttempts) * 100;
    
    // Update average speed (weighted average)
    const newAverageSpeed = (existing.averageSpeed * existing.totalAttempts + performance.speed) / newAttempts;
    
    existing.accuracy = newAccuracy;
    existing.averageSpeed = newAverageSpeed;
    existing.totalAttempts = newAttempts;
    existing.errors = newErrors;
    existing.lastPracticed = new Date();
    
    // Update mastery level based on accuracy
    if (newAccuracy >= 95) existing.masteryLevel = 'mastered';
    else if (newAccuracy >= 85) existing.masteryLevel = 'familiar';
    else if (newAccuracy >= 70) existing.masteryLevel = 'learning';
    else existing.masteryLevel = 'weak';
    
  } else {
    // Create new keyword stat
    const newStat: KeywordStats = {
      keyword,
      language,
      accuracy: performance.correct ? 100 : 0,
      averageSpeed: performance.speed,
      totalAttempts: 1,
      errors: performance.correct ? 0 : 1,
      lastPracticed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      reviewInterval: 1,
      masteryLevel: performance.correct ? 'learning' : 'weak'
    };
    stats.push(newStat);
  }
  
  saveKeywordStats(stats);
};

// Session History Management
export const loadSessionHistory = (): SessionResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION_HISTORY);
    if (!data) return [];
    
    const sessions = JSON.parse(data);
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      date: new Date(session.date),
      keywordPerformance: session.keywordPerformance.map((kp: any) => ({
        ...kp,
        lastPracticed: new Date(kp.lastPracticed),
        nextReview: new Date(kp.nextReview)
      }))
    }));
  } catch (error) {
    console.error('Error loading session history:', error);
    return [];
  }
};

export const saveSessionHistory = (sessions: SessionResult[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION_HISTORY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving session history:', error);
  }
};

export const addSessionResult = (session: SessionResult): void => {
  const sessions = loadSessionHistory();
  sessions.push(session);
  
  // Keep only last 100 sessions to prevent localStorage bloat
  if (sessions.length > 100) {
    sessions.splice(0, sessions.length - 100);
  }
  
  saveSessionHistory(sessions);
};

// User Settings Management
export const loadUserSettings = (): UserSettings => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    if (!data) {
      // Return default settings
      return {
        soundEnabled: true,
        fontSize: 'medium',
        testDuration: 60,
        theme: 'dark'
      };
    }
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading user settings:', error);
    return {
      soundEnabled: true,
      fontSize: 'medium',
      testDuration: 60,
      theme: 'dark'
    };
  }
};

export const saveUserSettings = (settings: UserSettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving user settings:', error);
  }
};

// Last Review Date Management
export const getLastReviewDate = (): Date | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LAST_REVIEW);
    return data ? new Date(data) : null;
  } catch (error) {
    console.error('Error loading last review date:', error);
    return null;
  }
};

export const setLastReviewDate = (date: Date): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_REVIEW, date.toISOString());
  } catch (error) {
    console.error('Error saving last review date:', error);
  }
};

// Utility functions
export const clearAllData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing all data:', error);
  }
};

export const exportData = (): string => {
  try {
    const data = {
      keywordStats: loadKeywordStats(),
      sessionHistory: loadSessionHistory(),
      userSettings: loadUserSettings(),
      lastReview: getLastReviewDate()
    };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error exporting data:', error);
    return '';
  }
};

export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.keywordStats) {
      saveKeywordStats(data.keywordStats);
    }
    if (data.sessionHistory) {
      saveSessionHistory(data.sessionHistory);
    }
    if (data.userSettings) {
      saveUserSettings(data.userSettings);
    }
    if (data.lastReview) {
      setLastReviewDate(new Date(data.lastReview));
    }
    
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};
