import { Pool, PoolClient } from 'pg';
import { config } from '../config/env.js';
import { logger } from '../utils/logger.js';

class DatabaseClient {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            connectionString: config.database.url,
            ssl: config.server.env === 'production' ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.testConnection();
    }

    private async testConnection() {
        try {
            const result = await this.pool.query('SELECT NOW()');
            logger.info('✅ Database connected: ' + result.rows[0].now);
        } catch (error) {
            logger.warn('⚠️  Database connection failed (server will continue): ' + (error instanceof Error ? error.message : String(error)));
            logger.warn('⚠️  Database features will not work until connection is established');
            // Don't throw - allow server to start without DB
        }
    }

    // User methods
    async ensureUser(walletAddress: string): Promise<void> {
        const query = `
      INSERT INTO users (wallet_address)
      VALUES ($1)
      ON CONFLICT (wallet_address) DO NOTHING
    `;
        await this.pool.query(query, [walletAddress]);
    }

    async getUserByAddress(walletAddress: string): Promise<any> {
        const query = 'SELECT * FROM users WHERE wallet_address = $1';
        const result = await this.pool.query(query, [walletAddress]);
        return result.rows[0] || null;
    }

    async getUserByTelegramChatId(chatId: number): Promise<any> {
        const query = 'SELECT * FROM users WHERE telegram_chat_id = $1';
        const result = await this.pool.query(query, [chatId]);
        return result.rows[0] || null;
    }


    async linkTelegram(walletAddress: string, chatId: number, username?: string): Promise<void> {
        await this.ensureUser(walletAddress);

        const query = `
      UPDATE users
      SET telegram_chat_id = $1, telegram_username = $2, updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = $3
    `;
        await this.pool.query(query, [chatId, username, walletAddress]);
    }

    async setNotificationEnabled(walletAddress: string, enabled: boolean): Promise<void> {
        const query = `
      UPDATE users
      SET notification_enabled = $1, updated_at = CURRENT_TIMESTAMP
      WHERE wallet_address = $2
    `;
        await this.pool.query(query, [enabled, walletAddress]);
    }

    // Transfer methods
    async insertTransfer(params: {
        tx_id: string;
        block_height: number;
        timestamp: number;
        sender_address: string;
        transfer_type: string;
        token_contract: string | null;
        total_amount: number;
        recipient_count: number;
        network: string;
    }): Promise<number> {
        const query = `
      INSERT INTO transfers (
        tx_id, block_height, timestamp, sender_address, transfer_type,
        token_contract, total_amount, recipient_count, network
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      ON CONFLICT (tx_id) DO NOTHING
      RETURNING id
    `;

        const result = await this.pool.query(query, [
            params.tx_id,
            params.block_height,
            params.timestamp,
            params.sender_address,
            params.transfer_type,
            params.token_contract,
            params.total_amount,
            params.recipient_count,
            params.network,
        ]);

        return result.rows[0]?.id;
    }

    async transferExists(txId: string): Promise<boolean> {
        const query = 'SELECT id FROM transfers WHERE tx_id = $1';
        const result = await this.pool.query(query, [txId]);
        return result.rows.length > 0;
    }

    async getTransferIdByTxId(txId: string): Promise<number | null> {
        const query = 'SELECT id FROM transfers WHERE tx_id = $1';
        const result = await this.pool.query(query, [txId]);
        return result.rows[0]?.id ?? null;
    }

    // Recipient methods
    async insertRecipient(params: {
        transfer_id: number;
        recipient_address: string;
        amount: number;
        amount_decimals: number;
        position_in_list: number;
    }): Promise<number> {
        const query = `
      INSERT INTO recipients (
        transfer_id, recipient_address, amount, amount_decimals, position_in_list
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;

        const result = await this.pool.query(query, [
            params.transfer_id,
            params.recipient_address,
            params.amount,
            params.amount_decimals,
            params.position_in_list,
        ]);

        return result.rows[0].id;
    }

    async markNotificationSent(recipientId: number): Promise<void> {
        const query = `
      UPDATE recipients
      SET notification_sent = true, notification_sent_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `;
        await this.pool.query(query, [recipientId]);
    }

    // Notification methods
    async insertNotification(params: {
        recipient_id: number;
        telegram_chat_id: number;
        message_text: string;
        message_sent: boolean;
        telegram_message_id: number | null;
        error_message?: string;
    }): Promise<void> {
        const query = `
      INSERT INTO notifications (
        recipient_id, telegram_chat_id, message_text, message_sent,
        telegram_message_id, error_message, sent_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

        await this.pool.query(query, [
            params.recipient_id,
            params.telegram_chat_id,
            params.message_text,
            params.message_sent,
            params.telegram_message_id,
            params.error_message || null,
            params.message_sent ? new Date() : null,
        ]);
    }

    // Activity feed methods
    async insertActivityFeed(params: {
        user_address: string;
        event_type: 'received' | 'sent';
        transfer_id: number;
        recipient_id: number | null;
        metadata?: unknown;
    }): Promise<void> {
        const query = `
      INSERT INTO activity_feed (
        user_address, event_type, transfer_id, recipient_id, metadata
      )
      VALUES ($1, $2, $3, $4, $5)
    `;

        await this.pool.query(query, [
            params.user_address,
            params.event_type,
            params.transfer_id,
            params.recipient_id,
            params.metadata ? JSON.stringify(params.metadata) : null,
        ]);
    }

    async getUserActivity(userAddress: string, limit: number = 50): Promise<any[]> {
        const query = `
      SELECT
        af.*,
        t.tx_id,
        t.sender_address,
        t.transfer_type,
        t.token_contract,
        t.network,
        r.amount,
        r.amount_decimals
      FROM activity_feed af
      JOIN transfers t ON af.transfer_id = t.id
      LEFT JOIN recipients r ON af.recipient_id = r.id
      WHERE af.user_address = $1
      ORDER BY af.created_at DESC
      LIMIT $2
    `;

        const result = await this.pool.query(query, [userAddress, limit]);
        return result.rows;
    }

    // Query methods
    async getRecentTransfers(limit: number = 50): Promise<any[]> {
        const query = `
      SELECT * FROM transfers
      ORDER BY created_at DESC
      LIMIT $1
    `;
        const result = await this.pool.query(query, [limit]);
        return result.rows;
    }

    async close(): Promise<void> {
        await this.pool.end();
    }
}

export const db = new DatabaseClient();
