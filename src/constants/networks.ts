export const MAINNET_CHAIN_ID = 1;
export const TESTNET_CHAIN_ID = 2147483648;

export const EXPLORER_URLS = Object.freeze({
  mainnet: 'https://explorer.stacks.co',
  testnet: 'https://explorer.stacks.co/?chain=testnet',
} as const);

export function explorerTxUrl(txId: string, isMainnet: boolean): string {
  const base = isMainnet ? EXPLORER_URLS.mainnet : EXPLORER_URLS.testnet;
  return `${base}/txid/${txId}`;
}

export function explorerAddressUrl(address: string, isMainnet: boolean): string {
  const base = isMainnet ? EXPLORER_URLS.mainnet : EXPLORER_URLS.testnet;
  return `${base}/address/${address}`;
}

export type {};
