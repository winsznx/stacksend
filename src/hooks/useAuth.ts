import { connect, disconnect, isConnected, getLocalStorage, request } from '@stacks/connect';
import { createNetwork } from '@stacks/network';
import type { NetworkType, StacksNetwork } from '@stacks/network';
import { createContext, createElement, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { reownModal, isReownConfigured } from '../config/reown-config';
import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';

type BitcoinWalletProvider = ReturnType<typeof useAppKitProvider>['walletProvider'];

interface StoredAddresses {
    addresses?: {
        stx?: Array<{ address: string; publicKey?: string }>;
        btc?: Array<{ address: string; publicKey?: string }>;
    };
}

type WalletType = 'stacks' | 'bitcoin' | null;

interface AuthState {
    isAuthenticated: boolean;
    stxAddress: string | null;
    btcAddress: string | null;
    publicKey: string | null;
    walletType: WalletType;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    stxAddress: string | null;
    btcAddress: string | null;
    publicKey: string | null;
    walletType: WalletType;
    loading: boolean;
    userData: {
        stxAddress: string | null;
        btcAddress: string | null;
        publicKey: string | null;
    } | null;
    authenticate: () => Promise<unknown>;
    connectBitcoin: () => Promise<void>;
    disconnect: () => Promise<void>;
    getStxAddress: () => Promise<unknown>;
    network: StacksNetwork;
    setNetwork: (network: StacksNetwork) => void;
    isReownConfigured: boolean;
    walletProvider: BitcoinWalletProvider;
}

function detectNetwork(address: string): StacksNetwork {
    const prefix = address.slice(0, 2);
    const type: NetworkType = prefix === 'ST' ? 'testnet' : 'mainnet';
    return createNetwork(type);
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function useProvideAuth(): AuthContextValue {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        stxAddress: null,
        btcAddress: null,
        publicKey: null,
        walletType: null,
    });
    const [network, setNetwork] = useState<StacksNetwork>(createNetwork('mainnet'));
    const [loading, setLoading] = useState(false);

    const { address: reownAddress, isConnected: isReownConnected } = useAppKitAccount();
    const { walletProvider } = useAppKitProvider('bip122');

    useEffect(() => {
        const checkConnection = () => {
            if (isConnected()) {
                const data = getLocalStorage() as StoredAddresses | null;
                if (data?.addresses?.stx?.[0]) {
                    const address = data.addresses.stx[0].address;
                    setAuthState({
                        isAuthenticated: true,
                        stxAddress: address,
                        btcAddress: data.addresses.btc?.[0]?.address || null,
                        publicKey: data.addresses.stx[0].publicKey || null,
                        walletType: 'stacks',
                    });
                    setNetwork(detectNetwork(address));
                }
            }
        };
        checkConnection();
    }, []);

    useEffect(() => {
        if (isReownConnected && reownAddress) {
            setAuthState(prev => ({
                ...prev,
                isAuthenticated: true,
                btcAddress: reownAddress,
                walletType: 'bitcoin',
            }));
        } else if (!isReownConnected && authState.walletType === 'bitcoin') {
            setAuthState({
                isAuthenticated: false,
                stxAddress: null,
                btcAddress: null,
                publicKey: null,
                walletType: null,
            });
        }
    }, [isReownConnected, reownAddress, authState.walletType]);

    const authenticate = useCallback(async () => {
        setLoading(true);
        try {
            const response = await connect();
            const data = getLocalStorage() as StoredAddresses | null;

            if (data?.addresses?.stx?.[0]) {
                const address = data.addresses.stx[0].address;
                setAuthState({
                    isAuthenticated: true,
                    stxAddress: address,
                    btcAddress: data.addresses.btc?.[0]?.address || null,
                    publicKey: data.addresses.stx[0].publicKey || null,
                    walletType: 'stacks',
                });
                setNetwork(detectNetwork(address));
            }

            return response;
        } catch (error) {
            console.error('Failed to connect Stacks wallet:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const connectBitcoin = useCallback(async () => {
        if (!isReownConfigured()) {
            throw new Error('Reown is not configured. Please add VITE_REOWN_PROJECT_ID to your .env file.');
        }

        setLoading(true);
        try {
            await reownModal?.open();
        } catch (error) {
            console.error('Failed to connect Bitcoin wallet:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const signOut = useCallback(async () => {
        if (authState.walletType === 'stacks') {
            disconnect();
        } else if (authState.walletType === 'bitcoin') {
            await reownModal?.disconnect();
        }

        setAuthState({
            isAuthenticated: false,
            stxAddress: null,
            btcAddress: null,
            publicKey: null,
            walletType: null,
        });
    }, [authState.walletType]);

    const getStxAddress = useCallback(async () => {
        try {
            return await request('stx_getAddresses');
        } catch (error) {
            console.error('Failed to get STX addresses:', error);
            throw error;
        }
    }, []);

    return {
        isAuthenticated: authState.isAuthenticated,
        stxAddress: authState.stxAddress,
        btcAddress: authState.btcAddress,
        publicKey: authState.publicKey,
        walletType: authState.walletType,
        loading,
        userData: authState.isAuthenticated ? {
            stxAddress: authState.stxAddress,
            btcAddress: authState.btcAddress,
            publicKey: authState.publicKey,
        } : null,
        authenticate,
        connectBitcoin,
        disconnect: signOut,
        getStxAddress,
        network,
        setNetwork,
        isReownConfigured: isReownConfigured(),
        walletProvider,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useProvideAuth();
    return createElement(AuthContext.Provider, { value: auth }, children);
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
