import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ToastProps {
  message: string;
  variant?: 'info' | 'success' | 'error';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  className?: string;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  info: { backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' },
  success: { backgroundColor: 'var(--success-light)', borderColor: 'var(--success)' },
  error: { backgroundColor: 'var(--error-light)', borderColor: 'var(--error)' },
};

export const Toast: React.FC<ToastProps> = ({ message, variant = 'info', visible, onDismiss, duration = 4000, className }) => {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, onDismiss, duration]);

  if (!visible) return null;

  return (
    <div
      className={cn('fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm', className)}
      style={VARIANT_STYLES[variant]}
      role="status"
      aria-live="polite"
    >
      <span style={{ color: 'var(--text-primary)' }}>{message}</span>
      <button type="button" onClick={onDismiss} className="hover:opacity-70 transition-opacity" aria-label="Dismiss">
        <X className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
      </button>
    </div>
  );
};

export type {};
