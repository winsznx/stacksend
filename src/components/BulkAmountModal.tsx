import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { Calculator, X, Plus, Trash2 } from 'lucide-react';

interface BulkAmountModalProps {
    onApply: (ranges: AmountRange[]) => void;
    recipientCount: number;
}

export interface AmountRange {
    startIndex: number;
    endIndex: number;
    amount: string;
}

type InputMode = 'fill-all' | 'ranges';

export const BulkAmountModal: React.FC<BulkAmountModalProps> = ({ onApply, recipientCount }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<InputMode>('fill-all');
    const [fillAllAmount, setFillAllAmount] = useState('');
    const defaultEndIndex = Math.max(1, Math.min(10, recipientCount));
    const [ranges, setRanges] = useState<AmountRange[]>([
        { startIndex: 1, endIndex: defaultEndIndex, amount: '' }
    ]);
    const [errors, setErrors] = useState<string[]>([]);

    const addRange = () => {
        const lastRange = ranges[ranges.length - 1];
        const newStart = lastRange ? lastRange.endIndex + 1 : 1;
        if (newStart > recipientCount) {
            return;
        }

        setRanges([
            ...ranges,
            {
                startIndex: newStart,
                endIndex: Math.min(newStart + 9, recipientCount),
                amount: '',
            },
        ]);
    };

    const removeRange = (index: number) => {
        if (ranges.length > 1) {
            setRanges(ranges.filter((_, i) => i !== index));
        }
    };

    const updateRange = (index: number, field: keyof AmountRange, value: string | number) => {
        const newRanges = [...ranges];
        newRanges[index] = { ...newRanges[index], [field]: value };
        setRanges(newRanges);
    };

    const validateRanges = (): boolean => {
        const newErrors: string[] = [];

        if (mode === 'fill-all') {
            if (!fillAllAmount || Number(fillAllAmount) <= 0) {
                newErrors.push('Please enter a valid amount');
            }
        } else {
            ranges.forEach((range, index) => {
                if (range.startIndex < 1 || range.startIndex > recipientCount) {
                    newErrors.push(`Range ${index + 1}: Start index must be between 1 and ${recipientCount}`);
                }
                if (range.endIndex < 1 || range.endIndex > recipientCount) {
                    newErrors.push(`Range ${index + 1}: End index must be between 1 and ${recipientCount}`);
                }
                if (range.startIndex > range.endIndex) {
                    newErrors.push(`Range ${index + 1}: Start index must be less than or equal to end index`);
                }
                if (!range.amount || Number(range.amount) <= 0) {
                    newErrors.push(`Range ${index + 1}: Please enter a valid amount`);
                }
            });

            // Check for overlapping ranges
            for (let i = 0; i < ranges.length; i++) {
                for (let j = i + 1; j < ranges.length; j++) {
                    const r1 = ranges[i];
                    const r2 = ranges[j];
                    if (
                        (r1.startIndex <= r2.endIndex && r1.endIndex >= r2.startIndex) ||
                        (r2.startIndex <= r1.endIndex && r2.endIndex >= r1.startIndex)
                    ) {
                        newErrors.push(`Ranges ${i + 1} and ${j + 1} overlap`);
                    }
                }
            }
        }

        setErrors(newErrors);
        return newErrors.length === 0;
    };

    const handleApply = () => {
        if (!validateRanges()) return;

        let appliedRanges: AmountRange[];
        if (mode === 'fill-all') {
            appliedRanges = [{ startIndex: 1, endIndex: recipientCount, amount: fillAllAmount }];
        } else {
            appliedRanges = ranges;
        }

        onApply(appliedRanges);
        setIsOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setMode('fill-all');
        setFillAllAmount('');
        setRanges([{ startIndex: 1, endIndex: defaultEndIndex, amount: '' }]);
        setErrors([]);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={"btn-secondary flex-1 sm:flex-initial justify-center"}
                disabled={recipientCount === 0}
            >
                <Calculator className={"w-4 h-4"} />
                <span>Bulk Amount</span>
            </button>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={handleClose} className={"relative z-50"}>
                    {/* Backdrop */}
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-200"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-150"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className={"fixed inset-0 bg-black/50 backdrop-blur-sm"} />
                    </Transition.Child>

                    {/* Modal */}
                    <div className={"fixed inset-0 flex items-center justify-center p-4"}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-200"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel
                                className={"w-full max-w-2xl rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto"}
                                style={{ backgroundColor: 'var(--bg-secondary)' }}
                            >
                                <div className={"flex items-center justify-between mb-4"}>
                                    <Dialog.Title
                                        className={"text-lg font-semibold"}
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        Bulk Amount Assignment
                                    </Dialog.Title>
                                    <button type="button"
                                        onClick={handleClose}
                                        aria-label="Close bulk amount dialog"
                                        className={"p-2 rounded-lg transition-colors"}
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <X className={"w-5 h-5"} />
                                    </button>
                                </div>

                                <p
                                    className={"text-sm mb-4"}
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Assign amounts to multiple recipients at once. You have {recipientCount} recipient{recipientCount !== 1 ? 's' : ''}.
                                </p>

                                {/* Mode Selector */}
                                <div className={"flex flex-col sm:flex-row gap-2 mb-6"}>
                                    <label
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all flex-1 ${mode === 'fill-all' ? 'ring-2 ring-orange-500' : ''}`}
                                        style={{
                                            backgroundColor: mode === 'fill-all' ? 'var(--accent-orange-light)' : 'var(--bg-tertiary)',
                                            color: mode === 'fill-all' ? 'var(--accent-orange)' : 'var(--text-secondary)'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="bulk-amount-mode"
                                            value="fill-all"
                                            checked={mode === 'fill-all'}
                                            onChange={(e) => setMode(e.target.value as InputMode)}
                                            className={"hidden"}
                                        />
                                        <span className={"font-medium text-sm sm:text-base"}>Fill All</span>
                                    </label>
                                    <label
                                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg cursor-pointer transition-all flex-1 ${mode === 'ranges' ? 'ring-2 ring-orange-500' : ''}`}
                                        style={{
                                            backgroundColor: mode === 'ranges' ? 'var(--accent-orange-light)' : 'var(--bg-tertiary)',
                                            color: mode === 'ranges' ? 'var(--accent-orange)' : 'var(--text-secondary)'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="bulk-amount-mode"
                                            value="ranges"
                                            checked={mode === 'ranges'}
                                            onChange={(e) => setMode(e.target.value as InputMode)}
                                            className={"hidden"}
                                        />
                                        <span className={"font-medium text-sm sm:text-base"}>Range-Based</span>
                                    </label>
                                </div>

                                {/* Fill All Mode */}
                                {mode === 'fill-all' && (
                                    <div className={"mb-6"}>
                                        <label
                                            className={"block text-sm font-medium mb-2"}
                                            style={{ color: 'var(--text-secondary)' }}
                                        >
                                            Amount for all recipients
                                        </label>
                                        <input
                                            type="number"
                                            value={fillAllAmount}
                                            onChange={(e) => setFillAllAmount(e.target.value)}
                                            inputMode="decimal"
                                            aria-label="Amount for all recipients"
                                            placeholder="0.001"
                                            step="any"
                                            min="0"
                                            className={"input-field"}
                                        />
                                    </div>
                                )}

                                {/* Range-Based Mode */}
                                {mode === 'ranges' && (
                                    <div className={"mb-6"}>
                                        <div className={"flex items-center justify-between mb-3"}>
                                            <label
                                                className={"text-sm font-medium"}
                                                style={{ color: 'var(--text-secondary)' }}
                                            >
                                                Amount Ranges
                                            </label>
                                            <button
                                                type="button"
                                                onClick={addRange}
                                                className={"btn-ghost text-xs sm:text-sm"}
                                            >
                                                <Plus className={"w-4 h-4"} />
                                                <span>Add Range</span>
                                            </button>
                                        </div>

                                        <div className={"space-y-3"}>
                                            {ranges.map((range, index) => (
                                                <div
                                                    key={index}
                                                    className={"flex flex-col sm:flex-row gap-2 p-3 rounded-lg"}
                                                    style={{ backgroundColor: 'var(--bg-tertiary)' }}
                                                >
                                                    <div className={"flex-1 grid grid-cols-2 gap-2"}>
                                                        <div>
                                                            <label
                                                                className={"block text-xs mb-1"}
                                                                style={{ color: 'var(--text-muted)' }}
                                                            >
                                                                From
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={range.startIndex}
                                                                onChange={(e) => updateRange(index, 'startIndex', Number(e.target.value))}
                                                                inputMode="numeric"
                                                                aria-label={`Range ${index + 1} start recipient index`}
                                                                min="1"
                                                                max={recipientCount}
                                                                className={"input-field text-sm"}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label
                                                                className={"block text-xs mb-1"}
                                                                style={{ color: 'var(--text-muted)' }}
                                                            >
                                                                To
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={range.endIndex}
                                                                onChange={(e) => updateRange(index, 'endIndex', Number(e.target.value))}
                                                                inputMode="numeric"
                                                                aria-label={`Range ${index + 1} end recipient index`}
                                                                min="1"
                                                                max={recipientCount}
                                                                className={"input-field text-sm"}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className={"flex-1"}>
                                                        <label
                                                            className={"block text-xs mb-1"}
                                                            style={{ color: 'var(--text-muted)' }}
                                                        >
                                                            Amount
                                                        </label>
                                                        <input
                                                            type="number"
                                                            value={range.amount}
                                                            onChange={(e) => updateRange(index, 'amount', e.target.value)}
                                                            inputMode="decimal"
                                                            aria-label={`Range ${index + 1} amount`}
                                                            placeholder="0.001"
                                                            step="any"
                                                            min="0"
                                                            className={"input-field text-sm"}
                                                        />
                                                    </div>
                                                    <div className={"flex items-end"}>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeRange(index)}
                                                            disabled={ranges.length === 1}
                                                            aria-label={`Remove range ${index + 1}`}
                                                            className={"p-2 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 disabled:cursor-not-allowed"}
                                                            style={{ color: 'var(--error)' }}
                                                        >
                                                            <Trash2 className={"w-4 h-4"} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Errors */}
                                {errors.length > 0 && (
                                    <div
                                        role="alert"
                                        className={"mb-4 p-3 rounded-lg text-sm"}
                                        style={{
                                            backgroundColor: 'var(--error-light)',
                                            color: 'var(--error)'
                                        }}
                                    >
                                        <ul className={"list-disc list-inside space-y-1"}>
                                            {errors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className={"flex flex-col-reverse sm:flex-row gap-3 justify-end"}>
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className={"btn-ghost justify-center"}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleApply}
                                        className={"btn-primary justify-center"}
                                    >
                                        Apply Amounts
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};


export type {};
