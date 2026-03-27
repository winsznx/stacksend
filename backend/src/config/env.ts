import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    // Database
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

    // Chainhooks
    HIRO_API_KEY: z.string().min(1, 'HIRO_API_KEY is required'),

    // Server
    BACKEND_URL: z.string().url(),
    PORT: z.string().default('3001'),
    NODE_ENV: z.enum(['development', 'production']).default('development'),
    ALLOWED_ORIGINS: z.string().default(''),

    // Telegram
    TELEGRAM_BOT_TOKEN: z.string().min(1, 'TELEGRAM_BOT_TOKEN is required'),
    TELEGRAM_BOT_USERNAME: z.string().min(1, 'TELEGRAM_BOT_USERNAME is required'),
    TELEGRAM_LINK_API_SECRET: z.string().optional(),

    // Contracts
    MULTISEND_CONTRACT_MAINNET: z.string().min(1),
    MULTISEND_CONTRACT_TESTNET: z.string().min(1),

    // Webhook authentication (recommended for production)
    WEBHOOK_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
}

if (parsed.data.NODE_ENV === 'production' && !parsed.data.WEBHOOK_SECRET) {
    throw new Error('WEBHOOK_SECRET is required in production');
}

export const config = {
    database: {
        url: parsed.data.DATABASE_URL,
    },
    chainhooks: {
        apiKey: parsed.data.HIRO_API_KEY,
    },
    server: {
        port: parseInt(parsed.data.PORT),
        url: parsed.data.BACKEND_URL,
        env: parsed.data.NODE_ENV,
        allowedOrigins: parsed.data.ALLOWED_ORIGINS
            .split(',')
            .map(origin => origin.trim())
            .filter(Boolean),
    },
    telegram: {
        botToken: parsed.data.TELEGRAM_BOT_TOKEN,
        botUsername: parsed.data.TELEGRAM_BOT_USERNAME,
    },
    api: {
        telegramLinkSecret: parsed.data.TELEGRAM_LINK_API_SECRET ?? null,
    },
    contracts: {
        mainnet: parsed.data.MULTISEND_CONTRACT_MAINNET,
        testnet: parsed.data.MULTISEND_CONTRACT_TESTNET,
    },
    webhooks: {
        secret: parsed.data.WEBHOOK_SECRET ?? null,
    },
};


export type {};
