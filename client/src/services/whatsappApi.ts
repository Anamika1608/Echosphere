import { serverUrl } from '../utils';

interface EventData {
  title: string;
  description: string;
  date: string;
  location: string;
  estimatedCost: number;
  recommendedCapacity: number;
}

interface WhatsAppGroup {
  id: string;
  name: string;
  isGroup: boolean;
}

interface WhatsAppStatus {
  isReady: boolean;
  isInitializing: boolean;
  qrCode: string | null;
  qrCodeDataURL: string | null; // Add this for the QR code image
}

class WhatsAppAPI {
  async initializeWhatsApp(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${serverUrl}/whatsapp/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log("after initializeWhatsApp", response);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to initialize WhatsApp');
    }

    return response.json();
  }

  async getStatus(): Promise<WhatsAppStatus> {
    const response = await fetch(`${serverUrl}/whatsapp/status`);

    console.log("response after fetching status", response);
    
    if (!response.ok) {
      throw new Error('Failed to get WhatsApp status');
    }

    return response.json();
  }

  async getGroups(): Promise<WhatsAppGroup[]> {
    const response = await fetch(`${serverUrl}/whatsapp/groups`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get groups');
    }

    const data = await response.json();
    return data.groups || [];
  }

  async sendEventBroadcast(groupId: string, eventData: EventData): Promise<boolean> {
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

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to send broadcast');
    }

    const data = await response.json();
    return data.success;
  }
}

export const whatsappAPI = new WhatsAppAPI();