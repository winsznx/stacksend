import { cn } from '../../lib/cn';

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const Separator: React.FC<SeparatorProps> = ({ orientation = 'horizontal', className }) => (
  <div
    role="separator"
    className={cn(orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full', className)}
    style={{ backgroundColor: 'var(--border-color)' }}
  />
);

export type {};
