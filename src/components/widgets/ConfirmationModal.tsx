import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  className?: string;
  appName?: string;
  /**
   * Whether the modal is open or not
   */
  open: boolean;
  /**
   * Function to control the open state of the modal
   */
  setOpen: (open: boolean) => void;
  /**
   * The title of the confirmation modal
   */
  title?: string;
  /**
   * The text or ReactNode content to display in the confirmation modal
   */
  text: string | ReactNode;
  /**
   * Optional additional description that appears under the title
   */
  description?: string;
  /**
   * Handler function called when the confirm button is clicked
   */
  handleClickConfirm: () => void;
  /**
   * Handler function called when the cancel button is clicked
   */
  handleClickCancel: () => void;
  /**
   * Optional loading state to show a spinner in the confirm button
   */
  isLoading?: boolean;
  /**
   * Text or ReactNode to display on the confirm button
   * @default "Confirm"
   */
  confirmText?: string | ReactNode;
  /**
   * Text or ReactNode to display on the cancel button
   * @default "Cancel"
   */
  cancelText?: string | ReactNode;
  /**
   * Variant for the confirm button
   * @default "default"
   */
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * Whether to show a warning icon in the header
   * @default false
   */
  showWarningIcon?: boolean;
}

/**
 * A reusable confirmation modal component that can be used to confirm user actions
 */
export default function ConfirmationModal({
  open,
  setOpen,
  title = "Confirmation",
  description,
  text,
  handleClickConfirm,
  handleClickCancel,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmVariant = "default",
  showWarningIcon = false,
}: ConfirmationModalProps) {
  
  const onCancel = () => {
    handleClickCancel();
    setOpen(false);
  };

  const onConfirm = () => {
    handleClickConfirm();
    // Don't close the modal automatically when loading
    // This allows the calling component to control closure after async operations
    if (!isLoading) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md" data-testid="confirm-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {showWarningIcon && (
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            )}
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        <div className="py-4">
          {typeof text === "string" ? <p>{text}</p> : text}
        </div>

        <DialogFooter className="flex justify-end gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            data-testid="cancel-delete"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={confirmVariant}
            onClick={onConfirm}
            disabled={isLoading}
            data-testid="confirm-delete"
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 