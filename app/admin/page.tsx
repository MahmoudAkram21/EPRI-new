'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react';
import { apiClient } from '@/lib/api';

interface AdminStats {
  totalUsers: number;
  totalEvents: number;
  totalEventRequests: number;
  pendingRequests: number;
  verifiedUsers: number;
  recentEvents: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await apiClient.getAdminStats();
      setStats(response.stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Total Events',
      value: stats?.totalEvents || 0,
      change: '+8.2%',
      trend: 'up',
      icon: Calendar,
      color: 'green',
    },
    {
      title: 'Event Requests',
      value: stats?.totalEventRequests || 0,
      change: '-3.1%',
      trend: 'down',
      icon: FileText,
      color: 'orange',
    },
    {
      title: 'Pending Requests',
      value: stats?.pendingRequests || 0,
      change: '+5.7%',
      trend: 'up',
      icon: Activity,
      color: 'red',
    },
  ];

  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={`h-4 w-4 text-${card.color}-500`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {card.trend === 'up' ? (
                    <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={card.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                    {card.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Verified Users</CardTitle>
            <CardDescription>Number of verified users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{stats?.verifiedUsers || 0}</div>
            <p className="text-sm text-gray-500 mt-2">
              {stats && stats.totalUsers > 0 
                ? `${Math.round((stats.verifiedUsers / stats.totalUsers) * 100)}% of total users`
                : 'No users yet'
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Number of events scheduled in the future</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{stats?.recentEvents || 0}</div>
            <p className="text-sm text-gray-500 mt-2">
              Events scheduled for future dates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <a href="/admin/events?action=create">
                <Calendar className="h-8 w-8 mb-2" />
                <span>Create Event</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <a href="/admin/users">
                <Users className="h-8 w-8 mb-2" />
                <span>Manage Users</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col" asChild>
              <a href="/admin/requests">
                <FileText className="h-8 w-8 mb-2" />
                <span>View Requests</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
