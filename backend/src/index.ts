import express from 'express';
import cors from 'cors';
import { z } from 'zod';
import { config } from './config/env.js';
import { handleSTXTransferWebhook } from './api/webhooks/stx-transfer.js';
import { handleFTTransferWebhook } from './api/webhooks/ft-transfer.js';
import { db } from './db/client.js';
import { telegramService } from './services/telegram.js';
import { isValidStacksAddress, parseLimit, safeSecretCompare } from './utils/security.js';


const app = express();

const defaultDevOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const allowedOrigins = config.server.allowedOrigins.length > 0
    ? config.server.allowedOrigins
    : (config.server.env === 'development' ? defaultDevOrigins : []);


const telegramLinkRequestSchema = z.object({
    walletAddress: z.string().trim().refine(isValidStacksAddress, 'Invalid wallet address'),
    chatId: z.coerce.number().int().positive(),
    username: z.string().trim().min(1).max(64).optional(),
});


const notificationToggleSchema = z.object({
    enabled: z.boolean(),
});

// Middleware
app.use(cors({
    origin(origin, callback) {
        if (!origin) {
            callback(null, true);
            return;
        }

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Telegram-Link-Secret'],
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook endpoints
app.post('/api/webhooks/stx-transfer', handleSTXTransferWebhook);
app.post('/api/webhooks/ft-transfer', handleFTTransferWebhook);

// Telegram linking endpoint
app.post('/api/telegram/link', async (req, res) => {
    try {
        const secret = req.header('x-telegram-link-secret');
        const expectedSecret = config.api.telegramLinkSecret;

        if (!expectedSecret) {
            return res.status(503).json({ error: 'Telegram linking API is disabled' });
        }

        if (!safeSecretCompare(secret, expectedSecret)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const parsed = telegramLinkRequestSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const { walletAddress, chatId, username } = parsed.data;
        await db.linkTelegram(walletAddress, chatId, username);

        // Send welcome message
        await telegramService.sendWelcomeMessage(chatId, walletAddress);

        res.json({ success: true, message: 'Telegram linked successfully' });
    } catch (error: unknown) {
        console.error('❌ Telegram link error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user activity
app.get('/api/users/:address/activity', async (req, res) => {
    try {
        const { address } = req.params;
        if (!isValidStacksAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const limit = parseLimit(req.query.limit, 50, 200);

        const activity = await db.getUserActivity(address, limit);

        res.json({ activity });
    } catch (error: unknown) {
        console.error('❌ Activity fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get user settings
app.get('/api/users/:address', async (req, res) => {
    try {
        const { address } = req.params;
        if (!isValidStacksAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }
        const user = await db.getUserByAddress(address);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                wallet_address: user.wallet_address,
                telegram_linked: Boolean(user.telegram_chat_id),
                telegram_username: user.telegram_username,
                notification_enabled: user.notification_enabled,
                created_at: user.created_at,
                updated_at: user.updated_at,
            },
        });
    } catch (error: unknown) {
        console.error('❌ User fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update notification settings
app.post('/api/users/:address/notifications', async (req, res) => {
    try {
        const { address } = req.params;
        if (!isValidStacksAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }

        const secret = req.header('x-telegram-link-secret');
        const expectedSecret = config.api.telegramLinkSecret;

        if (!expectedSecret) {
            return res.status(503).json({ error: 'Notification settings API is disabled' });
        }

        if (!safeSecretCompare(secret, expectedSecret)) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const parsed = notificationToggleSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid request body',
                details: parsed.error.flatten().fieldErrors,
            });
        }

        const { enabled } = parsed.data;
        await db.setNotificationEnabled(address, enabled);

        res.json({ success: true, enabled });
    } catch (error: unknown) {
        console.error('❌ Notification update error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get recent transfers
app.get('/api/transfers/recent', async (req, res) => {
    try {
        const limit = parseLimit(req.query.limit, 50, 200);
        const transfers = await db.getRecentTransfers(limit);

        res.json({ transfers });
    } catch (error: unknown) {
        console.error('❌ Transfers fetch error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server

const port = config.server.port;
app.listen(port, () => {
    console.log(`✅ Server running on port ${port}`);
    console.log(`🌍 Environment: ${config.server.env}`);
    console.log(`📡 Backend URL: ${config.server.url}`);
});
