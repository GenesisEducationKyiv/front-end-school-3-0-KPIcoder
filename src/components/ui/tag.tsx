import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Text content of the tag */
  children: React.ReactNode;
  /** Callback when remove button is clicked (if not provided, no remove button will be shown) */
  onRemove?: () => void;
  /** Custom class for remove button */
  removeButtonClassName?: string;
  /** Aria label for the remove button (for accessibility) */
  removeAriaLabel?: string;
  /** Makes the tag appear in a disabled/readonly state (if true, remove button won't be shown) */
  disabled?: boolean;
  /** Optional variant for styling the tag differently */
  variant?: 'default' | 'primary' | 'destructive';
}

/**
 * A reusable Tag component for displaying tags/badges with an optional remove button
 */
export function Tag({
  children,
  className,
  onRemove,
  removeButtonClassName,
  removeAriaLabel = 'Remove',
  disabled = false,
  variant = 'default',
  ...props
}: TagProps) {
  // Base and variant-specific styles
  const variantStyles = {
    default: 'bg-secondary text-secondary-foreground',
    primary: 'bg-primary text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
  };

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1',
        variantStyles[variant],
        disabled && 'opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {onRemove && !disabled && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={cn('hover:opacity-100 focus:outline-none opacity-70 transition-opacity', removeButtonClassName)}
          aria-label={`${removeAriaLabel} ${typeof children === 'string' ? children : ''}`}
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  );
}
