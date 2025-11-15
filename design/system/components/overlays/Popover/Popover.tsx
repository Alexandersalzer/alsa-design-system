// ===============================================
// src/design-system/components/primitives/Popover/Popover.tsx
// IMPROVED POPOVER - Chakra-inspired with portal positioning
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
import { createPortal } from 'react-dom';
import { cn } from '../../../lib/utils';
import './Popover.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type PopoverSize = 'xs' | 'sm' | 'md' | 'lg';
export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';

interface PositioningOptions {
  placement?: PopoverPlacement;
  offset?: number;
  strategy?: 'absolute' | 'fixed';

  /** NAVBAR MODE (CInspo-style) */
  navbar?: boolean;
  alignment?: 'left' | 'center' | 'right';
  animation?: 'slide-fade' | 'fade';
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
  positioning: PositioningOptions;
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
  positioning?: PositioningOptions;
  className?: string;
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
  positioning = {},
  className
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
      
      const isInsideTrigger = triggerRef.current?.contains(target);
      const isInsideContent = contentRef.current?.contains(target);
      const isInputInTrigger = triggerRef.current?.querySelector('input, textarea')?.contains(target);
      
      if (!isInsideTrigger && !isInsideContent && !isInputInTrigger) {
        setIsOpen(false);
      }
    };

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
    modal,
    positioning
  };
  
  return (
    <PopoverContext.Provider value={value}>
      <div className={cn('popover-root', className)}>
        {children}
      </div>
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
// POPOVER POSITIONER (Portal with Absolute Positioning)
// ===============================================

export interface PopoverPositionerProps {
  children: ReactNode;
}

export const PopoverPositioner = ({ children }: PopoverPositionerProps) => {
  const { isOpen, triggerRef, positioning } = usePopoverContext();
  const positionerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
    referenceWidth: 0,
    referenceHeight: 0,
    availableWidth: 0,
    availableHeight: 0
  });

  const {
    placement = 'bottom',
    offset = 8,
    strategy = 'absolute',
    navbar = false
  } = positioning;

  // Calculate position
  const updatePosition = () => {
    if (!triggerRef.current || !isOpen) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

  if (navbar) {
    let x = viewportWidth / 2; // default center

    if (positioning.alignment === 'left') x = viewportWidth * 0.05;
    if (positioning.alignment === 'right') x = viewportWidth - viewportWidth * 0.05;

    return setPosition({
      x,
      y: triggerRect.bottom + offset,
      referenceWidth: triggerRect.width,
      referenceHeight: triggerRect.height,
      availableWidth: viewportWidth,
      availableHeight: viewportHeight,
    });
  }


    let x = 0;
    let y = 0;

    // Calculate base position based on placement
    switch (placement) {
      case 'bottom':
      case 'bottom-start':
      case 'bottom-end':
        x = triggerRect.left;
        y = triggerRect.bottom + offset;
        break;
      case 'top':
      case 'top-start':
      case 'top-end':
        x = triggerRect.left;
        y = triggerRect.top - offset;
        break;
      case 'left':
        x = triggerRect.left - offset;
        y = triggerRect.top;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top;
        break;
    }

    // Handle alignment variants
    if (placement.includes('end')) {
      x = triggerRect.right;
    } else if (!placement.includes('start')) {
      // Center alignment for 'bottom' and 'top'
      if (placement === 'bottom' || placement === 'top') {
        x = triggerRect.left + (triggerRect.width / 2);
      }
    }

    const availableWidth = viewportWidth - x - 16;
    const availableHeight = placement.startsWith('bottom')
      ? viewportHeight - y - 16
      : y - 16;

    setPosition({
      x,
      y,
      referenceWidth: triggerRect.width,
      referenceHeight: triggerRect.height,
      availableWidth: Math.max(200, availableWidth),
      availableHeight: Math.max(200, availableHeight)
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    updatePosition();
    const timer = setTimeout(updatePosition, 16);

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, placement, navbar]);

  if (!isOpen) return null;

  // Portal to body
  return createPortal(
    <div
      ref={positionerRef}
      className="popover-positioner"
      data-placement={placement}
      data-navbar={navbar ? "" : undefined}
      style={{
        position: strategy,
        isolation: 'isolate',
        minWidth: 'max-content',
        top: 0,
        left: 0,
        transform: `translate3d(var(--x), var(--y), 0)`,
        zIndex: 'var(--z-index)',
        '--x': `${position.x}px`,
        '--y': `${position.y}px`,
        '--z-index': 'var(--z-popover)',
        '--reference-width': `${position.referenceWidth}px`,
        '--reference-height': `${position.referenceHeight}px`,
        '--available-width': `${position.availableWidth}px`,
        '--available-height': `${position.availableHeight}px`,
      } as React.CSSProperties}
    >
      {children}
    </div>,
    document.body
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
}

export const PopoverContent = ({ 
  children, 
  className, 
  maxHeight,
  width
}: PopoverContentProps) => {
  const { contentId, size, contentRef, triggerRef, autoFocus, isOpen, positioning } = usePopoverContext();
  
  // Auto focus first focusable element
  useEffect(() => {
    if (autoFocus && contentRef.current && isOpen) {
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
      data-placement={positioning.placement || 'bottom'}
      data-navbar={positioning.navbar ? "" : undefined}

      data-alignment={positioning.alignment}
      data-animation={positioning.animation}

      className={cn(
        'popover-content',
        `popover-content--${size}`,
        className
      )}
      style={{
        maxHeight: maxHeight ? `${maxHeight}px` : 'var(--available-height)',
        width: width || 'auto',
        pointerEvents: 'auto'
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