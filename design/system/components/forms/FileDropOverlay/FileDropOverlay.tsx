// ===============================================
// FileDropOverlay Component - Global drag and drop overlay
// ===============================================

import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import { VStack, Body, Label, Icon } from '../..';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import './FileDropOverlay.css';

export interface FileDropOverlayProps {
  /** Callback when files are dropped */
  onFilesDropped?: (files: File[]) => void;
  /** Custom content to show in the overlay */
  children?: ReactNode;
  /** Accept filter (e.g., "image/*,video/*") */
  accept?: string;
  /** Disable the overlay */
  disabled?: boolean;
}

export const FileDropOverlay: React.FC<FileDropOverlayProps> = ({
  onFilesDropped,
  children,
  accept,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const dragCounterRef = useRef(0);
  const dragTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || disabled) return;

    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();

      // Only show overlay if dragging files
      if (e.dataTransfer?.types?.includes('Files')) {
        dragCounterRef.current++;

        if (dragCounterRef.current === 1) {
          setIsDragging(true);
        }

        if (dragTimerRef.current) {
          clearTimeout(dragTimerRef.current);
          dragTimerRef.current = null;
        }
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy';
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current--;

      if (dragTimerRef.current) {
        clearTimeout(dragTimerRef.current);
      }

      dragTimerRef.current = setTimeout(() => {
        if (dragCounterRef.current <= 0) {
          dragCounterRef.current = 0;
          setIsDragging(false);
        }
      }, 50);
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setIsDragging(false);

      if (dragTimerRef.current) {
        clearTimeout(dragTimerRef.current);
        dragTimerRef.current = null;
      }

      // Get files
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);

        // Filter by accept if provided
        let filteredFiles = fileArray;
        if (accept) {
          const acceptTypes = accept.split(',').map(t => t.trim());
          filteredFiles = fileArray.filter(file => {
            return acceptTypes.some(acceptType => {
              if (acceptType.endsWith('/*')) {
                const category = acceptType.replace('/*', '');
                return file.type.startsWith(category + '/');
              }
              return file.type === acceptType;
            });
          });
        }

        if (filteredFiles.length > 0) {
          onFilesDropped?.(filteredFiles);
        }
      }
    };

    document.addEventListener('dragenter', handleGlobalDragEnter);
    document.addEventListener('dragover', handleGlobalDragOver);
    document.addEventListener('dragleave', handleGlobalDragLeave);
    document.addEventListener('drop', handleGlobalDrop);

    return () => {
      document.removeEventListener('dragenter', handleGlobalDragEnter);
      document.removeEventListener('dragover', handleGlobalDragOver);
      document.removeEventListener('dragleave', handleGlobalDragLeave);
      document.removeEventListener('drop', handleGlobalDrop);

      if (dragTimerRef.current) {
        clearTimeout(dragTimerRef.current);
      }
    };
  }, [isMounted, disabled, onFilesDropped, accept]);

  if (!isMounted || !isDragging) return null;

  return createPortal(
    <div className="file-drop-overlay">
      <div className="file-drop-overlay__content">
        {children || (
          <>
            <Icon size="xl" color="accent">
              <ArrowUpTrayIcon />
            </Icon>
            <VStack spacing="xs" align="center">
              <Label size="lg" weight="semibold">Drop files to upload</Label>
              <Body size="sm" color="secondary">Release to start uploading</Body>
            </VStack>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};
