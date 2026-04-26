import React from 'react';
import { cn } from '../../lib/cn';

export interface StatusDotProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export const StatusDot = React.forwardRef<HTMLDivElement, StatusDotProps>(
  ({ className, status = 'online', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'h-2.5 w-2.5 rounded-full',
          status === 'online' && 'bg-green-500',
          status === 'offline' && 'bg-gray-500',
          status === 'away' && 'bg-yellow-500',
          status === 'busy' && 'bg-red-500',
          className
        )}
        {...props}
      />
    );
  }
);
StatusDot.displayName = 'StatusDot';

export type {};
