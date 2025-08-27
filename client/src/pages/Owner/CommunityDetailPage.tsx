import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import CommunityStats from '../../app/components/PgAnalytics/CommunityStats';
import CommunityResidents from '../../app/components/PgAnalytics/CommunityResidents';
import CommunityIssues from '../../app/components/PgAnalytics/CommunityIssues';
import CommunityServices from '../../app/components/PgAnalytics/CommunityServices';
import CommunityEvents from '../../app/components/PgAnalytics/CommunityEvents';
import CommunityTechnicians from '../../app/components/PgAnalytics/CommunityTechnicians';
import {
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
import bgimage from '../../assets/bgimage.png';

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
      <motion.div 
        className="fixed inset-0 flex justify-center items-center px-4"
        style={{ 
          backgroundImage: `url(${bgimage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="rounded-full h-16 w-16 border-b-4 border-orange-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    );
  }

  if (error || !community) {
    return (
      <motion.div 
        className="fixed inset-0 flex justify-center items-center px-4"
        style={{ 
          backgroundImage: `url(${bgimage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="rounded-2xl p-8 w-full max-w-md text-center"
          style={{
            background: '#F4F4F4',
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
            border: '8px solid rgba(255,255,255,0.95)'
          }}
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="text-gray-600 mb-6 text-base font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {error || 'Community not found'}
          </motion.div>
          <motion.button
            onClick={handleBackToDashboard}
            className="w-full text-white px-6 rounded-xl hover:shadow-lg transition-all text-base font-semibold"
            style={{
              borderRadius: "12px",
              border: "1.26px solid #FFAA67",
              background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
              boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Back to Dashboard
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const renderTabContent = () => {
    if (!id) return null;

    const content = (() => {
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
    })();

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {content}
        </motion.div>
      </AnimatePresence>
    );
  };

  return (
    <div className="h-screen overflow-hidden">
      {/* Desktop Layout */}
      <div className="hidden lg:flex h-full">
        {/* Fixed Desktop Sidebar */}
        <motion.div 
          className="w-80 h-full flex flex-col shadow-2xl border-r relative overflow-hidden"
          style={{
            background: '#F4F4F4',
            borderColor: 'rgba(255,255,255,0.95)',
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)'
          }}
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Gradient Overlay */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)"
            }}
          />
          
          {/* Sidebar Header */}
          <motion.div 
            className="relative z-10 p-8 border-b border-gray-200/30 flex-shrink-0"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.button
              onClick={handleBackToDashboard}
              className="flex items-center gap-3 text-gray-600 hover:text-orange-500 p-3 rounded-xl hover:bg-orange-50/50 transition-all duration-300 mb-6 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Dashboard</span>
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold tracking-tighter text-gray-900 mb-3">{community.name}</h1>
              <motion.div 
                className="inline-block px-4 py-2 rounded-xl mb-4"
                style={{
                  background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                  boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
                }}
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-sm font-semibold text-white">Code: {community.pgCode}</p>
              </motion.div>
              <p className="text-sm text-gray-500 leading-relaxed font-light mb-3">{community.address}</p>
              {community.description && (
                <motion.p 
                  className="text-sm text-gray-500 leading-relaxed font-light bg-white/50 p-4 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {community.description}
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* Scrollable Navigation */}
          <motion.nav 
            className="relative z-10 flex-1 -mt-4 p-6 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-6">Community Management</h2>
            <ul className="space-y-3">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <motion.li 
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index + 0.5 }}
                  >
                    <motion.button
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-4 px-4 py-4 font-medium rounded-xl transition-all duration-300 group ${
                        activeTab === tab.id
                          ? 'text-white shadow-lg'
                          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50/50'
                      }`}
                      style={activeTab === tab.id ? {
                        borderRadius: "12px",
                        border: "1.26px solid #FFAA67",
                        background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                        boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
                      } : {}}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      animate={activeTab === tab.id ? { scale: 1.05 } : { scale: 1 }}
                    >
                      <Icon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-light">{tab.label}</span>
                    </motion.button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.nav>
        </motion.div>

        {/* Desktop Main Content - Scrollable */}
        <div 
          className="flex-1 h-full overflow-y-auto"
        >
          <motion.div 
            className="p-8 min-h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="max-w-7xl mx-auto">
              <motion.div 
                className="rounded-2xl overflow-hidden min-h-[600px]"
                style={{
                  borderRadius: "15px",
                }}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {renderTabContent()}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden h-full overflow-y-auto">
        {/* Mobile Header - Fixed */}
        <motion.div 
          className="shadow-lg border-b flex-shrink-0"
          style={{
            borderRadius: "0 0 12px 12px",
            border: "1.26px solid #FFAA67",
            background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
            boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
          }}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="px-4 py-6 sm:py-8">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <motion.button
                  onClick={handleBackToDashboard}
                  className="text-white hover:text-orange-100 p-2 rounded-xl hover:bg-white/20 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </motion.button>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{community.name}</h1>
                  <p className="text-sm text-orange-100 font-light">Code: {community.pgCode}</p>
                </div>
              </div>
              
              {/* Hamburger Menu Button */}
              <motion.button
                onClick={toggleMenu}
                className="text-white hover:text-orange-100 p-3 rounded-xl hover:bg-white/20 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Mobile Menu Overlay - Fixed */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" 
              onClick={toggleMenu}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute top-4 right-4 w-[92%] rounded-2xl shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
                style={{
                  borderRadius: "15px",
                  background: '#F4F4F4',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                  border: '8px solid rgba(255,255,255,0.95)'
                }}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="p-6">
                  <motion.div 
                    className="flex items-center justify-between mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h2 className="text-xl font-bold tracking-tight text-gray-900">Navigation</h2>
                    <motion.button
                      onClick={toggleMenu}
                      className="text-gray-600 hover:text-gray-800 p-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                  
                  {/* Community Info */}
                  <motion.div 
                    className="mb-8 p-6 rounded-2xl"
                    style={{
                      background: "linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)",
                      boxShadow: "0 8px 20px rgba(255, 180, 102, 0.3)"
                    }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <h3 className="font-bold text-orange-900 text-lg mb-3 tracking-tight">{community.name}</h3>
                    <p className="text-sm text-orange-800 mb-3 font-light leading-relaxed">{community.address}</p>
                    {community.description && (
                      <p className="text-sm text-orange-700 font-light leading-relaxed bg-white/30 p-3 rounded-lg">{community.description}</p>
                    )}
                  </motion.div>

                  {/* Navigation Tabs */}
                  <nav>
                    <ul className="space-y-3">
                      {tabs.map((tab, index) => {
                        const Icon = tab.icon;
                        return (
                          <motion.li 
                            key={tab.id}
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 * index + 0.4 }}
                          >
                            <motion.button
                              onClick={() => handleTabChange(tab.id)}
                              className={`w-full flex items-center gap-4 px-4 py-2 font-medium rounded-xl transition-all duration-300 ${
                                activeTab === tab.id
                                  ? 'text-white shadow-lg'
                                  : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                              }`}
                              style={activeTab === tab.id ? {
                                borderRadius: "12px",
                                border: "1.26px solid #FFAA67",
                                background: "linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)",
                                boxShadow: "1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)"
                              } : {}}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              animate={activeTab === tab.id ? { scale: 1.05 } : { scale: 1 }}
                            >
                              <Icon className="h-5 w-5" />
                              <span className="font-light">{tab.label}</span>
                            </motion.button>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </nav>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Main Content - Scrollable */}
        <div 
          className="flex-1 overflow-y-auto"
        >
          <motion.div 
            className="py-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >          
            {/* Mobile Tab Content */}
            <motion.div 
              className="rounded-2xl overflow-y-auto"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {renderTabContent()}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetailPage;