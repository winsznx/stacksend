import { cn } from '../../lib/cn';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ value, max = 100, className }) => {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div
      className={cn('h-2 w-full rounded-full overflow-hidden', className)}
      style={{ backgroundColor: 'var(--bg-tertiary)' }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${percent}%`, backgroundColor: 'var(--accent-orange)' }}
      />
    </div>
  );
};

export type {};
