import { cn } from '../../lib/cn';
import { CopyButton } from './copy-button';

interface TruncatedAddressProps {
  address: string;
  startChars?: number;
  endChars?: number;
  copyable?: boolean;
  className?: string;
}

export const TruncatedAddress: React.FC<TruncatedAddressProps> = ({
  address, startChars = 6, endChars = 4, copyable = true, className,
}) => {
  const display = address.length > startChars + endChars
    ? `${address.slice(0, startChars)}...${address.slice(-endChars)}`
    : address;

  return (
    <span className={cn('inline-flex items-center gap-1 font-mono text-sm', className)} style={{ color: 'var(--text-secondary)' }}>
      <span title={address}>{display}</span>
      {copyable && <CopyButton text={address} />}
    </span>
  );
};

export type {};
