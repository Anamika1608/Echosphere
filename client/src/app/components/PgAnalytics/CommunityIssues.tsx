// @ts-nocheck
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  ExclamationTriangleIcon,
  ChevronDownIcon,
  PhoneIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';
import userStore from '@/store/userStore';

interface Issue {
  id: string;
  ticketNumber?: number;
  title: string;
  description: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';
  priorityLevel: 'P1' | 'P2' | 'P3' | 'P4';
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
  data: Issue[];
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

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
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
  const { user } = userStore();
  const [callingTechnician, setCallingTechnician] = useState<string | null>(null);
  const [resolvingIssue, setResolvingIssue] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [issueTypeFilter, setIssueTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown states
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [isIssueTypeDropdownOpen, setIsIssueTypeDropdownOpen] = useState(false);
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
    loadIssues();
  }, [communityId, currentPage, statusFilter, priorityFilter, issueTypeFilter, sortOrder]);

  const loadIssues = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
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

  const callTechnician = async (issue: Issue) => {
    if (!issue.assignedTechnician?.phoneNumber) {
      addToast('No technician phone number available for this issue.', 'error');
      return;
    }

    setCallingTechnician(issue.id);

    try {
      const callPayload = {
        agent_id: 29311,
        to_number: issue.assignedTechnician.phoneNumber,
        call_context: {
          issue_id: issue.id,
          ticket_number: issue.ticketNumber || 'N/A',
          issue_title: issue.title,
          issue_details: issue.description,
          issue_type: issue.issueType.replace('_', ' '),
          location: issue.location || 'Not specified',
          priority: issue.priorityLevel,
          status: issue.status,
          customer_name: issue.raisedBy.name,
          customer_email: issue.raisedBy.email,
          technician_name: issue.assignedTechnician.name,
          technician_speciality: issue.assignedTechnician.speciality,
          pg_owner_name: user.name,
          community_name: issue.pgCommunity?.name || 'Community',
          created_at: new Date(issue.createdAt).toLocaleString(),
          updated_at: new Date(issue.updatedAt).toLocaleString(),
          resolved_at: issue.resolvedAt ? new Date(issue.resolvedAt).toLocaleString() : null
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
        addToast(`Call dispatched successfully to ${issue.assignedTechnician.name}!`, 'success');
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

  const markAsResolved = async (issue: Issue) => {
    if (issue.status === 'RESOLVED') {
      addToast('This issue is already resolved.', 'info');
      return;
    }

    setResolvingIssue(issue.id);

    try {
      const response = await axios.patch(`${serverUrl}/pg-analytics/${issue.id}/updateIssueStatus`,
        { status: 'RESOLVED' },
        { withCredentials: true }
      );

      if (response.data) {
        addToast(`Issue has been marked as resolved!`, 'success');
        await loadIssues();
      } else {
        throw new Error(response.data.message || 'Failed to update issue status');
      }
    } catch (err: any) {
      addToast(`Failed to update issue status!`, 'error');
      await loadIssues();
    } finally {
      setResolvingIssue(null);
      await loadIssues();
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

  const sortOrderOptions = [
    { value: 'desc', label: 'Descending' },
    { value: 'asc', label: 'Ascending' }
  ];

  if (loading) {
    return (
      <div className="h-screen overflow-y-auto p-4">
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
      <div className="h-screen overflow-y-auto p-4">
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
    <div className="">
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

        {/* Filters - Responsive Design */}
        <div className="mb-6">

          {/* Filter Dropdowns - Responsive Grid */}
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

            {/* Issue Type Filter */}
            <div className="relative">
              <button
                onClick={() => setIsIssueTypeDropdownOpen(!isIssueTypeDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
              >
                <span className="text-gray-700 truncate">
                  {issueTypeOptions.find(opt => opt.value === issueTypeFilter)?.label || 'All Types'}
                </span>
                <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isIssueTypeDropdownOpen ? 'rotate-180' : ''}`} />
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
                      className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${issueTypeFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
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
              <div
                key={issue.id}
                className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 relative"
              >
                {/* Action Buttons) */}
                
                <div className="absolute top-4 right-4 hidden sm:flex gap-2">
                  {/* Mark as Resolved Button */}
                  {issue.status !== 'RESOLVED' && (
                    <button
                      onClick={() => markAsResolved(issue)}
                      disabled={resolvingIssue === issue.id}
                      className="flex items-center gap-2 text-black px-3 py-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid #FFF',
                        background: 'linear-gradient(180deg, #FFF 0%, #A9E4A9 56.5%, #62B862 113%)',
                        boxShadow: '1px 3px 6.1px 0 rgba(0, 0, 0, 0.20)'
                      }}
                    >
                      <CheckIcon className="h-4 w-4" />
                      <span>
                        {resolvingIssue === issue.id ? 'Resolving...' : 'Resolve'}
                      </span>
                    </button>
                  )}

                  {/* Call Technician Button */}
                  {/* {issue.assignedTechnician && issue.assignedTechnician.phoneNumber && (
                    <button
                      onClick={() => callTechnician(issue)}
                      disabled={callingTechnician === issue.id}
                      className="flex items-center gap-2 text-black px-3 py-2 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        borderRadius: '16px',
                        border: '1px solid #FFF',
                        background: 'linear-gradient(180deg, #FFF 0%, #FFD7AE 56.5%, #FF6E39 113%)',
                        boxShadow: '1px 3px 6.1px 0 rgba(0, 0, 0, 0.20)'
                      }}
                    >
                      <PhoneIcon className="h-4 w-4" />
                      <span>
                        {callingTechnician === issue.id ? 'Calling...' : `Call ${issue.assignedTechnician.name}`}
                      </span>
                    </button>
                  )} */}
                </div>

                <div className="mb-4 mt-3">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
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

                {/* Action Buttons - Mobile version at bottom */}
                <div className="sm:hidden mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-col gap-3">
                    {/* Mark as Resolved Button */}
                    {issue.status !== 'RESOLVED' && (
                      <button
                        onClick={() => markAsResolved(issue)}
                        disabled={resolvingIssue === issue.id}
                        className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <CheckIcon className="h-4 w-4" />
                        <span>
                          {resolvingIssue === issue.id ? 'Resolving...' : 'Mark as Resolved'}
                        </span>
                      </button>
                    )}

                    {/* Call Technician Button */}
                    {/* {issue.assignedTechnician && issue.assignedTechnician.phoneNumber && (
                      <button
                        onClick={() => callTechnician(issue)}
                        disabled={callingTechnician === issue.id}
                        className="w-full flex items-center justify-center gap-2 bg-[#FF4500] text-white px-4 py-3 rounded-xl hover:bg-[#E03E00] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <PhoneIcon className="h-4 w-4" />
                        <span>
                          {callingTechnician === issue.id ? 'Calling...' : `Call ${issue.assignedTechnician.name}`}
                        </span>
                      </button>
                    )} */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center pb-6">
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
    </div>
  );
};

export default CommunityIssues;