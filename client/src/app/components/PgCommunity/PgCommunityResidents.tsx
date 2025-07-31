import React, { useState, useEffect } from 'react';
import { pgCommunityService } from '../../../services/pgCommunityService';
import type { PgCommunity, Resident } from '../../../types/pgCommunity';
import { UsersIcon, BuildingOfficeIcon, ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface PgCommunityResidentsProps {
    community: PgCommunity;
    onBack: () => void;
}

const PgCommunityResidents: React.FC<PgCommunityResidentsProps> = ({ community, onBack }) => {
    const [residents, setResidents] = useState<Resident[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadResidents();
    }, [community.id]);

    const loadResidents = async () => {
        try {
            setLoading(true);
            const data = await pgCommunityService.getPgCommunityResidents(community.id);
            setResidents(data.residents);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load residents');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Residents</h1>
                </div>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="text-red-800">{error}</div>
                    <button
                        onClick={loadStats}
                        className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
                        <ArrowLeftIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
                </div>
                <div className="text-center py-12">
                    <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No statistics available</h3>
                    <p className="mt-1 text-sm text-gray-500">Statistics data is not available for this community.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
                    <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Statistics</h1>
                    <p className="text-gray-600">{community.name} - {community.pgCode}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <UsersIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Residents</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalResidents}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <ChartBarIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Occupancy Rate</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.occupancyRate}%</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalRooms}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-green-500">₹</span>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                                    <dd className="text-lg font-medium text-gray-900">₹{stats.monthlyRevenue.toLocaleString()}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Room Occupancy</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-sm">
                            <span>Occupied Rooms</span>
                            <span>{stats.occupiedRooms} / {stats.totalRooms}</span>
                        </div>
                        <div className="mt-1 relative pt-1">
                            <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                                <div
                                    style={{ width: `${stats.occupancyRate}%` }}
                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PgCommunityResidents