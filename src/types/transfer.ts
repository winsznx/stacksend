export interface Recipient {
  address: string;
  amount: string;
}

export interface TransferRequest {
  recipients: Recipient[];
  contractAddress: string;
  network: 'mainnet' | 'testnet';
}

export interface TransferResult {
  txId: string;
  recipientCount: number;
  totalAmount: number;
}

export type {};
