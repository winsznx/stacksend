function required(key: string): string {
  const value = import.meta.env[key];
  if (typeof value !== 'string' || value === '') {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

function optional(key: string, fallback = ''): string {
  const value = import.meta.env[key];
  return typeof value === 'string' ? value : fallback;
}

export const env = {
  backendUrl: optional('VITE_BACKEND_URL', 'http://localhost:3001'),
  reownProjectId: optional('VITE_REOWN_PROJECT_ID'),
  contractMainnet: optional('VITE_CONTRACT_ADDRESS_MAINNET'),
  contractTestnet: optional('VITE_CONTRACT_ADDRESS_TESTNET'),
  required,
  optional,
} as const;

export type {};
