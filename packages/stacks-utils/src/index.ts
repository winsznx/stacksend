import { z } from 'zod';

const STANDARD_PRINCIPAL_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}$/;
const CONTRACT_PRINCIPAL_REGEX = /^S[TPM][0-9A-HJ-NP-Za-km-z]{33,41}\.[a-zA-Z][a-zA-Z0-9-]*$/;

export const isValidPrincipal = (address: string): boolean => {
  if (!address || typeof address !== 'string') return false;
  const trimmed = address.trim();
  return STANDARD_PRINCIPAL_REGEX.test(trimmed) || CONTRACT_PRINCIPAL_REGEX.test(trimmed);
};

export const StandardPrincipalSchema = z.string().refine(
  (p) => STANDARD_PRINCIPAL_REGEX.test(p.trim()),
  { message: 'Invalid Stacks address. Must start with SP (mainnet) or ST (testnet).' }
);

export const PrincipalSchema = z.string().refine(
  (p) => isValidPrincipal(p),
  { message: 'Invalid Stacks principal address.' }
);

export const AmountSchema = z.string().refine(
  (val) => {
    const num = Number(val);
    return !isNaN(num) && num > 0;
  },
  { message: 'Amount must be a positive number.' }
);

export const parseAddresses = (input: string): string[] => {
  if (!input || typeof input !== 'string') return [];
  return input
    .split(/[\n,;]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .filter((addr) => STANDARD_PRINCIPAL_REGEX.test(addr));
};

export const validateRecipient = (
  address: string,
  amount: string
): { valid: boolean; errors: string[] } => {
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

export const formatAddress = (address: string, startChars = 6, endChars = 4): string => {
  if (!address || address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

export const stxToMicroStx = (stx: number): number => Math.floor(stx * 1_000_000);

export const microStxToStx = (microStx: number): number => microStx / 1_000_000;
