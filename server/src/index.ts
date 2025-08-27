import express from "express";
import db from "./config/dbConnection";
import cookieParser from "cookie-parser";
import cors from "cors";
import config from "./config"

import { authRouter } from "./modules/auth/auth.routes";
import { voiceChatRouter } from "./modules/voiceChat/voiceChat.routes";
import { pgCommunityRouter } from "./modules/pgCommunity/pgCommunity.routes"
import { pgAnalyticsRouter } from "./modules/pgAnalytics/pgAnalytics.routes";
import { technicianRouter } from './modules/technician/technician.routes'
import { eventSuggestionRouter } from './modules/eventSuggestion/eventSuggestion.routes'
import whatsappService from "./modules/whatsappWeb/whatsapp.service";

const app = express()
const port = config.port

app.use(cors(
    {
        credentials: true,
        origin: config.frontendUrl
    }
));

db.connect()
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.error("Database connection error:", err));

app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());

app.listen(port, () => {
    console.log(`Server is running on port ${port}!`);
});

app.get("/", (req, res) => {
    res.send("Hello there!");
});

app.use("/api/auth", authRouter)
app.use("/api/pg-community", pgCommunityRouter)
app.use("/api/pg-analytics", pgAnalyticsRouter)
app.use("/api/technician", technicianRouter)
app.use("/api/voice-chat", voiceChatRouter)
app.use("/api/event-suggestions", eventSuggestionRouter)


app.post('/api/whatsapp/initialize', async (req, res) => {
    try {
        await whatsappService.initialize();
        res.json({
            success: true,
            message: 'WhatsApp initialization started. Check console for QR code.'
        });
    } catch (error) {
        console.error('WhatsApp initialization error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to initialize WhatsApp client',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get WhatsApp status
app.get('/api/whatsapp/status', (req, res) => {
    try {
        const status = whatsappService.getClientStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to get WhatsApp status',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Get WhatsApp groups
app.get('/api/whatsapp/groups', async (req, res) => {
    try {
        const groups = await whatsappService.getChats();
        res.json({ success: true, groups });
    } catch (error) {
        console.error('Failed to get groups:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get WhatsApp groups',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Send event broadcast
app.post('/api/whatsapp/broadcast', async (req, res) => {
    try {
        const { groupId, eventData } = req.body;

        if (!groupId || !eventData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: groupId and eventData'
            });
        }

        const success = await whatsappService.sendEventBroadcast(groupId, eventData);

        res.json({
            success: true,
            message: 'Event broadcast sent successfully!'
        });
    } catch (error) {
        console.error('Broadcast error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send event broadcast',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});