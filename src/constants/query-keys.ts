export const queryKeys = {
  user: (address: string) => ['user', address] as const,
  activity: (address: string) => ['activity', address] as const,
  transfers: (limit?: number) => ['transfers', limit] as const,
  balance: (address: string) => ['balance', address] as const,
  health: () => ['health'] as const,
} as const;

export type {};

export type QueryKeysType = typeof queryKeys;
