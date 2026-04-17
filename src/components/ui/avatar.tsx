import { cn } from '../../lib/cn';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' } as const;

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'md', className }) => {
  const initials = name.slice(0, 2).toUpperCase();
  return (
    <div
      className={cn('rounded-full flex items-center justify-center font-semibold', SIZES[size], className)}
      style={{ backgroundColor: 'var(--accent-orange-light)', color: 'var(--accent-orange)' }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export type {};
