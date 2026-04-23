export interface WalletState {
  readonly isAuthenticated: boolean;
  readonly stxAddress: string | null;
  readonly btcAddress: string | null;
  readonly publicKey: string | null;
  readonly walletType: 'stacks' | 'bitcoin' | null;
}

export interface WalletUser {
  readonly stxAddress: string | null;
  readonly btcAddress: string | null;
  readonly publicKey: string | null;
}

export type {};
