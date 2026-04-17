import { useState } from 'react';
import { cn } from '../../lib/cn';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children, className }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div
          className={cn('absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs whitespace-nowrap z-50', className)}
          style={{ backgroundColor: 'var(--bg-hover)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-md)' }}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
};

export type {};
