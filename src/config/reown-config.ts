import { createAppKit } from '@reown/appkit/react';
import { BitcoinAdapter } from '@reown/appkit-adapter-bitcoin';
import { bitcoin, bitcoinTestnet } from '@reown/appkit/networks';

// Get project ID from environment
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

if (!projectId) {
    console.warn('VITE_REOWN_PROJECT_ID is not set. Bitcoin wallet connection will not work.');
}

// Bitcoin networks configuration
const networks = [bitcoin, bitcoinTestnet] as const;

// Bitcoin adapter setup
const bitcoinAdapter = new BitcoinAdapter({
    projectId: projectId || '',
});

// Metadata for the dApp
const metadata = {
    name: 'StackSend',
    description: 'Send STX and SIP-010 tokens to multiple recipients in a single transaction',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://stacksend.app',
    icons: [typeof window !== 'undefined' ? `${window.location.origin}/favicon.ico` : 'https://stacksend.app/favicon.ico'],
};

// Create and export the AppKit modal instance

export const reownModal = projectId ? createAppKit({
    adapters: [bitcoinAdapter],
    networks: [...networks],
    metadata,
    projectId,
    features: {
        analytics: true,
        email: false,
        socials: [],
    },
}) : null;

// Export helper to check if Reown is configured

export const isReownConfigured = () => !!projectId;


export type {};
