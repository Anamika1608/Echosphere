import whatsappService from "./whatsapp.service";

import { Router } from 'express';

const router = Router();

router.post('/initialize', async (req, res) => {
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
router.get('/status', (req, res) => {
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
router.get('/groups', async (req, res) => {
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
router.post('/broadcast', async (req, res) => {
    try {
        const { groupId, eventData } = req.body;

        if (!groupId || !eventData) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: groupId and eventData'
            });
        }

        await whatsappService.sendEventBroadcast(groupId, eventData);

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

export { router as whatsappWebRouter };