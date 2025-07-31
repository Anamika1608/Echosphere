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
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  issueType: string;
  reportedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

interface IssuesResponse {
  issues: Issue[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
}

interface CommunityIssuesProps {
  communityId: string;
}

const CommunityIssues: React.FC<CommunityIssuesProps> = ({ communityId }) => {
  const [issuesData, setIssuesData] = useState<IssuesResponse | null>(null);
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
      setIssuesData(response.data.data ? response.data : {
        issues: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        summary: { total: 0, open: 0, inProgress: 0, resolved: 0, closed: 0 }
      });
    } catch (err: any) {
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
      URGENT: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-green-100 text-green-800'
    };
    return colors[priority as keyof typeof colors] || colors.LOW;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      OPEN: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.OPEN;
  };

  // Dropdown options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' }
  ];

  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'HIGH', label: 'High' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'LOW', label: 'Low' }
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
              <p className="text-2xl font-semibold text-blue-900">{issuesData?.summary.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Open</p>
              <p className="text-2xl font-semibold text-yellow-900">{issuesData?.summary.open || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">In Progress</p>
              <p className="text-2xl font-semibold text-orange-900">{issuesData?.summary.inProgress || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Resolved</p>
              <p className="text-2xl font-semibold text-green-900">{issuesData?.summary.resolved || 0}</p>
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
      {!issuesData?.issues || issuesData.issues.length === 0 ? (
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
          {issuesData?.issues && issuesData.issues.length > 0 ? (
            issuesData.issues.map((issue) => (
              <div key={issue.id} className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2">{issue.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{issue.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                        {issue.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Reported by: {issue.reportedBy.name}</span>
                      <span>•</span>
                      <span>Type: {issue.issueType}</span>
                      <span>•</span>
                      <span>Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : null}
        </div>
      )}

      {/* Pagination */}
      {issuesData?.pagination && issuesData.pagination.totalPages > 1 && (
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
              Page {currentPage} of {issuesData.pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(issuesData.pagination.totalPages, currentPage + 1))}
              disabled={currentPage === issuesData.pagination.totalPages}
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