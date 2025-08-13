import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import { motion, AnimatePresence } from 'framer-motion';

import type { PgCommunity } from '../../types/pgCommunity';
import { serverUrl } from '@/utils';
import userStore from '@/store/userStore';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import CreatePgCommunityForm from '../../app/components/PgCommunity/CreatePgCommunityForm';
import EditPgCommunityForm from '../../app/components/PgCommunity/EditPgCommunityForm';
import { Button } from '../../components/ui/button';

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
            totalResidents: overviewRes.data.data.totalResidents || 0,
            totalIssues: overviewRes.data.data.totalIssues || 0,
            totalServices: overviewRes.data.data.totalServices || 0,
            totalEvents: overviewRes.data.data.totalEvents || 0,
            totalTechnicians: overviewRes.data.data.totalTechnicians || 0,
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const statsCardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  const communityCardVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.2
      }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.95 }
  };

  const heroButtonVariants = {
    idle: { scale: 1, y: 0 },
    hover: { 
      scale: 1.05,
      y: -2,
      boxShadow: "0 10px 25px rgba(255, 80, 0, 0.3)",
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98, y: 0 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  const activityVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const loadingSpinnerVariants = {
    spin: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="h-12 w-12 border-b-4 border-orange-500 rounded-full"
          variants={loadingSpinnerVariants}
          animate="spin"
        />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="bg-white rounded-2xl p-6 w-full max-w-sm"
          style={{
            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.95)'
          }}
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <div className="text-orange-600 text-center mb-4 text-sm">{error}</div>
          <motion.button
            onClick={loadDashboardData}
            className="w-full text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
            style={{
              background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
              boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Retry
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen px-4 py-6 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100"
      variants={containerVariants}
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

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8 lg:mb-12">
          {/* Desktop Header Layout */}
          <div className="lg:flex lg:items-center lg:justify-between lg:mb-8">
            {/* Title Section */}
            <div className="text-center lg:text-left mb-6 lg:mb-0">
              <motion.h1 
                variants={itemVariants}
                className="text-3xl lg:text-4xl xl:text-5xl pt-4 font-bold tracking-tight text-gray-900 mb-2"
              >
                Community Owner Dashboard
              </motion.h1>
              <motion.p 
                variants={itemVariants}
                className="text-purple-800 text-sm lg:text-base py-4 px-4 lg:px-0 leading-relaxed max-w-sm lg:max-w-2xl mx-auto lg:mx-0"
              >
                Manage your <strong className="font-bold">paying guest communities</strong> with smart insights and instant support.
              </motion.p>
            </div>

            {/* Desktop User Profile & Actions */}
            <div className="hidden lg:flex lg:items-center lg:gap-6">
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateNew}
                className="bg-orange-100 text-black hover:bg-purple-600 hover:text-black px-8 py-4 rounded-2xl transition-colors flex items-center gap-3 font-semibold text-base"
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

              <motion.div 
                variants={itemVariants}
                className="bg-white/80 rounded-2xl p-4 shadow-lg"

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

          {/* Action Button - Hero Style */}
          <motion.div 
            className="flex flex-col items-center gap-4 mb-8"
            variants={itemVariants}
          >
            <motion.button
              onClick={handleCreateNew}
              className="text-white px-8 py-4 rounded-xl transition-all flex items-center gap-3 font-semibold text-base"
              style={{
                background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
                boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
              }}
              variants={heroButtonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
            >
              <motion.div
                animate={{ rotate: [0, 90, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <PlusIcon className="h-5 w-5" />
              </motion.div>
              Create Community
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Overview Cards - Mobile Responsive Grid */}
        {overview && (
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8"
            variants={containerVariants}
          >
            {[
              { icon: BuildingOfficeIcon, label: 'Communities', value: overview.totalCommunities, gradient: 'linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)' },
              { icon: UsersIcon, label: 'Residents', value: overview.totalResidents, gradient: 'linear-gradient(135deg, #E6F3FF 0%, #66B3FF 100%)' },
              { icon: ChartBarIcon, label: 'Active Issues', value: overview.totalIssues, gradient: 'linear-gradient(135deg, #FFE6E6 0%, #FF6666 100%)' },
              { icon: WrenchScrewdriverIcon, label: 'Technicians', value: overview.totalTechnicians, gradient: 'linear-gradient(135deg, #E6FFE6 0%, #66FF66 100%)' }
            ].map((stat, index) => (
              <motion.div key={stat.label} variants={statsCardVariants}>
                <Card 
                  className="border-0 rounded-2xl cursor-pointer"
                  style={{
                    background: '#F4F4F4',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    border: '2px solid rgba(255,255,255,0.95)'
                  }}
                >
                  <motion.div
                    whileHover="hover"
                    variants={statsCardVariants}
                  >
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex flex-col items-center text-center">
                        <motion.div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: stat.gradient }}
                          whileHover={{ 
                            rotate: 360,
                            transition: { duration: 0.6 }
                          }}
                        >
                          <stat.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                        <motion.p 
                          className="text-xl sm:text-2xl font-bold text-gray-900"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                        >
                          {stat.value}
                        </motion.p>
                      </div>
                    </CardHeader>
                  </motion.div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Main Content - Mobile Stacked */}
        <motion.div className="space-y-6" variants={containerVariants}>
          {/* Communities List */}
          <motion.div variants={cardVariants}>
            <Card 
              className="border-0 rounded-2xl"
              style={{
                background: '#F4F4F4',
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                border: '2px solid rgba(255,255,255,0.95)'
              }}
            >
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">My Communities</CardTitle>
              </CardHeader>
              <div className="px-4 sm:px-6 pb-6">
                {communities.length === 0 ? (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <motion.h3 
                      className="text-base sm:text-lg font-semibold text-gray-900 mb-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      No communities yet
                    </motion.h3>
                    <motion.p 
                      className="text-gray-500 text-sm sm:text-base mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Get started by creating your first PG community.
                    </motion.p>
                    <motion.button
                      onClick={handleCreateNew}
                      className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-6 py-3 rounded-xl transition-colors font-semibold text-sm"
                      variants={buttonVariants}
                      initial="idle"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Create Community
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div className="space-y-4">
                    <AnimatePresence>
                      {communities.map((community, index) => (
                        <motion.div
                          key={community.id}
                          variants={communityCardVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ x: -100, opacity: 0 }}
                          custom={index}
                        >
                          <Card 
                            className="border-0 rounded-xl cursor-pointer transition-all duration-300"
                            style={{
                              background: 'rgba(255, 255, 255, 0.8)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              border: '1px solid rgba(255,255,255,0.95)'
                            }}
                          >
                            <motion.div
                              whileHover="hover"
                              variants={communityCardVariants}
                            >
                              <div className="p-4 sm:p-5">
                                <div className="flex justify-between items-start z-10">
                                  <motion.div 
                                    className="flex-1 cursor-pointer" 
                                    onClick={() => handleViewCommunity(community)}
                                    whileHover={{ x: 4 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 hover:text-orange-600 transition-colors mb-2">{community.name}</h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Code: <span className="font-semibold text-orange-600">{community.pgCode}</span></p>
                                    <p className="text-gray-600 text-xs sm:text-sm mb-2">{community.address}</p>
                                    {community.description && (
                                      <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{community.description}</p>
                                    )}
                                  </motion.div>
                                  <div className="flex space-x-2 ml-4">
                                    <motion.button
                                      onClick={() => handleEditCommunity(community)}
                                      className="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                                      title="Edit Community"
                                      whileHover={{ scale: 1.1, rotate: 15 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </motion.button>
                                    <motion.button
                                      onClick={() => handleDelete(community)}
                                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                      title="Delete Community"
                                      whileHover={{ scale: 1.1, rotate: -15 }}
                                      whileTap={{ scale: 0.9 }}
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </motion.button>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Card>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* User Profile Card */}
          <motion.div variants={cardVariants}>
            <Card 
              className="border-0 rounded-2xl"
              style={{
                background: '#F4F4F4',
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                border: '2px solid rgba(255,255,255,0.95)'
              }}
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden ring-2 ring-orange-200"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <img 
                        src={user?.profilePicture ?? undefined} 
                        alt='user-profile' 
                        className='w-full h-full object-cover'
                      />
                    </motion.div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">{user?.name}</p>
                      <p className="text-gray-600 text-xs sm:text-sm">{user?.email}</p>
                    </div>
                  </div>
                  <motion.button 
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    className="text-orange-500 hover:text-orange-700 p-2 sm:p-3 rounded-xl hover:bg-orange-100 disabled:opacity-50 transition-colors"
                    title="Logout"
                    whileHover={{ scale: 1.1, rotate: 15 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <AnimatePresence mode="wait">
                      {logoutLoading ? (
                        <motion.div 
                          className="h-5 w-5 border-b-2 border-orange-500 rounded-full"
                          variants={loadingSpinnerVariants}
                          animate="spin"
                          key="loading"
                        />
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key="logout"
                        >
                          <LogOut className="h-5 w-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Recent Activities */}
          <motion.div variants={cardVariants}>
            <Card 
              className="border-0 rounded-2xl"
              style={{
                background: '#F4F4F4',
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                border: '2px solid rgba(255,255,255,0.95)'
              }}
            >
              <CardHeader className="px-4 sm:px-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-gray-900">Recent Activities</CardTitle>
              </CardHeader>
              <div className="px-4 sm:px-6 pb-6">
                {activities && activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.slice(0, 6).map((activity, index) => (
                      <motion.div 
                        key={activity.id} 
                        className="border-l-4 border-orange-400 pl-4 py-3 bg-white/50 rounded-r-lg"
                        variants={activityVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.8)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.userName} • {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                    >
                      <BellIcon className="mx-auto h-10 w-10 text-orange-300 mb-3" />
                    </motion.div>
                    <p className="text-gray-500 text-sm">No recent activities</p>
                  </motion.div>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Create Community Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="w-full max-w-md"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <motion.div 
              className="w-full max-w-md"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
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