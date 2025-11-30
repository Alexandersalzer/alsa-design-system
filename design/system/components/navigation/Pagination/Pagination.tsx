// ===============================================
// src/design-system/components/navigation/Pagination/Pagination.tsx
// PAGINATION COMPONENT - For Index Tables
// ===============================================

import React from 'react';
import { cn } from '../../utils/cn';
import { Icon, Button, IconButton } from '../../';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Total number of items */
  totalItems?: number;
  /** Items per page */
  pageSize?: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Show first/last page buttons */
  showFirstLast?: boolean;
  /** Show page info text */
  showInfo?: boolean;
  /** Compact mode (just prev/next) */
  compact?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  showFirstLast = true,
  showInfo = true,
  compact = false,
  disabled = false,
  size = 'md',
  className
}) => {
  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const handleFirst = () => onPageChange(1);
  const handlePrevious = () => onPageChange(Math.max(1, currentPage - 1));
  const handleNext = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const handleLast = () => onPageChange(totalPages);

  // Calculate item range for info text
  const getItemRange = () => {
    if (!totalItems || !pageSize) return null;
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    return { start, end };
  };

  const itemRange = getItemRange();

  if (compact) {
    return (
      <div className={cn('pagination pagination--compact', className)}>
        <Button
          variant="ghost"
          size={size}
          onClick={handlePrevious}
          disabled={!hasPrevious || disabled}
          leftIcon={<Icon size="sm"><ChevronLeftIcon /></Icon>}
        >
          Previous
        </Button>
        {showInfo && (
          <span className="pagination__info">
            Page {currentPage} of {totalPages}
          </span>
        )}
        <Button
          variant="ghost"
          size={size}
          onClick={handleNext}
          disabled={!hasNext || disabled}
          rightIcon={<Icon size="sm"><ChevronRightIcon /></Icon>}
        >
          Next
        </Button>
      </div>
    );
  }

  return (
    <div className={cn('pagination', `pagination--${size}`, className)}>
      {/* Item info */}
      {showInfo && itemRange && (
        <div className="pagination__info">
          Showing {itemRange.start}–{itemRange.end} of {totalItems}
        </div>
      )}

      {/* Page controls */}
      <div className="pagination__controls">
        {/* First page */}
        {showFirstLast && (
          <IconButton
            icon={<Icon size="sm"><ChevronDoubleLeftIcon /></Icon>}
            aria-label="First page"
            variant="ghost"
            size={size}
            onClick={handleFirst}
            disabled={!hasPrevious || disabled}
          />
        )}

        {/* Previous page */}
        <IconButton
          icon={<Icon size="sm"><ChevronLeftIcon /></Icon>}
          aria-label="Previous page"
          variant="ghost"
          size={size}
          onClick={handlePrevious}
          disabled={!hasPrevious || disabled}
        />

        {/* Page indicator */}
        <span className="pagination__page-info">
          Page {currentPage} of {totalPages}
        </span>

        {/* Next page */}
        <IconButton
          icon={<Icon size="sm"><ChevronRightIcon /></Icon>}
          aria-label="Next page"
          variant="ghost"
          size={size}
          onClick={handleNext}
          disabled={!hasNext || disabled}
        />

        {/* Last page */}
        {showFirstLast && (
          <IconButton
            icon={<Icon size="sm"><ChevronDoubleRightIcon /></Icon>}
            aria-label="Last page"
            variant="ghost"
            size={size}
            onClick={handleLast}
            disabled={!hasNext || disabled}
          />
        )}
      </div>
    </div>
  );
};

Pagination.displayName = 'Pagination';