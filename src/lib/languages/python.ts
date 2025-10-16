import { Language, CodePattern } from '@/types';

export const pythonKeywords = [
  // Control flow
  'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass', 'return', 'yield', 'raise',
  
  // Declarations
  'def', 'class', 'lambda', 'global', 'nonlocal', 'import', 'from', 'as',
  
  // Exception handling
  'try', 'except', 'finally', 'raise', 'assert', 'with',
  
  // Boolean/Logic
  'True', 'False', 'None', 'and', 'or', 'not', 'is', 'in',
  
  // Built-in types
  'int', 'float', 'str', 'list', 'tuple', 'dict', 'set', 'frozenset', 'bool', 'bytes', 'bytearray',
  
  // Built-in functions
  'print', 'len', 'range', 'enumerate', 'zip', 'map', 'filter', 'sorted', 'reversed', 'sum', 'min', 'max', 'abs', 'round', 'isinstance', 'type', 'open', 'input',
  
  // List methods
  'append', 'extend', 'insert', 'remove', 'pop', 'clear', 'index', 'count', 'sort', 'reverse',
  
  // Dict methods
  'get', 'keys', 'values', 'items', 'update', 'pop', 'clear',
  
  // String methods
  'split', 'join', 'strip', 'replace', 'format', 'startswith', 'endswith', 'upper', 'lower',
  
  // Decorators
  'property', 'staticmethod', 'classmethod', 'abstractmethod',
  
  // Operators & symbols
  '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '//', '%', '**', '=', '+=', '-=', '*=', '/=',
  
  // Brackets & punctuation
  ':', ',', '.', '(', ')', '[', ']', '{', '}', '"', "'", '"""', "'''",
  
  // Keywords
  'del', 'async', 'await', 'match', 'case'
];

export const pythonPatterns: CodePattern[] = [
  {
    template: 'def {function_name}({param1}, {param2}):\n    if {condition}:\n        return {result}',
    keywords: ['def', 'if', 'return'],
    difficulty: 'medium',
    description: 'Function with conditional'
  },
  {
    template: 'for {item} in {list_name}:\n    print({item})',
    keywords: ['for', 'in', 'print'],
    difficulty: 'easy',
    description: 'For loop with print'
  },
  {
    template: 'try:\n    {result} = {some_function}()\nexcept Exception as {e}:\n    print(f"Error: {{e}}")',
    keywords: ['try', 'except', 'print'],
    difficulty: 'hard',
    description: 'Exception handling'
  },
  {
    template: 'class {ClassName}:\n    def __init__(self, {param}):\n        self.{param} = {param}',
    keywords: ['class', 'def', '__init__', 'self'],
    difficulty: 'hard',
    description: 'Class with constructor'
  },
  {
    template: '{list_name} = [{item} for {item} in {iterable} if {condition}]',
    keywords: ['for', 'in', 'if'],
    difficulty: 'medium',
    description: 'List comprehension'
  },
  {
    template: 'with open({filename}, \'r\') as {file}:\n    {content} = {file}.read()',
    keywords: ['with', 'open', 'as'],
    difficulty: 'medium',
    description: 'File handling with context manager'
  },
  {
    template: '@{decorator}\ndef {function_name}():\n    pass',
    keywords: ['@', 'def', 'pass'],
    difficulty: 'medium',
    description: 'Decorated function'
  },
  {
    template: '{result} = {lambda} {param}: {expression}',
    keywords: ['lambda'],
    difficulty: 'medium',
    description: 'Lambda function'
  }
];

export const pythonLanguage: Language = {
  id: 'python',
  name: 'Python',
  keywords: pythonKeywords,
  patterns: pythonPatterns
};
