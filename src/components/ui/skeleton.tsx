import { cn } from '../../lib/cn';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height = '1rem', rounded = false, className }) => (
  <div
    className={cn('animate-pulse', rounded ? 'rounded-full' : 'rounded', className)}
    style={{ width, height, backgroundColor: 'var(--bg-tertiary)' }}
    aria-hidden="true"
  />
);

export type {};
