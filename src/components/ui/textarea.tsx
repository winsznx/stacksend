import React from 'react';
import { cn } from '../../lib/cn';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  className, id, label, rows = 4, style, ...props
}, ref) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {label && <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
    <textarea
      ref={ref}
      id={id}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', ...style }}
      {...props}
    />
  </div>
));
Textarea.displayName = 'Textarea';

export type {};
