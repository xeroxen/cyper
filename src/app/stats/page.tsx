'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeToggle } from '@/components/theme-toggle';
import { loadSessionHistory, loadKeywordStats } from '@/lib/storage/localStorage';
import { getSpacedRepetitionStats, getReviewSchedule } from '@/lib/algorithms/spacedRepetition';
import { SessionResult, KeywordStats } from '@/types';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

export default function StatsPage() {
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [keywordStats, setKeywordStats] = useState<KeywordStats[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [timeRange, setTimeRange] = useState('30'); // days

  useEffect(() => {
    const sessionData = loadSessionHistory();
    const keywordData = loadKeywordStats();
    
    setSessions(sessionData);
    setKeywordStats(keywordData);
  }, []);

  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.date);
    const cutoffDate = new Date(Date.now() - parseInt(timeRange) * 24 * 60 * 60 * 1000);
    return sessionDate >= cutoffDate;
  });

  const languageStats = keywordStats.filter(stat => stat.language === selectedLanguage);
  const spacedRepStats = getSpacedRepetitionStats(selectedLanguage);
  const reviewSchedule = getReviewSchedule(selectedLanguage);

  // Prepare chart data
  const wpmChartData = filteredSessions
    .filter(s => s.language === selectedLanguage)
    .map(session => ({
      date: new Date(session.date).toLocaleDateString(),
      wpm: session.wpm,
      accuracy: session.accuracy
    }))
    .slice(-20); // Last 20 sessions

  const accuracyByLanguage = sessions.reduce((acc, session) => {
    if (!acc[session.language]) {
      acc[session.language] = { total: 0, count: 0 };
    }
    acc[session.language].total += session.accuracy;
    acc[session.language].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  const languageAccuracyData = Object.entries(accuracyByLanguage).map(([language, data]) => ({
    language: language.charAt(0).toUpperCase() + language.slice(1),
    accuracy: Math.round(data.total / data.count)
  }));

  const masteryData = [
    { name: 'Mastered', value: spacedRepStats.mastered, color: '#10b981' },
    { name: 'Learning', value: spacedRepStats.learning, color: '#f59e0b' },
    { name: 'Weak', value: spacedRepStats.weak, color: '#ef4444' }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">Statistics Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400">Track your typing progress and performance</p>
            </div>
            <div className="flex gap-4">
              <Link href="/">
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
                  ← Back to Practice
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-100 border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Progress
            </TabsTrigger>
            <TabsTrigger value="keywords" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Keywords
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-black data-[state=active]:text-white">
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Overall Stats Cards */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-2">Total Sessions</h3>
                <div className="text-3xl font-bold text-black">{sessions.length}</div>
                <p className="text-sm text-gray-600">All time</p>
              </Card>

              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-2">Average WPM</h3>
                <div className="text-3xl font-bold text-black">
                  {sessions.length > 0 
                    ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length)
                    : 0
                  }
                </div>
                <p className="text-sm text-gray-600">Words per minute</p>
              </Card>

              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-2">Average Accuracy</h3>
                <div className="text-3xl font-bold text-black">
                  {sessions.length > 0 
                    ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
                    : 0
                  }%
                </div>
                <p className="text-sm text-gray-600">Typing accuracy</p>
              </Card>

              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-2">Keywords Tracked</h3>
                <div className="text-3xl font-bold text-black">{keywordStats.length}</div>
                <p className="text-sm text-gray-600">Unique keywords</p>
              </Card>
            </div>

            {/* Mastery Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">Keyword Mastery</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={masteryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {masteryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">Accuracy by Language</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="language" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#000000'
                        }}
                      />
                      <Bar dataKey="accuracy" fill="#000000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">WPM Progress Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wpmChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="date" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#ffffff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#000000'
                        }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#000000" strokeWidth={2} />
                      <Line type="monotone" dataKey="accuracy" stroke="#6b7280" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="keywords" className="mt-6">
            <div className="space-y-6">
              {/* Keyword Mastery Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-white border-gray-200 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{spacedRepStats.mastered}</div>
                    <div className="text-sm text-gray-600">Mastered</div>
                  </div>
                </Card>
                <Card className="p-4 bg-white border-gray-200 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{spacedRepStats.learning}</div>
                    <div className="text-sm text-gray-600">Learning</div>
                  </div>
                </Card>
                <Card className="p-4 bg-white border-gray-200 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{spacedRepStats.weak}</div>
                    <div className="text-sm text-gray-600">Weak</div>
                  </div>
                </Card>
              </div>

              {/* Keywords Due for Review */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">Keywords Due for Review</h3>
                <div className="space-y-2">
                  {reviewSchedule.dueToday.length > 0 ? (
                    reviewSchedule.dueToday.slice(0, 10).map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-50 border border-red-200 rounded">
                        <span className="text-black">{keyword.keyword}</span>
                        <Badge variant="destructive" className="bg-red-100 text-red-800">Due Today</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No keywords due for review today! 🎉</p>
                  )}
                </div>
              </Card>

              {/* Weak Keywords */}
              <Card className="p-6 bg-white border-gray-200 shadow-sm">
                <h3 className="text-lg font-semibold text-black mb-4">Weak Keywords</h3>
                <div className="space-y-2">
                  {reviewSchedule.weak.slice(0, 10).map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <span className="text-black">{keyword.keyword}</span>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        {Math.round(keyword.accuracy)}% accuracy
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <Card className="p-6 bg-white border-gray-200 shadow-sm">
              <h3 className="text-lg font-semibold text-black mb-4">Recent Sessions</h3>
              <div className="space-y-2">
                {filteredSessions.slice(0, 20).map((session, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <div className="flex gap-4">
                      <span className="text-gray-600">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="border-gray-300 text-gray-700">
                        {session.language}
                      </Badge>
                    </div>
                    <div className="flex gap-4">
                      <Badge variant="secondary" className="bg-black text-white">
                        {session.wpm} WPM
                      </Badge>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        {session.accuracy}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredSessions.length === 0 && (
                  <p className="text-gray-600 text-center py-8">No sessions found for the selected time range.</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
