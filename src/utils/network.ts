import { TESTNET_CHAIN_ID } from '../constants/networks';

export function isTestnetChainId(chainId: number): boolean {
  return chainId === TESTNET_CHAIN_ID;
}

export function networkLabel(isMainnet: boolean): string {
  return isMainnet ? 'Mainnet' : 'Testnet';
}

export type {};
\nexport type StacksNetworkType = 'mainnet' | 'testnet';\n