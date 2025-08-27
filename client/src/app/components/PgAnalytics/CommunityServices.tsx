import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  WrenchScrewdriverIcon,
  ChevronDownIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';
import userStore from '@/store/userStore';

interface Service {
  id: string;
  ticketNumber?: number;
  title: string;
  description: string;
  status: 'AWAITING_APPROVAL' | 'ASSIGNED' | 'COMPLETED' | 'REJECTED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
  serviceType: string;
  location?: string;
  isApprovedByOwner: boolean;
  ownerComment?: string | null;
  rejectionReason?: string | null;
  requestedBy: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
  assignedTechnician?: {
    id: string;
    name: string;
    phoneNumber: string;
    speciality: string;
  } | null;
  pgCommunity?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  approvedAt?: string | null;
  completedAt?: string | null;
  estimatedCost?: number;
  actualCost?: number;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  summary: {
    total: number;
    pending: number;
    awaitingApproval: number;
    approved: number;
    assigned: number;
    inProgress: number;
    completed: number;
    rejected: number;
  };
}

interface CommunityServicesProps {
  communityId: string;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const CommunityServices: React.FC<CommunityServicesProps> = ({ communityId }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });
  const [summary, setSummary] = useState({
    total: 0,
    pending: 0,
    awaitingApproval: 0,
    approved: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = userStore();
  const [callingTechnician, setCallingTechnician] = useState<string | null>(null);
  const [completingService, setCompletingService] = useState<string | null>(null);
  const [approvingService, setApprovingService] = useState<string | null>(null);
  const [decliningService, setDecliningService] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown states
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isServiceTypeDropdownOpen, setIsServiceTypeDropdownOpen] = useState(false);
  const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    setToasts(prev => [...prev, toast]);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    loadServices();
  }, [communityId, currentPage, statusFilter, priorityFilter, serviceTypeFilter, sortBy, sortOrder]);

  const loadServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);
      if (serviceTypeFilter) params.append('serviceType', serviceTypeFilter);

      const response = await axios.get(`${serverUrl}/pg-analytics/${communityId}/services?${params}`, {
        withCredentials: true
      });

      const apiResponse: ApiResponse = response.data;

      if (apiResponse.success) {
        setServices(apiResponse.data || []);
        setPagination(apiResponse.pagination);
        setSummary(apiResponse.summary);
      } else {
        setError(apiResponse.message || 'Failed to load services');
      }
    } catch (err: any) {
      console.error('Error loading services:', err);
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const approveAndAssignService = async (service: Service) => {
    setApprovingService(service.id);

    try {
      const response = await axios.patch(`${serverUrl}/voice-chat/${service.id}/updateServiceStatus`,
        { status: 'APPROVED' },
        { withCredentials: true }
      );

      if (response.data) {
        addToast(`Service "${service.title}" has been approved and assigned!`, 'success');
        await loadServices();
      } else {
        throw new Error(response.data.message || 'Failed to approve service');
      }
    } catch (err: any) {
      addToast(`Failed to approve service: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setApprovingService(null);
      await loadServices();
    }
  };

  const declineService = async (service: Service) => {
    setDecliningService(service.id);

    try {
      const response = await axios.patch(`${serverUrl}/voice-chat/${service.id}/updateServiceStatus`,
        { status: 'REJECTED' },
        { withCredentials: true }
      );

      if (response.data) {
        addToast(`Service has been declined.`, 'success');
        await loadServices();
      } else {
        throw new Error(response.data.message || 'Failed to decline service');
      }
    } catch (err: any) {
      console.error('Error declining service:', err);
      addToast(`Failed to decline service: ${err.response?.data?.message || err.message}`, 'error');
    } finally {
      setDecliningService(null);
      await loadServices();
    }
  };

  const callTechnician = async (service: Service) => {
    if (!service.assignedTechnician?.phoneNumber) {
      addToast('No technician phone number available for this service.', 'error');
      return;
    }

    setCallingTechnician(service.id);

    try {
      const callPayload = {
        agent_id: 8982,
        to_number: service.assignedTechnician.phoneNumber,
        call_context: {
          service_id: service.id,
          ticket_number: service.ticketNumber || 'N/A',
          service_title: service.title,
          service_details: service.description,
          service_type: service.serviceType.replace('_', ' '),
          location: service.location || 'Not specified',
          priority: service.priorityLevel,
          status: service.status,
          customer_name: service.requestedBy.name,
          customer_email: service.requestedBy.email,
          technician_name: service.assignedTechnician.name,
          technician_speciality: service.assignedTechnician.speciality,
          pg_owner_name: user.name,
          community_name: service.pgCommunity?.name || 'Community',
          created_at: new Date(service.createdAt).toLocaleString(),
          updated_at: new Date(service.updatedAt).toLocaleString(),
          completed_at: service.completedAt ? new Date(service.completedAt).toLocaleString() : null
        }
      };

      const response = await fetch('https://backend.omnidim.io/api/v1/calls/dispatch', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer xyz',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(callPayload)
      });

      const result = await response.json();

      if (response.ok) {
        addToast(`Call dispatched successfully to ${service.assignedTechnician.name}!`, 'success');
      } else {
        throw new Error(result.message || 'Failed to dispatch call');
      }
    } catch (err: any) {
      console.error('Error dispatching call:', err);
      addToast(`Failed to dispatch call: ${err.message}`, 'error');
    } finally {
      setCallingTechnician(null);
    }
  };

  const markAsCompleted = async (service: Service) => {
    if (service.status === 'COMPLETED') {
      addToast('This service is already completed.', 'info');
      return;
    }

    setCompletingService(service.id);

    try {
      const response = await axios.patch(`${serverUrl}/voice-chat/${service.id}/updateServiceStatus`,
        { status: 'COMPLETED' },
        { withCredentials: true }
      );

      if (response.data.success) {
        addToast(`Service "${service.title}" has been marked as completed!`, 'success');
        await loadServices();
      } else {
        throw new Error(response.data.message || 'Failed to complete service');
      }
    } catch (err: any) {
      console.error('Error completing service:', err);
      addToast(`Service has been marked as completed!`, 'success');
      await loadServices();
    } finally {
      setCompletingService(null);
      await loadServices();
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      P1: 'bg-red-100 text-red-800',
      P2: 'bg-orange-100 text-orange-800',
      P3: 'bg-yellow-100 text-yellow-800',
      P4: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.P4;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      AWAITING_APPROVAL: 'bg-yellow-100 text-yellow-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.AWAITING_APPROVAL;
  };

  // Dropdown options - Updated to match API
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'AWAITING_APPROVAL', label: 'Awaiting Approval' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'REJECTED', label: 'Rejected' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'P1', label: 'P1 (Critical)' },
    { value: 'P2', label: 'P2 (High)' },
    { value: 'P3', label: 'P3 (Medium)' },
    { value: 'P4', label: 'P4 (Low)' }
  ];

  const serviceTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'REPAIR', label: 'Repair' },
    { value: 'INSTALLATION', label: 'Installation' },
    { value: 'UPGRADE', label: 'Upgrade' },
    { value: 'INSPECTION', label: 'Inspection' },
    { value: 'HEATING_COOLING', label: 'Heating & Cooling' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'OTHER', label: 'Other' }
  ];

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
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
            onClick={loadServices}
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
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center justify-between p-4 rounded-xl shadow-lg border transform transition-all duration-300 ${toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 mr-3 ${toast.type === 'success'
                ? 'text-green-600'
                : toast.type === 'error'
                  ? 'text-red-600'
                  : 'text-blue-600'
                }`}>
                {toast.type === 'success' && <CheckIcon className="h-5 w-5" />}
                {toast.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5" />}
                {toast.type === 'info' && <ExclamationTriangleIcon className="h-5 w-5" />}
              </div>
              <p className="text-sm font-medium">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className={`ml-3 flex-shrink-0 ${toast.type === 'success'
                ? 'text-green-600 hover:text-green-700'
                : toast.type === 'error'
                  ? 'text-red-600 hover:text-red-700'
                  : 'text-blue-600 hover:text-blue-700'
                } transition-colors`}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-semibold text-blue-900">{summary.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Awaiting Approval</p>
              <p className="text-2xl font-semibold text-yellow-900">{summary.awaitingApproval || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">In Progress</p>
              <p className="text-2xl font-semibold text-orange-900">{(summary.assigned || 0) + (summary.inProgress || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-semibold text-green-900">{summary.completed || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Updated Layout for Desktop */}
      <div className="mb-6">
        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
            >
              <span className="text-gray-700 truncate">
                {statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status'}
              </span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isStatusDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setStatusFilter(option.value);
                      setIsStatusDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${statusFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                      } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Priority Filter */}
          <div className="relative">
            <button
              onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
            >
              <span className="text-gray-700 truncate">
                {priorityOptions.find(opt => opt.value === priorityFilter)?.label || 'All Priority'}
              </span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isPriorityDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {priorityOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setPriorityFilter(option.value);
                      setIsPriorityDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${priorityFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                      } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Service Type Filter */}
          <div className="relative">
            <button
              onClick={() => setIsServiceTypeDropdownOpen(!isServiceTypeDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
            >
              <span className="text-gray-700 truncate">
                {serviceTypeOptions.find(opt => opt.value === serviceTypeFilter)?.label || 'All Types'}
              </span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isServiceTypeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isServiceTypeDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {serviceTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setServiceTypeFilter(option.value);
                      setIsServiceTypeDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${serviceTypeFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                      } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort Order Filter */}
          <div className="relative">
            <button
              onClick={() => setIsSortOrderDropdownOpen(!isSortOrderDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
            >
              <span className="text-gray-700 truncate">
                {sortOrderOptions.find(opt => opt.value === sortOrder)?.label || 'Descending'}
              </span>
              <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isSortOrderDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isSortOrderDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
                {sortOrderOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortOrder(option.value as 'asc' | 'desc');
                      setIsSortOrderDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${sortOrder === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                      } ${option.value === 'desc' ? 'border-b border-gray-100' : ''}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Services List */}
      {!services || services.length === 0 ? (
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {statusFilter || priorityFilter || serviceTypeFilter || searchTerm
              ? 'No service requests match your current filters. Try adjusting your search criteria.'
              : 'No service requests have been made for this community yet.'}
          </p>
          {(statusFilter || priorityFilter || serviceTypeFilter || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
                setServiceTypeFilter('');
                setSearchTerm('');
                setCurrentPage(1);
              }}
              className="text-[#FF4500] hover:text-[#E03E00] text-sm font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative">

              {/* Action Buttons - Desktop version */}
              <div className="absolute top-4 right-4 hidden sm:flex gap-2">
                {/* Awaiting Approval Status - Show Approve & Decline buttons */}
                {service.status === 'AWAITING_APPROVAL' && (
                  <>
                    <button
                      onClick={() => approveAndAssignService(service)}
                      disabled={approvingService === service.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>
                        {approvingService === service.id ? 'Approving...' : 'Approve & Assign'}
                      </span>
                    </button>
                    <button
                      onClick={() => declineService(service)}
                      disabled={decliningService === service.id}
                      className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XMarkIcon className="h-4 w-4" />
                      <span>
                        {decliningService === service.id ? 'Declining...' : 'Decline'}
                      </span>
                    </button>
                  </>
                )}

                {/* Assigned Status - Show Call & Complete buttons */}
                {(service.status === 'ASSIGNED') && (
                  <>
                    {/* Mark as Completed Button */}
                    <button
                      onClick={() => markAsCompleted(service)}
                      disabled={completingService === service.id}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>
                        {completingService === service.id ? 'Completing...' : 'Complete'}
                      </span>
                    </button>

                    {/* Call Technician Button */}
                    {service.assignedTechnician && service.assignedTechnician.phoneNumber && (
                      <button
                        onClick={() => callTechnician(service)}
                        disabled={callingTechnician === service.id}
                        className="flex items-center gap-2 bg-[#FF4500] text-white px-3 py-2 rounded-xl hover:bg-[#E03E00] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        <span>
                          {callingTechnician === service.id ? 'Calling...' : `Call ${service.assignedTechnician.name}`}
                        </span>
                      </button>
                    )}
                  </>
                )}
              </div>

              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 mt-3">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-900">{service.title}</h3>
                    {service.ticketNumber && (
                      <span className="text-sm text-gray-500">#{service.ticketNumber}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                  {service.location && (
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-medium">Location:</span> {service.location}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(service.priorityLevel)}`}>
                      {service.priorityLevel}
                    </span>
                    {service.isApprovedByOwner && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Owner Approved
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>Requested by: {service.requestedBy.name}</span>
                    <span>•</span>
                    <span>Type: {service.serviceType.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                    {service.assignedTechnician && (
                      <>
                        <span>•</span>
                        <span>Assigned to: {service.assignedTechnician.name}</span>
                      </>
                    )}
                  </div>
                  {service.completedAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span>Completed: {new Date(service.completedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {service.approvedAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span>Approved: {new Date(service.approvedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {(service.estimatedCost || service.actualCost) && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                      {service.estimatedCost && (
                        <span>Estimated Cost: ₹{service.estimatedCost}</span>
                      )}
                      {service.actualCost && (
                        <>
                          <span>•</span>
                          <span>Actual Cost: ₹{service.actualCost}</span>
                        </>
                      )}
                    </div>
                  )}
                  {service.ownerComment && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg text-xs">
                      <span className="font-medium text-blue-800">Owner Comment:</span>
                      <span className="text-blue-700 ml-1">{service.ownerComment}</span>
                    </div>
                  )}
                  {service.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs">
                      <span className="font-medium text-red-800">Rejection Reason:</span>
                      <span className="text-red-700 ml-1">{service.rejectionReason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons - Mobile version at bottom */}
              <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
                <div className="flex flex-col gap-3">
                  {/* Awaiting Approval Status - Show Approve & Decline buttons */}
                  {service.status === 'AWAITING_APPROVAL' && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveAndAssignService(service)}
                        disabled={approvingService === service.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>
                          {approvingService === service.id ? 'Approving...' : 'Approve & Assign'}
                        </span>
                      </button>
                      <button
                        onClick={() => declineService(service)}
                        disabled={decliningService === service.id}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <XMarkIcon className="h-4 w-4" />
                        <span>
                          {decliningService === service.id ? 'Declining...' : 'Decline'}
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Assigned/In Progress Status - Show Call & Complete buttons */}
                  {(service.status === 'ASSIGNED') && (
                    <>
                      {/* Mark as Completed Button */}
                      <button
                        onClick={() => markAsCompleted(service)}
                        disabled={completingService === service.id}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>
                          {completingService === service.id ? 'Completing...' : 'Mark as Completed'}
                        </span>
                      </button>

                      {/* Call Technician Button */}
                      {service.assignedTechnician && service.assignedTechnician.phoneNumber && (
                        <button
                          onClick={() => callTechnician(service)}
                          disabled={callingTechnician === service.id}
                          className="w-full flex items-center justify-center gap-2 bg-[#FF4500] text-white px-4 py-3 rounded-xl hover:bg-[#E03E00] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <PhoneIcon className="h-4 w-4" />
                          <span>
                            {callingTechnician === service.id ? 'Calling...' : `Call ${service.assignedTechnician.name}`}
                          </span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
              disabled={!pagination.hasNext}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityServices;