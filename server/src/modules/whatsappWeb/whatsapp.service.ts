import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

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

class WhatsAppService {
  private client: Client;
  private isReady: boolean = false;
  private isInitializing: boolean = false;
  private qrCode: string | null = null;

  constructor() {
    this.client = new Client({
      authStrategy: new LocalAuth({
        clientId: "event-manager"
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    this.client.on('qr', (qr: string) => {

      console.log('📱 QR RECEIVED - Scan with WhatsApp:');
      qrcode.generate(qr, { small: true });

      this.qrCode = qr;
    });

    this.client.on('ready', () => {
      console.log('✅ WhatsApp Client is ready!');
      this.isReady = true;
      this.qrCode = null;
    });

    this.client.on('authenticated', () => {
      console.log('✅ WhatsApp authenticated successfully');
    });

    this.client.on('auth_failure', (msg: string) => {
      console.error('❌ Authentication failed:', msg);
      this.isReady = false;
      this.qrCode = null;
    });

    this.client.on('disconnected', (reason: string) => {
      console.log('📱 WhatsApp disconnected:', reason);
      this.isReady = false;
    });

    // Test commands
    this.client.on('message', async (msg) => {
      if (msg.body.toLowerCase() === '!ping') {
        await msg.reply('🏓 Pong! Event Manager Bot is active!');
      }

      if (msg.body.toLowerCase() === '!test') {
        await msg.reply('✅ WhatsApp integration working perfectly!');
      }
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitializing || this.isReady) {
      return;
    }

    this.isInitializing = true;

    try {
      await this.client.initialize();
      console.log('🚀 WhatsApp client initialization started...');
    } catch (error) {
      console.error('❌ Failed to initialize WhatsApp:', error);
      this.isInitializing = false;
      throw error;
    }
  }

  public async sendEventBroadcast(
    groupId: string,
    eventData: EventData
  ): Promise<boolean> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready. Please scan QR code first.');
    }

    try {
      const message = this.formatEventMessage(eventData);
      await this.client.sendMessage(groupId, message);
      console.log('✅ Event broadcast sent successfully!');
      return true;
    } catch (error) {
      console.error('❌ Failed to send event broadcast:', error);
      throw error;
    }
  }

  private formatEventMessage(eventData: EventData): string {
    return `🎉 *UPCOMING EVENT ALERT* 🎉

📅 *${eventData.title}*

📝 *Description:*
${eventData.description}

⏰ *Date & Time:* ${eventData.date}
📍 *Location:* ${eventData.location}
💰 *Estimated Cost:* ₹${eventData.estimatedCost}
👥 *Capacity:* ${eventData.recommendedCapacity} people

Don't miss out! Mark your calendars! 🗓️

_This message was sent automatically by Event Manager Bot_ 🤖`;
  }

  public async getChats(): Promise<WhatsAppGroup[]> {
    if (!this.isReady) {
      throw new Error('WhatsApp client is not ready');
    }

    try {
      const chats = await this.client.getChats();
      return chats.filter(chat => chat.isGroup).map(chat => ({
        id: chat.id._serialized,
        name: chat.name,
        isGroup: chat.isGroup
      }));
    } catch (error) {
      console.error('❌ Failed to get chats:', error);
      throw error;
    }
  }

  public getClientStatus(): {
    isReady: boolean;
    isInitializing: boolean;
    qrCode: string | null;
  } {
    return {
      isReady: this.isReady,
      isInitializing: this.isInitializing,
      qrCode: this.qrCode
    };
  }

  public async destroy(): Promise<void> {
    try {
      await this.client.destroy();
      this.isReady = false;
      this.isInitializing = false;
      this.qrCode = null;
    } catch (error) {
      console.error('❌ Failed to destroy WhatsApp client:', error);
    }
  }
}

const whatsappService = new WhatsAppService();

export default whatsappService;