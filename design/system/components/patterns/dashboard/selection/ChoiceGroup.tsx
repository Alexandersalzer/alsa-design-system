// ===============================================
// FIL 2: src/design-system/components/patterns/selection/ChoiceGroup.tsx
// FIXED - Proper Radio Context Flow + Icon Type Safety
// ===============================================

import React from 'react';
import { RadioGroup, Radio } from '../../../primitives/Radio';
import { Checkbox } from '../../../primitives/Checkbox';
import { Stack } from '../../../layout';
import { Grid } from '../../../layout';
import { Body, Label } from '../../../primitives/Typography';
import { SelectionCard } from './SelectionCard';
import { cn } from '../../../../lib/utils';

export interface ChoiceOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactElement; // ✅ FIXED: Change from ReactNode to ReactElement
  disabled?: boolean;
  content?: React.ReactNode; // För custom card content
}

export interface ChoiceGroupProps {
  /** Type of selection */
  type: 'radio' | 'checkbox';
  /** Available options */
  options: ChoiceOption[];
  /** Current value(s) */
  value: string | string[];
  /** Change handler */
  onChange: (value: string | string[]) => void;
  /** Group label */
  label?: string;
  /** Group description */
  description?: string;
  /** Layout style */
  layout?: 'list' | 'grid' | 'cards';
  /** Size for all items */
  size?: 'sm' | 'md' | 'lg';
  /** Required field */
  required?: boolean;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom className */
  className?: string;
}

export const ChoiceGroup: React.FC<ChoiceGroupProps> = ({
  type,
  options,
  value,
  onChange,
  label,
  description,
  layout = 'list',
  size = 'md',
  required = false,
  error,
  disabled = false,
  className
}) => {
  const isRadio = type === 'radio';
  const selectedValues = Array.isArray(value) ? value : [value];

  const handleRadioChange = (newValue: string) => {
    onChange(newValue);
  };

  const handleCheckboxChange = (optionValue: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : [];
    if (checked) {
      onChange([...currentValues, optionValue]);
    } else {
      onChange(currentValues.filter(v => v !== optionValue));
    }
  };

  const renderOption = (option: ChoiceOption) => {
    const isSelected = selectedValues.includes(option.value);
    const isDisabled = disabled || option.disabled;

    if (layout === 'cards') {
      // Use SelectionCard for card layout
      return (
        <SelectionCard
          key={option.value}
          type={isRadio ? 'radio' : 'checkbox'} // ✅ IMPROVED: Pass correct type
          name={isRadio ? `choice-group-${Math.random()}` : undefined} // ✅ For radio groups
          value={option.value}
          checked={isSelected}
          onChange={(checked) => {
            if (isRadio) {
              if (checked) handleRadioChange(option.value);
            } else {
              handleCheckboxChange(option.value, checked);
            }
          }}
          disabled={isDisabled}
          label={option.label}
          description={option.description}
          icon={option.icon} // ✅ Now type-safe
          size={size}
        >
          {option.content && (
            <div className="mt-2">
              {option.content}
            </div>
          )}
        </SelectionCard>
      );
    }

    // Use native Radio/Checkbox for list/grid layout
    if (isRadio) {
      return (
        <Radio
          key={option.value}
          value={option.value}
          label={option.label}
          description={option.description}
          disabled={isDisabled}
          checked={isSelected}
          size={size}
        />
      );
    } else {
      return (
        <Checkbox
          key={option.value}
          label={option.label}
          description={option.description}
          disabled={isDisabled}
          checked={isSelected}
          size={size}
          onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
        />
      );
    }
  };

  // ✅ FIXED: För radio med grid layout - använd RadioGroup's inbyggda direction
  if (isRadio && layout === 'grid') {
    return (
      <RadioGroup
        label={label}
        description={description}
        error={error}
        required={required}
        size={size}
        name={`choice-group-${Math.random()}`}
        value={typeof value === 'string' ? value : ''}
        onChange={handleRadioChange}
        disabled={disabled}
        className={cn('choice-group', className)}
        direction="horizontal" // ✅ Använd RadioGroup's inbyggda horizontal layout
      >
        {options.map(renderOption)} {/* ✅ Direkt barn till RadioGroup - ingen extra wrapper */}
      </RadioGroup>
    );
  }

  // ✅ FIXED: För radio med list layout - använd RadioGroup's standard vertical layout
  if (isRadio && layout === 'list') {
    return (
      <RadioGroup
        label={label}
        description={description}
        error={error}
        required={required}
        size={size}
        name={`choice-group-${Math.random()}`}
        value={typeof value === 'string' ? value : ''}
        onChange={handleRadioChange}
        disabled={disabled}
        className={cn('choice-group', className)}
        direction="vertical" // ✅ Standard vertical layout
      >
        {options.map(renderOption)} {/* ✅ Direkt barn till RadioGroup */}
      </RadioGroup>
    );
  }

  // ✅ För checkbox eller card layout - custom wrapper (som förut)
  return (
    <div className={cn('choice-group', className)}>
      {label && (
        <Label size={size} weight="semibold" color="primary" className="choice-group__label">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </Label>
      )}
      
      {description && (
        <Body size="sm" color="secondary" className="choice-group__description mb-4">
          {description}
        </Body>
      )}

      {/* ✅ Layout wrapper för non-radio eller card layouts */}
      {layout === 'grid' && type === 'checkbox' ? (
        <Grid columns={3} gap="md" className="choice-group__grid">
          {options.map(renderOption)}
        </Grid>
      ) : layout === 'cards' ? (
        <div className="choice-group__cards">
          <Grid columns={3} gap="md" className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {options.map(renderOption)}
          </Grid>
        </div>
      ) : (
        <Stack spacing="sm" className="choice-group__list">
          {options.map(renderOption)}
        </Stack>
      )}

      {error && (
        <Body size="sm" color="error" className="choice-group__error mt-2">
          {error}
        </Body>
      )}
    </div>
  );
};