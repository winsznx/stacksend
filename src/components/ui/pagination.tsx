import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onPageChange, className }) => (
  <nav className={cn('flex items-center gap-2', className)} aria-label="Pagination">
    <button
      type="button"
      onClick={() => onPageChange(page - 1)}
      disabled={page <= 1}
      className="p-2 rounded-lg transition-opacity disabled:opacity-30"
      style={{ color: 'var(--text-primary)' }}
      aria-label="Previous page"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    <span className="text-sm tabular-nums" style={{ color: 'var(--text-secondary)' }}>
      {page} / {totalPages}
    </span>
    <button
      type="button"
      onClick={() => onPageChange(page + 1)}
      disabled={page >= totalPages}
      className="p-2 rounded-lg transition-opacity disabled:opacity-30"
      style={{ color: 'var(--text-primary)' }}
      aria-label="Next page"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </nav>
);

export type {};
