export interface WalletState {
  isAuthenticated: boolean;
  stxAddress: string | null;
  btcAddress: string | null;
  publicKey: string | null;
  walletType: 'stacks' | 'bitcoin' | null;
}

export interface WalletUser {
  stxAddress: string | null;
  btcAddress: string | null;
  publicKey: string | null;
}

export type {};
