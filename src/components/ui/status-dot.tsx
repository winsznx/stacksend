import { cn } from '../../lib/cn';

interface StatusDotProps {
  status: 'online' | 'offline' | 'pending';
  className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  online: 'var(--success)',
  offline: 'var(--text-muted)',
  pending: 'var(--warning)',
};

export const StatusDot: React.FC<StatusDotProps> = ({ status, className }) => (
  <span
    className={cn('inline-block w-2 h-2 rounded-full', status === 'online' && 'animate-pulse', className)}
    style={{ backgroundColor: STATUS_COLORS[status] }}
    aria-label={status}
  />
);

export type {};
