// ===============================================
// src/design-system/components/navigation/Breadcrumbs/BreadcrumbItem.tsx
// BREADCRUMB ITEM COMPONENT
// ===============================================

import React from 'react';
import { cn } from '../../../utils/cn';
import { useBreadcrumbsContext } from './Breadcrumbs';

export interface BreadcrumbItemProps {
  /** Item content */
  children: React.ReactNode;
  /** Color override for this item */
  color?: 'foreground' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'accent';
  /** Size override for this item */
  size?: 'sm' | 'md' | 'lg';
  /** Underline override for this item */
  underline?: 'none' | 'active' | 'hover' | 'focus' | 'always';
  /** Content before the item */
  startContent?: React.ReactNode;
  /** Content after the item */
  endContent?: React.ReactNode;
  /** Custom separator for this item */
  separator?: React.ReactNode;
  /** Whether this is the current page */
  isCurrent?: boolean;
  /** Whether this is the last item */
  isLast?: boolean;
  /** Hide separator for this item */
  hideSeparator?: boolean;
  /** Disable this item */
  isDisabled?: boolean;
  /** Disable animation for this item */
  disableAnimation?: boolean;
  /** Link href */
  href?: string;
  /** Custom classes */
  classNames?: Partial<Record<'base' | 'item' | 'separator', string>>;
  /** Click handler */
  onPress?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  /** Key down handler */
  onKeyDown?: (e: React.KeyboardEvent) => void;
  /** Key up handler */
  onKeyUp?: (e: React.KeyboardEvent) => void;
  /** Press start handler */
  onPressStart?: (e: React.MouseEvent) => void;
  /** Press end handler */
  onPressEnd?: (e: React.MouseEvent) => void;
  /** Additional className */
  className?: string;
}

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  (
    {
      children,
      color: colorProp,
      size: sizeProp,
      underline: underlineProp,
      startContent,
      endContent,
      separator: separatorProp,
      isCurrent: isCurrentProp = false,
      isLast = false,
      hideSeparator: hideSeparatorProp = false,
      isDisabled: isDisabledProp = false,
      disableAnimation: disableAnimationProp = false,
      href,
      classNames: classNamesProp,
      onPress,
      onKeyDown,
      onKeyUp,
      onPressStart,
      onPressEnd,
      className
    },
    ref
  ) => {
    const context = useBreadcrumbsContext();

    // Determine values (item props override context)
    const color = colorProp || context.color;
    const size = sizeProp || context.size;
    const underline = underlineProp || context.underline;
    const separator = separatorProp || context.separator;
    const hideSeparator = hideSeparatorProp || context.hideSeparator;
    const isDisabled = isDisabledProp || context.isDisabled;
    const disableAnimation = disableAnimationProp || context.disableAnimation;
    const isCurrent = isCurrentProp || isLast;
    const itemClasses = { ...context.itemClasses, ...classNamesProp };

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
      if (isDisabled || isCurrent) {
        e.preventDefault();
        return;
      }
      onPress?.(e);
      onPressStart?.(e);
    };

    // Handle key events
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (isDisabled || isCurrent) {
          e.preventDefault();
          return;
        }
        onPress?.(e);
      }
      onKeyDown?.(e);
    };

    const handleKeyUp = (e: React.KeyboardEvent) => {
      onKeyUp?.(e);
    };

    // Determine element type
    const Element = href ? 'a' : 'span';

    return (
      <li
        ref={ref}
        className={cn(
          'breadcrumb-item',
          `breadcrumb-item--${color}`,
          `breadcrumb-item--${size}`,
          isCurrent && 'breadcrumb-item--current',
          isDisabled && 'breadcrumb-item--disabled',
          disableAnimation && 'breadcrumb-item--no-animation',
          itemClasses?.base,
          className
        )}
        data-current={isCurrent || undefined}
        data-disabled={isDisabled || undefined}
      >
        <Element
          {...(href && !isDisabled && !isCurrent ? { href } : {})}
          className={cn(
            'breadcrumb-item__content',
            `breadcrumb-item__content--underline-${underline}`,
            href && !isDisabled && !isCurrent && 'breadcrumb-item__content--link',
            isCurrent && 'breadcrumb-item__content--current',
            isDisabled && 'breadcrumb-item__content--disabled',
            itemClasses?.item
          )}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          {...(isCurrent ? { 'aria-current': 'page' } : {})}
          {...(href && !isDisabled && !isCurrent ? { tabIndex: 0 } : {})}
        >
          {startContent && (
            <span className="breadcrumb-item__start-content">{startContent}</span>
          )}
          <span className="breadcrumb-item__text">{children}</span>
          {endContent && (
            <span className="breadcrumb-item__end-content">{endContent}</span>
          )}
        </Element>

        {!isLast && !hideSeparator && (
          <span
            className={cn(
              'breadcrumb-item__separator',
              itemClasses?.separator
            )}
            aria-hidden="true"
          >
            {separator}
          </span>
        )}
      </li>
    );
  }
);

BreadcrumbItem.displayName = 'BreadcrumbItem';
