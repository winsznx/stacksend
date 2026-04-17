import { cn } from '../../lib/cn';
import { Spinner } from './spinner';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const SIZE_CLASSES = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' } as const;

const VARIANT_STYLES: Record<string, React.CSSProperties> = {
  primary: { backgroundColor: 'var(--accent-orange)', color: '#ffffff' },
  secondary: { backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' },
  ghost: { backgroundColor: 'transparent', color: 'var(--text-primary)' },
  destructive: { backgroundColor: 'var(--error)', color: '#ffffff' },
};

export const Button: React.FC<ButtonProps> = ({
  children, variant = 'primary', size = 'md', loading = false, disabled = false, onClick, type = 'button', className,
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled || loading}
    className={cn(
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-opacity',
      SIZE_CLASSES[size],
      (disabled || loading) && 'opacity-50 cursor-not-allowed',
      className,
    )}
    style={VARIANT_STYLES[variant]}
  >
    {loading && <Spinner size="sm" />}
    {children}
  </button>
);

export type {};
