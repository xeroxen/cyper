'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';
import { ArrowRight, Target, Brain, BarChart3, Code, Clock, Zap } from 'lucide-react';

export default function Home() {
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

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black dark:text-white mb-6">
            Master Programming Typing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            A specialized typing practice app designed for programmers. Improve your speed and accuracy with programming languages, syntax, and real code patterns.
          </p>
          <Link href="/practice">
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-8 py-3 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="text-xl font-semibold text-black dark:text-white">Adaptive Learning</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Our algorithm identifies your weak keywords and creates personalized practice sessions to improve them faster.
            </p>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Brain className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="text-xl font-semibold text-black dark:text-white">Spaced Repetition</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Uses proven spaced repetition techniques to help you retain programming syntax and keywords long-term.
            </p>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Code className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              <h3 className="text-xl font-semibold text-black dark:text-white">Real Code Patterns</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Practice with realistic code snippets instead of random text. Learn to type actual programming constructs.
            </p>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-8 w-8 text-orange-600 dark:text-orange-400 mr-3" />
              <h3 className="text-xl font-semibold text-black dark:text-white">Progress Tracking</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed analytics show your improvement over time, keyword mastery levels, and areas that need attention.
            </p>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-yellow-600 dark:text-yellow-400 mr-3" />
              <h3 className="text-xl font-semibold text-black dark:text-white">Multiple Languages</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Support for JavaScript, TypeScript, Python, C, and more. Each language has its own keyword set and patterns.
            </p>
          </Card>

          <Card className="p-6 bg-white border-gray-200 shadow-sm dark:bg-black dark:border-gray-800">
            <div className="flex items-center mb-4">
              <Clock className="h-8 w-8 text-red-600 dark:text-red-400 mr-3" />
              <h3 className="text-xl font-semibold text-black dark:text-white">Flexible Sessions</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Practice for 30 seconds, 1 minute, or 2 minutes. Perfect for quick breaks or focused practice sessions.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Choose Your Language</h3>
              <p className="text-gray-600 dark:text-gray-400">Select from JavaScript, TypeScript, Python, C, or other programming languages.</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Practice & Learn</h3>
              <p className="text-gray-600 dark:text-gray-400">Type realistic code snippets while our algorithm tracks your performance.</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-black dark:text-white mb-2">Improve Continuously</h3>
              <p className="text-gray-600 dark:text-gray-400">Get personalized practice sessions based on your weak areas and progress.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}