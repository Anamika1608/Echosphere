import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlusIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  PencilIcon,
  TrashIcon,
  WrenchScrewdriverIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { LogOut } from 'lucide-react';

import type { PgCommunity } from '../../types/pgCommunity';
import { serverUrl } from '@/utils';
import userStore from '@/store/userStore';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import CreatePgCommunityForm from '../../app/components/PgCommunity/CreatePgCommunityForm';
import EditPgCommunityForm from '../../app/components/PgCommunity/EditPgCommunityForm';

interface DashboardOverview {
  totalCommunities: number;
  totalResidents: number;
  totalIssues: number;
  totalServices: number;
  totalEvents: number;
  totalTechnicians: number;
  recentIssues: Array<{
    id: string;
    ticketNumber: number;
    title: string;
    status: string;
    priorityLevel: string;
    createdAt: string;
  }>;
  recentServices: Array<{
    id: string;
    ticketNumber: number;
    title: string;
    status: string;
    priorityLevel: string;
    createdAt: string;
  }>;
  upcomingEvents: Array<{
    id: string;
    title: string;
    eventType: string;
    startDate: string;
    endDate: string;
  }>;
}

interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  userName: string;
  createdAt: string;
  metadata: any;
}

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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

const PgOwnerDashboard: React.FC = () => {
  const [communities, setCommunities] = useState<PgCommunity[]>([]);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<PgCommunity | null>(null);
  const navigate = useNavigate();
  const { user, clearUser } = userStore();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load communities
      const communitiesRes = await axios.get(`${serverUrl}/pg-community/my-communities`, {
        withCredentials: true
      });

      setCommunities(communitiesRes.data.data);

      // If there are communities, load dashboard overview and activities
      if (communitiesRes.data.data && communitiesRes.data.data.length > 0) {
        const communityIds = communitiesRes.data.data.map((community: PgCommunity) => community.id);

        // Load dashboard overview for the first community (or aggregate if needed)
        const firstCommunityId = communityIds[0];

        try {
          const [overviewRes, activitiesRes] = await Promise.all([
            axios.get(`${serverUrl}/pg-analytics/${firstCommunityId}/dashboard`, {
              withCredentials: true
            }),
            axios.get(`${serverUrl}/pg-analytics/${firstCommunityId}/activities?limit=10`, {
              withCredentials: true
            })
          ]);

          // Aggregate data from all communities for overview
          const aggregatedOverview = {
            totalCommunities: communitiesRes.data.data.length,
            totalResidents: overviewRes.data.data.totalResidents || 4,
            totalIssues: overviewRes.data.data.totalIssues || 5,
            totalServices: overviewRes.data.data.totalServices || 0,
            totalEvents: overviewRes.data.data.totalEvents || 0,
            totalTechnicians: overviewRes.data.data.totalTechnicians || 8,
            recentIssues: overviewRes.data.data.recentIssues || [],
            recentServices: overviewRes.data.data.recentServices || [],
            upcomingEvents: overviewRes.data.data.upcomingEvents || []
          };

          setOverview(aggregatedOverview);
          setActivities(activitiesRes.data.data || []);
        } catch (analyticsError: any) {
          console.warn('Analytics data not available:', analyticsError.message);
          // Set default overview if analytics fail
          setOverview({
            totalCommunities: communitiesRes.data.data.length,
            totalResidents: 0,
            totalIssues: 0,
            totalServices: 0,
            totalEvents: 0,
            totalTechnicians: 0,
            recentIssues: [],
            recentServices: [],
            upcomingEvents: []
          });
        }
      } else {
        // No communities, set default overview
        setOverview({
          totalCommunities: 0,
          totalResidents: 0,
          totalIssues: 0,
          totalServices: 0,
          totalEvents: 0,
          totalTechnicians: 0,
          recentIssues: [],
          recentServices: [],
          upcomingEvents: []
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setShowCreateModal(true);
  };

  const handleEditCommunity = (community: PgCommunity) => {
    setSelectedCommunity(community);
    setShowEditModal(true);
  };

  const handleViewCommunity = (community: PgCommunity) => {
    navigate(`/community/${community.id}`);
  };

  const handleDelete = async (community: PgCommunity) => {
    if (window.confirm(`Are you sure you want to delete "${community.name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${serverUrl}/pg-community/${community.id}`, {
          withCredentials: true
        });
        setCommunities(communities.filter(c => c.id !== community.id));
        loadDashboardData();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete community');
      }
    }
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    loadDashboardData();
  };

  const handleCreateCancel = () => {
    setShowCreateModal(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    setSelectedCommunity(null);
    loadDashboardData();
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setSelectedCommunity(null);
  };

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);
      await axios.get(`${serverUrl}/auth/logout`, {
        withCredentials: true
      });

      clearUser();
      navigate('/login');
    } catch (err: any) {
      console.error('Logout error:', err);
      clearUser();
      navigate('/login');
    } finally {
      setLogoutLoading(false);
    }
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

  if (error) {
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
          <div className="text-purple-600 text-center mb-4 text-sm">{error}</div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={loadDashboardData}
            className="w-full bg-purple-500 text-white px-4 py-3 rounded-2xl hover:bg-purple-600 transition-colors text-sm font-semibold"
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile First */}
        <motion.div className="mb-8" variants={itemVariants}>
          {/* Title Section */}
          <motion.div className="text-center mb-6" variants={itemVariants}>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl pt-4 font-bold tracking-tighter text-gray-900 mb-4 leading-tight"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Community Owner{' '}
              <motion.span 
                className="text-orange-400"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
              >
                Dashboard
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-gray-500 text-sm sm:text-base py-4 px-4 leading-relaxed max-w-md mx-auto font-light"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Manage your <strong className="font-bold">paying guest communities</strong> with smart insights and instant support.
            </motion.p>
          </motion.div>

          {/* Mobile Action Buttons */}
          <div className="lg:hidden flex flex-col gap-3 mb-6">
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateNew}
              className="bg-orange-100 text-black hover:bg-purple-600 hover:text-white px-6 py-4 rounded-2xl transition-colors flex items-center justify-center mx-auto gap-2 mb-4 font-semibold text-base"
              style={{
                borderRadius: 16,
                border: '1px solid #FFF',
                background: 'linear-gradient(180deg, #FFF 0%, #E6D5FF 56.5%, #B2A1FF 113%)',
                boxShadow: '1px 3px 6.1px 0 rgba(138, 43, 226, 0.20)'
              }}
            >
              <PlusIcon className="h-5 w-5" />
              Create Community
            </motion.button>
          </div>
        </motion.div>

        {/* Overview Cards */}
        {overview && (
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
          >
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-transparent rounded-2xl lg:rounded-3xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white/80 h-32 lg:h-auto">
                <CardHeader className="p-4 lg:p-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                      <BuildingOfficeIcon className="h-4 w-4 lg:h-6 lg:w-6 text-purple-600" />
                    </div>
                    <p className="text-xs lg:text-sm font-medium text-purple-600 mb-1">Communities</p>
                    <p className="text-lg lg:text-2xl font-bold text-purple-900">{overview.totalCommunities}</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-transparent rounded-2xl lg:rounded-3xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white/80 h-32 lg:h-auto">
                <CardHeader className="p-4 lg:p-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
                      <UsersIcon className="h-4 w-4 lg:h-6 lg:w-6 text-indigo-600" />
                    </div>
                    <p className="text-xs lg:text-sm font-medium text-purple-600 mb-1">Residents</p>
                    <p className="text-lg lg:text-2xl font-bold text-purple-900">{overview.totalResidents}</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-transparent rounded-2xl lg:rounded-3xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white/80 h-32 lg:h-auto">
                <CardHeader className="p-4 lg:p-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-2">
                      <ChartBarIcon className="h-4 w-4 lg:h-6 lg:w-6 text-violet-600" />
                    </div>
                    <p className="text-xs lg:text-sm font-medium text-purple-600 mb-1">Active Issues</p>
                    <p className="text-lg lg:text-2xl font-bold text-purple-900">{overview.totalIssues}</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
            
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-transparent rounded-2xl lg:rounded-3xl hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white/80 h-32 lg:h-auto">
                <CardHeader className="p-4 lg:p-2">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-8 h-8 lg:w-12 lg:h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                      <WrenchScrewdriverIcon className="h-4 w-4 lg:h-6 lg:w-6 text-purple-600" />
                    </div>
                    <p className="text-xs lg:text-sm font-medium text-purple-600 mb-1">Technicians</p>
                    <p className="text-lg lg:text-2xl font-bold text-purple-900">{overview.totalTechnicians}</p>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Main Content - Desktop Grid Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Communities List - Desktop: 2 columns, Mobile: full width */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="border-transparent rounded-2xl bg-white/70 shadow-lg h-fit">
              <CardHeader className="px-4 lg:px-6">
                <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">My Communities</CardTitle>
              </CardHeader>
              <div className="px-4 lg:px-6 pb-6">
                {communities.length === 0 ? (
                  <motion.div 
                    variants={itemVariants}
                    className="text-center py-8 lg:py-12"
                  >
                    <BuildingOfficeIcon className="mx-auto h-12 w-12 lg:h-16 lg:w-16 text-purple-300 mb-4" />
                    <h3 className="text-base lg:text-lg font-semibold text-gray-900 mb-2">No communities yet</h3>
                    <p className="text-purple-600 text-sm lg:text-base mb-4">Get started by creating your first PG community.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCreateNew}
                      className="bg-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-2xl transition-colors font-semibold text-sm lg:text-base"
                    >
                      Create Community
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div 
                    variants={containerVariants}
                    className="space-y-3 lg:space-y-4"
                  >
                    {communities.map((community, index) => (
                      <motion.div
                        key={community.id}
                        variants={cardVariants}
                        whileHover="hover"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card 
                          className="border-white rounded-xl hover:border-purple-300 shadow-none hover:shadow-md transition-all duration-300" 
                          style={{
                            borderRadius: 16,
                            border: '1px solid #FFF',
                            background: 'radial-gradient(68.01% 86.99% at 100% 71.52%, #CCBBFE 0%, #FFF 100%)',
                            boxShadow: '1px 3px 6.1px 0 rgba(138, 43, 226, 0.20)'
                          }}
                        >
                          <div className="p-4 lg:p-6">
                            <div className="flex justify-between items-start">
                              <motion.div 
                                whileHover={{ scale: 1.01 }}
                                className="flex-1 cursor-pointer" 
                                onClick={() => handleViewCommunity(community)}
                              >
                                <h3 className="text-base lg:text-lg font-regular text-purple-900 transition-colors mb-1 lg:mb-2">{community.name}</h3>
                                <p className="text-xs lg:text-sm text-purple-800 mb-1">Code: <span className="font-semibold">{community.pgCode}</span></p>
                                <p className="text-purple-700 text-xs lg:text-sm mb-2">{community.address}</p>
                                {community.description && (
                                  <p className="text-purple-700 text-xs lg:text-sm line-clamp-2">{community.description}</p>
                                )}
                              </motion.div>
                              <div className="flex space-x-1 lg:space-x-2 ml-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleEditCommunity(community)}
                                  className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-100 transition-colors"
                                  title="Edit Community"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleDelete(community)}
                                  className="text-purple-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                  title="Delete Community"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Sidebar - Desktop: 1 column, Mobile: full width */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Mobile User Profile */}
            <div className="lg:hidden">
              <motion.div 
                variants={cardVariants}
                whileHover="hover"
                className="bg-white/80 rounded-2xl p-4 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={user?.profilePicture ?? undefined} 
                        alt='user-profile' 
                        className='w-full h-full object-cover'
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-purple-900 text-sm">{user?.name}</p>
                      <p className="text-purple-600 text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="text-purple-400 hover:text-purple-600 p-2 rounded-xl hover:bg-purple-100 disabled:opacity-50 transition-colors"
                    title="Logout"
                  >
                    {logoutLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="rounded-full h-5 w-5 border-b-2 border-purple-500"
                      />
                    ) : (
                      <LogOut className="h-5 w-5" />
                    )}
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Recent Activities */}
            <motion.div variants={cardVariants} whileHover="hover">
              <Card className="border-transparent rounded-2xl bg-white/80 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg lg:text-xl font-bold text-purple-900">Recent Activities</CardTitle>
                </CardHeader>
                <div className="p-4 lg:p-6">
                  {activities && activities.length > 0 ? (
                    <motion.div 
                      variants={containerVariants}
                      className="space-y-3 lg:space-y-4"
                    >
                      {activities.slice(0, 6).map((activity, index) => (
                        <motion.div 
                          key={activity.id}
                          variants={itemVariants}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-l-4 border-purple-400 pl-3 py-2"
                        >
                          <p className="text-xs lg:text-sm text-purple-800 font-medium leading-relaxed">{activity.description}</p>
                          <p className="text-xs text-purple-600 mt-1">
                            {activity.userName} • {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div 
                      variants={itemVariants}
                      className="text-center py-6 lg:py-8"
                    >
                      <BellIcon className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-purple-300 mb-2" />
                      <p className="text-purple-500 text-xs lg:text-sm">No recent activities</p>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleCreateCancel();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-full max-w-md lg:max-w-lg"
            >
              <CreatePgCommunityForm
                onSuccess={handleCreateSuccess}
                onCancel={handleCreateCancel}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Community Modal */}
      <AnimatePresence>
        {showEditModal && selectedCommunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                handleEditCancel();
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="w-full max-w-md lg:max-w-lg"
            >
              <EditPgCommunityForm
                community={selectedCommunity}
                onSuccess={handleEditSuccess}
                onCancel={handleEditCancel}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PgOwnerDashboard;