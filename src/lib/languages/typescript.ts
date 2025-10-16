import { Language, CodePattern } from '@/types';

export const typescriptKeywords = [
  // All JavaScript keywords plus TypeScript specific
  'interface', 'type', 'enum', 'namespace', 'implements', 'extends', 'public', 'private', 'protected', 'readonly',
  'string', 'number', 'boolean', 'void', 'any', 'unknown', 'never', 'undefined', 'null',
  'keyof', 'typeof', 'infer', 'extends', 'as', 'satisfies', 'const', 'asserts',
  'declare', 'module', 'global', 'export', 'import', 'from', 'default',
  'Array', 'Promise', 'Record', 'Partial', 'Required', 'Pick', 'Omit', 'Exclude', 'Extract',
  'ReturnType', 'Parameters', 'ConstructorParameters', 'InstanceType', 'ThisParameterType',
  'NonNullable', 'Uppercase', 'Lowercase', 'Capitalize', 'Uncapitalize'
];

export const typescriptPatterns: CodePattern[] = [
  {
    template: 'interface {InterfaceName} {\n  {property}: {type};\n}',
    keywords: ['interface'],
    difficulty: 'medium',
    description: 'Interface definition'
  },
  {
    template: 'type {TypeName} = {type} | {otherType};',
    keywords: ['type', '='],
    difficulty: 'medium',
    description: 'Type alias'
  },
  {
    template: 'class {ClassName} implements {InterfaceName} {\n  private {property}: {type};\n}',
    keywords: ['class', 'implements', 'private'],
    difficulty: 'hard',
    description: 'Class with interface implementation'
  },
  {
    template: 'const {variable}: {type} = {value};',
    keywords: ['const', ':', '='],
    difficulty: 'easy',
    description: 'Typed variable declaration'
  },
  {
    template: 'function {functionName}({param}: {type}): {returnType} {\n  return {result};\n}',
    keywords: ['function', ':', 'return'],
    difficulty: 'medium',
    description: 'Typed function'
  },
  {
    template: 'const {variable} = {value} as {type};',
    keywords: ['const', '=', 'as'],
    difficulty: 'medium',
    description: 'Type assertion'
  },
  {
    template: 'enum {EnumName} {\n  {VALUE1} = \'{value1}\',\n  {VALUE2} = \'{value2}\'\n}',
    keywords: ['enum', '='],
    difficulty: 'medium',
    description: 'Enum definition'
  },
  {
    template: 'type {GenericType}<T extends {constraint}> = {\n  [K in keyof T]: T[K];\n};',
    keywords: ['type', 'extends', 'keyof'],
    difficulty: 'hard',
    description: 'Generic type with constraints'
  }
];

export const typescriptLanguage: Language = {
  id: 'typescript',
  name: 'TypeScript',
  keywords: typescriptKeywords,
  patterns: typescriptPatterns
};
