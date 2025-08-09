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
            <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center px-4 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
                <div 
                    className="bg-white rounded-2xl p-6 w-full max-w-sm"
                    style={{
                        boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(255,255,255,0.95)'
                    }}
                >
                    <div className="text-orange-600 text-center mb-4 text-sm">{error}</div>
                    <button
                        onClick={loadCommunities}
                        className="w-full text-white px-4 py-3 rounded-xl hover:shadow-lg transition-all text-sm font-semibold"
                        style={{
                            background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
                            boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 py-6 bg-gradient-to-br from-orange-50 via-peach-50 to-orange-100">
            <div className="max-w-6xl mx-auto">
                {/* Header - Mobile First */}
                <div className="mb-8">
                    {/* Title Section */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl pt-4 font-bold tracking-tighter text-gray-900 mb-4 leading-tight">
                            My PG{' '}
                            <span className="text-orange-400">Communities</span>
                        </h1>
                        <p className="text-gray-500 text-sm sm:text-base py-4 px-4 leading-relaxed max-w-md mx-auto font-light">
                            Manage your <strong className="font-bold">paying guest communities</strong> with smart insights and instant support.
                        </p>
                    </div>

                    {/* Action Button - Hero Style */}
                    <div className="flex flex-col items-center gap-4 mb-8">
                        <button
                            onClick={onCreateNew}
                            className="text-white px-8 py-4 rounded-xl transition-all flex items-center gap-3 font-semibold text-base hover:shadow-lg transform hover:scale-105"
                            style={{
                                background: 'linear-gradient(95deg, #FFD0A2 4.5%, #FEB070 13.38%, #FF994F 31.58%, #FF7835 57.33%, #FF661F 79.98%, #FF5000 96.85%)',
                                boxShadow: '1.26px 3.78px 7.686px 0 rgba(0, 0, 0, 0.20)'
                            }}
                        >
                            <PlusIcon className="h-5 w-5" />
                            Create New Community
                        </button>
                    </div>
                </div>

                {/* Communities Grid */}
                {communities.length === 0 ? (
                    <div 
                        className="rounded-2xl p-8 sm:p-12 text-center"
                        style={{
                            background: '#F4F4F4',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
                            border: '2px solid rgba(255,255,255,0.95)'
                        }}
                    >
                        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-orange-300 mb-4" />
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No communities yet</h3>
                        <p className="text-gray-500 text-sm sm:text-base mb-6">Get started by creating your first PG community.</p>
                        <button
                            onClick={onCreateNew}
                            className="bg-orange-100 text-orange-600 hover:bg-orange-200 px-6 py-3 rounded-xl transition-colors font-semibold text-sm"
                        >
                            Create Community
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {communities.map((community) => (
                            <div 
                                key={community.id} 
                                className="rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                style={{
                                    background: '#F4F4F4',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                                    border: '2px solid rgba(255,255,255,0.95)'
                                }}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">{community.name}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600 mb-1">Code: <span className="font-semibold text-orange-600">{community.pgCode}</span></p>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => onEditCommunity(community)}
                                            className="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-100 transition-colors"
                                            title="Edit Community"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(community)}
                                            className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Delete Community"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-2">{community.address}</p>

                                {community.description && (
                                    <p className="text-gray-500 text-xs sm:text-sm mb-4 line-clamp-2">{community.description}</p>
                                )}

                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button
                                        onClick={() => onViewResidents(community)}
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs sm:text-sm hover:shadow-md transition-all flex items-center justify-center gap-1 font-medium"
                                    >
                                        <UsersIcon className="h-4 w-4" />
                                        Residents
                                    </button>
                                    <button
                                        onClick={() => onViewStats(community)}
                                        className="flex-1 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-xs sm:text-sm hover:shadow-md transition-all flex items-center justify-center gap-1 font-medium"
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
        </div>
    );
};

export default PgCommunityDashboard
