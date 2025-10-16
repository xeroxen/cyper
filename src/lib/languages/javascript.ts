import { Language, CodePattern } from '@/types';

export const javascriptKeywords = [
  // Control flow
  'if', 'else', 'else if', 'switch', 'case', 'default', 'break', 'continue', 'return', 'throw',
  
  // Declarations
  'const', 'let', 'var', 'function', 'class', 'import', 'export', 'default', 'as', 'from',
  
  // Async
  'async', 'await', 'Promise', 'then', 'catch', 'finally', 'resolve', 'reject',
  
  // Modern syntax
  '=>', '...', '?.', '??', '??=', '||=', '&&=',
  
  // Array methods
  'map', 'filter', 'reduce', 'forEach', 'find', 'findIndex', 'some', 'every', 'includes', 
  'slice', 'splice', 'push', 'pop', 'shift', 'unshift', 'concat', 'join', 'sort', 'reverse',
  
  // Object methods
  'Object.keys', 'Object.values', 'Object.entries', 'Object.assign', 'Object.freeze', 'Object.seal',
  
  // Special
  'this', 'super', 'new', 'typeof', 'instanceof', 'in', 'delete', 'void', 'static', 'get', 'set',
  
  // Operators & symbols
  '===', '!==', '==', '!=', '&&', '||', '!', '?', ':', '++', '--', '+=', '-=', '*=', '/=', '%=',
  
  // Brackets & punctuation
  '{', '}', '[', ']', '(', ')', ';', ',', '.', '...',
  
  // Common APIs
  'console.log', 'setTimeout', 'setInterval', 'fetch', 'JSON.parse', 'JSON.stringify', 
  'localStorage', 'document.querySelector', 'addEventListener'
];

export const javascriptPatterns: CodePattern[] = [
  {
    template: 'const {variableName} = {value};',
    keywords: ['const', '='],
    difficulty: 'easy',
    description: 'Variable declaration'
  },
  {
    template: 'function {functionName}({param1}, {param2}) {\n  return {result};\n}',
    keywords: ['function', 'return'],
    difficulty: 'medium',
    description: 'Function declaration'
  },
  {
    template: 'if ({condition}) {\n  {doSomething}();\n}',
    keywords: ['if'],
    difficulty: 'easy',
    description: 'Conditional statement'
  },
  {
    template: '{array}.map(item => item.{property});',
    keywords: ['map', '=>'],
    difficulty: 'medium',
    description: 'Array mapping'
  },
  {
    template: 'try {\n  await {asyncFunction}();\n} catch (error) {\n  console.error(error);\n}',
    keywords: ['try', 'await', 'catch', 'console.error'],
    difficulty: 'hard',
    description: 'Async error handling'
  },
  {
    template: 'const {{ {prop1}, {prop2} }} = {object};',
    keywords: ['const', '='],
    difficulty: 'medium',
    description: 'Destructuring assignment'
  },
  {
    template: 'import {{ {module} }} from \'{package}\';',
    keywords: ['import', 'from'],
    difficulty: 'easy',
    description: 'ES6 import'
  },
  {
    template: 'class {ClassName} {\n  constructor({param}) {\n    this.{property} = {param};\n  }\n}',
    keywords: ['class', 'constructor', 'this'],
    difficulty: 'hard',
    description: 'Class definition'
  }
];

export const javascriptLanguage: Language = {
  id: 'javascript',
  name: 'JavaScript',
  keywords: javascriptKeywords,
  patterns: javascriptPatterns
};
