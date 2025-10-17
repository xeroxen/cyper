'use client';

import React, { useState, useEffect } from 'react';
import { TypingTest } from '@/components/typing/TypingTest';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/theme-toggle';
import { languages } from '@/lib/languages';
import { loadUserSettings, saveUserSettings } from '@/lib/storage/localStorage';
import { UserSettings } from '@/types';
import Link from 'next/link';
import { ArrowLeft, Play, X, Target, Clock, Code, Brain } from 'lucide-react';

export default function PracticePage() {
  const [currentView, setCurrentView] = useState<'setup' | 'practice' | 'modal'>('setup');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testDuration, setTestDuration] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    soundEnabled: true,
    fontSize: 'medium',
    testDuration: 60,
    theme: 'light'
  });

  useEffect(() => {
    const savedSettings = loadUserSettings();
    setSettings(savedSettings);
    setTestDuration(savedSettings.testDuration);
  }, []);

  const handleTestStart = () => {
    setIsTestActive(true);
    setTestResults(null);
    setShowStartModal(false);
    setCurrentView('practice');
  };

  const handleTestStop = () => {
    setIsTestActive(false);
  };

  const handleTestComplete = (results: any) => {
    setIsTestActive(false);
    setTestResults(results);
  };

  const handleSettingsChange = (newSettings: Partial<UserSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    saveUserSettings(updatedSettings);
    
    if (newSettings.testDuration) {
      setTestDuration(newSettings.testDuration);
    }
  };

  const handleReady = () => {
    setShowStartModal(true);
    setCurrentView('modal');
  };

  const handleStartPractice = () => {
    setCurrentView('practice');
    handleTestStart();
  };

  const handleBackToSetup = () => {
    setCurrentView('setup');
    setShowStartModal(false);
  };

  const handleBackToHome = () => {
    setCurrentView('setup');
    setShowStartModal(false);
  };

  // Setup Section
  if (currentView === 'setup') {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">Cyper</h1>
                <p className="text-gray-600 dark:text-gray-400">Programmer Typing Practice</p>
              </div>
              <div className="flex gap-4">
                <Link href="/">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Home
                  </Button>
                </Link>
                <Link href="/stats">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                    View Stats
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Setup Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Practice Setup</h1>
              <p className="text-gray-600 dark:text-gray-400">Configure your practice session and see what you'll be working on</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Configuration */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Test Configuration
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Programming Language
                    </label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="bg-white border-gray-300 text-black dark:bg-black dark:border-gray-700 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 dark:bg-black dark:border-gray-800">
                        {languages.map(lang => (
                          <SelectItem key={lang.id} value={lang.id} className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-900">
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Test Duration
                    </label>
                    <Select value={testDuration.toString()} onValueChange={(value) => setTestDuration(parseInt(value))}>
                      <SelectTrigger className="bg-white border-gray-300 text-black dark:bg-black dark:border-gray-700 dark:text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 dark:bg-black dark:border-gray-800">
                        <SelectItem value="30" className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-900">30 seconds</SelectItem>
                        <SelectItem value="60" className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-900">1 minute</SelectItem>
                        <SelectItem value="120" className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-900">2 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Stats</h4>
                    <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      <div>Language: {languages.find(l => l.id === selectedLanguage)?.name}</div>
                      <div>Duration: {testDuration}s</div>
                      <div>Mode: Adaptive Practice</div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* What You'll Practice */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center">
                  <Code className="mr-2 h-5 w-5" />
                  What You'll Practice
                </h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-medium text-black dark:text-white mb-2">Keywords & Syntax</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Practice typing programming keywords, operators, and syntax specific to {languages.find(l => l.id === selectedLanguage)?.name}.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-medium text-black dark:text-white mb-2">Real Code Patterns</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Type realistic code snippets that you'd actually write in your projects.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-medium text-black dark:text-white mb-2">Adaptive Focus</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Our algorithm will focus on keywords you struggle with to maximize improvement.
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button 
                    onClick={handleReady}
                    size="lg" 
                    className="w-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    Ready?
                    <Play className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </Card>

              {/* Algorithm Info */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-6 flex items-center">
                  <Brain className="mr-2 h-5 w-5" />
                  How It Works
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-black dark:text-white text-sm">Spaced Repetition</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Keywords you've struggled with are scheduled for review</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 dark:bg-green-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-green-600 dark:text-green-400">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-black dark:text-white text-sm">Frequency Analysis</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Recent weak areas get more practice time</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-black dark:text-white text-sm">Real Code Generation</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Practice with realistic programming patterns</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Session Type:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        Adaptive
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-600 dark:text-gray-400">Focus:</span>
                      <span className="text-black dark:text-white">Weak Keywords</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Start Modal
  if (currentView === 'modal') {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">Cyper</h1>
                <p className="text-gray-600 dark:text-gray-400">Programmer Typing Practice</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Modal Content */}
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card className="p-8 bg-white border-gray-200 shadow-lg dark:bg-black dark:border-gray-800">
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <Play className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                
                <h2 className="text-2xl font-bold text-black dark:text-white mb-4">Ready to Start?</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You're about to start a {testDuration}-second practice session in {languages.find(l => l.id === selectedLanguage)?.name}.
                </p>
                
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Language:</span>
                    <span className="text-black dark:text-white">{languages.find(l => l.id === selectedLanguage)?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="text-black dark:text-white">{testDuration} seconds</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Mode:</span>
                    <span className="text-black dark:text-white">Adaptive Practice</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToSetup}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleStartPractice}
                    className="flex-1 bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Start
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Practice Section
  if (currentView === 'practice') {
    return (
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-black/80">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-black dark:text-white">Cyper</h1>
                <p className="text-gray-600 dark:text-gray-400">Programmer Typing Practice</p>
              </div>
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleBackToHome}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Setup
                </Button>
                <Link href="/stats">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                    View Stats
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Practice Content */}
        <main className="container mx-auto px-4 py-8">
          {isTestActive ? (
            <TypingTest
              language={selectedLanguage}
              duration={testDuration}
              onTestComplete={handleTestComplete}
              onTestStart={handleTestStart}
              onTestStop={handleTestStop}
            />
          ) : (
            <div className="text-center">
              <h1 className="text-3xl font-bold text-black dark:text-white mb-4">Practice Session</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {languages.find(l => l.id === selectedLanguage)?.name} • {testDuration} seconds
              </p>
              <Button 
                onClick={handleStartPractice}
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-3 text-lg"
              >
                Start Practice
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </div>
          )}
        </main>
      </div>
    );
  }

  return null;
}
