import React from 'react';
import { cn } from '../../lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  className, id, label, error, style, ...props
}, ref) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {label && <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
    <input
      ref={ref}
      id={id}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: error ? '1px solid var(--error)' : '1px solid var(--border-color)',
        ...style
      }}
      {...props}
    />
    {error && <span className="text-xs" style={{ color: 'var(--error)' }}>{error}</span>}
  </div>
));
Input.displayName = 'Input';

export type {};
