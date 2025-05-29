import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const spinnerVariants = cva(
  "animate-spin rounded-full border-current border-t-transparent",
  {
    variants: {
      size: {
        xs: "h-4 w-4 border-2",
        sm: "h-6 w-6 border-2",
        md: "h-8 w-8 border-4",
        lg: "h-12 w-12 border-4",
        xl: "h-16 w-16 border-4",
      },
      variant: {
        primary: "text-primary",
        secondary: "text-secondary",
        muted: "text-muted-foreground",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  }
);

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spinnerVariants> {
  /**
   * Optional label for accessibility
   */
  label?: string;
  /**
   * Center the spinner in its container
   * @default false
   */
  centered?: boolean;
}

/**
 * Spinner component for indicating loading states
 */
export function Spinner({ 
  className, 
  size, 
  variant, 
  label = "Loading...", 
  centered = false,
  ...props 
}: SpinnerProps) {
  return (
    <div 
      role="status" 
      className={cn(centered && "flex justify-center items-center", className)}
      {...props}
    >
      <div className={cn(spinnerVariants({ size, variant }))}>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

/**
 * Centered spinner with an optional message underneath
 */
export function LoadingSpinner({
  size,
  variant,
  message,
  className,
  ...props
}: SpinnerProps & { message?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-6", className)} data-testid="loading-spinner" {...props}>
      <Spinner size={size} variant={variant} />
      {message && (
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      )}
    </div>
  );
} 