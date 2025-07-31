// components/community/CommunityEvents.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  CalendarIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
      setEventsData(response.data.data ? response.data : {
        events: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        summary: { total: 0, upcoming: 0, ongoing: 0, completed: 0, cancelled: 0 }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load events');
    } finally {
      setLoading(false);
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
            onClick={loadEvents}
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    upcomingFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    eventTypeFilter === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
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
                  className={`w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors ${
                    sortBy === option.value ? 'bg-orange-100 text-[#FF4500] font-medium' : 'text-gray-700'
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