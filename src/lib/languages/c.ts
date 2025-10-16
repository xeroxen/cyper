import { Language, CodePattern } from '@/types';

export const cKeywords = [
  // Types
  'int', 'char', 'float', 'double', 'long', 'short', 'unsigned', 'signed', 'void', 'size_t', 'bool', '_Bool',
  
  // Type qualifiers
  'const', 'static', 'extern', 'register', 'volatile', 'auto', 'inline',
  
  // Control flow
  'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return', 'goto',
  
  // Loops
  'for', 'while', 'do',
  
  // Struct/Union
  'struct', 'union', 'enum', 'typedef',
  
  // Pointers
  '*', '&', '->', 'NULL', 'sizeof',
  
  // Memory management
  'malloc', 'calloc', 'realloc', 'free', 'memset', 'memcpy', 'memmove',
  
  // Preprocessor
  '#include', '#define', '#ifdef', '#ifndef', '#endif', '#pragma', '#undef',
  
  // Standard I/O
  'printf', 'scanf', 'fprintf', 'fscanf', 'fopen', 'fclose', 'fgets', 'fputs', 'getchar', 'putchar',
  
  // String functions
  'strlen', 'strcpy', 'strncpy', 'strcat', 'strncat', 'strcmp', 'strncmp', 'strchr', 'strstr',
  
  // Math functions
  'abs', 'sqrt', 'pow', 'sin', 'cos', 'tan', 'log', 'exp', 'ceil', 'floor',
  
  // Operators & symbols
  '==', '!=', '<', '>', '<=', '>=', '&&', '||', '!', '&', '|', '^', '~', '<<', '>>', '++', '--', '+=', '-=', '*=', '/=', '%=',
  
  // Brackets & punctuation
  '{', '}', '[', ']', '(', ')', ';', ',', '.', '->', '::'
];

export const cPatterns: CodePattern[] = [
  {
    template: 'int {functionName}(int {param1}, char* {param2}) {\n    if ({condition}) {\n        return {result};\n    }\n}',
    keywords: ['int', 'if', 'return'],
    difficulty: 'medium',
    description: 'Function with conditional'
  },
  {
    template: 'for (int {i} = 0; {i} < {n}; {i}++) {\n    {array}[{i}] = {value};\n}',
    keywords: ['for', 'int', '++'],
    difficulty: 'medium',
    description: 'For loop with array assignment'
  },
  {
    template: 'struct {StructName} {\n    int {field1};\n    char* {field2};\n};',
    keywords: ['struct'],
    difficulty: 'medium',
    description: 'Struct definition'
  },
  {
    template: 'int* {ptr} = (int*)malloc(sizeof(int) * {size});',
    keywords: ['int*', '=', 'malloc', 'sizeof'],
    difficulty: 'hard',
    description: 'Dynamic memory allocation'
  },
  {
    template: 'if ({ptr} != NULL) {\n    free({ptr});\n    {ptr} = NULL;\n}',
    keywords: ['if', '!=', 'NULL', 'free'],
    difficulty: 'medium',
    description: 'Memory deallocation check'
  },
  {
    template: '#include <{header}>\n\nint main() {\n    printf("{message}\\n");\n    return 0;\n}',
    keywords: ['#include', 'int', 'main', 'printf', 'return'],
    difficulty: 'easy',
    description: 'Basic C program structure'
  },
  {
    template: 'char {buffer}[{size}];\nstrcpy({buffer}, {source});',
    keywords: ['char', 'strcpy'],
    difficulty: 'medium',
    description: 'String buffer and copy'
  },
  {
    template: 'typedef struct {\n    int {field1};\n    char {field2};\n} {TypeName};',
    keywords: ['typedef', 'struct'],
    difficulty: 'hard',
    description: 'Typedef struct'
  }
];

export const cLanguage: Language = {
  id: 'c',
  name: 'C',
  keywords: cKeywords,
  patterns: cPatterns
};
