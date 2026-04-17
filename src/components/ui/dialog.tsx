import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ open, onClose, title, children, className }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        className={cn('relative z-10 w-full max-w-md rounded-xl p-6 shadow-xl', className)}
        style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{title}</h2>
            <button type="button" onClick={onClose} className="p-1 rounded-lg transition-opacity hover:opacity-70" aria-label="Close dialog">
              <X className="w-5 h-5" style={{ color: 'var(--text-muted)' }} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export type {};
