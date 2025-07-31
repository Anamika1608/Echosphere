import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  WrenchScrewdriverIcon, 
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon 
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
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="text-red-800">{error}</div>
          <button
            onClick={loadServices}
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
          <h2 className="text-2xl font-bold text-gray-900">Requested Services</h2>
          <p className="text-gray-600 mt-1">
            {servicesData?.summary.total || 0} total service requests
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-semibold text-yellow-900">{servicesData?.summary.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">In Progress</p>
              <p className="text-2xl font-semibold text-blue-900">{servicesData?.summary.inProgress || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Completed</p>
              <p className="text-2xl font-semibold text-green-900">{servicesData?.summary.completed || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <WrenchScrewdriverIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Cancelled</p>
              <p className="text-2xl font-semibold text-red-900">{servicesData?.summary.cancelled || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">All Priority</option>
          <option value="URGENT">Urgent</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="createdAt">Created Date</option>
          <option value="updatedAt">Updated Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {/* Services List */}
      {!servicesData?.services || servicesData.services.length === 0 ? (
        <div className="text-center py-12">
          <WrenchScrewdriverIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No services found</h3>
          <p className="mt-1 text-sm text-gray-500">
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
              className="mt-4 text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {servicesData?.services && servicesData.services.length > 0 ? (
            servicesData.services.map((service) => (
              <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Requested by: {service.requestedBy.name}</span>
                      <span>•</span>
                      <span>Type: {service.serviceType}</span>
                      <span>•</span>
                      <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
                      {service.completedAt && (
                        <>
                          <span>•</span>
                          <span>Completed: {new Date(service.completedAt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {(service.estimatedCost || service.actualCost) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-2">
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
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(service.priority)}`}>
                      {service.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      )}

      {/* Pagination */}
      {servicesData && servicesData.services && servicesData.services.length > 0 && servicesData.pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, servicesData.pagination.total)} of {servicesData.pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Previous
            </button>
            <span className="flex items-center px-3 py-2 text-sm font-medium text-gray-700">
              Page {currentPage} of {servicesData.pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, servicesData.pagination.totalPages))}
              disabled={currentPage === servicesData.pagination.totalPages}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRightIcon className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityServices;