// ===============================================
// src/design-system/components/primitives/Picker/Picker.tsx
// ENHANCED - Professional animations with proper timing
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
}

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
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const successId = success ? `${id}-success` : undefined;

  // 🎯 ENHANCED ANIMATION TIMING
  const ANIMATION_DURATION = {
    OPEN: 250,   // --foundation-duration-normal
    CLOSE: 150,  // --foundation-duration-fast
    STAGGER: 20  // Per option delay
  };

  // Handle opening/closing with proper animation timing
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender && !isClosing) {
      // Start closing animation
      setIsClosing(true);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
        setSearchTerm(''); // Clear search on close
        setFocusedIndex(-1); // Reset focus
      }, ANIMATION_DURATION.CLOSE);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender, isClosing]);

  // Filter options based on search term
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected options
  const selectedOptions = multiple 
    ? options.filter(opt => multiValue.includes(opt.value))
    : options.find(opt => opt.value === value);

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
      // Add small delay for visual feedback before closing
      setTimeout(() => setIsOpen(false), 100);
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

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || loading) return;

    switch (e.key) {
      case 'Enter':
        e.preventDefault();
        if (!isOpen) {
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

    if (shouldRender) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [shouldRender]);

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
          ref={ref}
          type="button"
          id={id}
          disabled={disabled || loading}
          className={pickerClasses}
          onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
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

        {shouldRender && !disabled && !loading && (
          <div 
            className={cn(
              "picker-dropdown",
              `picker-dropdown--${variant}`,
              radius === 'sm' && 'picker-dropdown--radius-sm',
              radius === 'lg' && 'picker-dropdown--radius-lg',
              searchable && "picker-dropdown--with-search",
              isClosing && "picker-dropdown--closing"
            )}
            style={{ maxHeight: `${maxHeight}px` }}
            data-multiple={multiple ? "true" : "false"}
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
                      // 🎯 CSS custom property for staggered animation
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