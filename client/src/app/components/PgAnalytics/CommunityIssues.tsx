// components/community/CommunityIssues.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';

interface Issue {
  id: string;
  ticketNumber?: number;
  title: string;
  description: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4'; // Updated to match API
  issueType: string;
  location?: string;
  raisedBy: {
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
  };
  pgCommunity?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Issue[]; // API returns data array directly
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
    assigned: number;
    inProgress: number;
    resolved: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

interface CommunityIssuesProps {
  communityId: string;
}

const CommunityIssues: React.FC<CommunityIssuesProps> = ({ communityId }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
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
    assigned: 0,
    inProgress: 0,
    resolved: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown states
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isIssueTypeDropdownOpen, setIsIssueTypeDropdownOpen] = useState(false);
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);

  useEffect(() => {
    loadIssues();
  }, [communityId, currentPage, statusFilter, priorityFilter, issueTypeFilter, sortBy, sortOrder]);

  const loadIssues = async () => {
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
      if (issueTypeFilter) params.append('issueType', issueTypeFilter);

      const response = await axios.get(`${serverUrl}/pg-analytics/${communityId}/issues?${params}`, {
        withCredentials: true
      });

      const apiResponse: ApiResponse = response.data;
      
      if (apiResponse.success) {
        setIssues(apiResponse.data || []);
        setPagination(apiResponse.pagination);
        setSummary(apiResponse.summary);
      } else {
        setError(apiResponse.message || 'Failed to load issues');
      }
    } catch (err: any) {
      console.error('Error loading issues:', err);
      setError(err.response?.data?.message || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadIssues();
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
      PENDING: 'bg-red-100 text-red-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  // Dropdown options - Updated to match API
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'ASSIGNED', label: 'Assigned' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'P1', label: 'P1 (Critical)' },
    { value: 'P2', label: 'P2 (High)' },
    { value: 'P3', label: 'P3 (Medium)' },
    { value: 'P4', label: 'P4 (Low)' }
  ];

  const issueTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'HEATING_COOLING', label: 'Heating & Cooling' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'CLEANING', label: 'Cleaning' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'REPAIR', label: 'Repair' },
    { value: 'SECURITY', label: 'Security' },
    { value: 'NOISE', label: 'Noise' },
    { value: 'OTHER', label: 'Other' }
  ];

  const sortByOptions = [
    { value: 'createdAt', label: 'Created Date' },
    { value: 'updatedAt', label: 'Updated Date' },
    { value: 'priorityLevel', label: 'Priority' },
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
            onClick={loadIssues}
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
            <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-semibold text-blue-900">{summary.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600">Pending</p>
              <p className="text-2xl font-semibold text-red-900">{summary.pending || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">In Progress</p>
              <p className="text-2xl font-semibold text-orange-900">{(summary.assigned || 0) + (summary.inProgress || 0)}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Resolved</p>
              <p className="text-2xl font-semibold text-green-900">{summary.resolved || 0}</p>
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
            placeholder="Search issues..."
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

        {/* Issue Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsIssueTypeDropdownOpen(!isIssueTypeDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {issueTypeOptions.find(opt => opt.value === issueTypeFilter)?.label || 'All Types'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isIssueTypeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isIssueTypeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {issueTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setIssueTypeFilter(option.value);
                    setIsIssueTypeDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    issueTypeFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
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

      {/* Issues List - Mobile Grid */}
      {!issues || issues.length === 0 ? (
        <div className="text-center py-12">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {statusFilter || priorityFilter || issueTypeFilter || searchTerm
              ? 'No issues match your current filters. Try adjusting your search criteria.'
              : 'No issues have been reported for this community yet.'}
          </p>
          {(statusFilter || priorityFilter || issueTypeFilter || searchTerm) && (
            <button
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
                setIssueTypeFilter('');
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
          {issues.map((issue) => (
            <div key={issue.id} className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-bold text-gray-900">{issue.title}</h3>
                    {issue.ticketNumber && (
                      <span className="text-sm text-gray-500">#{issue.ticketNumber}</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                  {issue.location && (
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-medium">Location:</span> {issue.location}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priorityLevel)}`}>
                      {issue.priorityLevel}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>Reported by: {issue.raisedBy.name}</span>
                    <span>•</span>
                    <span>Type: {issue.issueType.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    {issue.assignedTechnician && (
                      <>
                        <span>•</span>
                        <span>Assigned to: {issue.assignedTechnician.name}</span>
                      </>
                    )}
                  </div>
                  {issue.resolvedAt && (
                    <div className="text-xs text-gray-500 mt-1">
                      <span>Resolved: {new Date(issue.resolvedAt).toLocaleDateString()}</span>
                    </div>
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

export default CommunityIssues;