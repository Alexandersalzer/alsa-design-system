// ===============================================
// src/design-system/components/overlays/Tooltip/Tooltip.tsx
// Tooltip component with placement, delay, and arrow support
// ===============================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import './Tooltip.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type TooltipPlacement =
  | 'top-start'
  | 'top'
  | 'top-end'
  | 'bottom-start'
  | 'bottom'
  | 'bottom-end'
  | 'left-start'
  | 'left'
  | 'left-end'
  | 'right-start'
  | 'right'
  | 'right-end';

export type TooltipColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger';

export type TooltipSize = 'sm' | 'md' | 'lg';

export interface TooltipProps {
  /** The content to show in the tooltip */
  content: React.ReactNode;

  /** The element that triggers the tooltip */
  children: React.ReactNode;

  /** Placement of the tooltip relative to the trigger */
  placement?: TooltipPlacement;

  /** Delay in milliseconds before showing the tooltip on hover */
  delay?: number;

  /** Delay in milliseconds before hiding the tooltip */
  closeDelay?: number;

  /** Whether to show an arrow pointing to the trigger */
  showArrow?: boolean;

  /** Offset from the trigger element in pixels */
  offset?: number;

  /** Color variant of the tooltip */
  color?: TooltipColor;

  /** Size of the tooltip */
  size?: TooltipSize;

  /** Controlled open state */
  isOpen?: boolean;

  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;

  /** Callback when open state changes */
  onOpenChange?: (isOpen: boolean) => void;

  /** Whether the tooltip is disabled */
  disabled?: boolean;

  /** Custom className for the tooltip content */
  className?: string;

  /** Custom className for the wrapper */
  wrapperClassName?: string;

  /** Whether to close on click */
  closeOnClick?: boolean;
}

// ===============================================
// TOOLTIP COMPONENT
// ===============================================

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = 'top',
  delay = 500,
  closeDelay = 0,
  showArrow = false,
  offset = 8,
  color = 'default',
  size = 'md',
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  wrapperClassName,
  closeOnClick = false,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    // Calculate position based on placement
    switch (placement) {
      case 'top-start':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left;
        break;
      case 'top':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'top-end':
        top = triggerRect.top - tooltipRect.height - offset;
        left = triggerRect.right - tooltipRect.width;
        break;
      case 'bottom-start':
        top = triggerRect.bottom + offset;
        left = triggerRect.left;
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'bottom-end':
        top = triggerRect.bottom + offset;
        left = triggerRect.right - tooltipRect.width;
        break;
      case 'left-start':
        top = triggerRect.top;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'left':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'left-end':
        top = triggerRect.bottom - tooltipRect.height;
        left = triggerRect.left - tooltipRect.width - offset;
        break;
      case 'right-start':
        top = triggerRect.top;
        left = triggerRect.right + offset;
        break;
      case 'right':
        top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
        left = triggerRect.right + offset;
        break;
      case 'right-end':
        top = triggerRect.bottom - tooltipRect.height;
        left = triggerRect.right + offset;
        break;
    }

    setPosition({ top, left });
  }, [placement, offset, isOpen]);

  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) {
      setInternalIsOpen(value);
    }
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) return;

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    showTimeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delay);
  }, [disabled, delay, setOpen]);

  const handleMouseLeave = useCallback(() => {
    if (disabled) return;

    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = undefined;
    }

    hideTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, closeDelay);
  }, [disabled, closeDelay, setOpen]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    if (closeOnClick) {
      setOpen(false);
    }
  }, [disabled, closeOnClick, setOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen, updatePosition]);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const getArrowPlacement = (): string => {
    if (placement.startsWith('top')) return 'bottom';
    if (placement.startsWith('bottom')) return 'top';
    if (placement.startsWith('left')) return 'right';
    if (placement.startsWith('right')) return 'left';
    return 'bottom';
  };

  return (
    <>
      <div
        ref={triggerRef}
        className={cn('tooltip-trigger', wrapperClassName)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
      </div>

      {mounted && isOpen && content && (
        <div
          ref={tooltipRef}
          className={cn(
            'tooltip',
            `tooltip--${placement}`,
            `tooltip--${color}`,
            `tooltip--${size}`,
            className
          )}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 'var(--z-tooltip, 9999)',
          }}
          role="tooltip"
          data-placement={placement}
          data-show={isOpen}
        >
          <div className="tooltip__content">
            {content}
          </div>

          {showArrow && (
            <div
              className={cn(
                'tooltip__arrow',
                `tooltip__arrow--${getArrowPlacement()}`
              )}
              data-arrow-placement={getArrowPlacement()}
            />
          )}
        </div>
      )}
    </>
  );
};

Tooltip.displayName = 'Tooltip';

export default Tooltip;
