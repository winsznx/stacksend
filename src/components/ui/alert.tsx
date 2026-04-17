import { cn } from '../../lib/cn';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'success' | 'warning' | 'error';
  className?: string;
}

const CONFIG = {
  info: { Icon: Info, bg: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  success: { Icon: CheckCircle, bg: 'var(--success-light)', color: 'var(--success)' },
  warning: { Icon: AlertTriangle, bg: 'var(--warning-light)', color: 'var(--warning)' },
  error: { Icon: XCircle, bg: 'var(--error-light)', color: 'var(--error)' },
} as const;

export const Alert: React.FC<AlertProps> = ({ children, variant = 'info', className }) => {
  const { Icon, bg, color } = CONFIG[variant];
  return (
    <div
      className={cn('flex items-start gap-3 p-4 rounded-lg text-sm', className)}
      role="alert"
      style={{ backgroundColor: bg, color }}
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
};

export type {};
