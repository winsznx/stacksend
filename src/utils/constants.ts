// Contract addresses for each network
export const CONTRACT_ADDRESS_MAINNET = import.meta.env.VITE_CONTRACT_ADDRESS_MAINNET || '';
export const CONTRACT_ADDRESS_TESTNET = import.meta.env.VITE_CONTRACT_ADDRESS_TESTNET || '';

// Legacy support - defaults to mainnet
export const CONTRACT_ADDRESS = CONTRACT_ADDRESS_MAINNET;

// Helper to get contract address by network
export const getContractAddress = (isMainnet: boolean): string => {
    return isMainnet ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET;
};

// Maximum recipients allowed by the smart contract
export const MAX_RECIPIENTS_CONTRACT = 50;

// Plan configurations
export const PLANS = Object.freeze({
    starter: {
        name: 'Starter',
        maxRecipients: 5,
        description: 'Perfect for small batches',
    },
    pro: {
        name: 'Pro',
        maxRecipients: 10,
        description: 'For regular multisend users',
    },
    max: {
        name: 'Max',
        maxRecipients: 20,
        description: 'High volume transfers',
    },
    ultra: {
        name: 'Ultra',
        maxRecipients: 50,
        description: 'Maximum capacity',
    },
} as const;

export type PlanKey = keyof typeof PLANS;

// Network configurations
export const NETWORKS = Object.freeze({
    mainnet: {
        name: 'Mainnet',
        explorerUrl: 'https://explorer.stacks.co',
    },
    testnet: {
        name: 'Testnet',
        explorerUrl: 'https://explorer.stacks.co/?chain=testnet',
    },
} as const;
