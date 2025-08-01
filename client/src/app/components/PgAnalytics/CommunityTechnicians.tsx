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
  XCircleIcon,
  ChevronDownIcon
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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
      PLUMBING: 'bg-orange-100 text-orange-800',
      ELECTRICAL: 'bg-yellow-100 text-yellow-800',
      CLEANING: 'bg-emerald-100 text-emerald-800',
      MAINTENANCE: 'bg-purple-100 text-purple-800',
      SECURITY: 'bg-red-100 text-red-800',
      GARDENING: 'bg-emerald-100 text-emerald-800',
      PAINTING: 'bg-orange-100 text-orange-800',
      CARPENTRY: 'bg-amber-100 text-amber-800',
      GENERAL: 'bg-gray-100 text-gray-800'
    };
    return colors[speciality as keyof typeof colors] || colors.GENERAL;
  };

 const specialityOptions = [
  { value: '', label: 'All Specialities' },
  { value: 'PLUMBING', label: 'Plumbing' },
  { value: 'ELECTRICAL', label: 'Electrical' },
  { value: 'CARPENTRY', label: 'Carpentry' },
  { value: 'CLEANING', label: 'Cleaning' },
  { value: 'PAINTING', label: 'Painting' },
  { value: 'AC_REPAIR', label: 'AC Repair' },
  { value: 'APPLIANCE_REPAIR', label: 'Appliance Repair' },
  { value: 'GENERAL_MAINTENANCE', label: 'General Maintenance' }
];

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-32 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="text-red-800 text-sm">{error}</div>
          <button
            onClick={loadTechnicians}
            className="mt-3 bg-[#FF4500] text-white px-4 py-2 rounded-2xl hover:bg-[#E03E00] transition-colors text-sm font-semibold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header - Mobile First */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Technicians</h2>
          <p className="text-gray-600 text-sm">{technicians.length} technicians available</p>
        </div>
        
        {/* Action Buttons - Mobile Stacked */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-100 text-[#FF4500] hover:bg-[#E03E00] hover:text-white px-6 py-4 rounded-2xl transition-colors flex items-center justify-center mx-auto gap-2 mb-4 mt-2 font-semibold"
          >
            <PlusIcon className="h-5 w-5" />
            Add Technician
          </button>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-purple-100 text-purple-700 hover:bg-[#E03E00] hover:text-white px-6 py-4 rounded-2xl transition-colors flex items-center justify-center mx-auto gap-2 mb-4 font-semibold"
          >
            <UserPlusIcon className="h-5 w-5" />
            Import from Other PGs
          </button>
        </div>
      </div>

      {/* Filters - Mobile Optimized */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search technicians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:border-transparent transition-colors"
          />
        </div>
        
        {/* Custom Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {specialityOptions.find(opt => opt.value === specialityFilter)?.label || 'All Specialities'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {specialityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSpecialityFilter(option.value);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    specialityFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                  } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Technicians List - Mobile Grid */}
      {filteredTechnicians.length === 0 ? (
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">
            {searchTerm || specialityFilter ? 'No technicians found' : 'No technicians yet'}
          </h3>
          <p className="text-gray-500 text-sm mb-6">
            {searchTerm || specialityFilter
              ? 'Try adjusting your search or filter criteria.'
              : 'Add technicians to manage maintenance and services.'}
          </p>
          {!searchTerm && !specialityFilter && (
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#FF4500] text-white px-6 py-3 rounded-2xl hover:bg-[#E03E00] transition-colors font-semibold text-sm"
              >
                Add New Technician
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-purple-500 text-white px-6 py-3 rounded-2xl hover:bg-purple-600 transition-colors font-semibold text-sm"
              >
                Import from Other PGs
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTechnicians.map((technician) => (
            <div key={technician.id} className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-2">{technician.name}</h3>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getSpecialityColor(technician.speciality)}`}>
                    {technician.speciality}
                  </span>
                </div>
                <div className="flex items-center">
                  {technician.isAvailable ? (
                    <CheckCircleIcon className="h-5 w-5 text-emerald-500" title="Available" />
                  ) : (
                    <XCircleIcon className="h-5 w-5 text-red-500" title="Unavailable" />
                  )}
                </div>
              </div>

              {/* Contact Info */}
              <div className="mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <PhoneIcon className="h-4 w-4 mr-2 text-[#FF4500]" />
                  <span>{technician.phoneNumber}</span>
                </div>
              </div>

              {/* Workload */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">
                      {technician._count.assignedIssues + technician._count.assignedServices}
                    </div>
                    <div className="text-gray-500">Total Tasks</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-[#FF4500]">{technician._count.assignedIssues}</div>
                    <div className="text-gray-500">Issues</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-emerald-600">{technician._count.assignedServices}</div>
                    <div className="text-gray-500">Services</div>
                  </div>
                </div>
              </div>

              {/* Assigned PGs */}
              {technician.pgAssignments.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Assigned to:</p>
                  <div className="flex flex-wrap gap-1">
                    {technician.pgAssignments.map((assignment) => (
                      <span
                        key={assignment.pgCommunity.id}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-orange-100 text-orange-800 font-medium"
                      >
                        {assignment.pgCommunity.pgCode}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <button
                  onClick={() => {
                    setSelectedTechnician(technician);
                    setShowWorkloadModal(true);
                  }}
                  className="text-[#FF4500] hover:text-[#E03E00] text-sm font-medium transition-colors"
                >
                  View Details
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleAvailability(technician)}
                    className={`p-2 rounded-xl transition-colors ${
                      technician.isAvailable
                        ? 'text-red-600 hover:text-red-500 hover:bg-red-50'
                        : 'text-purple-600 hover:text-purple-500 hover:bg-purple-50'
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
                    className="text-gray-600 hover:text-[#FF4500] p-2 rounded-xl hover:bg-orange-50 transition-colors"
                    title="Edit Technician"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(technician)}
                    className="text-gray-600 hover:text-red-600 p-2 rounded-xl hover:bg-red-50 transition-colors"
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