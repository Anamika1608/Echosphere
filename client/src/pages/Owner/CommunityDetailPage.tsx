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
  ArrowLeftIcon,
  Bars3Icon,
  XMarkIcon
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FF4500]"></div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
        <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm">
          <div className="text-red-600 text-center mb-4 text-sm">{error || 'Community not found'}</div>
          <button
            onClick={handleBackToDashboard}
            className="w-full bg-[#FF4500] text-white px-4 py-3 rounded-2xl hover:bg-[#E03E00] transition-colors text-sm font-semibold"
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
        return <CommunityResidents communityId={id} />;
    }
  };

  const getActiveTabLabel = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    return activeTabConfig?.label || 'Residents';
  };

  return (
    <div className="min-h-screen" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
      {/* Mobile Header */}
      <div className="bg-white shadow-lg shadow-black/5 border-b border-orange-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToDashboard}
                className="text-gray-600 hover:text-[#FF4500] p-2 rounded-xl hover:bg-orange-50 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{community.name}</h1>
                <p className="text-xs text-gray-500">Code: {community.pgCode}</p>
              </div>
            </div>
            
            {/* Hamburger Menu Button */}
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-[#FF4500] p-2 rounded-xl hover:bg-orange-50 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-40" onClick={toggleMenu}>
          <div className="absolute top-2 right-2 w-[96%] rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                <button
                  onClick={toggleMenu}
                  className="text-gray-700 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
              
              {/* Community Info */}
              <div className="mb-6 p-4 bg-orange-50 rounded-2xl">
                <h3 className="font-semibold text-gray-900 mb-2">{community.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{community.address}</p>
                {community.description && (
                  <p className="text-sm text-gray-500">{community.description}</p>
                )}
              </div>

              {/* Navigation Tabs */}
              <nav>
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => handleTabChange(tab.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                            activeTab === tab.id
                              ? 'bg-[#FF4500] text-white shadow-lg'
                              : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF4500]'
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
        </div>
      )}

      {/* Main Content */}
      <div className="px-4 py-6">
        {/* Current Tab Indicator */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-gray-200 shadow-md border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{getActiveTabLabel()}</h2>
                <p className="text-sm text-gray-500">Community Management</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                {(() => {
                  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabConfig?.icon || UsersIcon;
                  return <Icon className="h-6 w-6 text-[#FF4500]" />;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/50 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;