// components/community/TechnicianWorkloadModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  WrenchScrewdriverIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

const serverUrl = 'http://localhost:3000/api';

interface WorkloadData {
  technician: {
    id: string;
    name: string;
    phoneNumber: string;
    speciality: string;
    isAvailable: boolean;
    assignedIssues: Array<{
      id: string;
      title: string;
      priority: string;
      status: string;
      pgCommunity: {
        name: string;
        pgCode: string;
      };
    }>;
    assignedServices: Array<{
      id: string;
      title: string;
      priority: string;
      status: string;
      pgCommunity: {
        name: string;
        pgCode: string;
      };
    }>;
    pgAssignments: Array<{
      pgCommunity: {
        id: string;
        name: string;
        pgCode: string;
      };
    }>;
  };
  workload: {
    activeIssues: number;
    activeServices: number;
    totalActiveTasks: number;
    assignedPgs: number;
  };
}

interface TechnicianWorkloadModalProps {
  technician: {
    id: string;
    name: string;
  };
  onClose: () => void;
}

const TechnicianWorkloadModal: React.FC<TechnicianWorkloadModalProps> = ({
  technician,
  onClose
}) => {
  const [workloadData, setWorkloadData] = useState<WorkloadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadWorkloadData();
  }, [technician.id]);

  const loadWorkloadData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${serverUrl}/technician/${technician.id}/workload`, {
        withCredentials: true
      });
      setWorkloadData(response.data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load workload data');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-red-100 text-red-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF4500]"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !workloadData) {
    return (
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="text-red-800">{error || 'Failed to load data'}</div>
            <button
              onClick={onClose}
              className="mt-2 bg-[#FF4500] text-white px-4 py-2 rounded-2xl hover:bg-[#E03E00] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{workloadData.technician.name}</h2>
            <p className="text-gray-600">{workloadData.technician.speciality} • {workloadData.technician.phoneNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Workload Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-center">
              <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-600">Assigned PGs</p>
                <p className="text-2xl font-semibold text-blue-900">{workloadData.workload.assignedPgs}</p>
              </div>
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600">Active Issues</p>
                <p className="text-2xl font-semibold text-orange-900">{workloadData.workload.activeIssues}</p>
              </div>
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
            <div className="flex items-center">
              <WrenchScrewdriverIcon className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-green-600">Active Services</p>
                <p className="text-2xl font-semibold text-green-900">{workloadData.workload.activeServices}</p>
              </div>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600">Total Tasks</p>
                <p className="text-2xl font-semibold text-purple-900">{workloadData.workload.totalActiveTasks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto max-h-96">
          {/* Active Issues */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Issues ({workloadData.workload.activeIssues})</h3>
            <div className="space-y-3">
              {workloadData.technician.assignedIssues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ExclamationTriangleIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No active issues assigned</p>
                </div>
              ) : (
                workloadData.technician.assignedIssues.map((issue) => (
                  <div key={issue.id} className="border border-gray-200 rounded-2xl p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{issue.title}</h4>
                      <div className="flex space-x-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {issue.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {issue.pgCommunity.name} ({issue.pgCommunity.pgCode})
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Active Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Services ({workloadData.workload.activeServices})</h3>
            <div className="space-y-3">
              {workloadData.technician.assignedServices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <WrenchScrewdriverIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">No active services assigned</p>
                </div>
              ) : (
                workloadData.technician.assignedServices.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-2xl p-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900 text-sm">{service.title}</h4>
                      <div className="flex space-x-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status.replace('_', ' ')}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(service.priority)}`}>
                          {service.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">
                      {service.pgCommunity.name} ({service.pgCommunity.pgCode})
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Assigned PG Communities */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assigned PG Communities</h3>
          <div className="flex flex-wrap gap-2">
            {workloadData.technician.pgAssignments.map((assignment) => (
              <span
                key={assignment.pgCommunity.id}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
              >
                {assignment.pgCommunity.name} ({assignment.pgCommunity.pgCode})
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-2xl hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TechnicianWorkloadModal;