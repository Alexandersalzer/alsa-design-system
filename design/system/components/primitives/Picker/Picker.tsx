// ===============================================
// src/design-system/components/primitives/Picker/Picker.tsx
// ENHANCED - Apple-style scroll lock + Smart positioning
// ===============================================

import { useState, useRef, useEffect, forwardRef, useId } from 'react';
import { SearchInput } from '../../../components/primitives/Input';
import { cn } from '../../../lib/utils';
import { Icon } from '../Icon/Icon';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import './Picker.css';

// Import your design system types
export type PickerSize = 'sm' | 'md' | 'lg';
export type PickerVariant = 'default' | 'compact';
export type PickerRadius = 'sm' | 'md' | 'lg';

export interface PickerOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface PickerProps {
  /** The label text for the picker */
  label?: string;
  /** Helper text displayed below the label */
  description?: string;
  /** Error message to display */
  error?: string;
  /** Success message to display */
  success?: string;
  /** Size variant */
  size?: PickerSize;
  /** Visual variant */
  variant?: PickerVariant;
  /** Radius size variant */
  radius?: PickerRadius;
  /** Required field indicator */
  required?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Picker options */
  options: PickerOption[];
  /** Enable multi-select mode */
  multiple?: boolean;
  /** Enable search functionality */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Maximum height of dropdown */
  maxHeight?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes for the wrapper */
  wrapperClassName?: string;
  /** Additional CSS classes for the picker */
  className?: string;
  /** Controlled value for single select */
  value?: string | null;
  /** Controlled value for multi select */
  multiValue?: string[];
  /** Change handler for single select */
  onChange?: (value: string | null) => void;
  /** Change handler for multi select */
  onMultiChange?: (values: string[]) => void;
  /** Custom render function for options */
  renderOption?: (option: PickerOption, isSelected: boolean) => React.ReactNode;
  /** ID for the picker */
  id?: string;
  /** Disable scroll locking (not recommended) */
  disableScrollLock?: boolean;
}

// Utility functions for scroll locking (Apple-style)
const useScrollLock = (isLocked: boolean, disabled: boolean = false) => {
  const [originalStyle, setOriginalStyle] = useState<string>('');
  const [originalScrollbarWidth, setOriginalScrollbarWidth] = useState<string>('');

  useEffect(() => {
    if (disabled) return;

    if (isLocked) {
      // Store original styles
      const body = document.body;
      const html = document.documentElement;
      
      setOriginalStyle(body.style.overflow);
      setOriginalScrollbarWidth(body.style.paddingRight);

      // Calculate scrollbar width
      const scrollbarWidth = window.innerWidth - html.clientWidth;
      
      // Apply scroll lock with scrollbar compensation
      body.style.overflow = 'hidden';
      body.style.paddingRight = `${scrollbarWidth}px`;
      
      // Prevent rubber band scrolling on iOS
      const preventDefault = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefault);
      };
    } else {
      // Restore original styles
      const body = document.body;
      body.style.overflow = originalStyle;
      body.style.paddingRight = originalScrollbarWidth;
    }
  }, [isLocked, disabled, originalStyle, originalScrollbarWidth]);
};

// Smart positioning utility
const calculateDropdownPosition = (
  triggerElement: HTMLElement,
  dropdownHeight: number,
  offset: number = 8
) => {
  const triggerRect = triggerElement.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;
  
  const spaceAbove = triggerRect.top;
  const spaceBelow = viewportHeight - triggerRect.bottom;
  
  // Determine if dropdown should open upward or downward
  const shouldOpenUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
  
  return {
    shouldOpenUpward,
    spaceAbove,
    spaceBelow,
    maxHeight: shouldOpenUpward 
      ? Math.min(dropdownHeight, spaceAbove - offset)
      : Math.min(dropdownHeight, spaceBelow - offset)
  };
};

export const Picker = forwardRef<HTMLButtonElement, PickerProps>(({
  label,
  description,
  error,
  success,
  size = 'md',
  variant = 'compact',
  radius = 'md',
  required = false,
  disabled = false,
  loading = false,
  placeholder = "Select an option...",
  options = [],
  multiple = false,
  searchable = false,
  searchPlaceholder = "Search options...",
  maxHeight = 400,
  wrapperClassName,
  className,
  value,
  multiValue = [],
  onChange,
  onMultiChange,
  renderOption,
  id: providedId,
  disableScrollLock = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState<{
    shouldOpenUpward: boolean;
    maxHeight: number;
  }>({ shouldOpenUpward: false, maxHeight: maxHeight });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const successId = success ? `${id}-success` : undefined;

  // Apply scroll lock when dropdown is open
  useScrollLock(isOpen, disableScrollLock);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options
  const selectedOptions = multiple 
    ? options.filter(opt => multiValue.includes(opt.value))
    : options.find(opt => opt.value === value);

  // Calculate dropdown position when opening
  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const position = calculateDropdownPosition(triggerRef.current, maxHeight);
      setDropdownPosition(position);
    }
  };

  // Handle selection
  const handleSelect = (option: PickerOption) => {
    if (option.disabled || loading) return;

    if (multiple) {
      const currentValues = multiValue || [];
      const isSelected = currentValues.includes(option.value);
      const newValues = isSelected
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      onMultiChange?.(newValues);
    } else {
      onChange?.(option.value);
      // Close immediately for single select
      setIsOpen(false);
    }
  };

  // Check if option is selected
  const isSelected = (option: PickerOption) => {
    if (multiple) {
      return multiValue.includes(option.value);
    }
    return value === option.value;
  };

  // Get display text
  const getDisplayText = () => {
    if (loading) return "Loading...";
    
    if (multiple) {
      const selected = selectedOptions as PickerOption[];
      if (selected.length === 0) return placeholder;
      if (selected.length === 1) return selected[0].label;
      return `${selected.length} selected`;
    }
    const selected = selectedOptions as PickerOption | undefined;
    return selected ? selected.label : placeholder;
  };

  // Handle opening/closing with position calculation
  const handleToggle = () => {
    if (disabled || loading) return;
    
    if (!isOpen) {
      updateDropdownPosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
          updateDropdownPosition();
          setIsOpen(true);
        } else if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          updateDropdownPosition();
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Update position on scroll/resize when open
  useEffect(() => {
    if (!isOpen) return;

    const handlePositionUpdate = () => {
      updateDropdownPosition();
    };

    window.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
    };
  }, [isOpen, maxHeight]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current && !loading) {
      // Small delay to ensure dropdown is rendered
      setTimeout(() => {
        searchRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable, loading]);

  // Reset focused index when search changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm]);

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setFocusedIndex(-1);
    }
  }, [isOpen]);

  // Build classes using your design system
  const wrapperClasses = cn(
    'picker-wrapper',
    `picker-wrapper--${size}`,
    `picker-wrapper--${variant}`,
    radius === 'sm' && 'picker-wrapper--radius-sm',
    radius === 'lg' && 'picker-wrapper--radius-lg',
    disabled && 'picker-wrapper--disabled',
    error && 'picker-wrapper--error',
    success && 'picker-wrapper--success',
    wrapperClassName
  );

  const pickerClasses = cn(
    'picker',
    `picker--${size}`,
    `picker--${variant}`,
    radius === 'sm' && 'picker--radius-sm',
    radius === 'lg' && 'picker--radius-lg',
    isOpen && 'picker--open',
    loading && 'picker--loading',
    error && 'picker--error',
    success && 'picker--success',
    disabled && 'picker--disabled',
    className
  );

  const dropdownClasses = cn(
    "picker-dropdown",
    `picker-dropdown--${variant}`,
    radius === 'sm' && 'picker-dropdown--radius-sm',
    radius === 'lg' && 'picker-dropdown--radius-lg',
    searchable && "picker-dropdown--with-search",
    dropdownPosition.shouldOpenUpward && "picker-dropdown--upward"
  );

  return (
    <div 
      className={wrapperClasses} 
      ref={containerRef}
      data-multiple={multiple ? "true" : "false"}
    >
      {label && (
        <label
          htmlFor={id}
          className="picker-label"
        >
          {label}
          {required && (
            <span className="picker-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div
          id={descriptionId}
          className="picker-description"
        >
          {description}
        </div>
      )}

      <div className="picker-container">
        <button
          ref={(node) => {
            // Use a type assertion to allow assignment
            (triggerRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          type="button"
          id={id}
          disabled={disabled || loading}
          className={pickerClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={cn(descriptionId, errorId, successId)}
          aria-invalid={error ? 'true' : 'false'}
          aria-busy={loading}
          {...props}
        >
          <span className="picker-value">
            {getDisplayText()}
          </span>
          <div className="picker-icon">
            <Icon color='secondary' size='sm'>
              <ChevronDownIcon />
            </Icon>
          </div>
        </button>

        {/* Smart positioned dropdown */}
        {isOpen && !disabled && !loading && (
          <div 
            ref={dropdownRef}
            className={dropdownClasses}
            style={{ 
              maxHeight: `${dropdownPosition.maxHeight}px`,
              ...(dropdownPosition.shouldOpenUpward && {
                bottom: '100%',
                top: 'auto',
                marginBottom: 'var(--foundation-space-1)',
                marginTop: '0'
              })
            }}
            data-multiple={multiple ? "true" : "false"}
            data-position={dropdownPosition.shouldOpenUpward ? "upward" : "downward"}
          >
            {searchable && (
              <div className="picker-search">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={cn(
                    "picker-search-input",
                    radius === 'sm' && 'picker-search-input--radius-sm',
                    radius === 'lg' && 'picker-search-input--radius-lg'
                  )}
                />
              </div>
            )}
            
            <ul className="picker-options" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="picker-option picker-option--empty">
                  <div className="picker-option-content">
                    {searchTerm ? 'No matching options found' : 'No options available'}
                  </div>
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    className={cn(
                      'picker-option',
                      radius === 'sm' && 'picker-option--radius-sm',
                      radius === 'lg' && 'picker-option--radius-lg',
                      option.disabled && 'picker-option--disabled',
                      isSelected(option) && 'picker-option--selected',
                      index === focusedIndex && 'picker-option--focused'
                    )}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={isSelected(option)}
                    style={{
                      // CSS custom property for staggered animation
                      '--option-index': index
                    } as React.CSSProperties}
                  >
                    {renderOption ? (
                      renderOption(option, isSelected(option))
                    ) : (
                      <div className="picker-option-content">
                        <div className="picker-option-label">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="picker-option-description">
                            {option.description}
                          </div>
                        )}
                      </div>
                    )}
                    {isSelected(option) && multiple && (
                      <div className="picker-option-check">
                        <Icon color='secondary' size='sm'>
                          <CheckIcon />
                        </Icon>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>

      {error && (
        <div
          id={errorId}
          className="picker-error"
          role="alert"
        >
          {error}
        </div>
      )}

      {success && !error && (
        <div
          id={successId}
          className="picker-success"
        >
          {success}
        </div>
      )}
    </div>
  );
});

Picker.displayName = 'Picker';