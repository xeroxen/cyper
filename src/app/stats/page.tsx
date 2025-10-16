'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-400">Statistics Dashboard</h1>
              <p className="text-gray-400">Track your typing progress and performance</p>
            </div>
            <Link href="/">
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                ← Back to Practice
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-blue-600">
              Progress
            </TabsTrigger>
            <TabsTrigger value="keywords" className="data-[state=active]:bg-blue-600">
              Keywords
            </TabsTrigger>
            <TabsTrigger value="sessions" className="data-[state=active]:bg-blue-600">
              Sessions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Overall Stats Cards */}
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Total Sessions</h3>
                <div className="text-3xl font-bold text-white">{sessions.length}</div>
                <p className="text-sm text-gray-400">All time</p>
              </Card>

              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Average WPM</h3>
                <div className="text-3xl font-bold text-white">
                  {sessions.length > 0 
                    ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length)
                    : 0
                  }
                </div>
                <p className="text-sm text-gray-400">Words per minute</p>
              </Card>

              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Average Accuracy</h3>
                <div className="text-3xl font-bold text-white">
                  {sessions.length > 0 
                    ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
                    : 0
                  }%
                </div>
                <p className="text-sm text-gray-400">Typing accuracy</p>
              </Card>

              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Keywords Tracked</h3>
                <div className="text-3xl font-bold text-white">{keywordStats.length}</div>
                <p className="text-sm text-gray-400">Unique keywords</p>
              </Card>
            </div>

            {/* Mastery Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Keyword Mastery</h3>
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

              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Accuracy by Language</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={languageAccuracyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="language" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#ffffff'
                        }}
                      />
                      <Bar dataKey="accuracy" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="mt-6">
            <div className="space-y-6">
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">WPM Progress Over Time</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wpmChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '6px',
                          color: '#ffffff'
                        }}
                      />
                      <Line type="monotone" dataKey="wpm" stroke="#3b82f6" strokeWidth={2} />
                      <Line type="monotone" dataKey="accuracy" stroke="#10b981" strokeWidth={2} />
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
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{spacedRepStats.mastered}</div>
                    <div className="text-sm text-gray-400">Mastered</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{spacedRepStats.learning}</div>
                    <div className="text-sm text-gray-400">Learning</div>
                  </div>
                </Card>
                <Card className="p-4 bg-gray-800 border-gray-700">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{spacedRepStats.weak}</div>
                    <div className="text-sm text-gray-400">Weak</div>
                  </div>
                </Card>
              </div>

              {/* Keywords Due for Review */}
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Keywords Due for Review</h3>
                <div className="space-y-2">
                  {reviewSchedule.dueToday.length > 0 ? (
                    reviewSchedule.dueToday.slice(0, 10).map((keyword, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-red-900/20 border border-red-500/30 rounded">
                        <span className="text-white">{keyword.keyword}</span>
                        <Badge variant="destructive">Due Today</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No keywords due for review today! 🎉</p>
                  )}
                </div>
              </Card>

              {/* Weak Keywords */}
              <Card className="p-6 bg-gray-800 border-gray-700">
                <h3 className="text-lg font-semibold text-blue-400 mb-4">Weak Keywords</h3>
                <div className="space-y-2">
                  {reviewSchedule.weak.slice(0, 10).map((keyword, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-yellow-900/20 border border-yellow-500/30 rounded">
                      <span className="text-white">{keyword.keyword}</span>
                      <Badge variant="secondary" className="bg-yellow-600">
                        {Math.round(keyword.accuracy)}% accuracy
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sessions" className="mt-6">
            <Card className="p-6 bg-gray-800 border-gray-700">
              <h3 className="text-lg font-semibold text-blue-400 mb-4">Recent Sessions</h3>
              <div className="space-y-2">
                {filteredSessions.slice(0, 20).map((session, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded border border-gray-600">
                    <div className="flex gap-4">
                      <span className="text-gray-400">
                        {new Date(session.date).toLocaleDateString()}
                      </span>
                      <Badge variant="outline" className="border-gray-500 text-gray-300">
                        {session.language}
                      </Badge>
                    </div>
                    <div className="flex gap-4">
                      <Badge variant="secondary" className="bg-blue-600">
                        {session.wpm} WPM
                      </Badge>
                      <Badge variant="secondary" className="bg-green-600">
                        {session.accuracy}%
                      </Badge>
                    </div>
                  </div>
                ))}
                {filteredSessions.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No sessions found for the selected time range.</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
