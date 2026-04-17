import { cn } from '../../lib/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, padding = true }) => (
  <div
    className={cn('rounded-xl transition-shadow', padding && 'p-4 sm:p-6', className)}
    style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}
  >
    {children}
  </div>
);

export type {};
