import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  UsersIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

import { ArrowUpIcon } from '@heroicons/react/24/outline';

interface CommunityAnalytics {
  residents: {
    total: number;
    active: number;
    newThisMonth: number;
  };
  issues: {
    total: number;
    open: number;
    resolved: number;
    pending: number;
  };
  services: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
  };
  events: {
    total: number;
    upcoming: number;
    thisMonth: number;
    avgAttendance: number;
  };
  trends: {
    issuesThisMonth: number;
    servicesThisMonth: number;
    eventsThisMonth: number;
    residentGrowth: number;
  };
}

interface CommunityStatsProps {
  communityId: string;
}

const CommunityStats: React.FC<CommunityStatsProps> = ({ communityId }) => {
  const [analytics, setAnalytics] = useState<CommunityAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [communityId, timeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/pg-analytics/${communityId}/analytics`, {
        params: { timeframe },
        withCredentials: true
      });
      setAnalytics(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={loadAnalytics}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statCards = [
    {
      title: 'Total Residents',
      value: analytics.residents.total,
      subtitle: `${analytics.residents.active} active`,
      icon: UsersIcon,
      color: 'blue',
      trend: analytics.trends.residentGrowth,
    },
    {
      title: 'Active Issues',
      value: analytics.issues.open,
      subtitle: `${analytics.issues.resolved} resolved`,
      icon: ExclamationTriangleIcon,
      color: 'red',
      trend: analytics.trends.issuesThisMonth,
    },
    {
      title: 'Service Requests',
      value: analytics.services.pending + analytics.services.inProgress,
      subtitle: `${analytics.services.completed} completed`,
      icon: WrenchScrewdriverIcon,
      color: 'yellow',
      trend: analytics.trends.servicesThisMonth,
    },
    {
      title: 'Upcoming Events',
      value: analytics.events.upcoming,
      subtitle: `${analytics.events.thisMonth} this month`,
      icon: CalendarIcon,
      color: 'green',
      trend: analytics.trends.eventsThisMonth,
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-100',
      red: 'text-red-600 bg-red-100',
      yellow: 'text-yellow-600 bg-yellow-100',
      green: 'text-green-600 bg-green-100',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Statistics</h2>
          <p className="text-gray-600 mt-1">Overview of your community performance</p>
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(Number(e.target.value))}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const colorClasses = getColorClasses(card.color);

          return (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${colorClasses}`}>
                  <Icon className="h-6 w-6" />
                </div>
                {card.trend !== 0 && (
                  <div className={`flex items-center text-sm ${card.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <ArrowUpIcon className={`h-4 w-4 mr-1 ${card.trend < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(card.trend)}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">{card.title}</h3>
                <p className="text-2xl font-semibold text-gray-900 mt-1">{card.value}</p>
                <p className="text-sm text-gray-600 mt-1">{card.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Issues Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Issues Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Issues</span>
              <span className="font-semibold">{analytics.issues.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Open</span>
              <span className="text-red-600 font-semibold">{analytics.issues.open}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="text-yellow-600 font-semibold">{analytics.issues.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Resolved</span>
              <span className="text-green-600 font-semibold">{analytics.issues.resolved}</span>
            </div>
          </div>
        </div>

        {/* Services Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Requests</span>
              <span className="font-semibold">{analytics.services.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Pending</span>
              <span className="text-red-600 font-semibold">{analytics.services.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">In Progress</span>
              <span className="text-yellow-600 font-semibold">{analytics.services.inProgress}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Completed</span>
              <span className="text-green-600 font-semibold">{analytics.services.completed}</span>
            </div>
          </div>
        </div>

        {/* Events Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Events Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Events</span>
              <span className="font-semibold">{analytics.events.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Upcoming</span>
              <span className="text-blue-600 font-semibold">{analytics.events.upcoming}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">This Month</span>
              <span className="text-green-600 font-semibold">{analytics.events.thisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg Attendance</span>
              <span className="font-semibold">{analytics.events.avgAttendance}%</span>
            </div>
          </div>
        </div>

        {/* Residents Breakdown */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Residents Overview</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Residents</span>
              <span className="font-semibold">{analytics.residents.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active</span>
              <span className="text-green-600 font-semibold">{analytics.residents.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">New This Month</span>
              <span className="text-blue-600 font-semibold">{analytics.residents.newThisMonth}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityStats;