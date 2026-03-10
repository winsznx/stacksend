// Backend API client for StackSend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export interface User {
    wallet_address: string;
    telegram_linked: boolean;
    telegram_username: string | null;
    notification_enabled: boolean;
    created_at: string;
    updated_at: string;
}

export interface Transfer {
    id: number;
    tx_id: string;
    block_height: number;
    timestamp: number;
    sender_address: string;
    transfer_type: 'STX' | 'FT';
    token_contract: string | null;
    total_amount: number;
    recipient_count: number;
    network: string;
}

export interface ActivityEvent {
    id: number;
    user_address: string;
    event_type: 'received' | 'sent';
    transfer_id: number;
    recipient_id: number | null;
    metadata: Record<string, unknown>;
    created_at: string;
    tx_id: string;
    sender_address: string;
    transfer_type: string;
    token_contract: string | null;
    network: string;
    amount: number;
    amount_decimals: number;
}

class BackendAPIClient {
    private baseUrl: string;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    /**
     * Link Telegram account to wallet
     */
    async linkTelegram(walletAddress: string, chatId: number, username?: string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/telegram/link`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress, chatId, username }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to link Telegram');
        }
    }

    /**
     * Get user settings
     */
    async getUser(walletAddress: string): Promise<User | null> {
        const response = await fetch(`${this.baseUrl}/api/users/${walletAddress}`);

        if (response.status === 404) {
            return null;
        }

        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        return data.user;
    }

    /**
     * Get user activity
     */
    async getUserActivity(walletAddress: string, limit: number = 50): Promise<ActivityEvent[]> {
        const response = await fetch(`${this.baseUrl}/api/users/${walletAddress}/activity?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch activity');
        }

        const data = await response.json();
        return data.activity;
    }

    /**
     * Update notification settings
     */
    async setNotificationEnabled(walletAddress: string, enabled: boolean): Promise<void> {
        const response = await fetch(`${this.baseUrl}/api/users/${walletAddress}/notifications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enabled }),
        });

        if (!response.ok) {
            throw new Error('Failed to update notifications');
        }
    }

    /**
     * Get recent transfers
     */
    async getRecentTransfers(limit: number = 50): Promise<Transfer[]> {
        const response = await fetch(`${this.baseUrl}/api/transfers/recent?limit=${limit}`);

        if (!response.ok) {
            throw new Error('Failed to fetch transfers');
        }

        const data = await response.json();
        return data.transfers;
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            return response.ok;
        } catch {
            return false;
        }
    }
}

export const backendAPI = new BackendAPIClient();
