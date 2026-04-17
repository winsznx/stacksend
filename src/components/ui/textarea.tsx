import { cn } from '../../lib/cn';

interface TextareaProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  placeholder?: string;
  label?: string;
  rows?: number;
  className?: string;
  id?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  value, onChange, placeholder, label, rows = 4, className, id,
}) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {label && <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-y"
      style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
    />
  </div>
);

export type {};
