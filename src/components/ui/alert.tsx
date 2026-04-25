import React from 'react';
import { cn } from '../../lib/cn';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success';
}

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&>h5]:mb-1 [&>h5]:leading-none [&>h5]:tracking-tight [&>p]:text-sm [&>p]:leading-relaxed',
          variant === 'destructive' && 'border-red-500/50 text-red-600 dark:border-red-500 [&>svg]:text-red-600',
          variant === 'success' && 'border-green-500/50 text-green-600 dark:border-green-500 [&>svg]:text-green-600',
          variant === 'default' && 'bg-background text-foreground',
          className
        )}
        {...props}
      />
    );
  }
);
Alert.displayName = 'Alert';

export type {};
