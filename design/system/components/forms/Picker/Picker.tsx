// ===============================================
// src/design-system/components/primitives/Picker/Picker.tsx
// REFACTORED - Uses Popover + Listbox primitives
// ===============================================

import { useState, useRef, useEffect, forwardRef, useId } from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import { Popover } from '../../overlays';
import { Listbox, ListboxItem, ListboxItemText } from '../../lists';
import './Picker.css';

// ===============================================
// TYPES & INTERFACES
// ===============================================

export type PickerSize = 'sm' | 'md' | 'lg';
export type PickerVariant = 'default' | 'compact' | 'full-width' | 'colorful' | 'minimal';
export type PickerRadius = 'sm' | 'md' | 'lg';

export interface PickerOption {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
}

export interface PickerProps {
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  size?: PickerSize;
  variant?: PickerVariant;
  radius?: PickerRadius;
  required?: boolean;
  placeholder?: string;
  options: PickerOption[];
  multiple?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  maxHeight?: number;
  disabled?: boolean;
  loading?: boolean;
  wrapperClassName?: string;
  className?: string;
  value?: string | null;
  multiValue?: string[];
  onChange?: (value: string | null) => void;
  onMultiChange?: (values: string[]) => void;
  renderOption?: (option: PickerOption, isSelected: boolean) => React.ReactNode;
  id?: string;
}

// ===============================================
// PICKER COMPONENT
// ===============================================

export const Picker = forwardRef<HTMLButtonElement, PickerProps>(({
  label,
  description,
  error,
  success,
  size = 'md',
  variant = 'default',
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
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  
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

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current && !loading) {
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

  return (
    <div className={wrapperClasses}>
      {label && (
        <label htmlFor={id} className="picker-label">
          {label}
          {required && (
            <span className="picker-label__required" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {description && (
        <div id={descriptionId} className="picker-description">
          {description}
        </div>
      )}

      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
        size={size}
      >
        <Popover.Trigger asChild>
          <button
            ref={ref}
            type="button"
            id={id}
            disabled={disabled || loading}
            className={pickerClasses}
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
        </Popover.Trigger>

        <Popover.Positioner>
          <Popover.Content 
            maxHeight={maxHeight}
            className={cn(
              'picker-content',
              radius === 'sm' && 'picker-content--radius-sm',
              radius === 'lg' && 'picker-content--radius-lg'
            )}
          >
            {searchable && (
              <div className="picker-search">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(
                    "picker-search-input",
                    radius === 'sm' && 'picker-search-input--radius-sm',
                    radius === 'lg' && 'picker-search-input--radius-lg'
                  )}
                />
              </div>
            )}
            
            <Listbox 
              role="listbox"
              size={size}
              spacing="xs"
              surface="raised"
            >
              {filteredOptions.length === 0 ? (
                <ListboxItem 
                  interactive={false}
                  className="picker-option-empty"
                >
                  {searchTerm ? 'No matching options found' : 'No options available'}
                </ListboxItem>
              ) : (
                filteredOptions.map((option, index) => (
                  <ListboxItem
                    key={option.value}
                    role="option"
                    size={size}
                    selected={isSelected(option)}
                    disabled={option.disabled}
                    focused={index === focusedIndex}
                    onClick={() => handleSelect(option)}
                    trailing={
                      isSelected(option) && multiple ? (
                        <Icon color='secondary' size='sm'>
                          <CheckIcon />
                        </Icon>
                      ) : undefined
                    }
                    aria-selected={isSelected(option)}
                    className={cn(
                      radius === 'sm' && 'picker-option--radius-sm',
                      radius === 'lg' && 'picker-option--radius-lg'
                    )}
                    style={{
                      '--option-index': index
                    } as React.CSSProperties}
                  >
                    {renderOption ? (
                      renderOption(option, isSelected(option))
                    ) : option.description ? (
                      <ListboxItemText
                        title={option.label}
                        description={option.description}
                      />
                    ) : (
                      option.label
                    )}
                  </ListboxItem>
                ))
              )}
            </Listbox>
          </Popover.Content>
        </Popover.Positioner>
      </Popover>

      {error && (
        <div id={errorId} className="picker-error" role="alert">
          {error}
        </div>
      )}

      {success && !error && (
        <div id={successId} className="picker-success">
          {success}
        </div>
      )}
    </div>
  );
});

Picker.displayName = 'Picker';