import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CommunityStats from '../../app/components/PgAnalytics/CommunityStats';
import CommunityResidents from '../../app/components/PgAnalytics/CommunityResidents';
import CommunityIssues from '../../app/components/PgAnalytics/CommunityIssues';
import CommunityServices from '../../app/components/PgAnalytics/CommunityServices';
import CommunityEvents from '../../app/components/PgAnalytics/CommunityEvents';
import CommunityTechnicians from '../../app/components/PgAnalytics/CommunityTechnicians';
import {
  ChartBarIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon,
  CalendarIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import type { PgCommunity } from '../../types/pgCommunity';
import { serverUrl } from '@/utils';

type TabType = 'stats' | 'residents' | 'issues' | 'services' | 'events' | 'technicians';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabConfig[] = [
  // { id: 'stats', label: 'Statistics', icon: ChartBarIcon },
  { id: 'residents', label: 'Residents', icon: UsersIcon },
  { id: 'issues', label: 'Raised Issues', icon: ExclamationTriangleIcon },
  { id: 'services', label: 'Requested Services', icon: WrenchScrewdriverIcon },
  { id: 'events', label: 'Events', icon: CalendarIcon },
  { id: 'technicians', label: 'Technicians', icon: WrenchScrewdriverIcon },

];

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('residents');
  const [community, setCommunity] = useState<PgCommunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadCommunityData();
    }
  }, [id]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/pg-community/${id}`, { withCredentials: true });
      setCommunity(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard/owner');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error || 'Community not found'}</div>
          <button
            onClick={handleBackToDashboard}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    if (!id) return null;

    switch (activeTab) {
      case 'stats':
        return <CommunityStats communityId={id} />;
      case 'residents':
        return <CommunityResidents communityId={id} />;
      case 'issues':
        return <CommunityIssues communityId={id} />;
      case 'services':
        return <CommunityServices communityId={id} />;
      case 'events':
        return <CommunityEvents communityId={id} />;
      case 'technicians':
        return <CommunityTechnicians communityId={id} />;
      default:
        return <CommunityStats communityId={id} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-gray-900 flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Dashboard
              </button>
              <span className="text-gray-400">|</span>
              <h1 className="text-xl font-semibold text-gray-900">{community.name}</h1>
              <span className="text-sm text-gray-500">({community.pgCode})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Community Info */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900 mb-2">{community.name}</h2>
                <p className="text-sm text-gray-600 mb-2">{community.address}</p>
                {community.description && (
                  <p className="text-sm text-gray-500">{community.description}</p>
                )}
              </div>

              {/* Navigation */}
              <nav className="p-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                          <Icon className="h-5 w-5" />
                          {tab.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;