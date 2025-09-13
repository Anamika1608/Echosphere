import { useState, useEffect, useCallback } from 'react';

interface WhatsAppGroup {
  id: string;
  name: string;
  isGroup: boolean;
}

interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
  estimatedCost: number;
  recommendedCapacity: number;
}

interface WhatsAppStatus {
  isReady: boolean;
  isInitializing: boolean;
  qrCode: string | null;
}

import { serverUrl } from '../utils';


export const useWhatsApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize WhatsApp client
  const initializeWhatsApp = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${serverUrl}/whatsapp/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to initialize WhatsApp');
      }
      
      // Start polling for status updates
      pollStatus();
      return true;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      // console.error('❌ WhatsApp initialization failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll status every 2 seconds until ready
  const pollStatus = useCallback(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${serverUrl}/whatsapp/status`);
        const status: WhatsAppStatus = await response.json();
        
        setIsReady(status.isReady);
        setIsInitializing(status.isInitializing);
        setQrCode(status.qrCode);
        
        if (status.isReady) {
          clearInterval(interval);
          fetchGroups(); // Fetch groups once ready
        }
      } catch (err) {
        // console.error('Status polling error:', err);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(interval), 300000);
  }, []);

  // Fetch WhatsApp groups
  const fetchGroups = useCallback(async (): Promise<WhatsAppGroup[]> => {
    try {
      setLoading(true);
      
      const response = await fetch(`${serverUrl}/whatsapp/groups`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get groups');
      }
      
      const fetchedGroups = data.groups || [];
      setGroups(fetchedGroups);
      return fetchedGroups;
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      // console.error('❌ Failed to fetch groups:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Send event broadcast
  const sendEventBroadcast = useCallback(async (
    groupId: string,
    eventData: EventData
  ): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${serverUrl}/whatsapp/broadcast`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          groupId,
          eventData
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send broadcast');
      }
      return true;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      // console.error('❌ Broadcast failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check initial status on mount
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const response = await fetch(`${serverUrl}/whatsapp/status`);
        const status: WhatsAppStatus = await response.json();
        
        setIsReady(status.isReady);
        setIsInitializing(status.isInitializing);
        setQrCode(status.qrCode);
        
        if (status.isReady) {
          fetchGroups();
        }
      } catch (err) {
        // console.error('Failed to check initial status:', err);
      }
    };

    checkInitialStatus();
  }, [fetchGroups]);

  return {
    isReady,
    isInitializing,
    qrCode,
    groups,
    loading,
    error,
    initializeWhatsApp,
    fetchGroups,
    sendEventBroadcast,
    clearError: () => setError(null)
  };
};