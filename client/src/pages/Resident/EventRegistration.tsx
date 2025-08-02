import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner'; 

interface EventRegistrationProps {
  upcomingEvents: Array<{
    id: string;
    title: string;
    eventType: string;
    startDate: string;
    endDate: string;
    location: string;
    maxCapacity?: number;
    requiresRegistration: boolean;
    registrationDeadline?: string;
    _count: {
      attendances: number;
    };
  }>;
  userId: string;
}

interface RegistrationStatus {
  [eventId: string]: {
    isRegistered: boolean;
    status: string | null;
    isLoading: boolean;
  };
}

const EventRegistrationComponent: React.FC<EventRegistrationProps> = ({ 
  upcomingEvents, 
  userId 
}) => {
  const [registrationStatuses, setRegistrationStatuses] = useState<RegistrationStatus>({});

  // Fetch registration statuses for all events
  useEffect(() => {
    const fetchRegistrationStatuses = async () => {
      const statuses: RegistrationStatus = {};
      
      for (const event of upcomingEvents) {
        statuses[event.id] = { isRegistered: false, status: null, isLoading: true };
      }
      setRegistrationStatuses(statuses);

      // Fetch actual statuses
      for (const event of upcomingEvents) {
        try {
          const response = await fetch(`/api/events/${event.id}/registration-status`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust based on your auth setup
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            setRegistrationStatuses(prev => ({
              ...prev,
              [event.id]: {
                isRegistered: data.data.isRegistered,
                status: data.data.status,
                isLoading: false
              }
            }));
          }
        } catch (error) {
          console.error(`Error fetching registration status for event ${event.id}:`, error);
          setRegistrationStatuses(prev => ({
            ...prev,
            [event.id]: {
              ...prev[event.id],
              isLoading: false
            }
          }));
        }
      }
    };

    if (upcomingEvents.length > 0) {
      fetchRegistrationStatuses();
    }
  }, [upcomingEvents]);

  const handleRegistration = async (eventId: string, isRegistering: boolean) => {
    setRegistrationStatuses(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        isLoading: true
      }
    }));

    try {
      const url = `/api/events/${eventId}/register`;
      const method = isRegistering ? 'POST' : 'DELETE';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setRegistrationStatuses(prev => ({
          ...prev,
          [eventId]: {
            isRegistered: isRegistering,
            status: isRegistering ? 'REGISTERED' : null,
            isLoading: false
          }
        }));

        toast.success(data.message);
        
        // Optionally refresh the events list to update attendance count
        // window.location.reload(); // or use your state management solution
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Registration failed');
      
      setRegistrationStatuses(prev => ({
        ...prev,
        [eventId]: {
          ...prev[eventId],
          isLoading: false
        }
      }));
    }
  };

  const isRegistrationDisabled = (event: any) => {
    if (event.requiresRegistration && event.registrationDeadline) {
      return new Date() > new Date(event.registrationDeadline);
    }
    return new Date() > new Date(event.startDate);
  };

  const isAtCapacity = (event: any) => {
    return event.maxCapacity && event._count.attendances >= event.maxCapacity;
  };

  return (
    <div className="space-y-3">
      {upcomingEvents.slice(0, 3).map((event) => {
        const registrationStatus = registrationStatuses[event.id];
        const isDisabled = isRegistrationDisabled(event);
        const atCapacity = isAtCapacity(event);
        
        return (
          <div key={event.id} className="p-3 bg-gray-50 rounded-xl">
            <h4 className="font-medium text-gray-900">{event.title}</h4>
            <p className="text-sm text-gray-600 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {event.eventType}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {event.location}
            </p>

            {/* Registration Section */}
            <div className="mt-3 space-y-2">
              {registrationStatus?.isRegistered ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600 font-medium">Registered</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRegistration(event.id, false)}
                    disabled={registrationStatus.isLoading || isDisabled}
                    className="text-xs"
                  >
                    {registrationStatus.isLoading ? 'Loading...' : 'Unregister'}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {atCapacity ? 'Event Full' : 'Available'}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleRegistration(event.id, true)}
                    disabled={
                      registrationStatus?.isLoading || 
                      isDisabled || 
                      atCapacity ||
                      !registrationStatus // Still loading
                    }
                    className="text-xs"
                  >
                    {registrationStatus?.isLoading ? 'Loading...' : 'Register'}
                  </Button>
                </div>
              )}
              
              {/* Show registration deadline warning */}
              {event.requiresRegistration && event.registrationDeadline && (
                <p className="text-xs text-amber-600">
                  Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                </p>
              )}
{/*               
              {isDisabled && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Registration closed
                </p>
              )} */}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                {event._count.attendances} registered
                {event.maxCapacity && ` / ${event.maxCapacity}`}
              </Badge>
              {registrationStatus?.isRegistered && (
                <Badge variant="secondary" className="text-xs">
                  You're registered
                </Badge>
              )}
            </div>
          </div>
        );
      })}
      {!upcomingEvents.length && (
        <p className="text-center text-gray-500 py-4">No upcoming events</p>
      )}
    </div>
  );
};

export default EventRegistrationComponent;