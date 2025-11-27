// blimpify-ui/design/system/components/layout/Portal/Portal.tsx

import React, { useEffect, useState, useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export interface PortalProps {
  /** Content to render in the portal */
  children: ReactNode;
  
  /** Custom container to render into */
  container?: RefObject<HTMLElement | null> | HTMLElement | null;
  
  /** Disable portal and render in place */
  disabled?: boolean;
  
  /** The underlying element to render */
  as?: React.ElementType;
  
  /** Use the provided child element as the default rendered element */
  asChild?: boolean;
  
  /** Additional CSS classes */
  className?: string;
}

// ===============================================
// PORTAL COMPONENT
// ===============================================

export const Portal: React.FC<PortalProps> = ({
  children,
  container,
  disabled = false,
  as: Component = 'div',
  asChild = false,
  className
}) => {
  const [mounted, setMounted] = useState(false);
  const defaultContainerRef = useRef<HTMLElement | null>(null);

  // Handle SSR - only mount on client side
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Get the container element
  const getContainer = (): HTMLElement | null => {
    if (container) {
      // If it's a ref object
      if ('current' in container) {
        return container.current;
      }
      // If it's a direct element
      return container as HTMLElement;
    }
    // Default to document.body
    return document.body;
  };

  // If disabled, render in place
  if (disabled) {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn(className, (children as any).props?.className)
      });
    }
    
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }

  // During SSR, render children directly
  if (!mounted) {
    return null;
  }

  const containerElement = getContainer();

  // If no container available, render nothing
  if (!containerElement) {
    return null;
  }

  // Render portal content
  const content = asChild && React.isValidElement(children) ? (
    React.cloneElement(children as React.ReactElement<any>, {
      className: cn(className, (children as any).props?.className)
    })
  ) : (
    <Component className={className}>
      {children}
    </Component>
  );

  return createPortal(content, containerElement);
};

Portal.displayName = 'Portal';