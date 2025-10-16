import { TestGenerationOptions, CodePattern } from '@/types';
import { getLanguageById, getLanguageKeywords, getLanguagePatterns } from '../languages';
import { 
  getKeywordsDueForReview, 
  getWeakKeywords, 
  getKeywordsByMasteryLevel,
  needsWeeklyRecap 
} from './spacedRepetition';

// Weight distribution for keyword selection
const WEIGHTS = {
  DUE_FOR_REVIEW: 0.4,    // 40% keywords due for review
  WEAK_KEYWORDS: 0.4,     // 40% weak keywords
  RANDOM: 0.2             // 20% random keywords for variety
};

// Difficulty-based pattern selection
const DIFFICULTY_PATTERNS = {
  easy: ['easy'],
  medium: ['easy', 'medium'],
  hard: ['easy', 'medium', 'hard']
};

export const generateTest = (options: TestGenerationOptions): string => {
  const { language, difficulty, mode, duration } = options;
  
  // Check if this should be a weekly recap
  if (mode.type === 'recap' || needsWeeklyRecap()) {
    return generateWeeklyRecapTest(language, duration);
  }
  
  // Get keywords based on spaced repetition algorithm
  const dueKeywords = getKeywordsDueForReview(language);
  const weakKeywords = getWeakKeywords(language);
  const allKeywords = getLanguageKeywords(language);
  
  // Convert KeywordStats to string arrays for selection
  const dueKeywordStrings = dueKeywords.map(k => k.keyword);
  const weakKeywordStrings = weakKeywords.map(k => k.keyword);
  
  // Select keywords using weighted distribution
  const selectedKeywords = selectKeywords(dueKeywordStrings, weakKeywordStrings, allKeywords);
  
  // Generate code snippet using selected keywords
  return generateCodeSnippet(selectedKeywords, language, difficulty);
};

export const generateWeeklyRecapTest = (language: string, duration: number): string => {
  const allKeywords = getLanguageKeywords(language);
  const patterns = getLanguagePatterns(language);
  
  // For weekly recap, include a mix of all keywords
  const selectedKeywords = selectRandomKeywords(allKeywords, Math.min(20, allKeywords.length));
  const selectedPatterns = patterns.filter(p => 
    DIFFICULTY_PATTERNS.hard.includes(p.difficulty)
  );
  
  return generateCodeSnippet(selectedKeywords, language, 'hard', selectedPatterns);
};

export const generateFocusedTest = (keywords: string[], language: string, duration: number): string => {
  const patterns = getLanguagePatterns(language);
  const relevantPatterns = patterns.filter((p: CodePattern) => 
    p.keywords.some((k: string) => keywords.includes(k))
  );
  
  return generateCodeSnippet(keywords, language, 'medium', relevantPatterns);
};

const selectKeywords = (
  dueKeywords: string[], 
  weakKeywords: string[], 
  allKeywords: string[]
): string[] => {
  const selected: string[] = [];
  const totalNeeded = 15; // Target number of keywords per test
  
  // Add due keywords (40%)
  const dueCount = Math.floor(totalNeeded * WEIGHTS.DUE_FOR_REVIEW);
  const selectedDue = selectRandomKeywords(dueKeywords, dueCount);
  selected.push(...selectedDue);
  
  // Add weak keywords (40%)
  const weakCount = Math.floor(totalNeeded * WEIGHTS.WEAK_KEYWORDS);
  const selectedWeak = selectRandomKeywords(weakKeywords, weakCount);
  selected.push(...selectedWeak);
  
  // Add random keywords (20%)
  const randomCount = totalNeeded - selected.length;
  const availableRandom = allKeywords.filter(k => !selected.includes(k));
  const selectedRandom = selectRandomKeywords(availableRandom, randomCount);
  selected.push(...selectedRandom);
  
  return selected;
};

const selectRandomKeywords = (keywords: string[], count: number): string[] => {
  if (keywords.length <= count) return keywords;
  
  const shuffled = [...keywords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const generateCodeSnippet = (
  keywords: string[], 
  language: string, 
  difficulty: 'easy' | 'medium' | 'hard',
  customPatterns?: CodePattern[]
): string => {
  const languageData = getLanguageById(language);
  if (!languageData) return '';
  
  const patterns = customPatterns || languageData.patterns;
  const difficultyPatterns = patterns.filter((p: CodePattern) => 
    DIFFICULTY_PATTERNS[difficulty].includes(p.difficulty)
  );
  
  if (difficultyPatterns.length === 0) {
    return generateSimpleCodeSnippet(keywords, language);
  }
  
  // Select 3-5 patterns to create a realistic code snippet
  const selectedPatterns = selectRandomPatterns(difficultyPatterns, 3 + Math.floor(Math.random() * 3));
  
  return combinePatterns(selectedPatterns, keywords, language);
};

const selectRandomPatterns = (patterns: CodePattern[], count: number): CodePattern[] => {
  if (patterns.length <= count) return patterns;
  
  const shuffled = [...patterns].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const combinePatterns = (patterns: CodePattern[], keywords: string[], language: string): string => {
  let code = '';
  
  patterns.forEach((pattern, index) => {
    let patternCode = pattern.template;
    
    // Replace placeholders with realistic values
    patternCode = replacePlaceholders(patternCode, language);
    
    // Add some spacing and structure
    if (index > 0) {
      code += '\n\n';
    }
    
    code += patternCode;
  });
  
  // Add some additional keywords that weren't covered by patterns
  const unusedKeywords = keywords.filter(k => !code.includes(k));
  if (unusedKeywords.length > 0) {
    code += '\n\n' + generateAdditionalCode(unusedKeywords, language);
  }
  
  return code;
};

const replacePlaceholders = (template: string, language: string): string => {
  const replacements: Record<string, string> = {
    '{variableName}': getRandomVariableName(),
    '{functionName}': getRandomFunctionName(),
    '{param1}': getRandomParameterName(),
    '{param2}': getRandomParameterName(),
    '{param}': getRandomParameterName(),
    '{value}': getRandomValue(language),
    '{result}': getRandomValue(language),
    '{condition}': getRandomCondition(),
    '{doSomething}': getRandomFunctionName(),
    '{array}': getRandomArrayName(),
    '{property}': getRandomPropertyName(),
    '{asyncFunction}': getRandomAsyncFunctionName(),
    '{prop1}': getRandomPropertyName(),
    '{prop2}': getRandomPropertyName(),
    '{object}': getRandomObjectName(),
    '{module}': getRandomModuleName(),
    '{package}': getRandomPackageName(),
    '{ClassName}': getRandomClassName(),
    '{field1}': getRandomFieldName(),
    '{field2}': getRandomFieldName(),
    '{i}': 'i',
    '{n}': 'n',
    '{size}': 'size',
    '{ptr}': 'ptr',
    '{buffer}': 'buffer',
    '{source}': 'source',
    '{header}': getRandomHeader(),
    '{message}': getRandomMessage(),
    '{filename}': 'filename',
    '{file}': 'file',
    '{content}': 'content',
    '{decorator}': getRandomDecorator(),
    '{expression}': getRandomExpression(),
    '{item}': 'item',
    '{list_name}': getRandomListName(),
    '{iterable}': getRandomIterableName(),
    '{e}': 'e',
    '{some_function}': getRandomFunctionName()
  };
  
  let result = template;
  Object.entries(replacements).forEach(([placeholder, replacement]) => {
    result = result.replace(new RegExp(placeholder, 'g'), replacement);
  });
  
  return result;
};

const generateSimpleCodeSnippet = (keywords: string[], language: string): string => {
  // Fallback: create simple code using keywords
  const lines: string[] = [];
  
  keywords.slice(0, 10).forEach((keyword, index) => {
    if (language === 'javascript' || language === 'typescript') {
      lines.push(`const ${getRandomVariableName()} = ${keyword};`);
    } else if (language === 'python') {
      lines.push(`${keyword} = ${getRandomValue(language)}`);
    } else if (language === 'c') {
      lines.push(`int ${getRandomVariableName()} = ${keyword};`);
    }
  });
  
  return lines.join('\n');
};

const generateAdditionalCode = (keywords: string[], language: string): string => {
  const lines: string[] = [];
  
  keywords.slice(0, 5).forEach(keyword => {
    if (language === 'javascript' || language === 'typescript') {
      lines.push(`// Using ${keyword}`);
      lines.push(`console.log(${keyword});`);
    } else if (language === 'python') {
      lines.push(`# Using ${keyword}`);
      lines.push(`print(${keyword})`);
    } else if (language === 'c') {
      lines.push(`/* Using ${keyword} */`);
      lines.push(`printf("%s\\n", ${keyword});`);
    }
  });
  
  return lines.join('\n');
};

// Helper functions for generating realistic code elements
const getRandomVariableName = (): string => {
  const names = ['user', 'data', 'result', 'value', 'item', 'count', 'index', 'name', 'id', 'type'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomFunctionName = (): string => {
  const names = ['process', 'handle', 'calculate', 'validate', 'format', 'parse', 'convert', 'generate'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomParameterName = (): string => {
  const names = ['param', 'value', 'data', 'input', 'options', 'config', 'settings'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomValue = (language: string): string => {
  const values = {
    javascript: ['"hello"', '42', 'true', 'null', '[]', '{}'],
    typescript: ['"hello"', '42', 'true', 'null', '[]', '{}'],
    python: ['"hello"', '42', 'True', 'None', '[]', '{}'],
    c: ['"hello"', '42', '1', 'NULL', '{}']
  };
  
  const langValues = values[language as keyof typeof values] || values.javascript;
  return langValues[Math.floor(Math.random() * langValues.length)];
};

const getRandomCondition = (): string => {
  const conditions = ['x > 0', 'isValid', 'count < 10', 'user !== null', 'data.length > 0'];
  return conditions[Math.floor(Math.random() * conditions.length)];
};

const getRandomArrayName = (): string => {
  const names = ['items', 'data', 'results', 'list', 'array', 'collection'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomPropertyName = (): string => {
  const names = ['name', 'id', 'value', 'type', 'status', 'count', 'length'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomAsyncFunctionName = (): string => {
  const names = ['fetchData', 'loadUser', 'processRequest', 'saveData', 'updateRecord'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomObjectName = (): string => {
  const names = ['user', 'config', 'data', 'options', 'settings', 'response'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomModuleName = (): string => {
  const names = ['utils', 'helpers', 'constants', 'types', 'api', 'services'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomPackageName = (): string => {
  const names = ['react', 'lodash', 'axios', 'moment', 'express', 'mongoose'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomClassName = (): string => {
  const names = ['User', 'Config', 'Data', 'Service', 'Manager', 'Handler'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomFieldName = (): string => {
  const names = ['id', 'name', 'email', 'status', 'created', 'updated'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomHeader = (): string => {
  const headers = ['stdio.h', 'stdlib.h', 'string.h', 'math.h', 'time.h'];
  return headers[Math.floor(Math.random() * headers.length)];
};

const getRandomMessage = (): string => {
  const messages = ['"Hello World"', '"Welcome"', '"Success"', '"Error occurred"'];
  return messages[Math.floor(Math.random() * messages.length)];
};

const getRandomDecorator = (): string => {
  const decorators = ['property', 'staticmethod', 'classmethod', 'abstractmethod'];
  return decorators[Math.floor(Math.random() * decorators.length)];
};

const getRandomExpression = (): string => {
  const expressions = ['x * 2', 'x + 1', 'x > 0', 'x % 2 == 0'];
  return expressions[Math.floor(Math.random() * expressions.length)];
};

const getRandomListName = (): string => {
  const names = ['items', 'data', 'results', 'values', 'numbers'];
  return names[Math.floor(Math.random() * names.length)];
};

const getRandomIterableName = (): string => {
  const names = ['items', 'data', 'list', 'array', 'collection'];
  return names[Math.floor(Math.random() * names.length)];
};
