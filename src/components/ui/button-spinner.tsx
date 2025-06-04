import { Spinner, SpinnerProps } from "./spinner";

interface ButtonSpinnerProps extends SpinnerProps {
  /**
   * Show the spinner only when loading is true
   */
  loading?: boolean;
  /**
   * Text to show alongside the spinner
   */
  loadingText?: string;
}

/**
 * A specialized spinner component designed for use inside buttons
 */
export function ButtonSpinner({ 
  loading = true, 
  loadingText,
  size = "xs",
  variant = "white",
  ...props 
}: ButtonSpinnerProps) {
  if (!loading) return null;
  
  return (
    <>
      <Spinner size={size} variant={variant} {...props} />
      {loadingText && <span>{loadingText}</span>}
    </>
  );
}

/**
 * Example usage:
 * 
 * <Button disabled={isLoading}>
 *   <ButtonSpinner loading={isLoading} />
 *   {isLoading ? 'Processing...' : 'Submit'}
 * </Button>
 * 
 * or with loading text combined:
 * 
 * <Button disabled={isLoading}>
 *   {isLoading 
 *     ? <ButtonSpinner loading={isLoading} loadingText="Processing..." /> 
 *     : 'Submit'
 *   }
 * </Button>
 */ 