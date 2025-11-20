"use client"

import { useState, useEffect } from 'react';
import { Eye, Users, TrendingUp } from 'lucide-react';

interface VisitorStats {
  totalVisits: number;
  uniqueSessions: number;
  since: string;
  lastUpdated: string;
}

interface VisitorWidgetProps {
  className?: string;
}

export function VisitorWidget({ className = "" }: VisitorWidgetProps) {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Generate or get session ID
  useEffect(() => {
    let storedSessionId = localStorage.getItem('epri-session-id');
    if (!storedSessionId) {
      storedSessionId = generateSessionId();
      localStorage.setItem('epri-session-id', storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Track visit when component mounts
  useEffect(() => {
    if (sessionId) {
      trackVisit();
    }
  }, [sessionId]);

  // Fetch stats
  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const generateSessionId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const trackVisit = async () => {
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/visitor-stats/track`, {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://epri.developteam.site:5000'}/api/visitor-stats/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId
        }),
      });

      if (!response.ok) {
        console.warn('Failed to track visit:', response.statusText);
      }
    } catch (error) {
      console.warn('Error tracking visit:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002'}/api/visitor-stats/stats`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://epri.developteam.site:5000'}/api/visitor-stats/stats`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setStats(result.data);
          setError('');
        } else {
          setError(result.message || 'Failed to fetch stats');
        }
      } else {
        setError('Failed to fetch stats');
      }
    } catch (error) {
      setError('Connection error');
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 ${className}`}>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-emerald-300 rounded-full animate-pulse"></div>
          <span className="text-sm text-muted-foreground">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className={`bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900 dark:to-gray-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 ${className}`}>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Visitor statistics unavailable</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950 rounded-lg p-4 border border-emerald-200 dark:border-emerald-800 ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            Website Statistics
          </h3>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Visits */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Eye className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-muted-foreground">Total Visits</span>
            </div>
            <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">
              {formatNumber(stats.totalVisits)}
            </div>
          </div>

          {/* Unique Sessions */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="w-3 h-3 text-teal-600 dark:text-teal-400" />
              <span className="text-xs text-muted-foreground">Unique Visitors</span>
            </div>
            <div className="text-lg font-bold text-teal-700 dark:text-teal-300">
              {formatNumber(stats.uniqueSessions)}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Since {formatDate(stats.since)}</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}