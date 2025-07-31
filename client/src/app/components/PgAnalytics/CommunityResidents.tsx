import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  UsersIcon, 
  PhoneIcon, 
  EnvelopeIcon, 
  CalendarIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

import { serverUrl } from '@/utils';

interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  roomNumber?: string;
  joinedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
  profilePicture?: string;
}

interface ResidentsData {
  pgCommunity: {
    id: string;
    name: string;
    pgCode: string;
  };
  residents: Resident[];
  count: number;
}

interface CommunityResidentsProps {
  communityId: string;
}

const CommunityResidents: React.FC<CommunityResidentsProps> = ({ communityId }) => {
  const [residentsData, setResidentsData] = useState<ResidentsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  useEffect(() => {
    loadResidents();
  }, [communityId]);

  const loadResidents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/pg-community/${communityId}/residents`, {
        withCredentials: true
      });
      setResidentsData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load residents');
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residentsData?.residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resident.phone.includes(searchTerm) ||
                         (resident.roomNumber && resident.roomNumber.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'ALL' || resident.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-20 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={loadResidents}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Residents</h2>
          <p className="text-gray-600 mt-1">
            {residentsData?.count || 0} residents in {residentsData?.pgCommunity.name}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search residents by name, email, phone, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE')}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Residents List */}
      {filteredResidents.length === 0 ? (
        <div className="text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || statusFilter !== 'ALL' ? 'No residents found' : 'No residents yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || statusFilter !== 'ALL' 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Residents will appear here once they join your community.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResidents.map((resident) => (
            <div key={resident.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-4">
                {/* Profile Picture */}
                <div className="flex-shrink-0">
                  {resident.profilePicture ? (
                    <img
                      src={resident.profilePicture}
                      alt={resident.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 font-medium text-lg">
                        {resident.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Resident Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {resident.name}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      resident.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {resident.status}
                    </span>
                  </div>
                  
                  {resident.roomNumber && (
                    <p className="text-sm text-gray-600 mb-2">Room: {resident.roomNumber}</p>
                  )}

                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      <span className="truncate">{resident.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2" />
                      <span>{resident.phone}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Joined {new Date(resident.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredResidents.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>
              Showing {filteredResidents.length} of {residentsData?.count || 0} residents
            </span>
            <div className="flex space-x-4">
              <span>
                Active: {filteredResidents.filter(r => r.status === 'ACTIVE').length}
              </span>
              <span>
                Inactive: {filteredResidents.filter(r => r.status === 'INACTIVE').length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityResidents;