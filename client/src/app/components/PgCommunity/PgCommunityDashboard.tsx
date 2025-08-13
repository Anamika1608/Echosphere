import React, { useState, useEffect } from 'react';
import { pgCommunityService } from '../../../services/pgCommunityService';
import type { PgCommunity } from '../../../types/pgCommunity';

import { PlusIcon, BuildingOfficeIcon, UsersIcon, ChartBarIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface PgCommunityDashboardProps {
    onCreateNew: () => void;
    onEditCommunity: (community: PgCommunity) => void;
    onViewResidents: (community: PgCommunity) => void;
    onViewStats: (community: PgCommunity) => void;
}

const PgCommunityDashboard: React.FC<PgCommunityDashboardProps> = ({
    onCreateNew,
    onEditCommunity,
    onViewResidents,
    onViewStats
}) => {
    const [communities, setCommunities] = useState<PgCommunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCommunities();
    }, []);

    const loadCommunities = async () => {
        try {
            setLoading(true);
            const data = await pgCommunityService.getMyPgCommunities();
            setCommunities(data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load communities');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (community: PgCommunity) => {
        if (window.confirm(`Are you sure you want to delete "${community.name}"? This action cannot be undone.`)) {
            try {
                await pgCommunityService.deletePgCommunity(community.id);
                setCommunities(communities.filter(c => c.id !== community.id));
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
                    onClick={loadCommunities}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My PG Communities</h1>
                    <p className="text-gray-600 mt-1">Manage your paying guest communities</p>
                </div>
                <button
                    onClick={onCreateNew}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    Create New Community
                </button>
            </div>

            {/* Communities Grid */}
            {communities.length === 0 ? (
                <div className="text-center py-12">
                    <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No communities</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating your first PG community.</p>
                    <div className="mt-6">
                        <button
                            onClick={onCreateNew}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        >
                            Create Community
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {communities.map((community) => (
                        <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                                    <p className="text-sm text-gray-500">Code: {community.pgCode}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => onEditCommunity(community)}
                                        className="text-gray-400 hover:text-blue-600"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(community)}
                                        className="text-gray-400 hover:text-red-600"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{community.address}</p>

                            {community.description && (
                                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{community.description}</p>
                            )}

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => onViewResidents(community)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                                >
                                    <UsersIcon className="h-4 w-4" />
                                    Residents
                                </button>
                                <button
                                    onClick={() => onViewStats(community)}
                                    className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-200 flex items-center justify-center gap-1"
                                >
                                    <ChartBarIcon className="h-4 w-4" />
                                    Stats
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PgCommunityDashboard
