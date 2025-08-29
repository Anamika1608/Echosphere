import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  CalendarIcon,
  ChevronDownIcon,
  SparklesIcon,
  PlusIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { serverUrl } from '@/utils';
import { useWhatsApp } from '@/services/whatsappService';

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
  location: string;
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
  // @ts-ignore
  const [sortBy, setSortBy] = useState('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Dropdown states
  const [isUpcomingDropdownOpen, setIsUpcomingDropdownOpen] = useState(false);
  const [isEventTypeDropdownOpen, setIsEventTypeDropdownOpen] = useState(false);
  const [isSortOrderDropdownOpen, setIsSortOrderDropdownOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [currentEventSuggestion, setCurrentEventSuggestion] = useState<any>(null);

  // QR Modal state
  const [showQRModal, setShowQRModal] = useState(false);

  const {
    isReady,
    isInitializing,
    qrCode,
    qrCodeDataURL,
    groups,
    loading: whatsappLoading,
    sendEventBroadcast,
  } = useWhatsApp();

  // Show QR modal when QR code is available 
  useEffect(() => {
    if (qrCodeDataURL) {
      setShowQRModal(true);
    } else {
      setShowQRModal(false);
    }
  }, [qrCodeDataURL]);

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

      if (response.data.success && response.data.data) {
        const transformedEvents = response.data.data.map((event: any) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          maxAttendees: event.maxCapacity,
          currentAttendees: event._count?.attendances || 0,
          organizer: {
            id: event.createdBy.id,
            name: event.createdBy.name,
            email: event.createdBy.email
          },
          createdAt: event.createdAt,
          updatedAt: event.updatedAt,
          status: determineEventStatus(event.startDate, event.endDate)
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
      // console.error('Events loading error:', err);
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
      // console.error('Failed to regenerate event suggestions:', err.response?.data?.message);
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

  const broadCastEvent = async (eventSuggestion: any) => {
    // Step 1: Initialize WhatsApp if not ready
    if (!isReady) {
      console.log("whatsapp is not ready")
      return;
    }

    // Step 2: Check if groups are available
    if (groups.length === 0) {
      alert('No WhatsApp groups found. Make sure you have groups and try refreshing.');
      return;
    }

    // Step 3: Store current event and show group selector
    setCurrentEventSuggestion(eventSuggestion);
    setShowGroupSelector(true);
  };

  // Handle the actual broadcast after group selection
  const handleConfirmBroadcast = async () => {
    if (!selectedGroupId || !currentEventSuggestion) return;

    try {
      // Prepare event data for WhatsApp message
      const eventData = {
        title: currentEventSuggestion.title,
        description: currentEventSuggestion.description,
        date: formatDateTime(currentEventSuggestion.suggestedDate),
        location: currentEventSuggestion.location,
        estimatedCost: currentEventSuggestion.estimatedCost,
        recommendedCapacity: currentEventSuggestion.recommendedCapacity
      };

      // Send WhatsApp broadcast first
      const broadcastSuccess = await sendEventBroadcast(selectedGroupId, eventData);

      if (broadcastSuccess) {
        // Then implement the suggestion (create actual event)
        await implementSuggestion(currentEventSuggestion.id);

        // Show success message
        alert('Event broadcasted to WhatsApp and created successfully!');

        // Reset modal state
        setShowGroupSelector(false);
        setSelectedGroupId('');
        setCurrentEventSuggestion(null);
      } else {
        alert('Failed to broadcast event to WhatsApp');
      }
    } catch (error) {
      // console.error('Failed to broadcast and create event:', error);
      alert('Error occurred while broadcasting event');
    }
  };

  const handleCancelModal = () => {
    setShowGroupSelector(false);
    setSelectedGroupId('');
    setCurrentEventSuggestion(null);
  };

  // QR Modal close handler
  const handleCloseQRModal = () => {
    setShowQRModal(false);
  };

  return (
    <div className="p-4">
      {/* QR Code Modal */}
      {showQRModal && qrCodeDataURL && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <button
              onClick={handleCloseQRModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Connect WhatsApp
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Scan this QR code with your WhatsApp mobile app to connect
                </p>
              </div>

              <div className="mb-6">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
                  <img
                    src={qrCodeDataURL}
                    alt="WhatsApp QR Code"
                    className="w-48 h-48 mx-auto"
                    onError={(e) => {
                      // console.error('QR Code image failed to load:', qrCodeDataURL);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    <span>Open WhatsApp on your phone</span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    <span>Tap Menu → Linked Devices</span>
                  </div>
                </div>
                <div className="flex items-center justify-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                    <span>Tap "Link a Device" and scan this code</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  This QR code will expire automatically once connected
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!isReady && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-800">
                {isInitializing
                  ? 'WhatsApp connecting. QR code will appear shortly'
                  : 'WhatsApp not connected. Click "Broadcast Event" to setup.'
                }
              </p>
              {qrCode && (
                <p className="text-xs text-yellow-600 mt-1">
                  QR Code available - scan with your phone
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Event Suggestion Section */}
      {eventSuggestion ? (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center">
              <SparklesIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-bold text-gray-900">AI Event Suggestion</h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleGenerateNewSuggestions}
                disabled={suggestionLoading}
                className=" flex mx-auto px-4 py-3  hover:bg-purple-600 transition-colors font-semibold text-sm" style={{
                  borderRadius: '16px',
                  border: '1px solid #FFF',
                  background: 'linear-gradient(180deg, #FFF 0%, #FFD7AE 56.5%, #FF9A72 113%)',
                  boxShadow: '1px 3px 6.1px 0 rgba(0, 0, 0, 0.20)'
                }}
              >
                <SparklesIcon className="h-4 w-4 mr-1" />
                {suggestionLoading ? 'Generating...' : 'New Ideas'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{eventSuggestion.title}</h4>
              <p className="text-gray-600 text-sm ">{eventSuggestion.description}</p>
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
                <span>{eventSuggestion.location}</span>
              </div>

              {eventSuggestion.status === 'PENDING' && (
                <button
                  onClick={() => broadCastEvent(eventSuggestion)}
                  disabled={suggestionLoading || whatsappLoading}
                  className="flex items-center bg-[#25D366] text-white px-3 py-1 rounded-lg hover:bg-[#20BA5A] transition-colors text-sm font-semibold disabled:opacity-50"
                >
                  {isReady ? (
                    <>
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z" />
                      </svg>
                      Broadcast Event
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4 mr-1" />
                      {isInitializing ? 'Connecting...' : 'Setup WhatsApp'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-2xl p-4 animate-pulse">
          <div className="flex items-center mb-2">
            <SparklesIcon className="h-6 w-6 text-purple-400 mr-2" />
            <h3 className="text-lg font-bold text-gray-700">AI Event Suggestion</h3>
          </div>
          <p className="text-gray-500 text-sm">Generating event ideas for you...</p>
        </div>
      )}

      {/* Group Selection Modal */}
      {showGroupSelector && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-75 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Select WhatsApp Group</h3>

            {groups.length === 0 ? (
              <p className="text-gray-600 mb-4">
                No WhatsApp groups found. Make sure you're added to some groups.
              </p>
            ) : (
              <>
                <div className="mb-4 max-h-60 overflow-y-auto">
                  {groups.map((group) => (
                    <div
                      key={group.id}
                      className={`p-3 border rounded-lg cursor-pointer mb-2 transition-colors ${selectedGroupId === group.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                      onClick={() => setSelectedGroupId(group.id)}
                    >
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-3">
                          {selectedGroupId === group.id && (
                            <div className="w-full h-full bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <span className="font-medium">{group.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="flex space-x-3">
              <button
                onClick={handleCancelModal}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBroadcast}
                disabled={!selectedGroupId || whatsappLoading}
                className="flex-1 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] disabled:opacity-50 transition-colors"
              >
                {whatsappLoading ? 'Sending...' : 'Send & Create Event'}
              </button>
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
              onClick={loadEventSuggestionExplicit}
              className="flex items-center bg-[#FF4500] text-white px-4 py-2 rounded-lg hover:bg-[#E03E00] transition-colors text-sm font-semibold"
            >
              <SparklesIcon className="h-4 w-4 mr-1" />
              Generate Ideas
            </button>
          </div>
        </div>
      )}

      {/* All Suggestions Modal */}
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
                View all AI-generated event suggestions for your community.
              </p>
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Full suggestions list will be implemented here.
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

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
      </div>

      {/* Events List */}
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