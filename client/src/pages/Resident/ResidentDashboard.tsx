import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '../../components/ui/card';
import {
  PlusCircle,
  History,
  CalendarDays,
  Mic,
  User,
  Settings,
  LogOut,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  Users,
  Activity,
  Wrench,
  TrendingUp,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight
} from 'lucide-react';
import userStore from '@/store/userStore';
import { handleUserLogout } from '@/services/authService';

const serverUrl = 'http://localhost:3000/api';

// Simple Badge Component
const Badge = ({ children, className = "", variant = "default" }: { 
  children: React.ReactNode; 
  className?: string; 
  variant?: string; 
}) => {
  const baseClasses = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    outline: "border border-gray-200 bg-white text-gray-800"
  };
  
  return (
    <span className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses] || variantClasses.default} ${className}`}>
      {children}
    </span>
  );
};

// Types for API responses
interface Issue {
  id: string;
  title: string;
  ticketNumber: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
  issueType: string;
  createdAt: string;
  assignedTechnician?: {
    name: string;
    phoneNumber: string;
    speciality: string;
  };
}

interface Service {
  id: string;
  title: string;
  ticketNumber: string;
  status: 'PENDING' | 'AWAITING_APPROVAL' | 'APPROVED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
  serviceType: string;
  createdAt: string;
  assignedTechnician?: {
    name: string;
    phoneNumber: string;
    speciality: string;
  };
}

interface Event {
  id: string;
  title: string;
  eventType: string;
  startDate: string;
  endDate: string;
  description?: string;
  userAttendanceStatus?: 'REGISTERED' | 'ATTENDED' | 'MISSED';
  _count: {
    attendances: number;
    feedbacks: number;
  };
}

interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    profilePicture?: string;
    pgCommunity: {
      id: string;
      name: string;
      address: string;
      pgCode: string;
    };
  };
  quickStats: {
    totalIssuesRaised: number;
    totalServicesRequested: number;
    totalEventsAttended: number;
    pendingIssues: number;
    pendingServices: number;
    upcomingEvents: number;
  };
  summaries: {
    issues: any;
    services: any;
    events: any;
  };
  recentActivities: any[];
}

type TabType = 'overview' | 'issues' | 'services' | 'events';

interface TabConfig {
  id: TabType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const tabs: TabConfig[] = [
  { id: 'overview', label: 'Overview', icon: TrendingUp },
  { id: 'issues', label: 'My Issues', icon: AlertCircle },
  { id: 'services', label: 'My Services', icon: Wrench },
  { id: 'events', label: 'Events', icon: Calendar }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
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
      duration: 0.3,
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

const sidebarVariants = {
  hidden: { x: -300, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const ResidentDashboard = () => {
  const { user } = userStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [userServices, setUserServices] = useState<Service[]>([]);
  const [userEvents, setUserEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user dashboard overview
      const dashboardResponse = await axios.get(`${serverUrl}/pg-analytics/user/dashboard`, {
        withCredentials: true
      });
      
      if (dashboardResponse.data.success) {
        setDashboardData(dashboardResponse.data.data);
        
        // Fetch user's issues, services, events, and upcoming events in parallel
        const [issuesRes, servicesRes, eventsRes, upcomingRes] = await Promise.all([
          axios.get(`${serverUrl}/pg-analytics/user/issues?limit=5&sortBy=createdAt&sortOrder=desc`, {
            withCredentials: true
          }),
          axios.get(`${serverUrl}/pg-analytics/user/services?limit=5&sortBy=createdAt&sortOrder=desc`, {
            withCredentials: true
          }),
          axios.get(`${serverUrl}/pg-analytics/user/events?limit=5&sortBy=createdAt&sortOrder=desc`, {
            withCredentials: true
          }),
          axios.get(`${serverUrl}/pg-analytics/${dashboardResponse.data.data.user.pgCommunity.id}/events?upcoming=true&limit=5`, {
            withCredentials: true
          })
        ]);

        if (issuesRes.data.success) setUserIssues(issuesRes.data.data);
        if (servicesRes.data.success) setUserServices(servicesRes.data.data);
        if (eventsRes.data.success) setUserEvents(eventsRes.data.data);
        if (upcomingRes.data.success) setUpcomingEvents(upcomingRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'P3': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'P4': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800';
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800';
      case 'RESOLVED': case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4" />;
      case 'ASSIGNED': case 'IN_PROGRESS': return <Activity className="h-4 w-4" />;
      case 'RESOLVED': case 'COMPLETED': return <CheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const getActiveTabLabel = () => {
    const activeTabConfig = tabs.find(tab => tab.id === activeTab);
    return activeTabConfig?.label || 'Overview';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-[#FF4500] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F9F7F5 0%, #FFF8F1 21.63%, #FFE4C9 45.15%, #FFE9C9 67.31%,#FFFAF3 100%)' }}>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <motion.aside
          initial="hidden"
          animate="visible"
          variants={sidebarVariants}
          className="w-80 bg-white/80 backdrop-blur-sm shadow-xl border-r border-orange-100 flex flex-col"
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
                {user.profilePicture ? (
                  <img 
                    src={user.profilePicture} 
                    alt="profile" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <User className="h-6 w-6 text-[#FF4500]" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-lg text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
            </div>
            
            {/* PG Community Info */}
            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">PG Community</span>
              </div>
              <p className="font-semibold text-gray-900">{dashboardData?.user.pgCommunity.name}</p>
              <p className="text-xs text-gray-600">Code: {dashboardData?.user.pgCommunity.pgCode}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <motion.li
                    key={tab.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.button
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-[#FF4500] text-white shadow-lg'
                          : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF4500]'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </motion.div>
                      )}
                    </motion.button>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-orange-100">
            <div className="space-y-2">
              <motion.button 
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#FF4500] rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Settings className="h-5 w-5" />
                Settings
              </motion.button>
              <motion.button 
                onClick={handleUserLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        {isMobile && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-orange-100"
          >
            <div className="px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
                    {user.profilePicture ? (
                      <img 
                        src={user.profilePicture} 
                        alt="profile" 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <User className="h-5 w-5 text-[#FF4500]" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{user.name}</h1>
                    <p className="text-xs text-gray-500">{dashboardData?.user.pgCommunity.name}</p>
                  </div>
                </div>
                
                <motion.button
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-[#FF4500] p-2 rounded-xl hover:bg-orange-50 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.button>
              </div>
            </div>
          </motion.header>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-orange-100"
          >
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
                  <p className="text-gray-600 mt-1">{getActiveTabLabel()} • {dashboardData?.user.pgCommunity.name}</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <motion.button
                    className="p-2 text-gray-600 hover:text-[#FF4500] hover:bg-orange-50 rounded-xl transition-colors relative"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </motion.button>
                  
                  <motion.button
                    className="p-2 text-gray-600 hover:text-[#FF4500] hover:bg-orange-50 rounded-xl transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Search className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.header>
        )}

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobile && isMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={toggleMenu}
            >
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="absolute top-2 right-2 w-[96%] rounded-xl bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-gray-900">Menu</h2>
                    <button
                      onClick={toggleMenu}
                      className="text-gray-700 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* User Profile Section */}
                  <div className="mb-6 p-4 bg-orange-50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden">
                        {user.profilePicture ? (
                          <img 
                            src={user.profilePicture} 
                            alt="profile" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                        ) : (
                          <User className="h-6 w-6 text-[#FF4500]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{dashboardData?.user.pgCommunity.name}</span>
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <nav className="mb-6">
                    <ul className="space-y-2">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <li key={tab.id}>
                            <motion.button
                              onClick={() => handleTabChange(tab.id)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                                activeTab === tab.id
                                  ? 'bg-[#FF4500] text-white shadow-lg'
                                  : 'text-gray-600 hover:bg-orange-50 hover:text-[#FF4500]'
                              }`}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Icon className="h-5 w-5" />
                              {tab.label}
                            </motion.button>
                          </li>
                        );
                      })}
                    </ul>
                  </nav>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-[#FF4500] rounded-2xl transition-all duration-200">
                      <Settings className="h-5 w-5" />
                      Settings
                    </button>
                    <button 
                      onClick={handleUserLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className={`flex-1 ${isMobile ? 'px-4 py-6' : 'px-8 py-8'} overflow-auto`}>
          {/* Mobile Tab Indicator */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-orange-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{getActiveTabLabel()}</h2>
                    <p className="text-sm text-gray-500">Resident Dashboard</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    {(() => {
                      const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                      const Icon = activeTabConfig?.icon || TrendingUp;
                      return <Icon className="h-6 w-6 text-[#FF4500]" />;
                    })()}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className={`bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-orange-100 overflow-hidden ${!isMobile ? 'min-h-[600px]' : ''}`}
          >
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-6"
                >
                  {/* Quick Stats Grid */}
                  <motion.div 
                    variants={containerVariants}
                    className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}
                  >
                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 h-full">
                        <div className="flex items-center justify-between mb-2">
                          <AlertCircle className="h-8 w-8 text-red-500" />
                          <span className="text-3xl font-bold text-gray-900">{dashboardData?.quickStats.totalIssuesRaised || 0}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Issues Raised</p>
                        {dashboardData?.quickStats.pendingIssues ? (
                          <p className="text-xs text-orange-600 mt-2 font-medium">
                            {dashboardData.quickStats.pendingIssues} pending
                          </p>
                        ) : null}
                      </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 h-full">
                        <div className="flex items-center justify-between mb-2">
                          <Wrench className="h-8 w-8 text-blue-500" />
                          <span className="text-3xl font-bold text-gray-900">{dashboardData?.quickStats.totalServicesRequested || 0}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Services Requested</p>
                        {dashboardData?.quickStats.pendingServices ? (
                          <p className="text-xs text-orange-600 mt-2 font-medium">
                            {dashboardData.quickStats.pendingServices} pending
                          </p>
                        ) : null}
                      </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 h-full">
                        <div className="flex items-center justify-between mb-2">
                          <Calendar className="h-8 w-8 text-green-500" />
                          <span className="text-3xl font-bold text-gray-900">{dashboardData?.quickStats.totalEventsAttended || 0}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Events Attended</p>
                      </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 h-full">
                        <div className="flex items-center justify-between mb-2">
                          <CalendarDays className="h-8 w-8 text-purple-500" />
                          <span className="text-3xl font-bold text-gray-900">{dashboardData?.quickStats.upcomingEvents || 0}</span>
                        </div>
                        <p className="text-sm text-gray-600 font-medium">Upcoming Events</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Desktop Layout - Two Column */}
                  {!isMobile && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Profile and Community Info */}
                      <motion.div variants={cardVariants} whileHover="hover">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 h-full">
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <User className="h-5 w-5 text-[#FF4500]" />
                            Profile Overview
                          </h3>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center overflow-hidden">
                                {user.profilePicture ? (
                                  <img 
                                    src={user.profilePicture} 
                                    alt="profile" 
                                    className="w-full h-full object-cover rounded-2xl"
                                  />
                                ) : (
                                  <User className="h-8 w-8 text-[#FF4500]" />
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-lg text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <Badge variant="outline" className="mt-1 text-xs">
                                  {user.role?.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <MapPin className="h-4 w-4" />
                                <span className="font-medium">Community Details</span>
                              </div>
                              <p className="font-semibold text-gray-900">{dashboardData?.user.pgCommunity.name}</p>
                              <p className="text-sm text-gray-600">Code: {dashboardData?.user.pgCommunity.pgCode}</p>
                              <p className="text-xs text-gray-500 mt-1">{dashboardData?.user.pgCommunity.address}</p>
                            </div>
                            
                            <motion.button 
                              className="w-full bg-orange-50 hover:bg-orange-100 text-[#FF4500] px-4 py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Settings className="h-4 w-4" />
                              Edit Profile
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>

                      {/* Quick Actions */}
                      <motion.div variants={cardVariants} whileHover="hover">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 h-full">
                          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                            <PlusCircle className="h-5 w-5 text-[#FF4500]" />
                            Quick Actions
                          </h3>
                          <div className="space-y-3">
                            <motion.button 
                              className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-3 rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <AlertCircle className="h-4 w-4" />
                              Report New Issue
                            </motion.button>
                            
                            <motion.button 
                              className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Wrench className="h-4 w-4" />
                              Request Service
                            </motion.button>
                            
                            <motion.button 
                              className="w-full bg-green-50 hover:bg-green-100 text-green-700 px-4 py-3 rounded-xl transition-colors font-medium text-sm flex items-center gap-2"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Calendar className="h-4 w-4" />
                              Browse Events
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  {/* Mobile Voice Assistant */}
                  {isMobile && (
                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Mic className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">Voice Assistant</h3>
                            <p className="text-sm text-white/80">Speak to raise issues or check status</p>
                          </div>
                        </div>
                        <motion.button 
                          className="w-full bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl transition-colors font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Mic className="h-4 w-4 mr-2 inline-block" />
                          Tap to Speak
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                  {/* Recent Activities */}
                  <motion.div variants={cardVariants} whileHover="hover">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Recent Activities</h3>
                      <div className="space-y-3">
                        {dashboardData?.recentActivities.slice(0, isMobile ? 3 : 5).map((activity, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-shrink-0">
                              {activity.type === 'ISSUE' && <AlertCircle className="h-5 w-5 text-red-500" />}
                              {activity.type === 'SERVICE' && <Wrench className="h-5 w-5 text-blue-500" />}
                              {activity.type === 'EVENT_ATTENDANCE' && <Calendar className="h-5 w-5 text-green-500" />}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-sm">{activity.title}</p>
                              <p className="text-xs text-gray-600">{activity.description}</p>
                              <p className="text-xs text-gray-400">
                                {new Date(activity.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                        {!dashboardData?.recentActivities.length && (
                          <p className="text-center text-gray-500 py-4">No recent activities</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'issues' && (
                <motion.div
                  key="issues"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-4"
                >
                  <motion.div variants={containerVariants} className="space-y-4">
                    {userIssues.map((issue, index) => (
                      <motion.div
                        key={issue.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                              <Badge variant="outline">#{issue.ticketNumber}</Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge className={getPriorityColor(issue.priorityLevel)}>
                                {issue.priorityLevel}
                              </Badge>
                              <Badge className={getStatusColor(issue.status)}>
                                {getStatusIcon(issue.status)}
                                <span className="ml-1">{issue.status.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{issue.issueType}</p>
                            {issue.assignedTechnician && (
                              <p className="text-sm text-gray-600">
                                Assigned: {issue.assignedTechnician.name} ({issue.assignedTechnician.speciality})
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Created: {new Date(issue.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {!userIssues.length && (
                      <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100"
                      >
                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">You haven't raised any issues yet.</p>
                        <motion.button 
                          className="bg-[#FF4500] text-white px-4 py-2 rounded-xl hover:bg-[#E03E00] transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                          Raise Your First Issue
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-4"
                >
                  <motion.div variants={containerVariants} className="space-y-4">
                    {userServices.map((service, index) => (
                      <motion.div
                        key={service.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{service.title}</h3>
                              <Badge variant="outline">#{service.ticketNumber}</Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge className={getPriorityColor(service.priorityLevel)}>
                                {service.priorityLevel}
                              </Badge>
                              <Badge className={getStatusColor(service.status)}>
                                {getStatusIcon(service.status)}
                                <span className="ml-1">{service.status.replace('_', ' ')}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{service.serviceType}</p>
                            {service.assignedTechnician && (
                              <p className="text-sm text-gray-600">
                                Assigned: {service.assignedTechnician.name} ({service.assignedTechnician.speciality})
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-2">
                              Requested: {new Date(service.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                    {!userServices.length && (
                      <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-2xl p-8 text-center shadow-sm border border-orange-100"
                      >
                        <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">You haven't requested any services yet.</p>
                        <motion.button 
                          className="bg-[#FF4500] text-white px-4 py-2 rounded-xl hover:bg-[#E03E00] transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                          Request Your First Service
                        </motion.button>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'events' && (
                <motion.div
                  key="events"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 space-y-6"
                >
                  <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
                    {/* Upcoming Events */}
                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 h-full">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <CalendarDays className="h-5 w-5 text-[#FF4500]" />
                          Upcoming Events
                        </h3>
                        <div className="space-y-3">
                          {upcomingEvents.slice(0, 3).map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.eventType}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Users className="h-3 w-3 mr-1" />
                                  {event._count.attendances} registered
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                          {!upcomingEvents.length && (
                            <p className="text-center text-gray-500 py-4">No upcoming events</p>
                          )}
                        </div>
                      </div>
                    </motion.div>

                    {/* Event History */}
                    <motion.div variants={cardVariants} whileHover="hover">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 h-full">
                        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                          <History className="h-5 w-5 text-[#FF4500]" />
                          My Event History
                        </h3>
                        <div className="space-y-3">
                          {userEvents.slice(0, 3).map((event, index) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                              <h4 className="font-medium text-gray-900">{event.title}</h4>
                              <p className="text-sm text-gray-600">{event.eventType}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(event.startDate).toLocaleDateString()}
                              </p>
                              {event.userAttendanceStatus && (
                                <Badge 
                                  variant="outline" 
                                  className={`mt-2 text-xs ${
                                    event.userAttendanceStatus === 'ATTENDED' 
                                      ? 'bg-green-100 text-green-800' 
                                      : event.userAttendanceStatus === 'MISSED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                                >
                                  {event.userAttendanceStatus}
                                </Badge>
                              )}
                            </motion.div>
                          ))}
                          {!userEvents.length && (
                            <p className="text-center text-gray-500 py-4">No events attended yet</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default ResidentDashboard;