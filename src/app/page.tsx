'use client';

import React, { useState, useEffect } from 'react';
import { TypingTest } from '@/components/typing/TypingTest';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { languages } from '@/lib/languages';
import { loadUserSettings, saveUserSettings } from '@/lib/storage/localStorage';
import { UserSettings } from '@/types';
import Link from 'next/link';

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [testDuration, setTestDuration] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
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

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Cyper</h1>
              <p className="text-gray-600 dark:text-gray-400">Programmer Typing Practice</p>
            </div>
            <div className="flex gap-4">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger value="practice" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
              Practice
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
              Settings
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-black data-[state=active]:text-white dark:data-[state=active]:bg-white dark:data-[state=active]:text-black">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-4 bg-white border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Test Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Programming Language
                      </label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="bg-white border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                          {languages.map(lang => (
                            <SelectItem key={lang.id} value={lang.id} className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700">
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
                        <SelectTrigger className="bg-white border-gray-300 text-black dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                          <SelectItem value="30" className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700">30 seconds</SelectItem>
                          <SelectItem value="60" className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700">1 minute</SelectItem>
                          <SelectItem value="120" className="text-black hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700">2 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Stats</h4>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        <div>Language: {languages.find(l => l.id === selectedLanguage)?.name}</div>
                        <div>Duration: {testDuration}s</div>
                        <div>Mode: Adaptive Practice</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Main Test Area */}
              <div className="lg:col-span-3">
                {testResults && (
                  <Card className="p-4 mb-6 bg-green-50 border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Test Completed!</h3>
                    <div className="flex gap-4">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        WPM: {testResults.wpm}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                        Accuracy: {testResults.accuracy}%
                      </Badge>
                    </div>
                  </Card>
                )}

                <TypingTest
                  language={selectedLanguage}
                  duration={testDuration}
                  onTestStart={handleTestStart}
                  onTestStop={handleTestStop}
                  onTestComplete={handleTestComplete}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="p-6 bg-white border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-black">Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <Select 
                    value={settings.fontSize} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      handleSettingsChange({ fontSize: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="small" className="text-black hover:bg-gray-50">Small</SelectItem>
                      <SelectItem value="medium" className="text-black hover:bg-gray-50">Medium</SelectItem>
                      <SelectItem value="large" className="text-black hover:bg-gray-50">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Default Test Duration
                  </label>
                  <Select 
                    value={settings.testDuration.toString()} 
                    onValueChange={(value) => 
                      handleSettingsChange({ testDuration: parseInt(value) as 30 | 60 | 120 })
                    }
                  >
                    <SelectTrigger className="bg-white border-gray-300 text-black">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200">
                      <SelectItem value="30" className="text-black hover:bg-gray-50">30 seconds</SelectItem>
                      <SelectItem value="60" className="text-black hover:bg-gray-50">1 minute</SelectItem>
                      <SelectItem value="120" className="text-black hover:bg-gray-50">2 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="soundEnabled"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleSettingsChange({ soundEnabled: e.target.checked })}
                    className="rounded border-gray-300 bg-white text-black"
                  />
                  <label htmlFor="soundEnabled" className="text-sm font-medium text-gray-700">
                    Enable sound effects
                  </label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="p-6 bg-white border-gray-200 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-black">About Cyper</h3>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  Cyper is a specialized typing practice application designed specifically for programmers. 
                  Unlike general typing practice apps, Cyper focuses on programming languages, syntax, 
                  and common coding patterns.
                </p>
                
                <h4 className="text-lg font-semibold text-black">Key Features:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adaptive learning algorithm that focuses on your weak keywords</li>
                  <li>Spaced repetition system for long-term retention</li>
                  <li>Support for JavaScript, TypeScript, Python, and C</li>
                  <li>Real-time performance tracking and analytics</li>
                  <li>Weekly comprehensive review sessions</li>
                  <li>Realistic code snippet generation</li>
                </ul>

                <h4 className="text-lg font-semibold text-black">How it works:</h4>
                <p>
                  The app tracks your performance on individual keywords and programming concepts. 
                  It uses a hybrid algorithm combining frequency-based practice (showing weak keywords more often) 
                  with spaced repetition (scheduling reviews based on forgetting curves) to optimize your learning.
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
