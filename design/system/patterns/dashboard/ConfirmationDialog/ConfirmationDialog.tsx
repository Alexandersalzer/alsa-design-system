import React, { forwardRef } from 'react';
import { Modal } from '../../../components/overlays/Modal';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Button } from '../../../components';
import { Typography } from '../../../components/Typography';
import { cn } from '../../../utils/cn';
import './ConfirmationDialog.css';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'warning' | 'danger';
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ConfirmationDialog = forwardRef<HTMLDivElement, ConfirmationDialogProps>(
  (
    {
      isOpen,
      onClose,
      onConfirm,
      title,
      message,
      confirmText = 'Bekräfta',
      cancelText = 'Avbryt',
      variant = 'default',
      loading = false,
      size = 'sm',
      className,
      ...props
    },
    ref
  ) => {
    const getConfirmButtonVariant = (): 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive' => {
      switch (variant) {
        case 'danger':
          return 'primary';
        case 'warning':
          return 'primary';
        default:
          return 'primary';
      }
    };

    const getConfirmButtonClassName = () => {
      switch (variant) {
        case 'danger':
          return 'bg-red-600 hover:bg-red-700 text-white';
        case 'warning':
          return 'bg-orange-600 hover:bg-orange-700 text-white';
        default:
          return '';
      }
    };

    return (
      <Modal
        ref={ref}
        isOpen={isOpen}
        onClose={onClose}
        title={title}
        size={size}
        className={cn('confirmation-dialog', `confirmation-dialog--${variant}`, className)}
        {...props}
      >
        <VStack spacing="md">
          <Typography variant="body-md" color="secondary">
            {message}
          </Typography>
          <HStack justify="end" spacing="sm">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={getConfirmButtonVariant()}
              onClick={onConfirm}
              loading={loading}
              className={getConfirmButtonClassName()}
            >
              {confirmText}
            </Button>
          </HStack>
        </VStack>
      </Modal>
    );
  }
);

ConfirmationDialog.displayName = 'ConfirmationDialog';
