import { cn } from '../../lib/cn';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, title, className }) => (
  <section className={cn('mb-8', className)}>
    {title && <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{title}</h2>}
    {children}
  </section>
);

export type {};
