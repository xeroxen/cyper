import { Language } from '@/types';
import { javascriptLanguage } from './javascript';
import { typescriptLanguage } from './typescript';
import { pythonLanguage } from './python';
import { cLanguage } from './c';

export const languages: Language[] = [
  javascriptLanguage,
  typescriptLanguage,
  pythonLanguage,
  cLanguage
];

export const getLanguageById = (id: string): Language | undefined => {
  return languages.find(lang => lang.id === id);
};

export const getLanguageKeywords = (languageId: string): string[] => {
  const language = getLanguageById(languageId);
  return language ? language.keywords : [];
};

export const getLanguagePatterns = (languageId: string) => {
  const language = getLanguageById(languageId);
  return language ? language.patterns : [];
};
