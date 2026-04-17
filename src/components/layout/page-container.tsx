import { cn } from '../../lib/cn';

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MAX_WIDTHS = { sm: 'max-w-2xl', md: 'max-w-4xl', lg: 'max-w-6xl', xl: 'max-w-7xl' } as const;

export const PageContainer: React.FC<PageContainerProps> = ({ children, maxWidth = 'lg', className }) => (
  <div className={cn(MAX_WIDTHS[maxWidth], 'mx-auto px-4 sm:px-6 lg:px-8', className)}>
    {children}
  </div>
);

export type {};
