// ===============================================
// src/design-system/components/navigation/Breadcrumbs/Breadcrumbs.tsx
// BREADCRUMBS COMPONENT - Navigation breadcrumbs
// ===============================================

import React, { createContext, useContext } from 'react';
import { cn } from '../../../utils/cn';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../..';

// Breadcrumbs context for sharing props with BreadcrumbItem
interface BreadcrumbsContextValue {
  variant: 'solid' | 'bordered' | 'light';
  color: 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent';
  size: 'sm' | 'md' | 'lg';
  underline: 'none' | 'active' | 'hover' | 'focus' | 'always';
  separator: React.ReactNode;
  hideSeparator: boolean;
  isDisabled: boolean;
  disableAnimation: boolean;
  itemClasses?: Partial<Record<'base' | 'item' | 'separator', string>>;
  onAction?: (key: React.Key) => void;
}

const BreadcrumbsContext = createContext<BreadcrumbsContextValue | undefined>(undefined);

export const useBreadcrumbsContext = () => {
  const context = useContext(BreadcrumbsContext);
  if (!context) {
    throw new Error('BreadcrumbItem must be used within Breadcrumbs');
  }
  return context;
};

export interface BreadcrumbsProps {
  /** Breadcrumb items */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'solid' | 'bordered' | 'light';
  /** Color scheme */
  color?: 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Border radius */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Underline style */
  underline?: 'none' | 'active' | 'hover' | 'focus' | 'always';
  /** Custom separator between items */
  separator?: React.ReactNode;
  /** Maximum number of items to display before collapsing */
  maxItems?: number;
  /** Number of items to show before ellipsis when collapsed */
  itemsBeforeCollapse?: number;
  /** Number of items to show after ellipsis when collapsed */
  itemsAfterCollapse?: number;
  /** Hide all separators */
  hideSeparator?: boolean;
  /** Disable all breadcrumb items */
  isDisabled?: boolean;
  /** Disable animations */
  disableAnimation?: boolean;
  /** Custom classes for breadcrumb items */
  itemClasses?: Partial<Record<'base' | 'item' | 'separator', string>>;
  /** Custom classes for breadcrumbs container */
  classNames?: Partial<Record<'base' | 'list' | 'ellipsis' | 'separator', string>>;
  /** Custom ellipsis render function */
  renderEllipsis?: (props: { items: React.ReactNode[] }) => React.ReactNode;
  /** Callback when a breadcrumb is clicked */
  onAction?: (key: React.Key) => void;
  /** Additional className */
  className?: string;
}

export const Breadcrumbs = React.forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      children,
      variant = 'solid',
      color = 'foreground',
      size = 'md',
      radius = 'sm',
      underline = 'none',
      separator,
      maxItems,
      itemsBeforeCollapse = 1,
      itemsAfterCollapse = 1,
      hideSeparator = false,
      isDisabled = false,
      disableAnimation = false,
      itemClasses,
      classNames,
      renderEllipsis,
      onAction,
      className
    },
    ref
  ) => {
    // Convert children to array
    const items = React.Children.toArray(children);
    const itemCount = items.length;

    // Determine if we need to collapse
    const shouldCollapse = maxItems && itemCount > maxItems;

    // Calculate which items to show
    let visibleItems = items;
    let collapsedItems: React.ReactNode[] = [];

    if (shouldCollapse) {
      const beforeItems = items.slice(0, itemsBeforeCollapse);
      const afterItems = items.slice(-itemsAfterCollapse);
      collapsedItems = items.slice(itemsBeforeCollapse, -itemsAfterCollapse);
      visibleItems = [...beforeItems, ...afterItems];
    }

    // Default separator
    const defaultSeparator = separator || <Icon size="sm"><ChevronRightIcon /></Icon>;

    // Context value
    const contextValue: BreadcrumbsContextValue = {
      variant,
      color,
      size,
      underline,
      separator: defaultSeparator,
      hideSeparator,
      isDisabled,
      disableAnimation,
      itemClasses,
      onAction
    };

    // Default ellipsis renderer
    const defaultRenderEllipsis = () => (
      <li className={cn('breadcrumbs__ellipsis', classNames?.ellipsis)}>
        <span className="breadcrumbs__ellipsis-content">...</span>
        {!hideSeparator && (
          <span className={cn('breadcrumbs__separator', classNames?.separator, itemClasses?.separator)}>
            {defaultSeparator}
          </span>
        )}
      </li>
    );

    return (
      <BreadcrumbsContext.Provider value={contextValue}>
        <nav
          ref={ref}
          className={cn(
            'breadcrumbs',
            `breadcrumbs--${variant}`,
            `breadcrumbs--${color}`,
            `breadcrumbs--${size}`,
            `breadcrumbs--radius-${radius}`,
            `breadcrumbs--underline-${underline}`,
            isDisabled && 'breadcrumbs--disabled',
            disableAnimation && 'breadcrumbs--no-animation',
            classNames?.base,
            className
          )}
          aria-label="Breadcrumb"
        >
          <ol className={cn('breadcrumbs__list', classNames?.list)}>
            {shouldCollapse ? (
              <>
                {/* Items before collapse */}
                {items.slice(0, itemsBeforeCollapse).map((item, index) => (
                  <React.Fragment key={index}>
                    {React.cloneElement(item as React.ReactElement<any>, {
                      isLast: false
                    })}
                  </React.Fragment>
                ))}

                {/* Ellipsis */}
                {renderEllipsis ? renderEllipsis({ items: collapsedItems }) : defaultRenderEllipsis()}

                {/* Items after collapse */}
                {items.slice(-itemsAfterCollapse).map((item, index) => (
                  <React.Fragment key={`after-${index}`}>
                    {React.cloneElement(item as React.ReactElement<any>, {
                      isLast: index === itemsAfterCollapse - 1
                    })}
                  </React.Fragment>
                ))}
              </>
            ) : (
              /* All items */
              items.map((item, index) => (
                <React.Fragment key={index}>
                  {React.cloneElement(item as React.ReactElement<any>, {
                    isLast: index === itemCount - 1
                  })}
                </React.Fragment>
              ))
            )}
          </ol>
        </nav>
      </BreadcrumbsContext.Provider>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';
