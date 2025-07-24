/**
 * Dropdown Component
 * 
 * A flexible dropdown component with support for custom trigger and content.
 */

import React, { 
  forwardRef, 
  ReactNode, 
  useState, 
  useRef, 
  useEffect, 
  createContext, 
  useContext,
  useCallback
} from 'react';
import { cn } from '../../../lib/utils';
  
  // ===== TYPE DEFINITIONS =====
  export interface DropdownProps {
    children: ReactNode;
    trigger: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    disabled?: boolean;
  }
  
  // ===== MAIN DROPDOWN COMPONENT =====
  export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
    ({
      children,
      trigger,
      open: controlledOpen,
      onOpenChange,
      align = 'end',
      side = 'bottom',
      className,
      disabled = false,
      ...props
    }, ref) => {
      const [internalOpen, setInternalOpen] = useState(false);
      const isControlled = controlledOpen !== undefined;
      const open = isControlled ? controlledOpen : internalOpen;
      
      const containerRef = useRef<HTMLDivElement>(null);
  
      // Handle open state changes
      const handleOpenChange = useCallback((newOpen: boolean) => {
        if (disabled) return;
        
        if (isControlled) {
          onOpenChange?.(newOpen);
        } else {
          setInternalOpen(newOpen);
          onOpenChange?.(newOpen);
        }
      }, [disabled, isControlled, onOpenChange]);
  
      // Close dropdown when clicking outside
      useEffect(() => {
        if (!open) return;
  
        const handleClickOutside = (event: MouseEvent) => {
          const target = event.target as Node;
          if (
            containerRef.current &&
            !containerRef.current.contains(target)
          ) {
            handleOpenChange(false);
          }
        };
  
        const handleEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            handleOpenChange(false);
          }
        };
  
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
  
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
          document.removeEventListener('keydown', handleEscape);
        };
      }, [open, handleOpenChange]);
  
      // Clone trigger to add click handler
      const triggerElement = React.isValidElement(trigger) ? React.cloneElement(
        trigger as React.ReactElement<Record<string, unknown>>,
        {
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Call original onClick if it exists
            const originalOnClick = (trigger as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>).props?.onClick;
            if (originalOnClick) {
              originalOnClick(e);
            }
            
            // Toggle dropdown
            handleOpenChange(!open);
          },
          'aria-expanded': open,
          'aria-haspopup': 'true',
          ...(disabled && { disabled: disabled })
        }
      ) : trigger;
  
      // Position classes based on your existing CSS patterns
      const getPositionClasses = () => {
        const classes = ['dropdown-menu'];
        
        if (side === 'top') {
          classes.push('dropdown-menu--top');
        }
        
        if (align === 'start') {
          classes.push('dropdown-menu--align-start');
        } else if (align === 'center') {
          classes.push('dropdown-menu--align-center');
        }
        // Default is 'end' which matches your existing right-aligned dropdowns
        
        return classes.join(' ');
      };
  
      return (
        <div
          ref={ref}
          className={cn('dropdown-wrapper', className)}
          {...props}
        >
          <div ref={containerRef} className="dropdown-container">
            {/* Trigger */}
            {triggerElement}
  
            {/* Dropdown Menu - matches your existing pattern */}
            {open && (
              <div className={getPositionClasses()}>
                {children}
              </div>
            )}
          </div>
        </div>
      );
    }
  );
  
  Dropdown.displayName = 'Dropdown';
  
  // ===== DROPDOWN ITEM COMPONENT =====
  export interface DropdownItemProps {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    variant?: 'default' | 'danger';
    icon?: ReactNode;
    className?: string;
  }
  
  export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
    ({ children, onClick, disabled = false, variant = 'default', icon, className, ...props }, ref) => {
      const handleClick = useCallback(() => {
        if (!disabled && onClick) {
          onClick();
        }
      }, [disabled, onClick]);
  
      return (
        <button
          ref={ref}
          type="button"
          className={cn(
            'dropdown-item',
            variant === 'danger' && 'dropdown-item--danger',
            disabled && 'dropdown-item--disabled',
            className
          )}
          onClick={handleClick}
          disabled={disabled}
          {...props}
        >
          {icon && (
            <span className="dropdown-item__icon">
              {icon}
            </span>
          )}
          {children}
        </button>
      );
    }
  );
  
  DropdownItem.displayName = 'DropdownItem';
  
  // ===== SIMPLE DROPDOWN MENU FOR COMMON USE CASES =====
  export interface SimpleDropdownProps {
    trigger: ReactNode;
    items: Array<{
      label: string;
      onClick: () => void;
      icon?: ReactNode;
      disabled?: boolean;
      variant?: 'default' | 'danger';
    }>;
    align?: 'start' | 'center' | 'end';
    side?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    disabled?: boolean;
  }
  
  export const SimpleDropdown = forwardRef<HTMLDivElement, SimpleDropdownProps>(
    ({ trigger, items, align = 'end', side = 'bottom', className, disabled = false }, ref) => {
      return (
        <Dropdown
          ref={ref}
          trigger={trigger}
          align={align}
          side={side}
          className={className}
          disabled={disabled}
        >
          {items.map((item, index) => (
            <DropdownItem
              key={index}
              onClick={item.onClick}
              disabled={item.disabled}
              variant={item.variant}
              icon={item.icon}
            >
              {item.label}
            </DropdownItem>
          ))}
        </Dropdown>
      );
    }
  );
  
  SimpleDropdown.displayName = 'SimpleDropdown';