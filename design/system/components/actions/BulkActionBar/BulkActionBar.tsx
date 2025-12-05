// ===============================================
// src/design-system/components/feedback/BulkActionBar/BulkActionBar.tsx
// BULK ACTION BAR - Appears when table rows are selected
// ===============================================

import React, { type ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Button, IconButton } from '../../actions';
import { Icon } from '../../media';
import { XMarkIcon } from '@heroicons/react/24/outline';

export interface BulkActionBarProps {
  /** Number of selected items */
  selectedCount: number;
  /** Total number of items */
  totalCount?: number;
  /** Whether all items are selected */
  selectAll?: boolean;
  /** Callback to select all items */
  onSelectAll?: () => void;
  /** Callback to clear selection */
  onClearSelection: () => void;
  /** Action buttons to show */
  actions?: ReactNode;
  /** Position of the bar */
  position?: 'top' | 'bottom' | 'sticky';
  /** Whether to show "Select all X items" prompt */
  showSelectAllPrompt?: boolean;
  /** Custom select all text */
  selectAllText?: string;
  className?: string;
}

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  totalCount,
  selectAll = false,
  onSelectAll,
  onClearSelection,
  actions,
  position = 'sticky',
  showSelectAllPrompt = true,
  selectAllText,
  className
}) => {
  if (selectedCount === 0) return null;

  const hasMoreToSelect = totalCount && selectedCount < totalCount && !selectAll;
  const defaultSelectAllText = totalCount
    ? `Select all ${totalCount} items`
    : 'Select all items';

  return (
    <div
      className={cn(
        'bulk-action-bar',
        `bulk-action-bar--${position}`,
        className
      )}
      role="toolbar"
      aria-label="Bulk actions"
    >
      <div className="bulk-action-bar__content">
        {/* Selection info */}
        <div className="bulk-action-bar__info">
          <span className="bulk-action-bar__count">
            {selectedCount} selected
          </span>

          {/* Select all prompt */}
          {showSelectAllPrompt && hasMoreToSelect && onSelectAll && (
            <>
              <span className="bulk-action-bar__separator">·</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onSelectAll}
                className="bulk-action-bar__select-all"
              >
                {selectAllText || defaultSelectAllText}
              </Button>
            </>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="bulk-action-bar__actions">
            {actions}
          </div>
        )}

        {/* Clear selection */}
        <IconButton
          icon={<Icon size="sm"><XMarkIcon /></Icon>}
          aria-label="Clear selection"
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="bulk-action-bar__close"
        />
      </div>
    </div>
  );
};

BulkActionBar.displayName = 'BulkActionBar';