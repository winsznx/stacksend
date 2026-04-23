export interface NetworkConfig {
  readonly name: string;
  readonly chainId: number;
  readonly explorerUrl: string;
  readonly isMainnet: boolean;
}

export type NetworkName = 'mainnet' | 'testnet';

export type {};
