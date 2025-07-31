import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, BuildingOfficeIcon, UsersIcon, ChartBarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { PgCommunity } from '../../types/pgCommunity';
import { serverUrl } from '@/utils';

interface DashboardOverview {
  totalCommunities: number;
  totalResidents: number;
  totalIssues: number;
  totalEvents: number;
  recentActivities: Array<{
    id: string;
    type: string;
    message: string;
    createdAt: string;
    pgCommunityId: string;
    pgCommunityName: string;
  }>;
}

const PgOwnerDashboard: React.FC = () => {
  const [communities, setCommunities] = useState<PgCommunity[]>([]);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load communities and dashboard overview
      const [communitiesRes] = await Promise.all([
        axios.get(`${serverUrl}/pg-community/my-communities`, { withCredentials: true }),
      ]);

      setCommunities(communitiesRes.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    // show the create new modal
  };

  const handleEditCommunity = (community: PgCommunity) => {
    // show the edit community modal
  };

  const handleViewCommunity = (community: PgCommunity) => {
    navigate(`/community/${community.id}`);
  };

  const handleDelete = async (community: PgCommunity) => {
    if (window.confirm(`Are you sure you want to delete "${community.name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${serverUrl}/pg-community/${community.id}`, { withCredentials: true });
        setCommunities(communities.filter(c => c.id !== community.id));
        loadDashboardData(); // Refresh overview data
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete community');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
        <button
          onClick={loadDashboardData}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">PG Owner Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your paying guest communities</p>
          </div>
          <button
            onClick={handleCreateNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create New Community
          </button>
        </div>

        {/* Overview Cards */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Communities</p>
                  <p className="text-2xl font-semibold text-gray-900">{overview.totalCommunities}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UsersIcon className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Residents</p>
                  <p className="text-2xl font-semibold text-gray-900">{overview.totalResidents}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active Issues</p>
                  <p className="text-2xl font-semibold text-gray-900">{overview.totalIssues}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Upcoming Events</p>
                  <p className="text-2xl font-semibold text-gray-900">{overview.totalEvents}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Communities List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Communities</h2>
              </div>
              <div className="p-6">
                {communities.length === 0 ? (
                  <div className="text-center py-12">
                    <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No communities</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first PG community.</p>
                    <div className="mt-6">
                      <button
                        onClick={handleCreateNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      >
                        Create Community
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {communities.map((community) => (
                      <div key={community.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 cursor-pointer" onClick={() => handleViewCommunity(community)}>
                            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">{community.name}</h3>
                            <p className="text-sm text-gray-500">Code: {community.pgCode}</p>
                            <p className="text-gray-600 text-sm mt-1">{community.address}</p>
                            {community.description && (
                              <p className="text-gray-500 text-sm mt-2 line-clamp-2">{community.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleEditCommunity(community)}
                              className="text-gray-400 hover:text-blue-600"
                              title="Edit Community"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(community)}
                              className="text-gray-400 hover:text-red-600"
                              title="Delete Community"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
              </div>
              <div className="p-6">
                {overview?.recentActivities && overview.recentActivities.length > 0 ? (
                  <div className="space-y-4">
                    {overview.recentActivities.slice(0, 10).map((activity) => (
                      <div key={activity.id} className="border-l-4 border-blue-200 pl-4">
                        <p className="text-sm text-gray-800">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {activity.pgCommunityName} • {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No recent activities</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PgOwnerDashboard;