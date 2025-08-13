import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  BellIcon

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
    setIsMenuOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
      <div className="max-w-5xl mx-auto">
        {/* Header - Desktop & Mobile */}
        <div className="mb-8">
          {/* Desktop Header */}
          <div className="hidden lg:block">
            <div className="flex justify-between items-center mb-8">
              <div className='py-10'>
                <h1 className="text-4xl xl:text-5xl font-bold tracking-tighter text-gray-900 mb-2 leading-tight">
                  Resident{' '}
                  <span className="text-orange-400">Dashboard</span>
                </h1>
                <p className="text-gray-500 text-lg font-light">
                  Manage your <strong className="font-bold">community living</strong> experience with instant support.
                </p>
              </div>

              {/* Desktop User Profile */}
              <Card
                className="border-0 rounded-2xl p-4"
                style={{
                  background: '#F4F4F4',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  border: '2px solid rgba(255,255,255,0.95)'
                }}
              >
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-200">
                      {user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                          <User className="h-6 w-6 text-orange-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-gray-600 text-sm">{dashboardData?.user.pgCommunity.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleUserLogout}
                    className="text-orange-500 hover:text-orange-700 p-2 rounded-xl hover:bg-orange-100 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </Card>
            </div>

            {/* Desktop Navigation */}
            <div className="flex gap-2 mb-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${activeTab === tab.id
                        ? 'text-white shadow-lg'
                        : 'bg-white/70 text-gray-600 hover:bg-white hover:shadow-md'
                      }`}
                    style={activeTab === tab.id ? {
                      background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
                      boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
                    } : {}}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="bg-white rounded-2xl p-4 mb-6 shadow-lg shadow-black/5 border border-orange-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="profile"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-orange-100 flex items-center justify-center rounded-xl">
                        <User className="h-5 w-5 text-orange-600" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">{user?.name}</h1>
                    <p className="text-xs text-gray-500">{dashboardData?.user.pgCommunity.name}</p>
                  </div>
                </div>

                {/* Hamburger Menu Button */}
                <button
                  onClick={toggleMenu}
                  className="text-gray-600 hover:text-orange-600 p-2 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Tab Indicator */}
            <div className="mb-6">
              <Card
                className="border-0 rounded-2xl p-4"
                style={{
                  background: '#F4F4F4',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                  border: '2px solid rgba(255,255,255,0.95)'
                }}
              >
                <div className="flex items-center justify-between ">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h2>
                    <p className="text-sm text-gray-500">Resident Dashboard</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    {(() => {
                      const activeTabConfig = tabs.find(tab => tab.id === activeTab);
                      const Icon = activeTabConfig?.icon || TrendingUp;
                      return <Icon className="h-6 w-6 text-orange-600" />;
                    })()}
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={toggleMenu}>
            <div className="absolute top-2 right-2 w-[96%] rounded-xl bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
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

                {/* Navigation Tabs */}
                <nav className="mb-6">
                  <ul className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <li key={tab.id}>
                          <button
                            onClick={() => handleTabChange(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${activeTab === tab.id
                                ? 'text-white shadow-lg'
                                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                              }`}
                            style={activeTab === tab.id ? {
                              background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)'
                            } : {}}
                          >
                            <Icon className="h-5 w-5" />
                            {tab.label}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Quick Actions */}
                <div className="space-y-3">
                  <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-2xl transition-all duration-200">
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
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                <Card
                  className="border-0 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: '#F4F4F4',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    border: '2px solid rgba(255,255,255,0.95)'
                  }}
                >
                  <CardHeader className="p-4 lg:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: 'linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)' }}
                      >
                        <AlertCircle className="h-6 w-6 text-orange-700" />
                      </div>
                      <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Issues Raised</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardData?.quickStats.totalIssuesRaised || 0}</p>
                      {dashboardData?.quickStats.pendingIssues ? (
                        <p className="text-xs text-orange-600 mt-1">
                          {dashboardData.quickStats.pendingIssues} pending
                        </p>
                      ) : null}
                    </div>
                  </CardHeader>
                </Card>

                <Card
                  className="border-0 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: '#F4F4F4',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    border: '2px solid rgba(255,255,255,0.95)'
                  }}
                >
                  <CardHeader className="p-4 lg:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: 'linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)' }}
                      >
                        <Wrench className="h-6 w-6 text-orange-700" />
                      </div>
                      <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Services</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardData?.quickStats.totalServicesRequested || 0}</p>
                      {dashboardData?.quickStats.pendingServices ? (
                        <p className="text-xs text-orange-600 mt-1">
                          {dashboardData.quickStats.pendingServices} pending
                        </p>
                      ) : null}
                    </div>
                  </CardHeader>
                </Card>

                <Card
                  className="border-0 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: '#F4F4F4',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    border: '2px solid rgba(255,255,255,0.95)'
                  }}
                >
                  <CardHeader className="p-4 lg:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: 'linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)' }}
                      >
                        <Calendar className="h-6 w-6 text-orange-700" />
                      </div>
                      <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Events Attended</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardData?.quickStats.totalEventsAttended || 0}</p>
                    </div>
                  </CardHeader>
                </Card>

                <Card
                  className="border-0 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: '#F4F4F4',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                    border: '2px solid rgba(255,255,255,0.95)'
                  }}
                >
                  <CardHeader className="p-4 lg:p-6">
                    <div className="flex flex-col items-center text-center">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: 'linear-gradient(135deg, #FFE4CC 0%, #FFB366 100%)' }}
                      >
                        <CalendarDays className="h-6 w-6 text-orange-700" />
                      </div>
                      <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">Upcoming</p>
                      <p className="text-xl lg:text-2xl font-bold text-gray-900">{dashboardData?.quickStats.upcomingEvents || 0}</p>
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Assistant Card */}
                <Card
                  className="border-0 rounded-2xl"
                  style={{
                    background: 'white',
                    boxShadow: '0 15px 30px rgba(255, 88, 53, 0.3)',
                  }}
                >
                  <div className="p-6 text-black ">    
                    <div className='flex flex-col items-center'><h3 className=" text-lg">Voice Assistant</h3><div className="flex justify-center items-center h-[160px] sm:h-[223px] mt-6 mx-auto relative">
                      <Spline scene="../../../../../public/spline.spline" />

                      {/* Overlay div to disable interaction */}
                      <div className="absolute inset-0 z-10" style={{ cursor: 'default' }}></div>
                    </div><button className=" bg-orange-100 hover:bg-white/30  text-black px-4 py-3 rounded-xl transition-colors font-medium">
                      <Mic className="h-4 w-4 mr-2 inline-block" />
                      Tap to Speak
                    </button></div>
                    
                  </div>
                </Card>

                {/* Recent Activities */}
                <Card
                  className="border-0 rounded-2xl"
                  style={{
                    background: '#F4F4F4',
                    boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                    border: '2px solid rgba(255,255,255,0.95)'
                  }}
                >
                  <CardHeader className="px-6">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <BellIcon className="h-5 w-5 text-orange-600" />
                      Recent Activities
                    </CardTitle>
                  </CardHeader>
                  <div className="px-6 pb-6">
                    <div className="space-y-3">
                      {dashboardData?.recentActivities.slice(0, 4).map((activity, index) => (
                        <div key={index} className="border-l-4 border-orange-400 pl-4 py-3 bg-white/50 rounded-r-lg">
                          <p className="text-sm text-gray-700 font-medium leading-relaxed">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                      {!dashboardData?.recentActivities.length && (
                        <div className="text-center py-8">
                          <BellIcon className="mx-auto h-10 w-10 text-orange-300 mb-3" />
                          <p className="text-gray-500 text-sm">No recent activities</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}

          {activeTab === 'issues' && (
            <Card
              className="border-0 rounded-2xl"
              style={{
                background: '#F4F4F4',
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                border: '2px solid rgba(255,255,255,0.95)'
              }}
            >
              <CardHeader className="px-4 lg:px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">My Issues</CardTitle>
                  <button
                    className="text-white px-4 py-2 rounded-xl transition-all font-semibold text-sm hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
                      boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                    Raise Issue
                  </button>
                </div>
              </CardHeader>
              <div className="px-4 lg:px-6 pb-6">
                {userIssues.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="mx-auto h-12 w-12 text-orange-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues yet</h3>
                    <p className="text-gray-500 mb-6">You haven't raised any issues yet.</p>
                    <button className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-6 py-3 rounded-xl transition-colors font-semibold text-sm">
                      <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                      Raise Your First Issue
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {userIssues.map((issue) => (
                      <Card
                        key={issue.id}
                        className="border-0 rounded-xl hover:shadow-lg transition-all duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          border: '1px solid rgba(255,255,255,0.95)'
                        }}
                      >
                        <div className="p-4">
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
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'services' && (
            <Card
              className="border-0 rounded-2xl"
              style={{
                background: '#F4F4F4',
                boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                border: '2px solid rgba(255,255,255,0.95)'
              }}
            >
              <CardHeader className="px-4 lg:px-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900">My Services</CardTitle>
                  <button
                    className="text-white px-4 py-2 rounded-xl transition-all font-semibold text-sm hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
                      boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
                    }}
                  >
                    <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                    Request Service
                  </button>
                </div>
              </CardHeader>
              <div className="px-4 lg:px-6 pb-6">
                {userServices.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="mx-auto h-12 w-12 text-orange-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No services yet</h3>
                    <p className="text-gray-500 mb-6">You haven't requested any services yet.</p>
                    <button className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-6 py-3 rounded-xl transition-colors font-semibold text-sm">
                      <PlusCircle className="h-4 w-4 mr-2 inline-block" />
                      Request Your First Service
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {userServices.map((service) => (
                      <Card
                        key={service.id}
                        className="border-0 rounded-xl hover:shadow-lg transition-all duration-300"
                        style={{
                          background: 'rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                          border: '1px solid rgba(255,255,255,0.95)'
                        }}
                      >
                        <div className="p-4">
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
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          )}

          {activeTab === 'events' && (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
              {/* Upcoming Events */}
              <Card
                className="border-0 rounded-2xl"
                style={{
                  background: '#F4F4F4',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                  border: '2px solid rgba(255,255,255,0.95)'
                }}
              >
                <CardHeader className="px-4 lg:px-6">
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-orange-600" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <div className="px-4 lg:px-6 pb-6">
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <CalendarDays className="mx-auto h-10 w-10 text-orange-300 mb-3" />
                      <p className="text-gray-500">No upcoming events</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {upcomingEvents.map((event) => (
                        <Card
                          key={event.id}
                          className="border-0 rounded-xl hover:shadow-lg transition-all duration-300"
                          style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(255,255,255,0.95)'
                          }}
                        >
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                            <p className="text-sm text-gray-600 mb-1">{event.eventType}</p>
                            <p className="text-xs text-gray-500 mb-3">
                              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                            </p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Users className="h-3 w-3 mr-1" />
                                {event._count.attendances} registered
                              </Badge>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Event History */}
              <Card
                className="border-0 rounded-2xl"
                style={{
                  background: '#F4F4F4',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                  border: '2px solid rgba(255,255,255,0.95)'
                }}
              >
                <CardHeader className="px-4 lg:px-6">
                  <CardTitle className="text-lg lg:text-xl font-bold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5 text-orange-600" />
                    My Event History
                  </CardTitle>
                </CardHeader>
                <div className="px-4 lg:px-6 pb-6">
                  {userEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <History className="mx-auto h-10 w-10 text-orange-300 mb-3" />
                      <p className="text-gray-500">No events attended yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {userEvents.map((event) => (
                        <Card
                          key={event.id}
                          className="border-0 rounded-xl hover:shadow-lg transition-all duration-300"
                          style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            border: '1px solid rgba(255,255,255,0.95)'
                          }}
                        >
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 mb-2">{event.title}</h4>
                            <p className="text-sm text-gray-600 mb-1">{event.eventType}</p>
                            <p className="text-xs text-gray-500 mb-3">
                              {new Date(event.startDate).toLocaleDateString()}
                            </p>
                            {event.userAttendanceStatus && (
                              <Badge
                                variant="outline"
                                className={`text-xs ${event.userAttendanceStatus === 'ATTENDED'
                                    ? 'bg-green-100 text-green-800'
                                    : event.userAttendanceStatus === 'MISSED'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}
                              >
                                {event.userAttendanceStatus}
                              </Badge>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResidentDashboard;