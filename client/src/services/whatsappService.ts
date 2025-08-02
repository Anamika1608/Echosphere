import { useState, useEffect, useCallback } from 'react';
import { whatsappAPI } from './whatsappApi';

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

export const useWhatsApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize WhatsApp client
  const initializeWhatsApp = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await whatsappAPI.initializeWhatsApp();
      console.log('✅', result.message);
      
      // Start polling for status updates
      pollStatus();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('❌ WhatsApp initialization failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll status every 2 seconds until ready
  const pollStatus = useCallback(() => {
    const interval = setInterval(async () => {
      try {
        const status = await whatsappAPI.getStatus();
        setIsReady(status.isReady);
        setIsInitializing(status.isInitializing);
        setQrCode(status.qrCode);
        
        if (status.isReady) {
          console.log('🎉 WhatsApp is ready!');
          clearInterval(interval);
          fetchGroups(); // Fetch groups once ready
        }
      } catch (err) {
        console.error('Status polling error:', err);
      }
    }, 2000);

    // Stop polling after 5 minutes
    setTimeout(() => clearInterval(interval), 300000);
  }, []);

  // Fetch WhatsApp groups
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedGroups = await whatsappAPI.getGroups();
      setGroups(fetchedGroups);
      console.log(`📱 Found ${fetchedGroups.length} WhatsApp groups`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch groups');
      console.error('❌ Failed to fetch groups:', err);
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

      const success = await whatsappAPI.sendEventBroadcast(groupId, eventData);
      
      if (success) {
        console.log('🎉 Event broadcast sent successfully!');
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Broadcast failed:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check initial status on mount
  useEffect(() => {
    const checkInitialStatus = async () => {
      try {
        const status = await whatsappAPI.getStatus();
        setIsReady(status.isReady);
        setIsInitializing(status.isInitializing);
        setQrCode(status.qrCode);
        
        if (status.isReady) {
          fetchGroups();
        }
      } catch (err) {
        console.error('Failed to check initial status:', err);
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
