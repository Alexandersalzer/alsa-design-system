// ===============================================
// src/design-system/components/primitives/Popover/Popover.tsx
// LOW-LEVEL POSITIONING PRIMITIVE - Chakra-inspired structure
// ===============================================

import React, { 
  useState, 
  useRef, 
  useEffect, 
  createContext, 
  useContext,
  forwardRef,
  useId,
  type ReactNode,
  type RefObject
} from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import './Popover.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type PopoverSize = 'xs' | 'sm' | 'md' | 'lg';
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

interface PositioningOptions {
  placement?: PopoverPlacement;
  offset?: number;
  sameWidth?: boolean;
  strategy?: 'absolute' | 'fixed';
  hideWhenDetached?: boolean;
}

interface PopoverContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  size: PopoverSize;
  triggerId: string;
  contentId: string;
  triggerRef: RefObject<HTMLElement | null>;
  contentRef: RefObject<HTMLDivElement | null>;
  autoFocus: boolean;
  closeOnEscape: boolean;
  closeOnInteractOutside: boolean;
  modal: boolean;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover.Root');
  }
  return context;
};

// Min-width values by size
const MIN_WIDTHS = {
  xs: 160,
  sm: 180,
  md: 200,
  lg: 240
};

// ===============================================
// UTILITY: Scroll Lock
// ===============================================

const useScrollLock = (isLocked: boolean, disabled: boolean = false) => {
  const [originalStyle, setOriginalStyle] = useState<string>('');
  const [originalScrollbarWidth, setOriginalScrollbarWidth] = useState<string>('');

  useEffect(() => {
    if (disabled) return;

    if (isLocked) {
      const body = document.body;
      const html = document.documentElement;
      
      setOriginalStyle(body.style.overflow);
      setOriginalScrollbarWidth(body.style.paddingRight);

      const scrollbarWidth = window.innerWidth - html.clientWidth;
      
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollbarWidth}px`;
      
      const preventDefault = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefault);
      };
    } else {
      const body = document.body;
      body.style.overflow = originalStyle;
      body.style.paddingRight = originalScrollbarWidth;
    }
  }, [isLocked, disabled, originalStyle, originalScrollbarWidth]);
};

// ===============================================
// POPOVER ROOT
// ===============================================

export interface PopoverRootProps {
  children: ReactNode;
  size?: PopoverSize;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  autoFocus?: boolean;
  closeOnEscape?: boolean;
  closeOnInteractOutside?: boolean;
  modal?: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  className?: string;
  componentKey?: string;
}

export const PopoverRoot = ({
  children,
  size = 'md',
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  autoFocus = true,
  closeOnEscape = true,
  closeOnInteractOutside = true,
  modal = false,
  className,
  componentKey
}: PopoverRootProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  
  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setIsOpen = (open: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(open);
    }
    onOpenChange?.(open);
  };
  
  const triggerId = useId();
  const contentId = useId();
  
  useScrollLock(isOpen && modal, !modal);
  
  // Close on outside click
  useEffect(() => {
    if (!isOpen || !closeOnInteractOutside) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      // Check if click is inside trigger or content
      const isInsideTrigger = triggerRef.current?.contains(target);
      const isInsideContent = contentRef.current?.contains(target);
      
      // 🎯 KEY FIX: Also check if the target is an input/textarea inside the trigger
      const isInputInTrigger = triggerRef.current?.querySelector('input, textarea')?.contains(target);
      
      if (!isInsideTrigger && !isInsideContent && !isInputInTrigger) {
        setIsOpen(false);
      }
    };

    // Use 'mousedown' instead of 'click' for better UX
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeOnInteractOutside]);
  
  // Close on escape
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape]);
  
  const value: PopoverContextValue = {
    isOpen,
    setIsOpen,
    size,
    triggerId,
    contentId,
    triggerRef,
    contentRef,
    autoFocus,
    closeOnEscape,
    closeOnInteractOutside,
    modal
  };
  
  return (
    <PopoverContext.Provider value={value}>
      <Component componentKey={componentKey}>
        <div className={cn('popover-root', className)}>
          {children}
        </div>
      </Component>
    </PopoverContext.Provider>
  );
};

// ===============================================
// POPOVER TRIGGER
// ===============================================

export interface PopoverTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  disabled?: boolean;
}

export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, asChild = false, className, disabled, ...props }, ref) => {
    const { isOpen, setIsOpen, triggerId, contentId, triggerRef } = usePopoverContext();
    
    const handleClick = (e?: React.MouseEvent) => {
      if (disabled) return;
      e?.stopPropagation();
      setIsOpen(!isOpen);
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };
    
    // If asChild, clone the child element
    if (asChild && React.isValidElement(children)) {
      const childElement = children as React.ReactElement<any>;
      return React.cloneElement(childElement, {
        ref: (node: HTMLElement) => {
          if (triggerRef) (triggerRef as any).current = node;
          if (typeof ref === 'function') ref(node as any);
          else if (ref) (ref as any).current = node;
        },
        id: triggerId,
        disabled,
        onClick: (e: React.MouseEvent) => {
          handleClick(e);
          if (childElement.props && typeof childElement.props.onClick === 'function') {
            childElement.props.onClick(e);
          }
        },
        onKeyDown: (e: React.KeyboardEvent) => {
          handleKeyDown(e);
          if (childElement.props && typeof childElement.props.onKeyDown === 'function') {
            childElement.props.onKeyDown(e);
          }
        },
        'aria-expanded': isOpen,
        'aria-haspopup': 'dialog',
        'aria-controls': contentId,
      });
    }
    
    // Default button
    return (
      <button
        ref={(node) => {
          if (triggerRef) (triggerRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={contentId}
        className={cn('popover-trigger', className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

PopoverTrigger.displayName = 'Popover.Trigger';

// ===============================================
// POPOVER POSITIONER
// ===============================================

export interface PopoverPositionerProps {
  children: ReactNode;
  positioning?: PositioningOptions;
}

export const PopoverPositioner = ({ children, positioning }: PopoverPositionerProps) => {
  const { isOpen } = usePopoverContext();
  
  if (!isOpen) return null;
  
  return (
    <div className="popover-positioner">
      {children}
    </div>
  );
};

// ===============================================
// POPOVER CONTENT
// ===============================================

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  maxHeight?: number;
  width?: number | string;
  positioning?: PositioningOptions;
}

export const PopoverContent = ({ 
  children, 
  className, 
  maxHeight = 600,
  width,
  positioning = {}
}: PopoverContentProps) => {
  const { contentId, size, contentRef, triggerRef, autoFocus, isOpen } = usePopoverContext();
  const [position, setPosition] = useState<{
    left: number;
    shouldOpenUpward: boolean;
    maxHeight: number;
    minWidth: number;
  }>({
    left: 0,
    shouldOpenUpward: false,
    maxHeight: maxHeight,
    minWidth: MIN_WIDTHS[size]
  });
  
  // Calculate positioning
  const updatePosition = () => {
    if (!contentRef.current || !triggerRef.current) return;
    
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    const spaceAbove = triggerRect.top;
    const spaceBelow = viewportHeight - triggerRect.bottom;
    
    // Get CSS min-width for this size
    const cssMinWidth = MIN_WIDTHS[size];
    
    // Determine actual content width (respecting CSS min-width)
    const actualContentWidth = Math.max(
      contentRect.width > 0 ? contentRect.width : cssMinWidth,
      cssMinWidth
    );
    
    // Vertical positioning
    const shouldOpenUpward = spaceBelow < Math.min(maxHeight, contentRect.height) && spaceAbove > spaceBelow;
    const calculatedMaxHeight = shouldOpenUpward 
      ? Math.min(maxHeight, spaceAbove - 16)
      : Math.min(maxHeight, spaceBelow - 16);
    
    // Horizontal positioning - prevent overflow
    let left = 0;
    
    // Check if content would overflow on the right
    if (triggerRect.left + actualContentWidth > viewportWidth - 16) {
      // Align to right edge of trigger
      left = triggerRect.width - actualContentWidth;
    }
    
    // Check if it would overflow on the left
    if (triggerRect.left + left < 16) {
      left = -triggerRect.left + 16;
    }
    
    setPosition({
      left,
      shouldOpenUpward,
      maxHeight: calculatedMaxHeight,
      minWidth: Math.max(cssMinWidth, triggerRect.width)
    });
  };
  
  // Position immediately when opened, then fine-tune after render
  useEffect(() => {
    if (!isOpen) return;
    
    // Immediate calculation
    updatePosition();
    
    // Fine-tune after one frame
    const timer = setTimeout(updatePosition, 16);
    
    return () => clearTimeout(timer);
  }, [isOpen]);
  
  // Recalculate on scroll/resize
  useEffect(() => {
    if (!isOpen) return;
    
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);
  
  // Auto focus first focusable element
  useEffect(() => {
    if (autoFocus && contentRef.current && isOpen) {
      // 🎯 FIX: Don't auto-focus if the trigger contains an input
      const triggerHasInput = triggerRef.current?.querySelector('input, textarea');
      
      if (!triggerHasInput) {
        const focusable = contentRef.current.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }
  }, [autoFocus, isOpen, triggerRef]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={contentRef}
      id={contentId}
      role="dialog"
      aria-modal="false"
      tabIndex={-1}
      className={cn(
        'popover-content',
        `popover-content--${size}`,
        className
      )}
      style={{
        maxHeight: `${position.maxHeight}px`,
        minWidth: width || position.minWidth,
        left: `${position.left}px`,
        ...(position.shouldOpenUpward ? {
          bottom: '100%',
          top: 'auto',
          marginBottom: 'calc( var(--control-height-md) + 8px)'
        } : {
          top: '100%',
          bottom: 'auto',
          marginTop: '8px'
        })
      }}
    >
      {children}
    </div>
  );
};

// ===============================================
// POPOVER ARROW
// ===============================================

export interface PopoverArrowProps {
  children?: ReactNode;
  className?: string;
}

export const PopoverArrow = ({ children, className }: PopoverArrowProps) => {
  return (
    <div className={cn('popover-arrow', className)}>
      {children || <div className="popover-arrow-tip" />}
    </div>
  );
};

// ===============================================
// POPOVER CLOSE TRIGGER
// ===============================================

export interface PopoverCloseTriggerProps {
  children?: ReactNode;
  asChild?: boolean;
  className?: string;
}

export const PopoverCloseTrigger = ({ children, asChild = false, className }: PopoverCloseTriggerProps) => {
  const { setIsOpen } = usePopoverContext();
  
  const handleClick = () => {
    setIsOpen(false);
  };
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: handleClick
    });
  }
  
  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn('popover-close-trigger', className)}
      aria-label="Close"
    >
      {children || '×'}
    </button>
  );
};

// ===============================================
// POPOVER HEADER/BODY/FOOTER
// ===============================================

export interface PopoverHeaderProps {
  children: ReactNode;
  className?: string;
}

export const PopoverHeader = ({ children, className }: PopoverHeaderProps) => {
  const { size } = usePopoverContext();
  return (
    <div className={cn('popover-header', `popover-header--${size}`, className)}>
      {children}
    </div>
  );
};

export interface PopoverBodyProps {
  children: ReactNode;
  className?: string;
}

export const PopoverBody = ({ children, className }: PopoverBodyProps) => {
  const { size } = usePopoverContext();
  return (
    <div className={cn('popover-body', `popover-body--${size}`, className)}>
      {children}
    </div>
  );
};

export interface PopoverFooterProps {
  children: ReactNode;
  className?: string;
}

export const PopoverFooter = ({ children, className }: PopoverFooterProps) => {
  const { size } = usePopoverContext();
  return (
    <div className={cn('popover-footer', `popover-footer--${size}`, className)}>
      {children}
    </div>
  );
};

export interface PopoverTitleProps {
  children: ReactNode;
  className?: string;
}

export const PopoverTitle = ({ children, className }: PopoverTitleProps) => {
  return (
    <h2 className={cn('popover-title', className)}>
      {children}
    </h2>
  );
};

export interface PopoverDescriptionProps {
  children: ReactNode;
  className?: string;
}

export const PopoverDescription = ({ children, className }: PopoverDescriptionProps) => {
  return (
    <p className={cn('popover-description', className)}>
      {children}
    </p>
  );
};

// ===============================================
// EXPORTS (Compound Component Pattern)
// ===============================================

export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Positioner: PopoverPositioner,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  CloseTrigger: PopoverCloseTrigger,
  Header: PopoverHeader,
  Body: PopoverBody,
  Footer: PopoverFooter,
  Title: PopoverTitle,
  Description: PopoverDescription
});