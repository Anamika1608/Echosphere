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
  description: string;
}

const tabs: TabConfig[] = [
  { id: 'residents', label: 'Residents', icon: UsersIcon, description: 'Manage community residents' },
  { id: 'issues', label: 'Raised Issues', icon: ExclamationTriangleIcon, description: 'Track and resolve issues' },
  { id: 'services', label: 'Requested Services', icon: WrenchScrewdriverIcon, description: 'Service requests management' },
  { id: 'events', label: 'Events', icon: CalendarIcon, description: 'Community events and activities' },
  { id: 'technicians', label: 'Technicians', icon: WrenchScrewdriverIcon, description: 'Technician management' },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const tabVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const contentVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

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
      <div 
        className="min-h-screen flex justify-center items-center px-4"
        style={{ 
          backgroundImage: `url(${bgimage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center px-4"
        style={{ 
          backgroundImage: `url(${bgimage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div 
          className="rounded-2xl p-8 w-full max-w-md text-center"
          style={{
            background: '#F4F4F4',
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
            border: '8px solid rgba(255,255,255,0.95)'
          }}
        >
          <div className="text-gray-600 mb-6 text-base font-medium">{error || 'Community not found'}</div>
          <button
            onClick={handleBackToDashboard}
            className="w-full text-white px-6 py-4 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 text-base font-semibold"
            style={{
              borderRadius: "12px",
              border: "1.26px solid #FFAA67",
              background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
              boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
            }}
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

  const getActiveTabDescription = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    return activeTabConfig?.description || 'Manage community residents';
  };

  return (
    <div 
      className="min-h-screen"
      style={{ 
        backgroundImage: 'linear-gradient(180deg, #D8B4FE 1.09%, #C4A1FF 18.47%, #B794F6 28.25%, #9F7AEA 47.26%, #9F7AEA 70.08%, #C4A1FF 93.44%, #D8B4FE 111.91%)'
      }}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen">
        {/* Desktop Sidebar */}
        <div 
          className="w-80 flex flex-col shadow-2xl border-r relative overflow-hidden"
          style={{
            background: '#F4F4F4',
            borderColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)'
          }}
        >
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)"
            }}
          />
          
          {/* Sidebar Header */}
          <div className="relative z-10 p-8 border-b border-gray-200/30">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-3 text-gray-600 hover:text-orange-500 p-3 rounded-xl hover:bg-orange-50/50 transition-all duration-300 mb-6 group"
            >
              <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            
            <div>
              <h1 className="text-3xl font-bold tracking-tighter text-gray-900 mb-3">{community.name}</h1>
              <div 
                className="inline-block px-4 py-2 rounded-xl mb-4"
                style={{
                  background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                  boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
                }}
              >
                <p className="text-sm font-semibold text-white">Code: {community.pgCode}</p>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed font-light mb-3">{community.address}</p>
              {community.description && (
                <p className="text-sm text-gray-500 leading-relaxed font-light bg-white/50 p-4 rounded-xl">{community.description}</p>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="relative z-10 flex-1 p-6">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Community Management</h2>
            <ul className="space-y-3">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-4 px-6 py-4 font-medium rounded-xl transition-all duration-300 group ${
                        activeTab === tab.id
                          ? 'text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50 hover:scale-102'
                      }`}
                      style={activeTab === tab.id ? {
                        borderRadius: "12px",
                        border: "1.26px solid #FFAA67",
                        background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                        boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
                      } : {}}
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-light">{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="relative z-10 p-6 border-t border-gray-200/30">
            <div 
              className="rounded-xl p-6"
              style={{ 
                background: '#F4F4F4',
                boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                border: '2px solid rgba(255,255,255,0.95)'
              }}
            >
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-light">Active Management Portal</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-600 font-medium">Online</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Desktop Header */}
          <div 
            className="px-8 py-8 shadow-lg border-b"
            style={{
              background: '#F4F4F4',
              borderColor: 'rgba(255,255,255,0.95)',
              boxShadow: '0 15px 30px rgba(0,0,0,0.12)'
            }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-gray-900 mb-4 leading-tight">
                  {getActiveTabLabel()} for{' '}
                  <span className="text-orange-400">{community.name}</span>
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                  A comprehensive approach to <strong className="font-bold">Community Management</strong>. Making 
                  <strong className="font-bold"> operations seamless</strong> and resident experience effortless.
                </p>
              </div>

              <div className="flex justify-center">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center"
                  style={{
                    borderRadius: "15px",
                    background: '#F4F4F4',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                    border: '8px solid rgba(255,255,255,0.95)'
                  }}
                >
                  {(() => {
                    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                    const Icon = activeTabConfig?.icon || UsersIcon;
                    return <Icon className="h-10 w-10 text-orange-500" />;
                  })()}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Content Area */}
          <div className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              <div 
                className="rounded-2xl overflow-hidden min-h-[600px]"
                style={{
                  borderRadius: "15px",
                  background: '#F4F4F4',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                  border: '8px solid rgba(255,255,255,0.95)'
                }}
              >
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div 
          className="shadow-lg border-b"
          style={{
            borderRadius: "0 0 12px 12px",
            border: "1.26px solid #FFAA67",
            background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
            boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
          }}
        >
          <div className="px-4 py-6 sm:py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToDashboard}
                  className="text-white hover:text-orange-100 p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-lg font-bold text-white">{community.name}</h1>
                  <p className="text-xs text-purple-100">Code: {community.pgCode}</p>
                </div>
              </div>
              
              {/* Hamburger Menu Button */}
              <button
                onClick={toggleMenu}
                className="text-white hover:text-orange-100 p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
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
          <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={toggleMenu}>
            <div 
              className="absolute top-4 right-4 w-[92%] rounded-2xl shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
              style={{
                borderRadius: "15px",
                background: '#F4F4F4',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                border: '8px solid rgba(255,255,255,0.95)'
              }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold tracking-tight text-gray-900">Navigation</h2>
                  <button
                    onClick={toggleMenu}
                    className="text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Community Info */}
                <div 
                  className="mb-8 p-6 rounded-2xl"
                  style={{
                    background: "linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)",
                    boxShadow: "0 8px 20px rgba(255, 180, 102, 0.3)"
                  }}
                >
                  <h3 className="font-bold text-orange-900 text-lg mb-3 tracking-tight">{community.name}</h3>
                  <p className="text-sm text-orange-800 mb-3 font-light leading-relaxed">{community.address}</p>
                  {community.description && (
                    <p className="text-sm text-orange-700 font-light leading-relaxed bg-white/30 p-3 rounded-lg">{community.description}</p>
                  )}
                </div>

                {/* Navigation Tabs */}
                <nav>
                  <ul className="space-y-3">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <li key={tab.id}>
                          <button
                            onClick={() => handleTabChange(tab.id)}
                            className={`w-full flex items-center gap-4 px-6 py-4 font-medium rounded-xl transition-all duration-300 ${
                              activeTab === tab.id
                                ? 'text-white shadow-lg transform scale-105'
                                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 hover:scale-102'
                            }`}
                            style={activeTab === tab.id ? {
                              borderRadius: "12px",
                              border: "1.26px solid #FFAA67",
                              background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                              boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
                            } : {}}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-light">{tab.label}</span>
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

        {/* Mobile Main Content */}
        <div className="px-4 py-8">
          {/* Current Tab Indicator - Hero Style */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-gray-900 mb-4 leading-tight">
                {getActiveTabLabel()} for{' '}
                <span className="text-orange-400">{community.name}</span>
              </h1>
              <p className="text-gray-500 max-w-md mx-auto font-light leading-relaxed px-4">
                Comprehensive <strong className="font-bold">Community Management</strong> at your fingertips.
              </p>
            </div>

            <div className="flex justify-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  borderRadius: "15px",
                  background: '#F4F4F4',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                  border: '4px solid rgba(255,255,255,0.95)'
                }}
              >
                {(() => {
                  const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabConfig?.icon || UsersIcon;
                  return <Icon className="h-8 w-8 text-orange-500" />;
                })()}
              </div>
            </div>
          </div>

          {/* Mobile Tab Content */}
          <div 
            className="rounded-2xl overflow-hidden"
            style={{
              borderRadius: "15px",
              background: '#F4F4F4',
              boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
              border: '4px solid rgba(255,255,255,0.95)'
            }}
          >
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;