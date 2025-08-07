// ===============================================
// src/design-system/components/patterns/selection/OptionGrid.tsx
// Clean, reusable option grid component using design system tokens
// ===============================================

import React from 'react';
import { SelectionCard } from './SelectionCard';
import { Grid } from '../page/Grid';
import { Stack } from '../page/Stack';
import { H4, Body } from '../../../primitives/Typography';
import { Icon } from '../../../primitives/Icon';
import { cn } from '../../../../lib/utils';

export interface OptionItem {
  id: string;
  name: string;
  value: string;
  description?: string;
  icon?: React.ReactElement; // Must be ReactElement for Icon component
  preview?: React.ReactNode;
  disabled?: boolean;
}

export interface OptionSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactElement; // Must be ReactElement for Icon component
  action?: React.ReactNode;
  children: React.ReactNode;
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
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
        {action}
      </div>
      {children}
    </div>
  );
};

export interface OptionGridProps {
  options: OptionItem[];
  selected: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'detailed';
  className?: string;
}

export const OptionGrid: React.FC<OptionGridProps> = ({
  options,
  selected,
  onChange,
  columns = 3,
  size = 'md',
  variant = 'detailed',
  className
}) => {
  const gridClassName = {
    2: 'grid-cols-2',
    3: 'grid-cols-3', 
    4: 'grid-cols-4'
  }[columns];

  if (variant === 'compact') {
    return (
      <Grid 
        columns={columns} 
        gap="sm" 
        className={cn(gridClassName, className)}
      >
        {options.map((option) => (
          <SelectionCard
            key={option.id}
            selected={selected === option.value}
            onClick={() => onChange(option.value)}
            disabled={option.disabled}
            size={size}
          >
            <div className="text-center">
              {option.preview && (
                <div className="mb-2">
                  {option.preview}
                </div>
              )}
              <Body size="sm" weight="medium">
                {option.name}
              </Body>
            </div>
          </SelectionCard>
        ))}
      </Grid>
    );
  }

  return (
    <Grid 
      columns={columns} 
      gap="md" 
      className={cn(gridClassName, className)}
    >
      {options.map((option) => (
        <SelectionCard
          key={option.id}
          selected={selected === option.value}
          onClick={() => onChange(option.value)}
          disabled={option.disabled}
          size={size}
          icon={option.icon && (
            <Icon size="md" color="accent">
              {option.icon}
            </Icon>
          )}
        >
          <div>
            {option.preview && (
              <div className="mb-3">
                {option.preview}
              </div>
            )}
            <Body size={size} weight="medium" color="primary">
              {option.name}
            </Body>
            {option.description && (
              <Body size="sm" color="secondary" className="mt-1">
                {option.description}
              </Body>
            )}
          </div>
        </SelectionCard>
      ))}
    </Grid>
  );
};

// Combined component for easy usage
export interface OptionGridSectionProps extends OptionSectionProps {
  options: OptionItem[];
  selected: string;
  onChange: (value: string) => void;
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'compact' | 'detailed';
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
  variant = 'detailed',
  className,
  gridClassName,
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
        size={size}
        variant={variant}
        className={gridClassName}
      />
    </OptionSection>
  );
};