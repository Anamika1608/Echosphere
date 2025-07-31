// components/community/CommunityServices.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  WrenchScrewdriverIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';

interface Service {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  serviceType: string;
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedCost?: number;
  actualCost?: number;
}

interface ServicesResponse {
  services: Service[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
}

interface CommunityServicesProps {
  communityId: string;
}

const CommunityServices: React.FC<CommunityServicesProps> = ({ communityId }) => {
  const [servicesData, setServicesData] = useState<ServicesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);

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
      setServicesData(response.data.data ? response.data : {
        services: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        summary: { total: 0, pending: 0, inProgress: 0, completed: 0, cancelled: 0 }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadServices();
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      URGENT: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.LOW;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  // Dropdown options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
  ];

  const serviceTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'REPAIR', label: 'Repair' },
    { value: 'INSTALLATION', label: 'Installation' },
    { value: 'UPGRADE', label: 'Upgrade' },
    { value: 'INSPECTION', label: 'Inspection' },
    { value: 'OTHER', label: 'Other' }
  ];

  const sortByOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'status', label: 'Status' }
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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-semibold text-blue-900">{servicesData?.summary.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-900">{servicesData?.summary.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">In Progress</p>
              <p className="text-2xl font-semibold text-orange-900">{servicesData?.summary.inProgress || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-semibold text-green-900">{servicesData?.summary.completed || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters - Mobile Optimized */}
      <div className="space-y-4 mb-6">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors"
          />
        </div>

        {/* Status Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {statusOptions.find(opt => opt.value === statusFilter)?.label || 'All Status'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    statusFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                  } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Priority Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {priorityOptions.find(opt => opt.value === priorityFilter)?.label || 'All Priority'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isPriorityDropdownOpen ? 'rotate-180' : ''}`} />
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    priorityFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                  } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Service Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsServiceTypeDropdownOpen(!isServiceTypeDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {serviceTypeOptions.find(opt => opt.value === serviceTypeFilter)?.label || 'All Types'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isServiceTypeDropdownOpen ? 'rotate-180' : ''}`} />
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    serviceTypeFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                  } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort By Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortByDropdownOpen(!isSortByDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {sortByOptions.find(opt => opt.value === sortBy)?.label || 'Created Date'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isSortByDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isSortByDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {sortByOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setIsSortByDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    sortBy === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                  } ${option.value === 'createdAt' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sort Order Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortOrderDropdownOpen(!isSortOrderDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {sortOrderOptions.find(opt => opt.value === sortOrder)?.label || 'Descending'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isSortOrderDropdownOpen ? 'rotate-180' : ''}`} />
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    sortOrder === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                  } ${option.value === 'desc' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Services List - Mobile Grid */}
      {!servicesData?.services || servicesData.services.length === 0 ? (
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
          {servicesData?.services && servicesData.services.length > 0 ? (
            servicesData.services.map((service) => (
              <div key={service.id} className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                        {service.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(service.priority)}`}>
                        {service.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Requested by: {service.requestedBy.name}</span>
                      <span>•</span>
                      <span>Type: {service.serviceType}</span>
                      <span>•</span>
                      <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      )}

      {/* Pagination */}
      {servicesData?.pagination && servicesData.pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg">
              Page {currentPage} of {servicesData.pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(servicesData.pagination.totalPages, currentPage + 1))}
              disabled={currentPage === servicesData.pagination.totalPages}
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