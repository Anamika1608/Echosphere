// components/community/ImportTechnicianModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { XMarkIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const serverUrl = 'http://localhost:3000/api';

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

interface ImportTechnicianModalProps {
  communityId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ImportTechnicianModal: React.FC<ImportTechnicianModalProps> = ({
  communityId,
  onClose,
  onSuccess
}) => {
  const [availableTechnicians, setAvailableTechnicians] = useState<Technician[]>([]);
  const [selectedTechnicians, setSelectedTechnicians] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAvailableTechnicians();
  }, []);

  const loadAvailableTechnicians = async () => {
    try {
      setLoading(true);
      // First get all technicians owned by the user
      const response = await axios.get(`${serverUrl}/technician/owner/all`, {
        withCredentials: true
      });

      // Filter out technicians already assigned to this PG
      const allTechnicians = response.data.data;
      const available = allTechnicians.filter((tech: Technician) => 
        !tech.pgAssignments.some(assignment => assignment.pgCommunity.id === communityId)
      );

      setAvailableTechnicians(available);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load available technicians');
    } finally {
      setLoading(false);
    }
  };

  const handleTechnicianToggle = (technicianId: string) => {
    setSelectedTechnicians(prev => 
      prev.includes(technicianId)
        ? prev.filter(id => id !== technicianId)
        : [...prev, technicianId]
    );
  };

  const handleImport = async () => {
    if (selectedTechnicians.length === 0) return;

    setImporting(true);
    setError(null);

    try {
      // Import each selected technician
      await Promise.all(
        selectedTechnicians.map(technicianId =>
          axios.post(`${serverUrl}/technician/${technicianId}/assign`, {
            pgCommunityIds: [communityId]
          }, {
            withCredentials: true
          })
        )
      );

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to import technicians');
    } finally {
      setImporting(false);
    }
  };

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

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Import Technicians</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Content */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            Select technicians from your other PG communities to assign to this community.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4500]"></div>
          </div>
        ) : (
          <>
            {/* Technicians List */}
            <div className="max-h-96 overflow-y-auto mb-6">
              {availableTechnicians.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No technicians available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    All your technicians are already assigned to this community.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableTechnicians.map((technician) => (
                    <div
                      key={technician.id}
                      className={`border rounded-2xl p-4 cursor-pointer transition-colors ${
                        selectedTechnicians.includes(technician.id)
                          ? 'border-[#FF4500] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleTechnicianToggle(technician.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedTechnicians.includes(technician.id)}
                              onChange={() => handleTechnicianToggle(technician.id)}
                              className="h-4 w-4 text-[#FF4500] focus:ring-[#FF4500] border-gray-300 rounded"
                            />
                            <div>
                              <h4 className="font-medium text-gray-900">{technician.name}</h4>
                              <p className="text-sm text-gray-600">{technician.phoneNumber}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSpecialityColor(technician.speciality)}`}>
                            {technician.speciality}
                          </span>
                          <span className="text-sm text-gray-500">
                            {technician._count.assignedIssues + technician._count.assignedServices} tasks
                          </span>
                        </div>
                      </div>
                      
                      {/* Current Assignments */}
                      <div className="mt-2 ml-7">
                        <p className="text-xs text-gray-500">Currently assigned to:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {technician.pgAssignments.map((assignment) => (
                            <span
                              key={assignment.pgCommunity.id}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                            >
                              {assignment.pgCommunity.name} ({assignment.pgCommunity.pgCode})
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                {selectedTechnicians.length} technician(s) selected
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleImport}
                  disabled={selectedTechnicians.length === 0 || importing}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#FF4500] border border-transparent rounded-2xl hover:bg-[#E03E00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {importing ? 'Importing...' : `Import ${selectedTechnicians.length} Technician(s)`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ImportTechnicianModal;