import { cn } from '../../lib/cn';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center py-12 px-4 text-center', className)}>
    {icon && <div className="mb-4" style={{ color: 'var(--text-muted)' }}>{icon}</div>}
    <h3 className="text-base font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{title}</h3>
    {description && <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    {action}
  </div>
);

export type {};
