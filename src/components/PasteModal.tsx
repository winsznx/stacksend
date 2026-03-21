import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { parseAddresses } from '../utils/validation';
import { Clipboard, X } from 'lucide-react';

interface PasteModalProps {
    onPaste: (addrs: string[]) => void;
    max: number;
}

export const PasteModal: React.FC<PasteModalProps> = ({ onPaste, max }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');

    const handlePaste = () => {
        const addrs = parseAddresses(input).slice(0, max);
        onPaste(addrs);
        setIsOpen(false);
        setInput('');
    };

    const addressCount = input ? parseAddresses(input).length : 0;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="btn-secondary flex-1 sm:flex-initial justify-center"
            >
                <Clipboard className="w-4 h-4" />
                <span>Paste Addresses</span>
            </button>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
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
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                    </Transition.Child>

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center p-4">
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
                                className="w-full max-w-lg rounded-2xl p-4 sm:p-6 shadow-2xl"
                                style={{ backgroundColor: 'var(--bg-secondary)' }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <Dialog.Title
                                        className="text-lg font-semibold"
                                        style={{ color: 'var(--text-primary)' }}
                                    >
                                        Paste Addresses
                                    </Dialog.Title>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close paste addresses dialog"
                                        className="p-2 rounded-lg transition-colors"
                                        style={{ color: 'var(--text-muted)' }}
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <p
                                    className="text-sm mb-4"
                                    style={{ color: 'var(--text-secondary)' }}
                                >
                                    Paste multiple addresses, one per line or comma-separated.
                                </p>

                                <textarea
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    aria-label="Paste recipient addresses"
                                    placeholder="SP1234...&#10;SP5678...&#10;or SP1234..., SP5678..."
                                    className="input-field h-40 resize-none font-mono text-sm mb-4"
                                />

                                <div
                                    className="flex items-center justify-between text-sm mb-4"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    <span>
                                        {addressCount} address{addressCount !== 1 ? 'es' : ''} detected
                                    </span>
                                    <span>
                                        Max: {max}
                                    </span>
                                </div>

                                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="btn-ghost justify-center"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handlePaste}
                                        className="btn-primary justify-center"
                                        disabled={addressCount === 0}
                                    >
                                        Add {Math.min(addressCount, max)} Address{addressCount !== 1 ? 'es' : ''}
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
