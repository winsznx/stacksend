import React from 'react';
import { cn } from '../../lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, padding = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('rounded-xl transition-shadow', padding && 'p-4 sm:p-6', className)}
      style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export type {};
