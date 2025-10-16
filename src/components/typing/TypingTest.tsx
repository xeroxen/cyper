'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TypingState, Performance, TestGenerationOptions } from '@/types';
import { generateTest } from '@/lib/algorithms/testGenerator';
import { trackKeywordUsage, analyzeTypingPerformance, saveSessionResults } from '@/lib/algorithms/performanceAnalyzer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface TypingTestProps {
  language: string;
  duration: number;
  onTestComplete: (results: any) => void;
  onTestStart: () => void;
  onTestStop: () => void;
}

export const TypingTest: React.FC<TypingTestProps> = ({
  language,
  duration,
  onTestComplete,
  onTestStart,
  onTestStop
}) => {
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
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate test text when component mounts or language changes
  useEffect(() => {
    generateTestText();
  }, [language]);

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

  const generateTestText = async () => {
    const options: TestGenerationOptions = {
      language,
      difficulty: 'medium',
      mode: { type: 'quick' },
      duration
    };
    
    const testText = generateTest(options);
    setState(prev => ({
      ...prev,
      currentText: testText,
      userInput: '',
      currentIndex: 0,
      errors: 0,
      wpm: 0,
      accuracy: 0
    }));
  };

  const startTest = () => {
    setState(prev => ({
      ...prev,
      isActive: true,
      startTime: new Date()
    }));
    setTimeRemaining(duration);
    setIsCompleted(false);
    setPerformances([]);
    onTestStart();
    
    // Focus the input
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const stopTest = () => {
    setState(prev => ({
      ...prev,
      isActive: false
    }));
    onTestStop();
  };

  const handleTestComplete = () => {
    if (isCompleted) return;
    
    setIsCompleted(true);
    setState(prev => ({
      ...prev,
      isActive: false
    }));

    // Analyze performance
    const analysis = analyzeTypingPerformance(state, performances);
    
    // Create session result
    const sessionResult = {
      id: Date.now().toString(),
      date: new Date(),
      language,
      duration: duration - timeRemaining,
      wpm: analysis.wpm,
      accuracy: analysis.accuracy,
      keywordPerformance: analysis.keywordStats
    };

    // Save results
    saveSessionResults(sessionResult, performances);
    
    onTestComplete(analysis);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!state.isActive || isCompleted) return;

    const newInput = e.target.value;
    const newIndex = newInput.length;
    
    // Track keyword usage
    const newPerformances = trackKeywordUsage(state.currentText, newInput, language);
    setPerformances(newPerformances);

    // Calculate real-time stats
    const currentTime = Date.now();
    const elapsed = state.startTime ? (currentTime - state.startTime.getTime()) / 1000 : 1;
    const wpm = Math.round((newInput.length / 5) / (elapsed / 60));
    const accuracy = calculateAccuracy(newInput, state.currentText);

    // Count errors
    let errors = 0;
    for (let i = 0; i < Math.min(newInput.length, state.currentText.length); i++) {
      if (newInput[i] !== state.currentText[i]) {
        errors++;
      }
    }

    setState(prev => ({
      ...prev,
      userInput: newInput,
      currentIndex: newIndex,
      wpm,
      accuracy,
      errors
    }));

    // Check if test is complete
    if (newInput.length >= state.currentText.length) {
      handleTestComplete();
    }
  };

  const calculateAccuracy = (input: string, target: string): number => {
    if (target.length === 0) return 100;
    
    const minLength = Math.min(input.length, target.length);
    let correctChars = 0;
    
    for (let i = 0; i < minLength; i++) {
      if (input[i] === target[i]) {
        correctChars++;
      }
    }
    
    return Math.round((correctChars / target.length) * 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      stopTest();
    }
  };

  const resetTest = () => {
    setState(prev => ({
      ...prev,
      isActive: false,
      userInput: '',
      currentIndex: 0,
      startTime: null,
      errors: 0,
      wpm: 0,
      accuracy: 0
    }));
    setTimeRemaining(duration);
    setIsCompleted(false);
    setPerformances([]);
    generateTestText();
  };

  const renderTextWithHighlighting = () => {
    const { currentText, userInput, currentIndex } = state;
    const chars = currentText.split('');
    
    return chars.map((char, index) => {
      let className = 'text-gray-400'; // Default: not typed yet
      
      if (index < userInput.length) {
        // Already typed
        if (userInput[index] === char) {
          className = 'text-green-500'; // Correct
        } else {
          className = 'text-red-500'; // Incorrect
        }
      } else if (index === userInput.length) {
        // Current character
        className = 'text-yellow-400 bg-yellow-100 dark:bg-yellow-900'; // Current
      }
      
      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
        {/* Test Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <Button
              onClick={startTest}
              disabled={state.isActive}
              className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {state.isActive ? 'Test Running...' : 'Start Test'}
            </Button>
            <Button
              onClick={stopTest}
              disabled={!state.isActive}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Stop Test
            </Button>
            <Button
              onClick={resetTest}
              disabled={state.isActive}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              Reset
            </Button>
          </div>
          
          <div className="text-right">
            <div className="text-2xl font-bold text-black dark:text-white">
              {timeRemaining}s
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round((state.currentIndex / state.currentText.length) * 100)}%</span>
          </div>
          <Progress 
            value={(state.currentIndex / state.currentText.length) * 100} 
            className="h-2"
          />
        </div>

        {/* Live Stats */}
        {state.isActive && (
          <div className="flex gap-6 mb-6">
            <Badge variant="secondary" className="text-lg">
              WPM: {state.wpm}
            </Badge>
            <Badge variant="secondary" className="text-lg">
              Accuracy: {state.accuracy}%
            </Badge>
            <Badge variant="secondary" className="text-lg">
              Errors: {state.errors}
            </Badge>
          </div>
        )}

        {/* Text Display */}
        <div className="mb-6">
          <div className="bg-gray-50 dark:bg-black p-4 rounded-lg border-2 border-gray-200 dark:border-gray-800 min-h-[200px]">
            <div className="font-mono text-lg leading-relaxed whitespace-pre-wrap">
              {renderTextWithHighlighting()}
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="mb-4">
          <textarea
            ref={inputRef}
            value={state.userInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={state.isActive ? "Start typing..." : "Click 'Start Test' to begin"}
            disabled={!state.isActive}
            className="w-full h-32 p-4 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-mono text-lg resize-none focus:outline-none focus:border-black dark:focus:border-white disabled:bg-gray-100 dark:disabled:bg-gray-900 bg-white dark:bg-black text-black dark:text-white"
            style={{ fontFamily: 'JetBrains Mono, monospace' }}
          />
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <p>• Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-800 rounded">Esc</kbd> to stop the test</p>
          <p>• Focus on accuracy first, then speed</p>
          <p>• The test will automatically end when time runs out or text is completed</p>
        </div>
      </Card>
    </div>
  );
};
