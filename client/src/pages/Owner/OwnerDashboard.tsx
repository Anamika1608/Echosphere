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

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F8F5FF 0%, #F0EBFF 21.63%, #E8D5FF 45.15%, #E6D5FF 67.31%, #F7F3FF 100%)' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center px-4" style={{ backgroundImage: 'radial-gradient(292.12% 100% at 50% 0%, #F8F5FF 0%, #F0EBFF 21.63%, #E8D5FF 45.15%, #E6D5FF 67.31%, #F7F3FF 100%)' }}>
        <div className="bg-white rounded-3xl p-6 shadow-xl w-full max-w-sm">
          <div className="text-purple-600 text-center mb-4 text-sm">{error}</div>
          <button
            onClick={loadDashboardData}
            className="w-full bg-purple-500 text-white px-4 py-3 rounded-2xl hover:bg-purple-600 transition-colors text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6" style={
                      {backgroundImage: 'radial-gradient(104.28% 128.18% at 100% 83.82%, #E8D5FF 0%, #F0EBFF 19.71%, #F8F5FF 57.21%, #FCFAFF 72.6%, #E6D5FF 100%)'}
                    }>
      <div className="max-w-6xl mx-auto">
        {/* Header - Mobile First */}
        <div className="mb-8">
          {/* Title Section */}
          <div className="text-center mb-6">
            <h1 className="text-3xl pt-4 font-bold tracking-tight text-gray-900 mb-2">
              Community owner dashboard{' '}
    
            </h1>
            <p className="text-purple-800 text-sm py-4 px-4 leading-relaxed max-w-sm mx-auto">
              Manage your <strong className="font-bold">paying guest communities</strong> with smart insights and instant support.
            </p>
          </div>

          {/* Action Buttons - Mobile Stacked */}
          <div className="flex flex-col gap-3 mb-6">
            <button
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
            </button>

            {/* User Profile - Mobile Optimized */}

          </div>
        </div>
      </div>

      {/* Overview Cards - Mobile Grid */}


        {/* Main Content - Mobile Stacked */}
        <div className="space-y-6">
          {/* Communities List - Mobile Full Width */}
          <Card className="border-transparent rounded-2xl bg-white/70 shadow-lg">
            <CardHeader className=" px-4">
              <CardTitle className="text-lg font-bold text-gray-900">My Communities</CardTitle>
            </CardHeader>
            <div className="px-4">
              {communities.length === 0 ? (
                <div className="text-center py-8">
                  <BuildingOfficeIcon className="mx-auto h-12 w-12 text-purple-300 mb-4" />
                  <h3 className="text-base font-semibold text-gray-900 mb-2">No communities yet</h3>
                  <p className="text-purple-600 text-sm mb-4">Get started by creating your first PG community.</p>
                  <button
                    onClick={handleCreateNew}
                    className="bg-purple-200 text-purple-700 hover:bg-purple-600 hover:text-white px-6 py-3 rounded-2xl  transition-colors font-semibold text-sm mx-auto"
                  >
                    Create Community
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {communities.map((community) => (
                    <Card key={community.id} className="border-white rounded-xl hover:border-purple-300 shadow-none hover:shadow-md transition-all duration-300" style={{
  borderRadius: 16,
  border: '1px solid #FFF',
  background: 'radial-gradient(204.74% 70% at 50% 50%, #FFF 0.96%, #F0EBFF 28.85%, #D8B4FE 64.9%, #A78BFA 100%)',
  boxShadow: '1px 3px 6.1px 0 rgba(138, 43, 226, 0.20)'
}}>
                      <div className="px-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 cursor-pointer" onClick={() => handleViewCommunity(community)}>
                            <h3 className="text-base font-regular text-purple-900  transition-colors mb-1">{community.name}</h3>
                            <p className="text-xs text-purple-800 mb-1">Code: <span className="font-semibold">{community.pgCode}</span></p>
                            <p className="text-purple-700 text-xs mb-2">{community.address}</p>
                            {community.description && (
                              <p className="text-purple-700 text-xs line-clamp-2">{community.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-1 ml-3">
                            <button
                              onClick={() => handleEditCommunity(community)}
                              className="text-purple-600 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-100 transition-colors"
                              title="Edit Community"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(community)}
                              className="text-purple-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete Community"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card> {overview && (
          <div className="grid grid-cols-2 gap-4 mb-8 items-center justify-center mx-7">
            <Card className="border-transparent rounded-4xl hover:border-purple-300 hover:shadow-lg transition-all w-40 h-40 duration-300 bg-white/80">
              <CardHeader className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium text-purple-600 mb-1">Communities</p>
                  <p className="text-xl font-bold text-purple-900">{overview.totalCommunities}</p>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-transparent rounded-4xl hover:border-purple-300 hover:shadow-lg transition-all w-40 h-40 duration-300 bg-white/80">
              <CardHeader className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-2">
                    <UsersIcon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <p className="text-xs font-medium text-purple-600 mb-1">Residents</p>
                  <p className="text-xl font-bold text-purple-900">{overview.totalResidents}</p>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-transparent rounded-4xl hover:border-purple-300 hover:shadow-lg transition-all w-40 h-40 duration-300 bg-white/80">
              <CardHeader className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-2">
                    <ChartBarIcon className="h-5 w-5 text-violet-600" />
                  </div>
                  <p className="text-xs font-medium text-purple-600 mb-1">Active Issues</p>
                  <p className="text-xl font-bold text-purple-900">{overview.totalIssues}</p>
                </div>
              </CardHeader>
            </Card>
            
            <Card className="border-transparent rounded-4xl hover:border-purple-300 hover:shadow-lg transition-all w-40 h-40 duration-300 bg-white/80">
              <CardHeader className="p-4">
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-2">
                    <WrenchScrewdriverIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <p className="text-xs font-medium text-purple-600 mb-1">Technicians</p>
                  <p className="text-xl font-bold text-purple-900">{overview.totalTechnicians}</p>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}
          <div className="bg-white/80 rounded-2xl p-4 shadow-lg">
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
                <button 
                  onClick={handleLogout}
                  disabled={logoutLoading}
                  className="text-purple-400 hover:text-purple-600 p-2 rounded-xl hover:bg-purple-100 disabled:opacity-50 transition-colors"
                  title="Logout"
                >
                  {logoutLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
                  ) : (
                    <LogOut className="h-5 w-5" />
                  )}
                </button>
              </div>
          {/* Recent Activities - Mobile Full Width */}

        </div>
      </div>
<Card className="border-transparent rounded-2xl mt-8 bg-white/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-purple-900">Recent Activities</CardTitle>
            </CardHeader>
            <div className="p-4">
              {activities && activities.length > 0 ? (
                <div className="space-y-3">
                  {activities.slice(0, 6).map((activity) => (
                    <div key={activity.id} className="border-l-4 border-purple-400 pl-3 py-2">
                      <p className="text-xs text-purple-800 font-medium leading-relaxed">{activity.description}</p>
                      <p className="text-xs text-purple-600 mt-1">
                        {activity.userName} • {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <BellIcon className="mx-auto h-10 w-10 text-purple-300 mb-2" />
                  <p className="text-purple-500 text-xs">No recent activities</p>
                </div>
              )}
            </div>
          </Card>
      {/* Create Community Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <CreatePgCommunityForm
              onSuccess={handleCreateSuccess}
              onCancel={handleCreateCancel}
            />
          </div>
        </div>
      )}

      {/* Edit Community Modal */}
      {showEditModal && selectedCommunity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <EditPgCommunityForm
              community={selectedCommunity}
              onSuccess={handleEditSuccess}
              onCancel={handleEditCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PgOwnerDashboard;