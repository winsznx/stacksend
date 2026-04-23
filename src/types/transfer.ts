export interface Recipient {
  readonly address: string;
  readonly amount: string;
}

export interface TransferRequest {
  readonly recipients: Recipient[];
  readonly contractAddress: string;
  readonly network: 'mainnet' | 'testnet';
}

export interface TransferResult {
  readonly txId: string;
  readonly recipientCount: number;
  readonly totalAmount: number;
}

export type {};
