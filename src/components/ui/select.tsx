import { cn } from '../../lib/cn';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  label?: string;
  className?: string;
  id?: string;
}

export const Select: React.FC<SelectProps> = ({ options, value, onChange, label, className, id }) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {label && <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="appearance-none w-full cursor-pointer pl-3 pr-8 py-2 text-sm rounded-lg"
        style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
      >
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <ChevronDown aria-hidden className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
    </div>
  </div>
);

export type {};
