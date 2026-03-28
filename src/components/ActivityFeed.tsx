import { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, ExternalLink, Loader2 } from 'lucide-react';
import { backendAPI, type ActivityEvent } from '../lib/backend-api';

interface ActivityFeedProps {
    walletAddress: string | null;
}

export function ActivityFeed({ walletAddress }: ActivityFeedProps) {
    const [activity, setActivity] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadActivity = useCallback(async () => {
        if (!walletAddress) return;

        setLoading(true);
        setError(null);
        setActivity([]);

        try {
            const events = await backendAPI.getUserActivity(walletAddress, 50);
            setActivity(events);
        } catch (err: unknown) {
            setError((err as Error)?.message || 'Unable to load transfer activity right now.');
        } finally {
            setLoading(false);
        }
    }, [walletAddress]);

    useEffect(() => {
        if (walletAddress) {
            loadActivity();
            return;
        }

        setActivity([]);
        setError(null);
    }, [walletAddress, loadActivity]);

    const formatAmount = (event: ActivityEvent) => {
        if (event.amount_decimals) {
            const amount = typeof event.amount_decimals === 'number'
                ? event.amount_decimals
                : parseFloat(event.amount_decimals);
            return amount.toFixed(6);
        }
        return event.amount?.toString() || '0';
    };

    const getTokenSymbol = (event: ActivityEvent) => {
        if (event.transfer_type === 'STX') {
            return 'STX';
        }

        if (event.token_contract?.includes('Wrapped-Bitcoin')) {
            return 'sBTC';
        }

        return event.token_contract?.split('.').pop() || 'FT';
    };

    const getExplorerUrl = (txId: string, network: string) => {
        const baseUrl = 'https://explorer.hiro.so/txid';
        return network === 'mainnet'
            ? `${baseUrl}/${txId}`
            : `${baseUrl}/${txId}?chain=testnet`;
    };

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const getCounterpartyAddress = (event: ActivityEvent) => {
        if (event.event_type === 'received') {
            return typeof event.metadata?.from === 'string' ? event.metadata.from : event.sender_address;
        }
        return event.sender_address;
    };

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString();
    };

    if (!walletAddress) {
        return (
            <div className={"card p-8 text-center"}>
                <p style={{ color: 'var(--text-secondary)' }}>Connect your wallet to view transfer history</p>
            </div>
        );
    }

    return (
        <div className={"card shadow-xl overflow-hidden"}>
            {/* Header */}
            <div className={"p-6"} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className={"flex items-center justify-between"}>
                    <div>
                        <h3 className={"text-xl font-bold"} style={{ color: 'var(--text-primary)' }}>Transfer Activity</h3>
                        <p className={"text-sm"} style={{ color: 'var(--text-secondary)' }}>Your recent StackSend transactions</p>
                    </div>
                    <button
                        onClick={loadActivity}
                        disabled={loading}
                        aria-busy={loading}
                        className={"btn-ghost p-2"}
                        aria-label="Refresh transfer activity"
                        title="Refresh transfer activity"
                    >
                        <Loader2 aria-hidden="true" className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} style={{ color: loading ? 'var(--accent-orange)' : 'currentColor' }} />
                    </button>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div
                    role="alert"
                    className={"p-4 m-4 rounded-lg text-sm"}
                    style={{ backgroundColor: 'var(--error-light)', border: '1px solid var(--error)', color: 'var(--error)' }}
                >
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading && activity.length === 0 && (
                <div className={"p-12 text-center"} role="status" aria-live="polite">
                    <Loader2 aria-hidden="true" className={"w-8 h-8 animate-spin mx-auto mb-3"} style={{ color: 'var(--accent-orange)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Loading activity...</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && activity.length === 0 && !error && (
                <div className={"p-12 text-center"}>
                    <div className={"w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"} style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                        <ArrowUpRight aria-hidden="true" className={"w-8 h-8"} style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p className={"mb-2"} style={{ color: 'var(--text-secondary)' }}>No transfer activity yet</p>
                    <p className={"text-sm"} style={{ color: 'var(--text-muted)' }}>Your received and sent transfers will appear here</p>
                </div>
            )}

            {/* Activity List */}
            {activity.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border-color)' }}>
                    {activity.map((event) => (
                        <div
                            key={event.id}
                            className={"p-4 transition-colors"}
                            style={{ borderBottom: '1px solid var(--border-color)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <div className={"flex items-start gap-4"}>
                                {/* Icon */}
                                <div className={"p-2 rounded-lg"} style={{
                                    backgroundColor: event.event_type === 'received' ? 'var(--success-light)' : 'var(--accent-orange-light)',
                                    color: event.event_type === 'received' ? 'var(--success)' : 'var(--accent-orange)'
                                }}>
                                    {event.event_type === 'received' ? (
                                        <ArrowDownRight aria-hidden="true" className={"w-5 h-5"} />
                                    ) : (
                                        <ArrowUpRight aria-hidden="true" className={"w-5 h-5"} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={"flex-1 min-w-0"}>
                                    <div className={"flex items-start justify-between mb-2"}>
                                        <div>
                                            <p className={"font-semibold mb-1"} style={{ color: 'var(--text-primary)' }}>
                                                {event.event_type === 'received' ? 'Received' : 'Sent'}{' '}
                                                <span style={{ color: 'var(--accent-orange)' }}>
                                                    {formatAmount(event)} {getTokenSymbol(event)}
                                                </span>
                                            </p>
                                            <p className={"text-sm"} style={{ color: 'var(--text-secondary)' }}>
                                                {event.event_type === 'received' ? 'From' : 'To'}{' '}
                                                <code className={"px-1.5 py-0.5 rounded text-xs"} style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                                                    {(() => {
                                                            const count = typeof event.metadata?.recipient_count === 'number' ? event.metadata.recipient_count : null;
                                                            return event.event_type === 'sent' && count
                                                                ? `${count} recipient${count > 1 ? 's' : ''}`
                                                                : formatAddress(getCounterpartyAddress(event));
                                                        })()}
                                                </code>
                                            </p>
                                            {event.event_type === 'sent' && typeof event.metadata?.recipient_count === 'number' && (
                                                <p className={"text-xs mt-1"} style={{ color: 'var(--text-muted)' }}>
                                                    {event.metadata.recipient_count} recipient{event.metadata.recipient_count > 1 ? 's' : ''}
                                                </p>
                                            )}
                                        </div>
                                        <div className={"text-right"}>
                                            <p className={"text-xs mb-1"} style={{ color: 'var(--text-muted)' }}>
                                                {formatDate(event.created_at)}
                                            </p>
                                            <span className={"text-xs px-2 py-1 rounded"} style={{
                                                backgroundColor: event.network === 'mainnet' ? 'rgba(168, 85, 247, 0.1)' : 'var(--warning-light)',
                                                color: event.network === 'mainnet' ? '#a855f7' : 'var(--warning)'
                                            }}>
                                                {event.network}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Transaction Link */}
                                    <a
                                        href={getExplorerUrl(event.tx_id, event.network)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={"inline-flex items-center gap-1 text-xs transition-opacity"}
                                        aria-label={`View transaction ${event.tx_id} in the explorer`}
                                        title="View transaction in the explorer"
                                        style={{ color: 'var(--accent-orange)' }}
                                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                                    >
                                        View transaction
                                        <ExternalLink aria-hidden="true" className={"w-3 h-3"} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Show More */}
            {activity.length >= 50 && (
                <div className={"p-4 text-center"} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <p className={"text-sm"} style={{ color: 'var(--text-secondary)' }}>Showing most recent 50 transfers</p>
                </div>
            )}
        </div>
    );
}


export type {};
