import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon,
  SparklesIcon,
  EyeIcon,
  PlusIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';

interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startDate: string;
  endDate: string;
  location?: string;
  maxAttendees?: number;
  currentAttendees: number;
  organizer: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

interface EventSuggestion {
  id: string;
  title: string;
  description: string;
  suggestedEventType: string;
  suggestedDate: string;
  expectedEngagement: number;
  estimatedCost: number;
  reasoning: string;
  status: 'PENDING' | 'APPROVED' | 'IMPLEMENTED' | 'REJECTED';
  contextFactors: string[];
  recommendedCapacity: number;
}

interface EventsResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  summary: {
    total: number;
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
}

interface CommunityEventsProps {
  communityId: string;
}

const CommunityEvents: React.FC<CommunityEventsProps> = ({ communityId }) => {
  const [eventsData, setEventsData] = useState<EventsResponse | null>(null);
  const [eventSuggestion, setEventSuggestion] = useState<EventSuggestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  // Filters and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [upcomingFilter, setUpcomingFilter] = useState<string>('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown states
  const [isUpcomingDropdownOpen, setIsUpcomingDropdownOpen] = useState(false);
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
  const [isSortByDropdownOpen, setIsSortByDropdownOpen] = useState(false);
  const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);

  useEffect(() => {
    loadEvents();
    loadEventSuggestion();
  }, [communityId, currentPage, upcomingFilter, eventTypeFilter, sortBy, sortOrder]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (upcomingFilter) params.append('upcoming', upcomingFilter);
      if (eventTypeFilter) params.append('eventType', eventTypeFilter);

      const response = await axios.get(`${serverUrl}/pg-analytics/${communityId}/events?${params}`, {
        withCredentials: true
      });

      console.log('API Response:', response.data); // Debug log

      // Fix: Map the API response structure correctly
      if (response.data.success && response.data.data) {
        // Transform the events data to match your component's expected structure
        const transformedEvents = response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          maxAttendees: event.maxCapacity, // Note: API uses maxCapacity, component expects maxAttendees
          currentAttendees: event._count?.attendances || 0,
          organizer: {
            id: event.createdBy.id,
            name: event.createdBy.name,
            email: event.createdBy.email
          },
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          status: determineEventStatus(event.startDate, event.endDate) // You'll need this helper function
        }));

        setEventsData({
          events: transformedEvents,
          pagination: response.data.pagination || { page: 1, limit: 10, total: 0, totalPages: 0 },
          summary: response.data.summary || { total: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 }
        });
      } else {
        // Fallback for when no data is returned
        setEventsData({
          events: [],
          pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
          summary: { total: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 }
        });
      }
    } catch (err: any) {
      console.error('Events loading error:', err);
      setError(err.response?.data?.message || 'Failed to load events');
      // Set empty state on error
      setEventsData({
        events: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        summary: { total: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to determine event status based on dates
  const determineEventStatus = (startDate: string, endDate: string): 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return 'UPCOMING';
    } else if (now >= start && now <= end) {
      return 'ONGOING';
    } else {
      return 'COMPLETED';
    }
  };

  const loadEventSuggestion = async () => {
    try {
      setSuggestionLoading(true);
      const response = await axios.get(`${serverUrl}/event-suggestions/${communityId}?limit=1&autoGenerate=true`, {
        withCredentials: true
      });

      if (response.data.success) {
        if (response.data.data && response.data.data.length > 0) {
          setEventSuggestion(response.data.data[0]);
        } else if (response.data.data && response.data.data.suggestions && response.data.data.suggestions.length > 0) {
          setEventSuggestion(response.data.data.suggestions[0]);
        }
      }
    } catch (err: any) {
      console.warn('Failed to load event suggestions:', err.response?.data?.message);
    } finally {
      setSuggestionLoading(false);
    }
  };

  const regenerateEventSuggestion = async () => {
    try {
      setSuggestionLoading(true);
      const response = await axios.post(`${serverUrl}/event-suggestions/${communityId}/generate`, {
        forceFresh: true
      }, {
        withCredentials: true
      });

      if (response.data.success && response.data.data && response.data.data.suggestions && response.data.data.suggestions.length > 0) {
        setEventSuggestion(response.data.data.suggestions[0]);
      }
    } catch (err: any) {
      console.error('Failed to regenerate event suggestions:', err.response?.data?.message);
      setError('Failed to generate new suggestions');
    } finally {
      setSuggestionLoading(false);
    }
  };

  const loadEventSuggestionExplicit = async () => {
    try {
      setSuggestionLoading(true);
      let response = await axios.get(`${serverUrl}/event-suggestions/${communityId}?limit=1&autoGenerate=false`, {
        withCredentials: true
      });

      if (response.data.success && (!response.data.data || response.data.data.length === 0)) {
        console.log('No existing suggestions, generating new ones...');
        await axios.post(`${serverUrl}/event-suggestions/${communityId}/generate`, {}, {
          withCredentials: true
        });
        response = await axios.get(`${serverUrl}/event-suggestions/${communityId}?limit=1`, {
          withCredentials: true
        });
      }

      if (response.data.success && response.data.data && response.data.data.length > 0) {
        setEventSuggestion(response.data.data[0]);
      }
    } catch (err: any) {
      console.warn('Failed to load event suggestions:', err.response?.data?.message);
      setError('Failed to load suggestions');
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleGenerateNewSuggestions = async () => {
    await regenerateEventSuggestion();
  };

  const implementSuggestion = async (suggestionId: string) => {
    try {
      setSuggestionLoading(true);
      await axios.post(`${serverUrl}/event-suggestions/${suggestionId}/implement`, {}, {
        withCredentials: true
      });

      // Reload events and suggestions after implementation
      await Promise.all([loadEvents(), loadEventSuggestion()]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to implement suggestion');
    } finally {
      setSuggestionLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadEvents();
  };

  const getStatusColor = (status: string) => {
    const colors = {
      UPCOMING: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.UPCOMING;
  };

  const getSuggestionStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      IMPLEMENTED: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || colors.PENDING;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  // Dropdown options
  const upcomingOptions = [
    { value: '', label: 'All Events' },
    { value: 'true', label: 'Upcoming Only' },
    { value: 'false', label: 'Past Events' }
  ];

  const eventTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'SOCIAL', label: 'Social' },
    { value: 'EDUCATIONAL', label: 'Educational' },
    { value: 'RECREATIONAL', label: 'Recreational' },
    { value: 'MAINTENANCE', label: 'Maintenance' },
    { value: 'MEETING', label: 'Meeting' }
  ];

  const sortByOptions = [
    { value: 'startDate', label: 'Start Date' },
    { value: 'createdAt', label: 'Created Date' },
    { value: 'title', label: 'Title' }
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
            onClick={() => {
              loadEvents();
              setError(null);
            }}
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

      {/* AI Event Suggestion Section */}
      {eventSuggestion && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">AI Event Suggestion</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowAllSuggestions(true)}
                className="flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium transition-colors"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                Read More
              </button>
              <button
                onClick={handleGenerateNewSuggestions}  // NEW
                disabled={suggestionLoading}
                className="flex items-center bg-purple-600 text-white px-3 py-1 rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold disabled:opacity-50"
              >
                <SparklesIcon className="h-4 w-4 mr-1" />
                {suggestionLoading ? 'Generating...' : 'New Ideas'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{eventSuggestion.title}</h4>
              <p className="text-gray-600 text-sm line-clamp-2">{eventSuggestion.description}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSuggestionStatusColor(eventSuggestion.status)}`}>
                {eventSuggestion.status}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {eventSuggestion.suggestedEventType}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {eventSuggestion.expectedEngagement}% engagement
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {formatDateTime(eventSuggestion.suggestedDate)}
                </span>
                <span>₹{eventSuggestion.estimatedCost}</span>
                <span>{eventSuggestion.recommendedCapacity} people</span>
              </div>

              {eventSuggestion.status === 'PENDING' && (
                <button
                  onClick={() => implementSuggestion(eventSuggestion.id)}
                  disabled={suggestionLoading}
                  className="flex items-center bg-[#FF4500] text-white px-3 py-1 rounded-lg hover:bg-[#E03E00] transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Create Event
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {!eventSuggestion && !suggestionLoading && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">No Event Suggestions</h3>
              <p className="text-gray-600 text-sm">Click to generate AI-powered event ideas for your community</p>
            </div>
            <button
              onClick={loadEventSuggestionExplicit}  // Use explicit function for initial generation
              className="flex items-center bg-[#FF4500] text-white px-4 py-2 rounded-lg hover:bg-[#E03E00] transition-colors text-sm font-semibold"
            >
              <SparklesIcon className="h-4 w-4 mr-1" />
              Generate Ideas
            </button>
          </div>
        </div>
      )}

      {/* All Suggestions Modal - Simple Implementation */}
      {showAllSuggestions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">All Event Suggestions</h2>
                <button
                  onClick={() => setShowAllSuggestions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 text-sm">
                View all AI-generated event suggestions for your community. Click "Create Event" to implement any suggestion.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Full suggestions list will be implemented here. For now, use the main suggestion above.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total</p>
              <p className="text-2xl font-semibold text-blue-900">{eventsData?.summary.total || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Upcoming</p>
              <p className="text-2xl font-semibold text-green-900">{eventsData?.summary.upcoming || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">Ongoing</p>
              <p className="text-2xl font-semibold text-orange-900">{eventsData?.summary.ongoing || 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-gray-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{eventsData?.summary.completed || 0}</p>
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
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors"
          />
        </div>

        {/* Upcoming Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUpcomingDropdownOpen(!isUpcomingDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {upcomingOptions.find(opt => opt.value === upcomingFilter)?.label || 'All Events'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isUpcomingDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isUpcomingDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {upcomingOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setUpcomingFilter(option.value);
                    setIsUpcomingDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${upcomingFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                    } ${option.value === '' ? 'border-b border-gray-100' : ''}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Event Type Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsEventTypeDropdownOpen(!isEventTypeDropdownOpen)}
            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-colors bg-white"
          >
            <span className="text-gray-700">
              {eventTypeOptions.find(opt => opt.value === eventTypeFilter)?.label || 'All Types'}
            </span>
            <ChevronDownIcon className={`h-5 w-5 text-gray-400 transition-transform ${isEventTypeDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isEventTypeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {eventTypeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setEventTypeFilter(option.value);
                    setIsEventTypeDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${eventTypeFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
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
              {sortByOptions.find(opt => opt.value === sortBy)?.label || 'Start Date'}
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${sortBy === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
                    } ${option.value === 'startDate' ? 'border-b border-gray-100' : ''}`}
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

      {/* Events List - Mobile Grid */}
      {!eventsData?.events || eventsData.events.length === 0 ? (
        <div className="text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-base font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {eventTypeFilter || upcomingFilter || searchTerm
              ? 'No events match your current filters. Try adjusting your search criteria.'
              : 'No events have been organized for this community yet.'}
          </p>
          {(eventTypeFilter || upcomingFilter || searchTerm) && (
            <button
              onClick={() => {
                setEventTypeFilter('');
                setUpcomingFilter('');
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
          {eventsData?.events && eventsData.events.length > 0 ? (
            eventsData.events.map((event) => {
              const startDateTime = formatDateTime(event.startDate);
              const endDateTime = formatDateTime(event.endDate);
              const upcoming = isEventUpcoming(event.startDate);

              return (
                <div key={event.id} className="bg-white border border-orange-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {event.eventType}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Organized by: {event.organizer.name}</span>
                        <span>•</span>
                        <span>Start: {startDateTime}</span>
                        <span>•</span>
                        <span>End: {endDateTime}</span>
                      </div>
                      {event.location && (
                        <div className="text-xs text-gray-500 mt-1">
                          Location: {event.location}
                        </div>
                      )}
                      {event.maxAttendees && (
                        <div className="text-xs text-gray-500 mt-1">
                          Attendees: {event.currentAttendees}/{event.maxAttendees}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : null}
        </div>
      )}

      {/* Pagination */}
      {eventsData?.pagination && eventsData.pagination.totalPages > 1 && (
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
              Page {currentPage} of {eventsData.pagination.totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(eventsData.pagination.totalPages, currentPage + 1))}
              disabled={currentPage === eventsData.pagination.totalPages}
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

export default CommunityEvents;