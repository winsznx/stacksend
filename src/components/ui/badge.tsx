import { cn } from '../../lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  default: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' },
  success: { backgroundColor: 'var(--success-light)', color: 'var(--success)' },
  warning: { backgroundColor: 'var(--warning-light)', color: 'var(--warning)' },
  error: { backgroundColor: 'var(--error-light)', color: 'var(--error)' },
};

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => (
  <span
    className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className)}
    style={VARIANT_STYLES[variant]}
  >
    {children}
  </span>
);

export type {};
