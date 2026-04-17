import { MICRO_STX_PER_STX } from '../constants/contracts';

export function stxToMicro(stx: number): bigint {
  return BigInt(Math.floor(stx * MICRO_STX_PER_STX));
}

export function microToStx(micro: bigint | number): number {
  return Number(micro) / MICRO_STX_PER_STX;
}

export function isMainnetAddress(address: string): boolean {
  return address.startsWith('SP');
}

export function isTestnetAddress(address: string): boolean {
  return address.startsWith('ST');
}

export type {};
