import React from 'react';
import { cn } from '../../lib/cn';

interface Tab {
  key: string;
  label: string;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  children: React.ReactNode;
  className?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({ tabs, activeKey, onChange, children, className, ...props }, ref) => (
  <div ref={ref} className={className} {...props}>
    <div className="flex gap-1 border-b" style={{ borderColor: 'var(--border-color)' }} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          role="tab"
          aria-selected={tab.key === activeKey}
          onClick={() => onChange(tab.key)}
          className={cn(
            'px-4 py-2 text-sm font-medium transition-colors -mb-px border-b-2',
            tab.key === activeKey ? 'border-current' : 'border-transparent',
          )}
          style={{ color: tab.key === activeKey ? 'var(--accent-orange)' : 'var(--text-muted)' }}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div role="tabpanel" className="pt-4">{children}</div>
  </div>
);
Tabs.displayName = 'Tabs';

export type {};
