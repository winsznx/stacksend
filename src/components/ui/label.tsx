import { cn } from '../../lib/cn';

interface LabelProps {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
  className?: string;
}

export const Label: React.FC<LabelProps> = ({ children, htmlFor, required, className }) => (
  <label htmlFor={htmlFor} className={cn('text-sm font-medium', className)} style={{ color: 'var(--text-secondary)' }}>
    {children}
    {required && <span style={{ color: 'var(--error)' }} aria-hidden="true"> *</span>}
  </label>
);

export type {};
