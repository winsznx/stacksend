import { cn } from '../../lib/cn';

interface InputProps {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  type?: string;
  className?: string;
  id?: string;
}

export const Input: React.FC<InputProps> = ({
  value, onChange, placeholder, label, error, disabled, type = 'text', className, id,
}) => (
  <div className={cn('flex flex-col gap-1', className)}>
    {label && <label htmlFor={id} className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</label>}
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors"
      style={{
        backgroundColor: 'var(--bg-tertiary)',
        color: 'var(--text-primary)',
        border: error ? '1px solid var(--error)' : '1px solid var(--border-color)',
      }}
    />
    {error && <span className="text-xs" style={{ color: 'var(--error)' }}>{error}</span>}
  </div>
);

export type {};
