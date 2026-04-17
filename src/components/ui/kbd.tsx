import { cn } from '../../lib/cn';

interface KbdProps {
  children: React.ReactNode;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({ children, className }) => (
  <kbd
    className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-xs font-mono', className)}
    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)', boxShadow: '0 1px 0 var(--border-color)' }}
  >
    {children}
  </kbd>
);

export type {};
