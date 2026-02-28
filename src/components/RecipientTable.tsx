import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, Send, Loader2, Coins, DollarSign } from 'lucide-react';
import { request } from '@stacks/connect';
import { Cl, Pc } from '@stacks/transactions';
import { useAuth } from '../hooks/useAuth';
import { validateRecipient } from '../utils/validation';
import { PasteModal } from './PasteModal';
import { BulkAmountModal } from './BulkAmountModal';
import type { AmountRange } from './BulkAmountModal';

const FT_MAX_RECIPIENTS = 10;

const schema = z.object({
    mode: z.enum(['stx', 'ft']),
    tokenContract: z.string().optional(),
    recipients: z.array(z.object({ to: z.string(), amount: z.string() })).min(1).max(50),
}).superRefine((value, context) => {
    if (value.mode === 'ft' && value.recipients.length > FT_MAX_RECIPIENTS) {
        context.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['recipients'],
            message: `FT mode supports up to ${FT_MAX_RECIPIENTS} recipients per transaction.`,
        });
    }
});

type FormData = z.infer<typeof schema>;

interface RecipientTableProps {
    contractAddress: string;
    maxRecipients: number;
}

export const RecipientTable: React.FC<RecipientTableProps> = ({ contractAddress, maxRecipients }) => {
    const { isAuthenticated, stxAddress, network } = useAuth();
    const [status, setStatus] = useState('');
    const [tokenDecimals, setTokenDecimals] = useState(8); // Default to 8 decimals (like sBTC)
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { control, handleSubmit, watch, setValue, register } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { mode: 'stx', recipients: [{ to: '', amount: '' }] },
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'recipients' });
    const mode = watch('mode');
    const recipients = watch('recipients');
    const modeMaxRecipients = mode === 'ft'
        ? Math.min(maxRecipients, FT_MAX_RECIPIENTS)
        : maxRecipients;
    const total = recipients.reduce((sum, r) => sum + Number(r.amount || 0), 0);

    const onPaste = (addresses: string[]) => {
        const remaining = modeMaxRecipients - fields.length;
        if (remaining <= 0) return;

        const newRecips = addresses.slice(0, remaining).map(addr => ({ to: addr, amount: '' }));
        setValue('recipients', [...recipients, ...newRecips]);
    };

    const onBulkAmount = (ranges: AmountRange[]) => {
        const updatedRecipients = [...recipients];

        ranges.forEach(range => {
            // Convert 1-based indices to 0-based array indices
            const startIdx = range.startIndex - 1;
            const endIdx = range.endIndex - 1;

            for (let i = startIdx; i <= endIdx && i < updatedRecipients.length; i++) {
                updatedRecipients[i] = {
                    ...updatedRecipients[i],
                    amount: range.amount
                };
            }
        });

        setValue('recipients', updatedRecipients);
    };

    const onSubmit = async (data: FormData) => {
        // Validate contract address is configured
        if (!contractAddress || contractAddress.trim() === '') {
            setStatus("Error: Contract not configured. Please set VITE_CONTRACT_ADDRESS in your .env file.");
            return;
        }

        if (!isAuthenticated || !stxAddress) {
            setStatus("Error: Wallet not connected");
            return;
        }

        if (data.recipients.length > modeMaxRecipients) {
            setStatus(`Error: ${mode === 'ft' ? `FT mode supports up to ${FT_MAX_RECIPIENTS}` : modeMaxRecipients} recipients.`);
            return;
        }

        // Validate all recipients have valid addresses and amounts
        const invalidRecipients = data.recipients.filter((r) => {
            const validation = validateRecipient(r.to, r.amount);
            return !validation.valid;
        });

        if (invalidRecipients.length > 0) {
            setStatus(`Error: ${invalidRecipients.length} recipient(s) have invalid addresses or amounts.`);
            return;
        }

        setIsSubmitting(true);
        setStatus('');

        try {
            const functionName = mode === 'stx' ? 'send-many-stx' : 'send-many-ft';

            let functionArgs: any[];

            if (mode === 'stx') {
                // Convert STX to microSTX (1 STX = 1,000,000 microSTX)
                const recipientTuples = data.recipients.map(r =>
                    Cl.tuple({
                        to: Cl.principal(r.to),
                        ustx: Cl.uint(Math.floor(Number(r.amount) * 1_000_000))
                    })
                );
                functionArgs = [Cl.list(recipientTuples)];
            } else {
                if (!data.tokenContract) {
                    setStatus("Error: Token contract required for FT mode");
                    setIsSubmitting(false);
                    return;
                }

                // For FT, convert decimal amount to base units (e.g., sBTC uses 8 decimals)
                // User enters 0.00001 sBTC, we convert to 1000 satoshis
                const recipientTuples = data.recipients.map(r => {
                    const decimalAmount = Number(r.amount);
                    const baseUnitAmount = Math.floor(decimalAmount * Math.pow(10, tokenDecimals));
                    return Cl.tuple({
                        to: Cl.principal(r.to),
                        amount: Cl.uint(baseUnitAmount)
                    });
                });

                functionArgs = [
                    Cl.principal(data.tokenContract),
                    Cl.list(recipientTuples)
                ];
            }

            const networkName = network.chainId === 2147483648 ? 'testnet' : 'mainnet';
            const formattedContract = contractAddress.includes('::')
                ? contractAddress.replace('::', '.')
                : contractAddress;

            // Calculate total amount for post-conditions (in microSTX)
            const totalAmountMicroStx = Math.floor(
                data.recipients.reduce((sum, r) => sum + Number(r.amount), 0) * 1_000_000
            );

            // Build post-conditions - allow the sender to send up to totalAmount STX
            const postConditions = mode === 'stx'
                ? [Pc.principal(stxAddress!).willSendLte(totalAmountMicroStx).ustx()]
                : [];

            const response = await request('stx_callContract', {
                contract: formattedContract as `${string}.${string}`,
                functionName: functionName,
                functionArgs: functionArgs,
                network: networkName,
                postConditions: postConditions,
            });

            if (response && 'txid' in response) {
                setStatus(`Success! Transaction ID: ${response.txid}`);
            } else {
                setStatus('Transaction submitted. Check your wallet for confirmation.');
            }
        } catch (err: any) {
            console.error('Transaction error:', err);
            if (err.code === 4001) {
                setStatus('Transaction was cancelled by user.');
            } else {
                setStatus(`Error: ${err.message || 'Unknown error occurred'}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            {/* Mode Selector */}
            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <label
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all flex-1 ${mode === 'stx' ? 'ring-2 ring-orange-500' : ''}`}
                    style={{
                        backgroundColor: mode === 'stx' ? 'var(--accent-orange-light)' : 'var(--bg-tertiary)',
                        color: mode === 'stx' ? 'var(--accent-orange)' : 'var(--text-secondary)'
                    }}
                >
                    <input
                        type="radio"
                        value="stx"
                        {...register('mode')}
                        className="hidden"
                    />
                    <DollarSign className="w-4 h-4" />
                    <span className="font-medium">STX</span>
                </label>
                <label
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all flex-1 ${mode === 'ft' ? 'ring-2 ring-orange-500' : ''}`}
                    style={{
                        backgroundColor: mode === 'ft' ? 'var(--accent-orange-light)' : 'var(--bg-tertiary)',
                        color: mode === 'ft' ? 'var(--accent-orange)' : 'var(--text-secondary)'
                    }}
                >
                    <input
                        type="radio"
                        value="ft"
                        {...register('mode')}
                        className="hidden"
                    />
                    <Coins className="w-4 h-4" />
                    <span className="font-medium">Fungible Token</span>
                </label>
            </div>

            {/* Token Contract Input */}
            {mode === 'ft' && (
                <div className="space-y-3 mb-6">
                    <input
                        {...register('tokenContract')}
                        placeholder="Token Contract (e.g., SP3DX3H4FEYZJZ586MFBS25ZW3HZDMEW92260R2PR.Wrapped-Bitcoin)"
                        className="input-field"
                    />
                    <div className="flex items-center gap-3">
                        <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                            Token Decimals:
                        </label>
                        <input
                            type="number"
                            value={tokenDecimals}
                            onChange={(e) => setTokenDecimals(Number(e.target.value))}
                            min="0"
                            max="18"
                            className="input-field w-24"
                        />
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            (sBTC uses 8 decimals)
                        </span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => append({ to: '', amount: '' })}
                    className="btn-secondary flex-1 sm:flex-initial justify-center"
                    disabled={fields.length >= modeMaxRecipients}
                >
                    <Plus className="w-4 h-4" />
                    <span>Add Recipient</span>
                </button>
                <PasteModal onPaste={onPaste} max={modeMaxRecipients} />
                <BulkAmountModal onApply={onBulkAmount} recipientCount={fields.length} />
            </div>

            {mode === 'ft' && (
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                    FT contract limit: up to {FT_MAX_RECIPIENTS} recipients per transaction.
                </p>
            )}

            {/* Recipients Table */}
            <div className="table-wrapper mb-6">
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{ borderColor: 'var(--border-color)' }}
                >
                    <table className="w-full">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                                <th
                                    className="text-left text-xs sm:text-sm font-medium px-2 sm:px-4 py-3"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Recipient Address
                                </th>
                                <th
                                    className="text-left text-xs sm:text-sm font-medium px-2 sm:px-4 py-3 w-24 sm:w-36"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Amount ({mode === 'stx' ? 'STX' : 'Tokens'})
                                </th>
                                <th className="w-12"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {fields.map((field, index) => (
                                <tr
                                    key={field.id}
                                    className="border-t transition-colors"
                                    style={{
                                        borderColor: 'var(--border-color)',
                                    }}
                                >
                                    <td className="px-2 sm:px-4 py-2">
                                        <input
                                            {...register(`recipients.${index}.to`)}
                                            placeholder="SP... or ST..."
                                            className="w-full py-2 bg-transparent outline-none font-mono text-xs sm:text-sm"
                                            style={{ color: 'var(--text-primary)' }}
                                            onBlur={(e) => validateRecipient(e.target.value, watch(`recipients.${index}.amount`))}
                                        />
                                    </td>
                                    <td className="px-2 sm:px-4 py-2">
                                        <input
                                            type="number"
                                            {...register(`recipients.${index}.amount`)}
                                            placeholder={mode === 'stx' ? '0.001' : '0.00001'}
                                            step="any"
                                            className="w-full py-2 bg-transparent outline-none text-xs sm:text-sm"
                                            style={{ color: 'var(--text-primary)' }}
                                            min="0"
                                        />
                                    </td>
                                    <td className="px-2 py-2">
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
                                            style={{ color: 'var(--error)' }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {fields.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={3}
                                        className="px-4 py-8 text-center text-sm"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        No recipients added yet. Click "Add Recipient" to start.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Summary */}
            <div
                className="flex items-center justify-between p-4 rounded-xl mb-6"
                style={{ backgroundColor: 'var(--bg-tertiary)' }}
            >
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {fields.length} / {modeMaxRecipients} recipients
                </span>
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Total: {total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 })} {mode === 'stx' ? 'STX' : 'tokens'}
                </span>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={fields.length === 0 || fields.length > modeMaxRecipients || isSubmitting}
                className="btn-primary w-full justify-center text-lg py-4"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Sending...</span>
                    </>
                ) : (
                    <>
                        <Send className="w-5 h-5" />
                        <span>Send Transaction</span>
                    </>
                )}
            </button>

            {/* Status Message */}
            {status && (
                <div
                    className="mt-4 p-4 rounded-xl text-sm"
                    style={{
                        backgroundColor: status.includes('Error') || status.includes('cancelled')
                            ? 'var(--error-light)'
                            : 'var(--success-light)',
                        color: status.includes('Error') || status.includes('cancelled')
                            ? 'var(--error)'
                            : 'var(--success)'
                    }}
                >
                    {status}
                </div>
            )}
        </form>
    );
};
