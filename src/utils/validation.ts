import { z } from 'zod';

// Stacks address validation regex
// Standard principal: SP (mainnet), ST (testnet), or SM followed by base58 characters
// Contract principal: Standard principal + .contract-name
const STANDARD_PRINCIPAL_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}$/;
const CONTRACT_PRINCIPAL_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}\.[a-zA-Z][a-zA-Z0-9-]*$/;

// Validate if string is a valid Stacks principal (standard or contract)

export const isValidPrincipal = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return STANDARD_PRINCIPAL_REGEX.test(trimmed) || CONTRACT_PRINCIPAL_REGEX.test(trimmed);
};

// Zod schema for standard principal address

export const StandardPrincipalSchema = z.string().refine(
  (p) => STANDARD_PRINCIPAL_REGEX.test(p.trim()),
  { message: 'Invalid Stacks address. Must start with SP (mainnet) or ST (testnet).' }
);

// Zod schema for any principal (standard or contract)

export const PrincipalSchema = z.string().refine(
  (p) => isValidPrincipal(p),
  { message: 'Invalid Stacks principal address.' }
);

// Zod schema for positive amount

export const AmountSchema = z.string().refine(
  (val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  },
  { message: 'Amount must be a positive number.' }
);

// Parse addresses from pasted input (newline or comma separated)

export const parseAddresses = (input: string): string[] => {
  if (!input || typeof input !== 'string') return [];

  return input
    .split(/[\n,;]/) // Split by newline, comma, or semicolon
    .map(s => s.trim()) // Trim whitespace
    .filter(Boolean) // Remove empty strings
    .filter(addr => {
      // Only include valid standard principals (not contract principals for recipients)
      return STANDARD_PRINCIPAL_REGEX.test(addr);
    });
};

// Validate a single recipient entry

export const validateRecipient = (address: string, amount: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!address || !address.trim()) {
    errors.push('Address is required');
  } else if (!STANDARD_PRINCIPAL_REGEX.test(address.trim())) {
    errors.push('Invalid Stacks address');
  }

  if (!amount || !amount.trim()) {
    errors.push('Amount is required');
  } else {
    const num = Number(amount);
    if (isNaN(num) || num <= 0) {
      errors.push('Amount must be a positive number');
    }
  }

  return { valid: errors.length === 0, errors };
};

// Format address for display (truncate middle)

export const formatAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (!address || address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Convert STX to microSTX (1 STX = 1,000,000 microSTX)

export const stxToMicroStx = (stx: number): number => {
  return Math.floor(stx * 1_000_000);
};

// Convert microSTX to STX

export const microStxToStx = (microStx: number): number => {
  return microStx / 1_000_000;
};


export type {};

// Type guard for strings
export const isString = (val: unknown): val is string => typeof val === "string";
