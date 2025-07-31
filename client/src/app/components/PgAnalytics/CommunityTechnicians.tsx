// components/community/CommunityTechnicians.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  WrenchScrewdriverIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  PhoneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import CreateTechnicianModal from '../Technician/CreateTechnicianModal';
import EditTechnicianModal from '../Technician/EditTechnicanModal';
import ImportTechnicianModal from '../Technician/ImportTechnicianModal';
import TechnicianWorkloadModal from '../Technician/TechnicianWorkloadModal';

import { serverUrl } from '@/utils';

interface Technician {
  id: string;
  name: string;
  phoneNumber: string;
  speciality: string;
  isAvailable: boolean;
  pgAssignments: Array<{
    pgCommunity: {
      id: string;
      name: string;
      pgCode: string;
    };
  }>;
  _count: {
    assignedIssues: number;
    assignedServices: number;
  };
}

interface CommunityTechniciansProps {
  communityId: string;
}

const CommunityTechnicians: React.FC<CommunityTechniciansProps> = ({ communityId }) => {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialityFilter, setSpecialityFilter] = useState<string>('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showWorkloadModal, setShowWorkloadModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);

  useEffect(() => {
    loadTechnicians();
  }, [communityId, specialityFilter]);

  const loadTechnicians = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      console.log("params", params)
      if (specialityFilter) params.append('speciality', specialityFilter);


      
      const response = await axios.get(`${serverUrl}/technician/pg/${communityId}?${params}`, {
        withCredentials: true
      });
      setTechnicians(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (technician: Technician) => {
    if (window.confirm(`Are you sure you want to delete "${technician.name}"? This action cannot be undone.`)) {
      try {
        await axios.delete(`${serverUrl}/technician/${technician.id}`, {
          withCredentials: true
        });
        loadTechnicians();
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete technician');
      }
    }
  };

  const handleToggleAvailability = async (technician: Technician) => {
    try {
      await axios.put(`${serverUrl}/technician/${technician.id}/availability`, {
        isAvailable: !technician.isAvailable
      }, {
        withCredentials: true
      });
      loadTechnicians();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update availability');
    }
  };

  const filteredTechnicians = technicians.filter(technician => {
    const matchesSearch = technician.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         technician.phoneNumber.includes(searchTerm) ||
                         technician.speciality.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getSpecialityColor = (speciality: string) => {
    const colors = {
      PLUMBING: 'bg-blue-100 text-blue-800',
      ELECTRICAL: 'bg-yellow-100 text-yellow-800',
      CLEANING: 'bg-green-100 text-green-800',
      MAINTENANCE: 'bg-purple-100 text-purple-800',
      SECURITY: 'bg-red-100 text-red-800',
      GARDENING: 'bg-emerald-100 text-emerald-800',
      PAINTING: 'bg-orange-100 text-orange-800',
      CARPENTRY: 'bg-amber-100 text-amber-800',
      GENERAL: 'bg-gray-100 text-gray-800'
    };
    return colors[speciality as keyof typeof colors] || colors.GENERAL;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
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
            onClick={loadTechnicians}
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
          <h2 className="text-2xl font-bold text-gray-900">Technicians</h2>
          <p className="text-gray-600 mt-1">{technicians.length} technicians available</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <UserPlusIcon className="h-5 w-5" />
            Import from Other PGs
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Add Technician
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search technicians by name, phone, or speciality..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={specialityFilter}
          onChange={(e) => setSpecialityFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Specialities</option>
          <option value="PLUMBING">Plumbing</option>
          <option value="ELECTRICAL">Electrical</option>
          <option value="CLEANING">Cleaning</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="SECURITY">Security</option>
          <option value="GARDENING">Gardening</option>
          <option value="PAINTING">Painting</option>
          <option value="CARPENTRY">Carpentry</option>
          <option value="GENERAL">General</option>
        </select>
      </div>

      {/* Technicians List */}
      {filteredTechnicians.length === 0 ? (
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {searchTerm || specialityFilter ? 'No technicians found' : 'No technicians yet'}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || specialityFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Add technicians to manage maintenance and services.'}
          </p>
          {!searchTerm && !specialityFilter && (
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Add New Technician
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Import from Other PGs
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTechnicians.map((technician) => (
            <div key={technician.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{technician.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecialityColor(technician.speciality)}`}>
                    {technician.speciality}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {technician.isAvailable ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500" title="Available" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" title="Unavailable" />
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  <span>{technician.phoneNumber}</span>
                </div>
              </div>

              {/* Workload */}
              <div className="mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Active Tasks:</span>
                  <span className="font-medium">
                    {technician._count.assignedIssues + technician._count.assignedServices}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Issues:</span>
                  <span className="text-orange-600">{technician._count.assignedIssues}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Services:</span>
                  <span className="text-blue-600">{technician._count.assignedServices}</span>
                </div>
              </div>

              {/* Assigned PGs */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Assigned to:</p>
                <div className="flex flex-wrap gap-1">
                  {technician.pgAssignments.map((assignment) => (
                    <span
                      key={assignment.pgCommunity.id}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800"
                    >
                      {assignment.pgCommunity.pgCode}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedTechnician(technician);
                    setShowWorkloadModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(technician)}
                    className={`p-1 rounded ${
                      technician.isAvailable 
                        ? 'text-red-600 hover:text-red-500' 
                        : 'text-green-600 hover:text-green-500'
                    }`}
                    title={technician.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                  >
                    {technician.isAvailable ? (
                      <XCircleIcon className="h-4 w-4" />
                    ) : (
                      <CheckCircleIcon className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTechnician(technician);
                      setShowEditModal(true);
                    }}
                    className="text-gray-600 hover:text-blue-600 p-1 rounded"
                    title="Edit Technician"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(technician)}
                    className="text-gray-600 hover:text-red-600 p-1 rounded"
                    title="Delete Technician"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateTechnicianModal
          communityId={communityId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadTechnicians();
          }}
        />
      )}

      {showEditModal && selectedTechnician && (
        <EditTechnicianModal
          technician={selectedTechnician}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTechnician(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedTechnician(null);
            loadTechnicians();
          }}
        />
      )}

      {showImportModal && (
        <ImportTechnicianModal
          communityId={communityId}
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            loadTechnicians();
          }}
        />
      )}

      {showWorkloadModal && selectedTechnician && (
        <TechnicianWorkloadModal
          technician={selectedTechnician}
          onClose={() => {
            setShowWorkloadModal(false);
            setSelectedTechnician(null);
          }}
        />
      )}
    </div>
  );
};

export default CommunityTechnicians;