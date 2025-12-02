// ===============================================
// src/design-system/components/data/IndexTable/IndexTable.tsx
// INDEX TABLE - Complete table with selection, sorting, bulk actions
// ===============================================

import React, { useState, useMemo, type ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Checkbox } from '../../forms';
import { BulkActionBar } from '../../actions/BulkActionBar';
import { Pagination } from '../../navigation/Pagination';
import { Clickable } from '../../actions/Clickable';
import { Icon } from '../../media';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// ===== TYPES =====

export interface IndexTableColumn<T = any> {
  key: string;
  title: string;
  /** Function to render cell content */
  render?: (item: T, index: number) => ReactNode;
  /** Column width */
  width?: string | number;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Enable sorting */
  sortable?: boolean;
  /** Sort function */
  sortFn?: (a: T, b: T) => number;
  /** Hide on mobile */
  hideOnMobile?: boolean;
  className?: string;
}

export interface IndexTableProps<T = any> {
  /** Array of data items */
  items: T[];
  /** Column definitions */
  columns: IndexTableColumn<T>[];
  /** Unique key for each row */
  resourceName?: {
    singular: string;
    plural: string;
  };
  /** Row ID accessor */
  getId?: (item: T) => string | number;
  /** Selection */
  selectable?: boolean;
  selectedItems?: (string | number)[];
  onSelectionChange?: (selected: (string | number)[]) => void;
  /** Bulk actions */
  bulkActions?: ReactNode;
  /** Row click handler */
  onRowClick?: (item: T, index: number) => void;
  /** Sorting */
  sortable?: boolean;
  defaultSortColumn?: string;
  defaultSortDirection?: 'asc' | 'desc';
  /** Pagination */
  pagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  /** States */
  loading?: boolean;
  emptyState?: ReactNode;
  /** Styling */
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'bordered' | 'striped';
  stickyHeader?: boolean;
  className?: string;
}

export const IndexTable = <T extends Record<string, any>>({
  items,
  columns,
  resourceName = { singular: 'item', plural: 'items' },
  getId = (item) => item.id,
  selectable = false,
  selectedItems: controlledSelection,
  onSelectionChange,
  bulkActions,
  onRowClick,
  sortable = false,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  pagination = false,
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 50,
  onPageChange,
  loading = false,
  emptyState,
  size = 'md',
  variant = 'default',
  stickyHeader = false,
  className
}: IndexTableProps<T>) => {
  // ===== STATE =====
  const [internalSelection, setInternalSelection] = useState<(string | number)[]>([]);
  const [sortColumn, setSortColumn] = useState<string | undefined>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);

  const selectedItems = controlledSelection ?? internalSelection;
  const isControlled = controlledSelection !== undefined;

  // ===== SELECTION LOGIC =====
  const itemIds = useMemo(() => items.map(getId), [items, getId]);

  const allSelected = selectedItems.length === items.length && items.length > 0;
  const someSelected = selectedItems.length > 0 && selectedItems.length < items.length;

  const toggleSelectAll = () => {
    const newSelection = allSelected ? [] : itemIds;
    if (isControlled) {
      onSelectionChange?.(newSelection);
    } else {
      setInternalSelection(newSelection);
    }
  };

  const toggleSelectItem = (id: string | number) => {
    const newSelection = selectedItems.includes(id)
      ? selectedItems.filter(selectedId => selectedId !== id)
      : [...selectedItems, id];
    
    if (isControlled) {
      onSelectionChange?.(newSelection);
    } else {
      setInternalSelection(newSelection);
    }
  };

  const clearSelection = () => {
    if (isControlled) {
      onSelectionChange?.([]);
    } else {
      setInternalSelection([]);
    }
  };

  // ===== SORTING LOGIC =====
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  const sortedItems = useMemo(() => {
    if (!sortable || !sortColumn) return items;

    const column = columns.find(col => col.key === sortColumn);
    if (!column?.sortFn) return items;

    const sorted = [...items].sort(column.sortFn);
    return sortDirection === 'desc' ? sorted.reverse() : sorted;
  }, [items, sortColumn, sortDirection, sortable, columns]);

  // ===== RENDER =====
  return (
    <div className={cn('index-table-container', className)}>
      {/* Bulk Action Bar */}
      {selectable && (
        <BulkActionBar
          selectedCount={selectedItems.length}
          totalCount={items.length}
          onClearSelection={clearSelection}
          actions={bulkActions}
          position="sticky"
        />
      )}

      {/* Table */}
      <div className="index-table-wrapper">
        <table
          className={cn(
            'index-table',
            `index-table--${size}`,
            `index-table--${variant}`,
            stickyHeader && 'index-table--sticky-header'
          )}
        >
          {/* Header */}
          <thead className="index-table__header">
            <tr className="index-table__header-row">
              {/* Selection checkbox */}
              {selectable && (
                <th className="index-table__header-cell index-table__header-cell--checkbox">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleSelectAll}
                    aria-label={`Select all ${resourceName.plural}`}
                  />
                </th>
              )}

              {/* Column headers */}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'index-table__header-cell',
                    column.align && `index-table__header-cell--${column.align}`,
                    column.sortable && 'index-table__header-cell--sortable',
                    column.hideOnMobile && 'index-table__header-cell--hide-mobile',
                    column.className
                  )}
                  style={{ width: column.width }}
                >
                  {column.sortable ? (
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                      className="index-table__sort-button"
                    >
                      {column.title}
                      {sortColumn === column.key && (
                        <Icon size="sm" className="index-table__sort-icon">
                          {sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </Icon>
                      )}
                    </button>
                  ) : (
                    column.title
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="index-table__body">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className="index-table__loading">Loading...</div>
                </td>
              </tr>
            ) : sortedItems.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)}>
                  <div className="index-table__empty">
                    {emptyState || `No ${resourceName.plural} found`}
                  </div>
                </td>
              </tr>
            ) : (
              sortedItems.map((item, index) => {
                const id = getId(item);
                const isSelected = selectedItems.includes(id);

                return (
                  <tr
                    key={id}
                    className={cn(
                      'index-table__row',
                      isSelected && 'index-table__row--selected',
                      onRowClick && 'index-table__row--clickable'
                    )}
                    onClick={() => onRowClick?.(item, index)}
                  >
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className="index-table__cell index-table__cell--checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={() => toggleSelectItem(id)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select ${resourceName.singular}`}
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={cn(
                          'index-table__cell',
                          column.align && `index-table__cell--${column.align}`,
                          column.hideOnMobile && 'index-table__cell--hide-mobile',
                          column.className
                        )}
                      >
                        {column.render ? column.render(item, index) : null}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && onPageChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          size={size}
        />
      )}
    </div>
  );
};

IndexTable.displayName = 'IndexTable';