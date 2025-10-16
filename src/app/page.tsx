'use client';

import React, { useState, useEffect } from 'react';
import { TypingTest } from '@/components/typing/TypingTest';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    theme: 'dark'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">Cyper</h1>
              <p className="text-gray-400">Programmer Typing Practice</p>
            </div>
            <div className="flex gap-4">
              <Link href="/stats">
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  View Stats
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                onClick={() => {
                  const newTheme = settings.theme === 'dark' ? 'light' : 'dark';
                  handleSettingsChange({ theme: newTheme });
                }}
              >
                {settings.theme === 'dark' ? '☀️' : '🌙'} Theme
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800 border-gray-700">
            <TabsTrigger value="practice" className="data-[state=active]:bg-blue-600">
              Practice
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600">
              Settings
            </TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-blue-600">
              About
            </TabsTrigger>
          </TabsList>

          <TabsContent value="practice" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Controls Sidebar */}
              <div className="lg:col-span-1">
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <h3 className="text-lg font-semibold mb-4 text-blue-400">Test Configuration</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Programming Language
                      </label>
                      <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          {languages.map(lang => (
                            <SelectItem key={lang.id} value={lang.id} className="text-white hover:bg-gray-700">
                              {lang.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Test Duration
                      </label>
                      <Select value={testDuration.toString()} onValueChange={(value) => setTestDuration(parseInt(value))}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="30" className="text-white hover:bg-gray-700">30 seconds</SelectItem>
                          <SelectItem value="60" className="text-white hover:bg-gray-700">1 minute</SelectItem>
                          <SelectItem value="120" className="text-white hover:bg-gray-700">2 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="text-sm font-medium text-gray-300 mb-2">Quick Stats</h4>
                      <div className="space-y-2 text-sm text-gray-400">
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
                  <Card className="p-4 mb-6 bg-green-900/20 border-green-500">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Test Completed!</h3>
                    <div className="flex gap-4">
                      <Badge variant="secondary" className="bg-green-600 text-white">
                        WPM: {testResults.wpm}
                      </Badge>
                      <Badge variant="secondary" className="bg-green-600 text-white">
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
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Font Size
                  </label>
                  <Select 
                    value={settings.fontSize} 
                    onValueChange={(value: 'small' | 'medium' | 'large') => 
                      handleSettingsChange({ fontSize: value })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="small" className="text-white hover:bg-gray-700">Small</SelectItem>
                      <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium</SelectItem>
                      <SelectItem value="large" className="text-white hover:bg-gray-700">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Default Test Duration
                  </label>
                  <Select 
                    value={settings.testDuration.toString()} 
                    onValueChange={(value) => 
                      handleSettingsChange({ testDuration: parseInt(value) as 30 | 60 | 120 })
                    }
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="30" className="text-white hover:bg-gray-700">30 seconds</SelectItem>
                      <SelectItem value="60" className="text-white hover:bg-gray-700">1 minute</SelectItem>
                      <SelectItem value="120" className="text-white hover:bg-gray-700">2 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="soundEnabled"
                    checked={settings.soundEnabled}
                    onChange={(e) => handleSettingsChange({ soundEnabled: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700 text-blue-600"
                  />
                  <label htmlFor="soundEnabled" className="text-sm font-medium text-gray-300">
                    Enable sound effects
                  </label>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">About Cyper</h3>
              
              <div className="space-y-4 text-gray-300">
                <p>
                  Cyper is a specialized typing practice application designed specifically for programmers. 
                  Unlike general typing practice apps, Cyper focuses on programming languages, syntax, 
                  and common coding patterns.
                </p>
                
                <h4 className="text-lg font-semibold text-blue-400">Key Features:</h4>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adaptive learning algorithm that focuses on your weak keywords</li>
                  <li>Spaced repetition system for long-term retention</li>
                  <li>Support for JavaScript, TypeScript, Python, and C</li>
                  <li>Real-time performance tracking and analytics</li>
                  <li>Weekly comprehensive review sessions</li>
                  <li>Realistic code snippet generation</li>
                </ul>

                <h4 className="text-lg font-semibold text-blue-400">How it works:</h4>
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
