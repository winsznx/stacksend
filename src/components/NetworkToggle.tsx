import { useEffect, useRef, useState } from 'react';
import { createNetwork } from '@stacks/network';
import { useAuth } from '../hooks/useAuth';
import { Globe, TestTube, AlertCircle } from 'lucide-react';

export const NetworkToggle: React.FC = () => {
    const { setNetwork, network } = useAuth();
    const isMainnet = network?.chainId !== 2147483648;
    const [showAlert, setShowAlert] = useState(false);
    const alertTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (alertTimeoutRef.current) {
                clearTimeout(alertTimeoutRef.current);
            }
        };
    }, []);

    const toggle = () => {
        const newIsMainnet = !isMainnet;
        const targetNetwork = newIsMainnet ? 'mainnet' : 'testnet';

        // Update local state
        const newNetwork = createNetwork(targetNetwork);
        setNetwork(newNetwork);

        // Show alert to remind user to switch in their wallet
        setShowAlert(true);
        if (alertTimeoutRef.current) {
            clearTimeout(alertTimeoutRef.current);
        }
        alertTimeoutRef.current = setTimeout(() => setShowAlert(false), 5000);
    };

    return (
        <div className="relative">
            <button
                onClick={toggle}
                className="btn-ghost text-sm"
                aria-label={`Switch to ${isMainnet ? 'Testnet' : 'Mainnet'}`}
                aria-pressed={!isMainnet}
                style={{
                    color: isMainnet ? 'var(--success)' : 'var(--warning)',
                }}
                title={`Click to switch to ${isMainnet ? 'Testnet' : 'Mainnet'}`}
            >
                {isMainnet ? (
                    <>
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">Mainnet</span>
                    </>
                ) : (
                    <>
                        <TestTube className="w-4 h-4" />
                        <span className="hidden sm:inline">Testnet</span>
                    </>
                )}
            </button>

            {/* Network Switch Alert */}
            {showAlert && (
                <div
                    role="status"
                    className="absolute top-full right-0 mt-2 p-3 rounded-lg shadow-lg z-50 w-64 animate-slide-up"
                    aria-live="polite"
                    style={{
                        backgroundColor: 'var(--bg-secondary)',
                        border: '1px solid var(--border-color)'
                    }}
                >
                    <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning)' }} />
                        <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                Switched to {isMainnet ? 'Mainnet' : 'Testnet'}
                            </p>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                                Please also switch your wallet to {isMainnet ? 'Mainnet' : 'Testnet'} for transactions to work.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
