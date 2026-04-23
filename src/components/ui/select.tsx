import React from 'react';
import { cn } from '../../lib/cn';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, label, className, id, style, ...props }, ref) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {label && <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
    <div className="relative">
      <select
        ref={ref}
        id={id}
        className="appearance-none w-full cursor-pointer pl-3 pr-8 py-2 text-sm rounded-lg"
        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', ...style }}
        {...props}
      >
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDown aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
    </div>
  </div>
));
Select.displayName = 'Select';

export type {};
