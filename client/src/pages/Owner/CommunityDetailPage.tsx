import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
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
        style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F8F5FF 0%, #F0EBFF 21.63%, #E8D5FF 45.15%, #E6D5FF 67.31%, #F7F3FF 100%)' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-b-4 border-purple-500"
        />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div 
        className="min-h-screen flex justify-center items-center px-4" 
        style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F8F5FF 0%, #F0EBFF 21.63%, #E8D5FF 45.15%, #E6D5FF 67.31%, #F7F3FF 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm"
        >
          <div className="text-purple-600 text-center mb-4 text-sm">{error || 'Community not found'}</div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBackToDashboard}
            className="w-full bg-purple-500 text-white px-4 py-3 rounded-2xl hover:bg-purple-600 transition-colors text-sm font-semibold"
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen" 
      style={{ 
        backgroundImage: 'linear-gradient(180deg, #D8B4FE 1.09%, #C4A1FF 18.47%, #B794F6 28.25%, #9F7AEA 47.26%, #9F7AEA 70.08%, #C4A1FF 93.44%, #D8B4FE 111.91%)'
      }}
    >
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Desktop Header */}
        <motion.div 
          variants={itemVariants}
          className="shadow-lg shadow-black/5 border-b border-purple-100/30"
        >
          <div className="px-6 xl:px-8 py-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleBackToDashboard}
                    className="text-white hover:text-purple-200 p-3 rounded-xl hover:bg-purple-500/30 transition-colors"
                  >
                    <ArrowLeftIcon className="h-6 w-6" />
                  </motion.button>
                  <div>
                    <h1 className="text-2xl xl:text-3xl font-bold text-white mb-1">{community.name}</h1>
                    <div className="flex items-center gap-4 text-purple-100">
                      <p className="text-sm">Code: <span className="font-medium">{community.pgCode}</span></p>
                      <p className="text-sm">{community.address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Desktop Community Info Card */}
                <motion.div 
                  variants={itemVariants}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
                >
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">Community Details</p>
                    <p className="text-purple-100 text-xs mt-1">
                      {community.description ? community.description.substring(0, 60) + '...' : 'No description available'}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Desktop Main Content */}
        <div className="px-6 xl:px-8 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-8">
              {/* Desktop Sidebar Navigation */}
              <motion.div 
                variants={itemVariants}
                className="col-span-3 xl:col-span-2"
              >
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 sticky top-8">
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-purple-900 mb-6">Navigation</h2>
                    <nav>
                      <ul className="space-y-2">
                        {tabs.map((tab, index) => {
                          const Icon = tab.icon;
                          return (
                            <motion.li
                              key={tab.id}
                              variants={tabVariants}
                              initial="hidden"
                              animate="visible"
                              transition={{ delay: index * 0.05 }}
                            >
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTabChange(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                  activeTab === tab.id
                                    ? 'bg-purple-500 text-white shadow-lg transform scale-105'
                                    : 'text-purple-700 hover:bg-purple-50 hover:text-purple-600'
                                }`}
                              >
                                <Icon className="h-5 w-5 flex-shrink-0" />
                                <div className="text-left">
                                  <div className="font-medium">{tab.label}</div>
                                  {activeTab !== tab.id && (
                                    <div className="text-xs opacity-70">{tab.description}</div>
                                  )}
                                </div>
                              </motion.button>
                            </motion.li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                </div>
              </motion.div>

              {/* Desktop Content Area */}
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  key={activeTab}
                  variants={contentVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-purple-100 overflow-hidden min-h-[600px]"
                >
                  {renderTabContent()}
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <motion.div 
          variants={itemVariants}
          className="shadow-lg shadow-black/5 border-b border-purple-100"
        >
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBackToDashboard}
                  className="text-white hover:text-purple-600 p-2 rounded-xl hover:bg-purple-50 transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </motion.button>
                <div>
                  <h1 className="text-lg font-bold text-white">{community.name}</h1>
                  <p className="text-xs text-purple-100">Code: {community.pgCode}</p>
                </div>
              </div>
              
              {/* Mobile Hamburger Menu Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleMenu}
                className="text-white hover:text-purple-200 p-2 rounded-xl hover:bg-purple-500/30 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40" 
              onClick={toggleMenu}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 15 }}
                className="absolute top-2 right-2 w-[96%] rounded-xl bg-white shadow-xl" 
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-purple-900">Menu</h2>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleMenu}
                      className="text-purple-700 hover:text-purple-600 p-1 rounded-lg hover:bg-purple-100"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </motion.button>
                  </div>
                  
                  {/* Mobile Community Info */}
                  <motion.div 
                    variants={itemVariants}
                    className="mb-6 p-4 bg-purple-50 rounded-2xl"
                  >
                    <h3 className="font-semibold text-purple-900 mb-2">{community.name}</h3>
                    <p className="text-sm text-purple-700 mb-2">{community.address}</p>
                    {community.description && (
                      <p className="text-sm text-purple-600">{community.description}</p>
                    )}
                  </motion.div>

                  {/* Mobile Navigation Tabs */}
                  <nav>
                    <motion.ul 
                      variants={containerVariants}
                      className="space-y-2"
                    >
                      {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        return (
                          <motion.li
                            key={tab.id}
                            variants={tabVariants}
                            transition={{ delay: index * 0.05 }}
                          >
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleTabChange(tab.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                                activeTab === tab.id
                                  ? 'bg-purple-500 text-white shadow-lg'
                                  : 'text-purple-700 hover:bg-purple-50 hover:text-purple-600'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <div className="text-left">
                                <div>{tab.label}</div>
                                <div className="text-xs opacity-70">{tab.description}</div>
                              </div>
                            </motion.button>
                          </motion.li>
                        );
                      })}
                    </motion.ul>
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Main Content */}
        <div className="px-4 py-6">
          {/* Mobile Current Tab Indicator */}
          <motion.div 
            variants={itemVariants}
            className="mb-6"
          >
            <div className="bg-white/80 rounded-2xl p-4 shadow-purple-200 shadow-md border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-purple-900">{getActiveTabLabel()}</h2>
                  <p className="text-sm text-purple-600">{getActiveTabDescription()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  {(() => {
                    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                    const Icon = activeTabConfig?.icon || UsersIcon;
                    return <Icon className="h-6 w-6 text-purple-600" />;
                  })()}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mobile Tab Content */}
          <motion.div 
            key={activeTab}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/70 rounded-2xl shadow-lg border border-purple-100 overflow-hidden"
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityDetailPage;