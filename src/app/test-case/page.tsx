'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { languages } from '@/lib/languages';
import { generateTest } from '@/lib/algorithms/testGenerator';
import { trackKeywordUsage, analyzeTypingPerformance, saveSessionResults } from '@/lib/algorithms/performanceAnalyzer';
import { loadKeywordStats, saveKeywordStats, loadSessionHistory, saveSessionHistory } from '@/lib/storage/localStorage';
import { KeywordStats, SessionResult, Performance } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Play, Square, RotateCcw, Target, Clock, Zap } from 'lucide-react';

interface TypingState {
  isActive: boolean;
  currentText: string;
  userInput: string;
  currentIndex: number;
  startTime: Date | null;
  errors: number;
  wpm: number;
  accuracy: number;
}

export default function TestCasePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testDuration, setTestDuration] = useState(60);
  const [state, setState] = useState<TypingState>({
    isActive: false,
    currentText: '',
    userInput: '',
    currentIndex: 0,
    startTime: null,
    errors: 0,
    wpm: 0,
    accuracy: 0
  });
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(testDuration);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate test text when component mounts or language changes
  useEffect(() => {
    generateTestText();
  }, [selectedLanguage]);

  // Sync textarea with display text
  useEffect(() => {
    if (inputRef.current && state.currentText) {
      // Ensure textarea has the same styling as the display text
      const textarea = inputRef.current;
      textarea.style.fontSize = '18px';
      textarea.style.lineHeight = '1.6';
      textarea.style.padding = '24px';
      textarea.style.fontFamily = 'JetBrains Mono, monospace';
    }
  }, [state.currentText]);

  // Timer countdown
  useEffect(() => {
    if (state.isActive && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTestComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.isActive, timeRemaining]);

  const generateTestText = useCallback(() => {
    try {
      const testOptions = {
        language: selectedLanguage,
        duration: testDuration,
        difficulty: 'medium' as const,
        mode: {
          type: 'custom' as const,
          language: selectedLanguage,
          duration: testDuration
        }
      };
      
      const testText = generateTest(testOptions);
      setState(prev => ({
        ...prev,
        currentText: testText,
        userInput: '',
        currentIndex: 0,
        errors: 0,
        wpm: 0,
        accuracy: 0
      }));
      setPerformances([]);
      setIsCompleted(false);
      setTestResults(null);
    } catch (error) {
      console.error('Error generating test:', error);
    }
  }, [selectedLanguage, testDuration]);

  const startTest = () => {
    if (!state.currentText) {
      generateTestText();
    }
    
    setState(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date(),
      userInput: '',
      currentIndex: 0,
      errors: 0,
      wpm: 0,
      accuracy: 0
    }));
    setTimeRemaining(testDuration);
    setIsCompleted(false);
    setTestResults(null);
    
    // Focus the input field
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(0, 0);
      }
    }, 100);
  };

  const stopTest = () => {
    setState(prev => ({ ...prev, isActive: false }));
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resetTest = () => {
    setState(prev => ({
      ...prev,
      isActive: false,
      userInput: '',
      currentIndex: 0,
      errors: 0,
      wpm: 0,
      accuracy: 0
    }));
    setTimeRemaining(testDuration);
    setIsCompleted(false);
    setTestResults(null);
    setPerformances([]);
  };

  const handleTestComplete = async () => {
    if (!state.startTime) return;

    const endTime = new Date();
    const duration = (endTime.getTime() - state.startTime.getTime()) / 1000;
    const wordsTyped = state.userInput.trim().split(/\s+/).length;
    const wpm = Math.round((wordsTyped / duration) * 60);
    const accuracy = state.currentText.length > 0 
      ? Math.round(((state.currentText.length - state.errors) / state.currentText.length) * 100)
      : 0;

    const results = {
      wpm,
      accuracy,
      errors: state.errors,
      duration: Math.round(duration),
      language: selectedLanguage
    };

    setTestResults(results);
    setState(prev => ({ ...prev, isActive: false, wpm, accuracy }));
    setIsCompleted(true);

    // Save session results
    try {
      const sessionResult: SessionResult = {
        id: Date.now().toString(),
        date: new Date(),
        language: selectedLanguage,
        duration: Math.round(duration),
        wpm,
        accuracy,
        keywordPerformance: [] // We'll implement proper keyword performance tracking later
      };

      saveSessionResults(sessionResult, performances);
    } catch (error) {
      console.error('Error saving session results:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!state.isActive) return;

    const input = e.target.value;
    const targetText = state.currentText;
    let newIndex = 0;
    let errors = 0;

    // Calculate current position and errors
    for (let i = 0; i < input.length; i++) {
      if (i < targetText.length) {
        if (input[i] === targetText[i]) {
          newIndex = i + 1;
        } else {
          errors++;
        }
      } else {
        errors++;
      }
    }

    // Calculate WPM and accuracy
    const currentTime = new Date();
    const elapsed = state.startTime ? (currentTime.getTime() - state.startTime.getTime()) / 1000 : 0;
    const wordsTyped = input.trim().split(/\s+/).length;
    const wpm = elapsed > 0 ? Math.round((wordsTyped / elapsed) * 60) : 0;
    const accuracy = targetText.length > 0 
      ? Math.round(((targetText.length - errors) / targetText.length) * 100)
      : 0;

    setState(prev => ({
      ...prev,
      userInput: input,
      currentIndex: newIndex,
      errors,
      wpm,
      accuracy
    }));

    // Track keyword performance
    if (input.length > 0) {
      const performance: Performance = {
        keyword: targetText[newIndex - 1] || '',
        correct: input[input.length - 1] === targetText[input.length - 1],
        speed: elapsed > 0 ? (input.length / elapsed) * 1000 : 0,
        timestamp: currentTime
      };
      
      setPerformances(prev => [...prev, performance]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      stopTest();
    }
  };

  const renderTextWithHighlighting = () => {
    const targetText = state.currentText;
    const userInput = state.userInput;
    
    return targetText.split('').map((char, index) => {
      let className = 'text-gray-400'; // Default: not yet typed
      
      if (index < userInput.length) {
        if (char === userInput[index]) {
          className = 'text-green-500 bg-green-100 dark:bg-green-900'; // Correct
        } else {
          className = 'text-red-500 bg-red-100 dark:bg-red-900'; // Incorrect
        }
      } else if (index === userInput.length) {
        className = 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900'; // Current character
      }
      
      return (
        <span 
          key={index} 
          className={className}
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '18px',
            lineHeight: '1.6',
            display: 'inline',
            margin: '0',
            padding: '0',
            letterSpacing: '0px',
            textIndent: '0px',
            textAlign: 'left'
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex flex-col">
      {/* Compact Header with Stats */}
      <header className="border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-black/95 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Left side - Navigation */}
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  Home
                </Button>
              </Link>
              <Link href="/stats">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                  Stats
                </Button>
              </Link>
              <ThemeToggle />
            </div>

            {/* Center - Test Controls */}
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <Button
                  onClick={startTest}
                  disabled={state.isActive}
                  size="sm"
                  className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  <Play className="mr-1 h-3 w-3" />
                  {state.isActive ? 'Running...' : 'Start'}
                </Button>
                <Button
                  onClick={stopTest}
                  disabled={!state.isActive}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <Square className="h-3 w-3" />
                </Button>
                <Button
                  onClick={resetTest}
                  disabled={state.isActive}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
              
              {/* Language and Duration Selectors */}
              <div className="flex gap-2">
                <select 
                  value={selectedLanguage} 
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="text-xs p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black text-black dark:text-white"
                >
                  {languages.map(lang => (
                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                  ))}
                </select>
                <select 
                  value={testDuration} 
                  onChange={(e) => setTestDuration(parseInt(e.target.value))}
                  className="text-xs p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-black text-black dark:text-white"
                >
                  <option value="30">30s</option>
                  <option value="60">1m</option>
                  <option value="120">2m</option>
                </select>
              </div>
            </div>

            {/* Right side - Stats Boxes */}
            <div className="flex gap-3">
              {/* WPM Box */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-center min-w-[60px]">
                <div className="text-lg font-bold text-black dark:text-white">{state.wpm}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">WPM</div>
              </div>
              
              {/* Accuracy Box */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-center min-w-[60px]">
                <div className="text-lg font-bold text-black dark:text-white">{state.accuracy}%</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
              </div>
              
              {/* Errors Box */}
              <div className="bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-lg text-center min-w-[60px]">
                <div className="text-lg font-bold text-black dark:text-white">{state.errors}</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Errors</div>
              </div>
              
              {/* Time Box */}
              <div className={`px-3 py-2 rounded-lg text-center min-w-[60px] ${
                timeRemaining <= 10 ? 'bg-red-100 dark:bg-red-900' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                <div className={`text-lg font-bold ${
                  timeRemaining <= 10 ? 'text-red-600 dark:text-red-400' : 'text-black dark:text-white'
                }`}>
                  {timeRemaining}s
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Time</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Full Page Typing Interface */}
      <main className="flex-1 flex flex-col">
        {/* Test Results Banner */}
        {testResults && (
          <div className="bg-green-50 dark:bg-green-900 border-b border-green-200 dark:border-green-800 px-4 py-3">
            <div className="container mx-auto">
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-700 dark:text-green-300">Test Completed!</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-700 dark:text-green-300">WPM:</span>
                  <span className="font-bold text-green-800 dark:text-green-200">{testResults.wpm}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-700 dark:text-green-300">Accuracy:</span>
                  <span className="font-bold text-green-800 dark:text-green-200">{testResults.accuracy}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-700 dark:text-green-300">Errors:</span>
                  <span className="font-bold text-green-800 dark:text-green-200">{testResults.errors}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Screen Text Area */}
        <div className="flex-1 relative">
          {/* Text Display with Overlay */}
          <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900">
            <div 
              className="h-full overflow-y-auto"
              style={{ 
                padding: '24px',
                margin: '0',
                boxSizing: 'border-box'
              }}
            >
              <div 
                className="font-mono whitespace-pre-wrap"
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '18px',
                  lineHeight: '1.6',
                  padding: '0px',
                  margin: '0',
                  letterSpacing: '0px',
                  textIndent: '0px',
                  textAlign: 'left',
                  wordWrap: 'normal',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {renderTextWithHighlighting()}
              </div>
            </div>
          </div>
          
          {/* Overlay Input Field */}
          <div className="absolute inset-0">
            <textarea
              ref={inputRef}
              value={state.userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={state.isActive ? "Start typing..." : "Click 'Start' to begin"}
              disabled={!state.isActive}
              className="w-full h-full border-0 resize-none focus:outline-none bg-transparent caret-yellow-500 whitespace-pre-wrap text-gray-600 dark:text-gray-400"
              style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                background: 'transparent',
                caretColor: '#eab308',
                fontSize: '18px',
                lineHeight: '1.6',
                padding: '24px',
                margin: '0',
                boxSizing: 'border-box',
                letterSpacing: '0px',
                textIndent: '0px',
                textAlign: 'left',
                border: 'none',
                outline: 'none',
                resize: 'none',
                overflow: 'hidden',
                wordWrap: 'normal',
                whiteSpace: 'pre-wrap'
              }}
            />
          </div>
        </div>

        {/* Instructions Footer */}
        <div className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <div className="container mx-auto">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-600 dark:text-gray-400">
              <span>• Press <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">Esc</kbd> to stop</span>
              <span>• Focus on accuracy first, then speed</span>
              <span>• Test auto-ends when time runs out</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
