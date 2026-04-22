import { ChainhooksClient, CHAINHOOKS_BASE_URL } from '@hirosystems/chainhooks-client';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

function withWebhookSecret(path: string): string {
    const base = `${config.server.url}${path}`;
    if (!config.webhooks.secret) {
        return base;
    }
    const secret = encodeURIComponent(config.webhooks.secret);
    return `${base}?secret=${secret}`;
}

/**
 * Register STX transfer chainhook
 */

export async function registerSTXTransferChainhook(network: 'mainnet' | 'testnet') {
    const client = new ChainhooksClient({
        baseUrl: network === 'mainnet' ? CHAINHOOKS_BASE_URL.mainnet : CHAINHOOKS_BASE_URL.testnet,
        apiKey: config.chainhooks.apiKey,
    });

    const contractIdentifier = network === 'mainnet'
        ? config.contracts.mainnet
        : config.contracts.testnet;

    const chainhook = {
        version: '1' as const,
        name: `stacksend-stx-transfers-${network}`,
        chain: 'stacks' as const,
        network,
        filters: {
            events: [
                {
                    type: 'contract_call' as const,
                    contract_identifier: contractIdentifier,
                    function_name: 'send-many-stx',
                },
            ],
        },
        action: {
            type: 'http_post' as const,
            url: withWebhookSecret('/api/webhooks/stx-transfer'),
        },
        options: {
            decode_clarity_values: true,
            enable_on_registration: true,
        },
    };

    try {
        const result = await client.registerChainhook(chainhook);
        logger.info(`✅ STX transfer chainhook registered for ${network}: ${result.uuid}`);
        return result;
    } catch (error: unknown) {
        logger.error(`❌ Failed to register STX chainhook for ${network}:`, error);
        throw error;
    }
}

/**
 * Register FT transfer chainhook
 */

export async function registerFTTransferChainhook(network: 'mainnet' | 'testnet') {
    const client = new ChainhooksClient({
        baseUrl: network === 'mainnet' ? CHAINHOOKS_BASE_URL.mainnet : CHAINHOOKS_BASE_URL.testnet,
        apiKey: config.chainhooks.apiKey,
    });

    const contractIdentifier = network === 'mainnet'
        ? config.contracts.mainnet
        : config.contracts.testnet;

    const chainhook = {
        version: '1' as const,
        name: `stacksend-ft-transfers-${network}`,
        chain: 'stacks' as const,
        network,
        filters: {
            events: [
                {
                    type: 'contract_call' as const,
                    contract_identifier: contractIdentifier,
                    function_name: 'send-many-ft',
                },
            ],
        },
        action: {
            type: 'http_post' as const,
            url: withWebhookSecret('/api/webhooks/ft-transfer'),
        },
        options: {
            decode_clarity_values: true,
            enable_on_registration: true,
        },
    };

    try {
        const result = await client.registerChainhook(chainhook);
        logger.info(`✅ FT transfer chainhook registered for ${network}: ${result.uuid}`);
        return result;
    } catch (error: unknown) {
        logger.error(`❌ Failed to register FT chainhook for ${network}:`, error);
        throw error;
    }
}

/**
 * Register all chainhooks
 */

export async function registerAllChainhooks() {
    logger.info('📡 Registering chainhooks...');

    try {
        await registerSTXTransferChainhook('mainnet');
        await registerSTXTransferChainhook('testnet');
        await registerFTTransferChainhook('mainnet');
        await registerFTTransferChainhook('testnet');

        logger.info('✅ All chainhooks registered successfully');
    } catch (error) {
        logger.error('❌ Failed to register chainhooks:', error);
        throw error;
    }
}
