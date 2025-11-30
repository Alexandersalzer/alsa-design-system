// ===============================================
// blimpify-ui/design/system/components/overlays/AriaPopover/AriaPopover.tsx
// REACT ARIA POPOVER WRAPPER - For date/time pickers
// ===============================================

import React, { useRef, forwardRef, type ReactNode } from 'react';
import { DismissButton, Overlay, usePopover } from '@react-aria/overlays';
import type { AriaPopoverProps } from '@react-aria/overlays';
import type { OverlayTriggerState } from '@react-stately/overlays';
import { cn } from '../../../utils/cn';
import './AriaPopover.css';

// ===============================================
// TYPES
// ===============================================

export interface AriaPopoverWrapperProps extends Omit<AriaPopoverProps, 'popoverRef' | 'triggerRef'> {
  children: ReactNode;
  className?: string;
  /** Popover state (from useDatePickerState or useOverlayTriggerState) */
  state: OverlayTriggerState;
  /** Ref to the trigger element */
  triggerRef: React.RefObject<Element | null>;
  /** Maximum height */
  maxHeight?: number;
  /** Width */
  width?: number | string;
  /** Whether to show arrow */
  showArrow?: boolean;
}

// ===============================================
// ARIA POPOVER COMPONENT
// ===============================================

export const AriaPopover = forwardRef<HTMLDivElement, AriaPopoverWrapperProps>(({
  children,
  className,
  state,
  triggerRef,
  maxHeight = 500,
  width,
  showArrow = false,
  ...props
}, ref) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  
  const { popoverProps, arrowProps, placement } = usePopover(
    {
      ...props,
      triggerRef,
      popoverRef,
    },
    state
  );

  return (
    <Overlay>
      <div
        {...popoverProps}
        ref={popoverRef}
        className={cn('aria-popover', className)}
        style={{
          ...popoverProps.style,
          maxHeight,
          ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
        }}
      >
        <DismissButton onDismiss={state.close} />
        
        {showArrow && (
          <div
            {...arrowProps}
            className="aria-popover-arrow"
            data-placement={placement}
          />
        )}
        
        <div className="aria-popover-content">
          {children}
        </div>
        
        <DismissButton onDismiss={state.close} />
      </div>
    </Overlay>
  );
});

AriaPopover.displayName = 'AriaPopover';