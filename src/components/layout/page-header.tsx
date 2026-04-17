import { cn } from '../../lib/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, className }) => (
  <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6', className)}>
    <div>
      <h1 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{title}</h1>
      {description && <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{description}</p>}
    </div>
    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);

export type {};
