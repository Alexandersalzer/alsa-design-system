// ===============================================
// src/design-system/components/patterns/selection/OptionGrid.tsx  
// Styled to match the original LiveDesignPanel design
// ===============================================

import React from 'react';
import { SelectionCard } from './SelectionCard';
import { Grid } from '../page/Grid';
import { Stack } from '../../../layout';
import { H4, Body } from '../../../primitives/Typography';
import { Icon } from '../../../primitives/Icon';
import { cn } from '../../../../lib/utils';
import { CheckIcon } from '@heroicons/react/24/outline';

export interface OptionItem {
  id: string;
  name: string;
  value: string;
  description?: string;
  icon?: React.ReactElement;
  preview?: React.ReactNode;
  disabled?: boolean;
  hex?: string; // For color options
  px?: string;  // For radius options
  family?: string; // For font options
}

export interface OptionSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactElement;
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const OptionSection: React.FC<OptionSectionProps> = ({
  title,
  description,
  icon,
  action,
  children,
  className
}) => {
  return (
    <div className={cn('option-section', className)}>
      <div className="flex items-center gap-3 mb-4">
        {icon && (
          <Icon size="md" color="accent">
            {icon}
          </Icon>
        )}
        <div>
          <H4>{title}</H4>
          {description && (
            <Body size="sm" color="secondary">{description}</Body>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export interface OptionGridProps {
  options: OptionItem[];
  selected: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'colors' | 'radius' | 'fonts';
  className?: string;
}

export const OptionGrid: React.FC<OptionGridProps> = ({
  options,
  selected,
  onChange,
  columns = 3,
  variant = 'colors',
  className
}) => {
  const gridClassName = {
    1: 'grid-cols-1',
    2: 'grid-cols-2', 
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }[columns];

  // Color variant - matches original design
  if (variant === 'colors') {
    return (
      <div className={cn('grid gap-3', gridClassName, className)}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.value)}
            className="group relative p-3 border-2 transition-all"
            style={{
              borderColor: selected === option.value ? 'var(--accent-500)' : 'var(--border-default)',
              backgroundColor: selected === option.value ? 'var(--accent-50)' : 'var(--surface-card)',
              borderRadius: 'var(--radius-button)'
            }}
          >
            {selected === option.value && (
              <div 
                className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--accent-500)',
                  borderRadius: '50%'
                }}
              >
                <Icon size="xs" color="button-primary">
                  <CheckIcon />
                </Icon>
              </div>
            )}
            <div
              className="w-full h-8 mb-2"
              style={{ 
                backgroundColor: option.hex,
                borderRadius: 'var(--radius-button)'
              }}
            />
            <div 
              className="text-sm font-medium"
              style={{
                color: 'var(--text-primary)'
              }}
            >
              {option.name}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Radius variant - matches original design with grid layout
  if (variant === 'radius') {
    return (
      <div className={cn('grid gap-2', gridClassName, className)}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.value)}
            className="group relative p-3 border-2 transition-all"
            style={{
              borderColor: selected === option.value ? 'var(--accent-500)' : 'var(--border-default)',
              backgroundColor: selected === option.value ? 'var(--accent-50)' : 'var(--surface-card)',
              borderRadius: 'var(--radius-button)'
            }}
          >
            {selected === option.value && (
              <div 
                className="absolute -top-2 -right-2 w-4 h-4 flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--accent-500)',
                  borderRadius: '50%'
                }}
              >
                <Icon size="xs" color="button-primary">
                  <CheckIcon />
                </Icon>
              </div>
            )}
            <div className="flex flex-col items-center gap-2 mb-2">
              <div
                className="w-6 h-4 bg-gray-300"
                style={{ borderRadius: option.px }}
              />
              <div
                className="w-4 h-2 bg-gray-400"
                style={{ borderRadius: option.px }}
              />
            </div>
            <div 
              className="text-xs font-medium"
              style={{
                color: selected === option.value ? 'var(--accent-700)' : 'var(--text-primary)'
              }}
            >
              {option.name}
            </div>
          </button>
        ))}
      </div>
    );
  }

  // Fonts variant - matches original design
  if (variant === 'fonts') {
    return (
      <Stack spacing="sm" className={className}>
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onChange(option.value)}
            className="w-full p-4 border-2 transition-all text-left relative"
            style={{
              borderColor: selected === option.value ? 'var(--accent-500)' : 'var(--border-default)',
              backgroundColor: selected === option.value ? 'var(--accent-50)' : 'var(--surface-card)',
              borderRadius: 'var(--radius-button)'
            }}
          >
            {selected === option.value && (
              <div 
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center"
                style={{ 
                  backgroundColor: 'var(--accent-500)',
                  borderRadius: '50%'
                }}
              >
                <Icon size="xs" color="button-primary">
                  <CheckIcon />
                </Icon>
              </div>
            )}
            <div className="flex items-center gap-3">
              <div
                className="text-2xl font-medium"
                style={{ 
                  fontFamily: option.family,
                  color: 'var(--text-primary)'
                }}
              >
                Aa
              </div>
              <div 
                className="font-medium"
                style={{
                  color: selected === option.value ? 'var(--accent-700)' : 'var(--text-primary)'
                }}
              >
                {option.name}
              </div>
            </div>
          </button>
        ))}
      </Stack>
    );
  }

  return null;
};

// Combined component for easy usage
export interface OptionGridSectionProps extends OptionSectionProps {
  options: OptionItem[];
  selected: string;
  onChange: (value: string) => void;
  columns?: 1 | 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'colors' | 'radius' | 'fonts';
  gridClassName?: string;
}

export const OptionGridSection: React.FC<OptionGridSectionProps> = ({
  title,
  description,
  icon,
  action,
  options,
  selected,
  onChange,
  columns = 3,
  size = 'md',
  variant = 'colors',
  className,
  gridClassName,
  children,
  ...props
}) => {
  return (
    <OptionSection
      title={title}
      description={description}
      icon={icon}
      action={action}
      className={className}
      {...props}
    >
      <OptionGrid
        options={options}
        selected={selected}
        onChange={onChange}
        columns={columns}
        variant={variant}
        className={gridClassName}
      />
    </OptionSection>
  );
};