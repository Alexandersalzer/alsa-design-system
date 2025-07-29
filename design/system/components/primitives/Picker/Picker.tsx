// ===============================================
// src/design-system/components/primitives/Picker/Picker.tsx
// PICKER COMPONENT - Complete with proper design system integration
// ===============================================

import { useState, useRef, useEffect, forwardRef, useId } from 'react';
import { SearchInput } from '../../../components/primitives/Input';
import { cn } from '../../../lib/utils';
import { Icon } from '../Icon/Icon';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';

// Import your design system types
export type PickerSize = 'sm' | 'md' | 'lg';
export type PickerVariant = 'default' | 'compact';

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
  required = false,
  disabled = false,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const generatedId = useId();
  const id = providedId || generatedId;
  const descriptionId = description ? `${id}-description` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const successId = success ? `${id}-success` : undefined;

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
    if (option.disabled) return;

    if (multiple) {
      const currentValues = multiValue || [];
      const isSelected = currentValues.includes(option.value);
      const newValues = isSelected
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      onMultiChange?.(newValues);
    } else {
      onChange?.(option.value);
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
    if (disabled) return;

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
        setSearchTerm('');
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Reset focused index when search changes
  useEffect(() => {
    setFocusedIndex(-1);
  }, [searchTerm]);

  // Build classes using your design system
  const wrapperClasses = cn(
    'picker-wrapper',
    `picker-wrapper--${size}`,
    `picker-wrapper--${variant}`,
    disabled && 'picker-wrapper--disabled',
    error && 'picker-wrapper--error',
    success && 'picker-wrapper--success',
    wrapperClassName
  );

  const pickerClasses = cn(
    'picker',
    `picker--${size}`,
    `picker--${variant}`,
    isOpen && 'picker--open',
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
          disabled={disabled}
          className={pickerClasses}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-describedby={cn(descriptionId, errorId, successId)}
          aria-invalid={error ? 'true' : 'false'}
          {...props}
        >
          <span className="picker-value">
            {getDisplayText()}
          </span>
          <div className="picker-icon">
            <Icon color='secondary'><ChevronDownIcon/></Icon>
          </div>
        </button>

        {isOpen && !disabled && (
          <div 
            className={cn(
              "picker-dropdown",
              `picker-dropdown--${variant}`,
              searchable && "picker-dropdown--with-search"
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
                  className="picker-search-input"
                />
              </div>
            )}
            
            <ul className="picker-options" role="listbox">
              {filteredOptions.length === 0 ? (
                <li className="picker-option picker-option--empty">
                  <div className="picker-option-content">
                    No options found
                  </div>
                </li>
              ) : (
                filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    className={cn(
                      'picker-option',
                      option.disabled && 'picker-option--disabled',
                      isSelected(option) && 'picker-option--selected',
                      index === focusedIndex && 'picker-option--focused'
                    )}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={isSelected(option)}
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
                        <Icon color='secondary'><CheckIcon></CheckIcon></Icon>
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