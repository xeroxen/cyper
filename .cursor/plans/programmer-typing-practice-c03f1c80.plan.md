<!-- c03f1c80-5694-4e3b-bfae-93b2ba7e9ce3 4c64a76a-a82d-4f80-b23b-fc98f6ae2a83 -->
# Programmer Typing Practice Web App

## Architecture Overview

**Tech Stack:**

- Next.js 15 (App Router) with TypeScript
- shadcn/ui components for modern UI
- Recharts (via shadcn charts) for analytics visualization
- localStorage for data persistence
- Tailwind CSS for styling

**Core Data Models:**

```typescript
// Keyword performance tracking
interface KeywordStats {
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

// Test session results
interface SessionResult {
  id: string;
  date: Date;
  language: string;
  duration: number;
  wpm: number;
  accuracy: number;
  keywordPerformance: KeywordStats[];
}
```

## Implementation Plan

### Phase 1: Project Setup & Dependencies

Install shadcn/ui and required dependencies:

```bash
npx shadcn@latest init
npx shadcn@latest add button card select tabs progress badge chart
```

Set up project structure:

```
src/
├── app/
│   ├── page.tsx (main typing interface)
│   ├── stats/page.tsx (progress dashboard)
│   └── layout.tsx
├── components/
│   ├── typing/
│   │   ├── TypingTest.tsx (main test component)
│   │   ├── TextDisplay.tsx (shows code to type)
│   │   └── InputArea.tsx (user input handling)
│   ├── stats/
│   │   ├── WPMChart.tsx
│   │   ├── AccuracyChart.tsx
│   │   ├── KeywordHeatmap.tsx
│   │   └── ProgressOverview.tsx
│   └── ui/ (shadcn components)
├── lib/
│   ├── languages/ (keyword data)
│   │   ├── javascript.ts
│   │   ├── typescript.ts
│   │   ├── python.ts
│   │   ├── c.ts
│   │   └── index.ts
│   ├── algorithms/
│   │   ├── testGenerator.ts (hybrid frequency + spaced repetition)
│   │   ├── spacedRepetition.ts
│   │   └── performanceAnalyzer.ts
│   ├── storage/
│   │   └── localStorage.ts
│   └── utils.ts
└── types/
    └── index.ts
```

### Phase 2: Comprehensive Language Keyword Data

Create extensive keyword datasets for each language in `src/lib/languages/` with realistic code patterns:

**JavaScript/TypeScript keywords & syntax:**

- **Control flow**: `if`, `else`, `else if`, `switch`, `case`, `default`, `break`, `continue`, `return`, `throw`
- **Declarations**: `const`, `let`, `var`, `function`, `class`, `import`, `export`, `default`, `as`, `from`
- **Async**: `async`, `await`, `Promise`, `then`, `catch`, `finally`, `resolve`, `reject`
- **Modern syntax**: `=>`, `...`, `?.`, `??`, `??=`, `||=`, `&&=`, `${}`
- **Array methods**: `map`, `filter`, `reduce`, `forEach`, `find`, `findIndex`, `some`, `every`, `includes`, `slice`, `splice`, `push`, `pop`, `shift`, `unshift`, `concat`, `join`, `sort`, `reverse`
- **Object methods**: `Object.keys`, `Object.values`, `Object.entries`, `Object.assign`, `Object.freeze`, `Object.seal`
- **Types (TS)**: `interface`, `type`, `enum`, `namespace`, `implements`, `extends`, `public`, `private`, `protected`, `readonly`, `string`, `number`, `boolean`, `void`, `any`, `unknown`, `never`
- **Special**: `this`, `super`, `new`, `typeof`, `instanceof`, `in`, `delete`, `void`, `static`, `get`, `set`
- **Operators & symbols**: `===`, `!==`, `==`, `!=`, `&&`, `||`, `!`, `?`, `:`, `++`, `--`, `+=`, `-=`, `*=`, `/=`, `%=`
- **Brackets & punctuation**: `{`, `}`, `[`, `]`, `(`, `)`, `;`, `,`, `.`, `...`
- **Common APIs**: `console.log`, `setTimeout`, `setInterval`, `fetch`, `JSON.parse`, `JSON.stringify`, `localStorage`, `document.querySelector`, `addEventListener`

**Python keywords & syntax:**

- **Control flow**: `if`, `elif`, `else`, `for`, `while`, `break`, `continue`, `pass`, `return`, `yield`, `raise`
- **Declarations**: `def`, `class`, `lambda`, `global`, `nonlocal`, `import`, `from`, `as`
- **Exception handling**: `try`, `except`, `finally`, `raise`, `assert`, `with`
- **Boolean/Logic**: `True`, `False`, `None`, `and`, `or`, `not`, `is`, `in`
- **Built-in types**: `int`, `float`, `str`, `list`, `tuple`, `dict`, `set`, `frozenset`, `bool`, `bytes`, `bytearray`
- **Built-in functions**: `print`, `len`, `range`, `enumerate`, `zip`, `map`, `filter`, `sorted`, `reversed`, `sum`, `min`, `max`, `abs`, `round`, `isinstance`, `type`, `open`, `input`
- **List methods**: `.append()`, `.extend()`, `.insert()`, `.remove()`, `.pop()`, `.clear()`, `.index()`, `.count()`, `.sort()`, `.reverse()`
- **Dict methods**: `.get()`, `.keys()`, `.values()`, `.items()`, `.update()`, `.pop()`, `.clear()`
- **String methods**: `.split()`, `.join()`, `.strip()`, `.replace()`, `.format()`, `.startswith()`, `.endswith()`, `.upper()`, `.lower()`
- **Decorators**: `@property`, `@staticmethod`, `@classmethod`, `@abstractmethod`
- **Comprehensions**: `[x for x in ...]`, `{k: v for k, v in ...}`, `(x for x in ...)`
- **Operators & symbols**: `==`, `!=`, `<`, `>`, `<=`, `>=`, `+`, `-`, `*`, `/`, `//`, `%`, `**`, `=`, `+=`, `-=`, `*=`, `/=`
- **Brackets & punctuation**: `:`, `,`, `.`, `(`, `)`, `[`, `]`, `{`, `}`, `"`, `'`, `"""`, `'''`
- **Keywords**: `del`, `async`, `await`, `match`, `case`

**C keywords & syntax:**

- **Types**: `int`, `char`, `float`, `double`, `long`, `short`, `unsigned`, `signed`, `void`, `size_t`, `bool`, `_Bool`
- **Type qualifiers**: `const`, `static`, `extern`, `register`, `volatile`, `auto`, `inline`
- **Control flow**: `if`, `else`, `switch`, `case`, `default`, `break`, `continue`, `return`, `goto`
- **Loops**: `for`, `while`, `do`, `while`
- **Struct/Union**: `struct`, `union`, `enum`, `typedef`
- **Pointers**: `*`, `&`, `->`, `NULL`, `sizeof`
- **Memory management**: `malloc`, `calloc`, `realloc`, `free`, `memset`, `memcpy`, `memmove`
- **Preprocessor**: `#include`, `#define`, `#ifdef`, `#ifndef`, `#endif`, `#pragma`, `#undef`
- **Standard I/O**: `printf`, `scanf`, `fprintf`, `fscanf`, `fopen`, `fclose`, `fgets`, `fputs`, `getchar`, `putchar`
- **String functions**: `strlen`, `strcpy`, `strncpy`, `strcat`, `strncat`, `strcmp`, `strncmp`, `strchr`, `strstr`
- **Math functions**: `abs`, `sqrt`, `pow`, `sin`, `cos`, `tan`, `log`, `exp`, `ceil`, `floor`
- **Operators & symbols**: `==`, `!=`, `<`, `>`, `<=`, `>=`, `&&`, `||`, `!`, `&`, `|`, `^`, `~`, `<<`, `>>`, `++`, `--`, `+=`, `-=`, `*=`, `/=`, `%=`
- **Brackets & punctuation**: `{`, `}`, `[`, `]`, `(`, `)`, `;`, `,`, `.`, `->`, `::`

**C++ additional keywords** (if adding C++):

- `class`, `public`, `private`, `protected`, `virtual`, `override`, `final`, `namespace`, `using`, `template`, `typename`, `new`, `delete`, `try`, `catch`, `throw`, `this`, `std::`, `vector`, `string`, `map`, `cout`, `cin`, `endl`

**Java keywords** (if adding Java):

- `public`, `private`, `protected`, `class`, `interface`, `implements`, `extends`, `abstract`, `final`, `static`, `void`, `String`, `int`, `boolean`, `new`, `this`, `super`, `try`, `catch`, `throw`, `throws`, `System.out.println`, `ArrayList`, `HashMap`, `@Override`, `@Deprecated`

### Phase 2.5: Realistic Code Pattern Generation

Instead of just random keyword placement, generate **actual code snippets** that look like real programming:

**Pattern Templates by Language:**

**JavaScript patterns:**

```javascript
const variableName = value;
function functionName(param1, param2) { return result; }
if (condition) { doSomething(); }
array.map(item => item.property);
try { await fetch(url); } catch (error) { console.error(error); }
const { prop1, prop2 } = object;
import { module } from 'package';
```

**Python patterns:**

```python
def function_name(param1, param2):
    if condition:
        return result
    
for item in list_name:
    print(item)
    
try:
    result = some_function()
except Exception as e:
    print(f"Error: {e}")
    
class ClassName:
    def __init__(self, param):
        self.param = param
```

**C patterns:**

```c
int functionName(int param1, char* param2) {
    if (condition) {
        return result;
    }
}

for (int i = 0; i < n; i++) {
    array[i] = value;
}

struct StructName {
    int field1;
    char* field2;
};

int* ptr = (int*)malloc(sizeof(int) * size);
```

**Code snippet generator should:**

- Use realistic variable/function names (not just "foo", "bar")
- Include proper indentation and spacing
- Mix keywords with common syntax patterns
- Create logical code blocks (not random keywords)
- Include comments occasionally (`//` for JS/C, `#` for Python)
- Vary complexity based on difficulty level

### Phase 3: Core Typing Test Component

**TypingTest.tsx** - Main test interface:

- Display code snippet with syntax highlighting (color-coded keywords)
- Real-time input comparison
- Visual feedback: correct (green), incorrect (red), current character
- Track WPM, accuracy, time elapsed
- Keyboard event handling with proper preventDefault
- End test automatically when completed

**Algorithm Integration:**

- On test start: Generate text using hybrid algorithm
- During test: Track per-keyword accuracy and speed
- On test end: Update localStorage stats, calculate next review dates

### Phase 4: Hybrid Learning Algorithm

**testGenerator.ts** - Main test generation:

```typescript
function generateTest(language: string, difficulty: 'easy' | 'medium' | 'hard'): string {
  // 1. Get keywords due for review (spaced repetition)
  const dueKeywords = getKeywordsDueForReview(language);
  
  // 2. Get weak keywords from recent sessions (frequency-based)
  const weakKeywords = getWeakKeywords(language);
  
  // 3. Mix with random keywords for variety
  const allKeywords = getLanguageKeywords(language);
  
  // 4. Weight distribution: 40% due, 40% weak, 20% random
  const selectedKeywords = weightedSelection(dueKeywords, weakKeywords, allKeywords);
  
  // 5. Generate realistic code patterns
  return generateCodeSnippet(selectedKeywords, language);
}
```

**spacedRepetition.ts** - Review scheduling:

```typescript
function calculateNextReview(keyword: KeywordStats, correct: boolean): Date {
  const baseIntervals = [1, 3, 7, 14, 30]; // days
  
  if (correct) {
    // Increase interval
    const newInterval = Math.min(keyword.reviewInterval * 2, 30);
    return addDays(new Date(), newInterval);
  } else {
    // Reset to 1 day
    return addDays(new Date(), 1);
  }
}

function getKeywordsDueForReview(language: string): KeywordStats[] {
  const stats = loadFromLocalStorage();
  const now = new Date();
  
  return stats.filter(k => 
    k.language === language && 
    k.nextReview <= now
  );
}
```

**Weekly recap system:**

- Every 7 days, automatically schedule a comprehensive review test
- Include a sample of ALL keywords (good and bad) for retention check
- Store `lastFullReview` date in localStorage

### Phase 5: localStorage Data Management

**localStorage.ts** - Data persistence:

```typescript
const STORAGE_KEYS = {
  KEYWORD_STATS: 'typing_keyword_stats',
  SESSION_HISTORY: 'typing_sessions',
  USER_SETTINGS: 'typing_settings',
  LAST_REVIEW: 'typing_last_full_review'
};

function updateKeywordStats(keyword: string, language: string, performance: Performance) {
  const stats = loadKeywordStats();
  const existing = stats.find(k => k.keyword === keyword && k.language === language);
  
  if (existing) {
    // Update accuracy, speed, attempts
    existing.accuracy = calculateNewAccuracy(existing, performance);
    existing.lastPracticed = new Date();
    existing.nextReview = calculateNextReview(existing, performance.correct);
  } else {
    // Create new entry
    stats.push(createNewKeywordStat(keyword, language, performance));
  }
  
  localStorage.setItem(STORAGE_KEYS.KEYWORD_STATS, JSON.stringify(stats));
}
```

### Phase 6: Statistics Dashboard

**Stats page** (`src/app/stats/page.tsx`) with shadcn charts:

1. **Overall Performance Card**

   - Current WPM average
   - Overall accuracy percentage
   - Total practice time
   - Tests completed

2. **WPM Progress Chart** (Line chart)

   - X-axis: Date
   - Y-axis: WPM
   - Show trend over last 30 days

3. **Accuracy by Language** (Bar chart)

   - Compare performance across JavaScript, Python, C, etc.

4. **Keyword Mastery Heatmap**

   - Grid showing all keywords color-coded by mastery level
   - Green (mastered), Yellow (learning), Red (weak)
   - Click to see detailed stats for each keyword

5. **Recent Weak Keywords List**

   - Table with keyword, language, accuracy, next review date
   - "Practice Now" button to start targeted test

6. **Session History**

   - Last 10 sessions with date, language, WPM, accuracy
   - Expandable to see per-keyword breakdown

### Phase 7: UI/UX Polish

**Design principles:**

- Dark theme optimized for coding aesthetic
- Monospace font for code display (JetBrains Mono or Fira Code)
- Smooth animations for feedback
- Keyboard shortcuts (e.g., ESC to restart, Tab to skip)
- Responsive design for different screen sizes

**Main page layout:**

- Top: Language selector, difficulty selector, settings icon
- Center: Large typing test area with clear visual feedback
- Bottom: Live stats (WPM, Accuracy, Time)
- Sidebar: Quick stats preview, "View Full Stats" button

**Color coding:**

- Correct characters: green/emerald
- Incorrect characters: red with shake animation
- Current character: yellow/amber highlight
- Upcoming text: muted gray

### Phase 8: Additional Features

1. **Settings panel:**

   - Toggle sound effects
   - Font size adjustment
   - Test duration preferences (30s, 60s, 120s)
   - Reset all data option

2. **Test modes:**

   - Quick test (30 seconds, mixed keywords)
   - Focused practice (specific weak keywords only)
   - Weekly recap (comprehensive review)
   - Custom (user selects language and duration)

3. **Achievements/Milestones:**

   - First 50 WPM
   - 95% accuracy streak
   - Master 50 keywords
   - 30-day practice streak

## Testing Strategy

- Test localStorage save/load functionality
- Verify algorithm generates appropriate keyword distribution
- Ensure accuracy and WPM calculations are correct
- Test edge cases (empty localStorage, corrupted data)
- Verify spaced repetition scheduling works correctly

## Deployment

Build and deploy to Vercel (or similar):

```bash
npm run build
npm start
```

No backend required - fully client-side application.

### To-dos

- [ ] Initialize shadcn/ui and install required components (button, card, select, tabs, progress, badge, chart)
- [ ] Set up project directory structure with components/, lib/, and types/ folders
- [ ] Create keyword datasets for JavaScript, TypeScript, Python, and C in lib/languages/
- [ ] Define TypeScript interfaces for KeywordStats, SessionResult, and other data models
- [ ] Implement localStorage wrapper functions for saving/loading keyword stats and session history
- [ ] Build spaced repetition algorithm with review interval calculation and due keyword filtering
- [ ] Implement hybrid test generation algorithm (frequency-based + spaced repetition)
- [ ] Create main TypingTest component with real-time input comparison, visual feedback, and WPM/accuracy tracking
- [ ] Implement performance analyzer to track per-keyword accuracy, speed, and update stats after each test
- [ ] Build main page with language selector, test area, and live stats display
- [ ] Create statistics dashboard page with WPM charts, accuracy visualization, and keyword heatmap using shadcn charts
- [ ] Implement weekly comprehensive review system that schedules full keyword recap every 7 days
- [ ] Apply dark theme, animations, color coding, and responsive design polish
- [ ] Add settings panel with preferences (sound, font size, test duration) and test modes