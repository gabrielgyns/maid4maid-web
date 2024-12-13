import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  destructive?: boolean;
}

/**
 * A reusable dialog component that asks for user confirmation before proceeding with an action.
 *
 * @component
 * @param {object} props - The component props
 * @param {ReactNode} props.children - The element that triggers the dialog when clicked
 * @param {string} props.title - The title text of the confirmation dialog
 * @param {string} [props.description] - Optional description text providing more details
 * @param {string} [props.confirmText='Confirm'] - Text for the confirm button
 * @param {string} [props.cancelText='Cancel'] - Text for the cancel button
 * @param {() => void | Promise<void>} props.onConfirm - Callback function executed when user confirms
 * @param {boolean} [props.isLoading=false] - Whether the confirmation action is in progress
 * @param {boolean} [props.destructive=false] - Whether the action is destructive (changes button styling)
 * @returns {JSX.Element} The confirm dialog component
 */
const ConfirmDialog = ({
  children,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  isLoading = false,
  destructive = false,
}: ConfirmDialogProps): JSX.Element => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {description && (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={destructive ? 'destructive' : 'default'}
              onClick={() => void onConfirm()}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
