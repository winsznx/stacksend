export interface UserRow {
  id: number;
  wallet_address: string;
  telegram_chat_id: number | null;
  telegram_username: string | null;
  notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface TransferRow {
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

export interface RecipientRow {
  id: number;
  transfer_id: number;
  recipient_address: string;
  amount: number;
  amount_decimals: number;
}

export type {};
