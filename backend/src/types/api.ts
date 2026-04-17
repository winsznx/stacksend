export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface WebhookPayload {
  apply: Array<{
    transactions: Array<{
      transaction_identifier: { hash: string };
      metadata: Record<string, unknown>;
    }>;
  }>;
}

export type {};
