// ===============================================
// Stats/Stats.tsx
// STATS COMPONENT PATTERN - Multiple variants for displaying statistics
// Uses: VStack, HStack, Box, Card, Typography
// ===============================================

import React from 'react';
import {
    Typography, 
    TypographyColor,
} from '../../../components';
import {
    VStack,
    HStack,
    Box,
    Card,
    Grid,
} from '../../../components/layout';
import { Icon, IconColor } from '../../../components/media/Icon';
import { CountUp } from '../../../components/animations/CountUp/CountUp';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, patternProps, useMapComponents, getPatternOrder } from '../../../core/utils/props';

import './Stats.css';

// ===== TYPE DEFINITIONS =====

export interface StatAnimation {
  type: 'countUp';
  settings: {
    start?: number;
    end: number;
    suffix?: string;
    prefix?: string;
    separator?: string;
    duration?: number;
    enableScrollTrigger?: boolean;
    triggerOffset?: number;
  };
}

export interface StatItem {
  id: string;
  componentKey: string;
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactElement;
  logo?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
  };
  animation?: StatAnimation;
}

export type StatsVariant =
  | 'centered'
  | 'with-separator'
  | 'with-bottom-border'
  | 'with-top-border'
  | 'with-left-border'
  | 'with-card'
  | 'with-icon'
  | 'with-logo';

export interface StatsProps {
  className?: string;
  stats: StatItem[];
  variant?: StatsVariant;
  
  // Typography options
  valueVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'h1' | 'h2' | 'h3';
  valueWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  valueColor?: TypographyColor;
  
  labelVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'label-lg' | 'label-md' | 'label-sm';
  labelWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  labelColor?: TypographyColor;
  
  descriptionVariant?: 'body-sm' | 'body-xs' | 'label-sm' | 'label-xs';
  descriptionColor?: TypographyColor;
  
  // Layout options
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end';
  
  // Grid layout - forces CSS grid with specified columns
  columns?: 1 | 2 | 3 | 4;
  
  // Grid gap when using columns
  gridGap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
  // Card options (for with-card variant)
  cardVariant?: 'default' | 'elevated' | 'outlined' | 'solid';
  cardPadding?: 'sm' | 'md' | 'lg';
  
  // Icon options (for with-icon variant)
  iconSize?: 'sm' | 'md' | 'lg';
  iconColor?: IconColor;
  
  // Spacing below component
  marginBottom?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

// ===== STAT ITEM COMPONENTS =====

interface StatItemComponentProps {
  stat: StatItem;
  valueVariant: NonNullable<StatsProps['valueVariant']>;
  valueWeight: NonNullable<StatsProps['valueWeight']>;
  valueColor: TypographyColor;
  labelVariant: NonNullable<StatsProps['labelVariant']>;
  labelWeight: NonNullable<StatsProps['labelWeight']>;
  labelColor: TypographyColor;
  descriptionVariant?: NonNullable<StatsProps['descriptionVariant']>;
  descriptionColor?: TypographyColor;
  spacing: NonNullable<StatsProps['spacing']>;
  align: NonNullable<StatsProps['align']>;
  iconSize?: NonNullable<StatsProps['iconSize']>;
  iconColor?: IconColor;
}

// Helper to render stat value with optional CountUp animation
const StatValue: React.FC<{
  stat: StatItem;
  valueVariant: NonNullable<StatsProps['valueVariant']>;
  valueWeight: NonNullable<StatsProps['valueWeight']>;
  valueColor: TypographyColor;
}> = ({ stat, valueVariant, valueWeight, valueColor }) => {
  // If animation is configured, use CountUp
  if (stat.animation?.type === 'countUp') {
    const { settings } = stat.animation;
    return (
      <CountUp
        end={settings.end}
        start={settings.start}
        suffix={settings.suffix}
        prefix={settings.prefix}
        separator={settings.separator}
        duration={settings.duration}
        enableScrollTrigger={settings.enableScrollTrigger}
        triggerOffset={settings.triggerOffset}
        variant={valueVariant}
        weight={valueWeight}
        color={valueColor}
        data-component-key={stat.componentKey}
      />
    );
  }

  // Default: static value
  return (
    <Typography
      variant={valueVariant}
      weight={valueWeight}
      color={valueColor}
      data-component-key={stat.componentKey}
    >
      {stat.value}
    </Typography>
  );
};

// Centered variant - Simple centered stat
const StatCentered: React.FC<StatItemComponentProps> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  descriptionVariant,
  descriptionColor,
  spacing,
  align
}) => (
  <VStack spacing={spacing} align={align}>
    <StatValue
      stat={stat}
      valueVariant={valueVariant}
      valueWeight={valueWeight}
      valueColor={valueColor}
    />
    <Typography
      variant={labelVariant}
      weight={labelWeight}
      color={labelColor}
      data-component-key={stat.componentKey}
    >
      {stat.label}
    </Typography>
    {stat.description && descriptionVariant && (
      <Typography
        variant={descriptionVariant}
        color={descriptionColor || 'tertiary'}
        data-component-key={stat.componentKey}
      >
        {stat.description}
      </Typography>
    )}
  </VStack>
);

// With Separator variant - Stats separated by vertical dividers
const StatWithSeparator: React.FC<StatItemComponentProps & { isLast?: boolean }> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  spacing,
  align,
  isLast
}) => (
  <HStack spacing="lg" align="center" className="stat-with-separator">
    <VStack spacing={spacing} align={align}>
      <StatValue
        stat={stat}
        valueVariant={valueVariant}
        valueWeight={valueWeight}
        valueColor={valueColor}
      />
      <Typography
        variant={labelVariant}
        weight={labelWeight}
        color={labelColor}
        data-component-key={stat.componentKey}
      >
        {stat.label}
      </Typography>
    </VStack>
    {!isLast && (
      <Box
        style={{
          width: '1px',
          height: '48px',
          backgroundColor: 'var(--border-subtle)'
        }}
        className="stat-separator"
      />
    )}
  </HStack>
);

// With Bottom Border variant
const StatWithBottomBorder: React.FC<StatItemComponentProps> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  spacing,
  align
}) => (
  <Box
    padding="md"
    style={{
      borderBottom: '2px solid var(--border-subtle)'
    }}
  >
    <VStack spacing={spacing} align={align}>
      <Typography
        variant={valueVariant}
        weight={valueWeight}
        color={valueColor}
      >
        {stat.value}
      </Typography>
      <Typography
        variant={labelVariant}
        weight={labelWeight}
        color={labelColor}
      >
        {stat.label}
      </Typography>
    </VStack>
  </Box>
);

// With Top Border variant
const StatWithTopBorder: React.FC<StatItemComponentProps> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  spacing,
  align
}) => (
  <Box
    padding="md"
    style={{
      borderTop: '3px solid var(--border-accent)',
      paddingTop: 'var(--space-md)'
    }}
  >
    <VStack spacing={spacing} align={align}>
      <Typography
        variant={valueVariant}
        weight={valueWeight}
        color={valueColor}
      >
        {stat.value}
      </Typography>
      <Typography
        variant={labelVariant}
        weight={labelWeight}
        color={labelColor}
      >
        {stat.label}
      </Typography>
    </VStack>
  </Box>
);

// With Left Border variant
const StatWithLeftBorder: React.FC<StatItemComponentProps> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  spacing,
  align
}) => (
  <Box
    padding="md"
    className="stat--left-border-responsive"
    style={{
      borderLeft: '4px solid var(--border-accent)',
      paddingLeft: 'var(--space-md)'
    }}
  >
    <VStack spacing={spacing} align={align}>
      <Typography
        variant={valueVariant}
        weight={valueWeight}
        color={valueColor}
      >
        {stat.value}
      </Typography>
      <Typography
        variant={labelVariant}
        weight={labelWeight}
        color={labelColor}
      >
        {stat.label}
      </Typography>
    </VStack>
  </Box>
);

// With Card variant
const StatWithCard: React.FC<StatItemComponentProps & { 
  cardVariant: NonNullable<StatsProps['cardVariant']>;
  cardPadding: NonNullable<StatsProps['cardPadding']>;
}> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  descriptionVariant,
  descriptionColor,
  spacing,
  align,
  cardVariant,
  cardPadding
}) => (
  <Card
    variant={cardVariant}
    padding={cardPadding}
  >
    <VStack spacing={spacing} align={align}>
      <Typography
        variant={valueVariant}
        weight={valueWeight}
        color={valueColor}
      >
        {stat.value}
      </Typography>
      <Typography
        variant={labelVariant}
        weight={labelWeight}
        color={labelColor}
      >
        {stat.label}
      </Typography>
      {stat.description && descriptionVariant && (
        <Typography
          variant={descriptionVariant}
          color={descriptionColor || 'tertiary'}
        >
          {stat.description}
        </Typography>
      )}
    </VStack>
  </Card>
);

// With Icon variant - Prominent icon above stat
const StatWithIcon: React.FC<StatItemComponentProps> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  descriptionVariant,
  descriptionColor,
  spacing,
  align,
  iconSize = 'lg',
  iconColor = 'accent'
}) => (
  <VStack spacing={spacing} align={align}>
    {stat.icon && (
      <Box
        padding="sm"
        radius="lg"
        bg="hover"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Icon
          size={iconSize}
          color={iconColor}
        >
          {stat.icon}
        </Icon>
      </Box>
    )}
    <Typography
      variant={valueVariant}
      weight={valueWeight}
      color={valueColor}
      data-component-key={stat.componentKey}
    >
      {stat.value}
    </Typography>
    <Typography
      variant={labelVariant}
      weight={labelWeight}
      color={labelColor}
      data-component-key={stat.componentKey}
    >
      {stat.label}
    </Typography>
    {stat.description && descriptionVariant && (
      <Typography
        variant={descriptionVariant}
        color={descriptionColor || 'tertiary'}
        data-component-key={stat.componentKey}
      >
        {stat.description}
      </Typography>
    )}
  </VStack>
);

// With Logo variant - Company logo with stat
const StatWithLogo: React.FC<StatItemComponentProps> = ({
  stat,
  valueVariant,
  valueWeight,
  valueColor,
  labelVariant,
  labelWeight,
  labelColor,
  spacing,
  align
}) => (
  <VStack spacing={spacing} align={align}>
    {stat.logo && (
      <Box
        className="stat-logo-wrapper"
        style={{
          width: '80px',
          height: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        <img
          src={stat.logo}
          alt={stat.label}
          className="stat-logo"
        />
      </Box>
    )}
    <Typography
      variant={valueVariant}
      weight={valueWeight}
      color={valueColor}
      data-component-key={stat.componentKey}
    >
      {stat.value}
    </Typography>
    <Typography
      variant={labelVariant}
      weight={labelWeight}
      color={labelColor}
      data-component-key={stat.componentKey}
    >
      {stat.label}
    </Typography>
  </VStack>
);

// ===== MAIN STATS COMPONENT =====

export const Stats: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getComponent = componentProps(components);
  const getPatternProps = patternProps(patternNode);
  const mapComponentsOfType = useMapComponents(components);
  const componentOrder = getPatternOrder(patternNode);

  // Extract pattern props with defaults
  const {
    className,
    variant = 'centered',
    valueVariant = 'display-md',
    valueWeight = 'bold',
    valueColor = 'primary',
    labelVariant = 'body-md',
    labelWeight = 'medium',
    labelColor = 'secondary',
    descriptionVariant = 'body-sm',
    descriptionColor = 'tertiary',
    spacing = 'sm',
    align = 'center',
    columns,
    gridGap = 'xl',
    cardVariant = 'elevated',
    cardPadding = 'lg',
    iconSize = 'lg',
    iconColor = 'accent',
    marginBottom = 'none',
  } = getPatternProps();
  
  // Map marginBottom to CSS variable
  const marginBottomMap: Record<string, string> = {
    'none': '0',
    'sm': 'var(--foundation-space-4, 16px)',
    'md': 'var(--foundation-space-6, 24px)',
    'lg': 'var(--foundation-space-8, 32px)',
    'xl': 'var(--foundation-space-12, 48px)',
    '2xl': 'var(--foundation-space-16, 64px)',
    '3xl': 'var(--foundation-space-20, 80px)',
  };
  
  const wrapperStyle = marginBottom !== 'none' ? { marginBottom: marginBottomMap[marginBottom] } : undefined;
  
  const commonProps = {
    valueVariant,
    valueWeight,
    valueColor,
    labelVariant,
    labelWeight,
    labelColor,
    descriptionVariant,
    descriptionColor,
    spacing,
    align,
    iconSize,
    iconColor
  };

  // Get stat items from components
  const statItems: StatItem[] = componentOrder.map(key => {
    const component = components[key];
    if (!component || component.type !== 'stat' || !component.props) return null;
    return {
      id: component.props.id || key,
      componentKey: key,
      value: component.props.value || '',
      label: component.props.label || '',
      description: component.props.description,
      icon: component.props.icon,
      logo: component.props.logo,
      trend: component.props.trend,
      animation: component.props.animation
    };
  }).filter(Boolean) as StatItem[];

  // Render based on variant
  const renderStat = (stat: StatItem, index: number) => {
    const key = stat.id || `stat-${index}`;
    
    switch (variant) {
      case 'centered':
        return <StatCentered key={key} stat={stat} {...commonProps} />;
        
      case 'with-separator':
        return (
          <StatWithSeparator
            key={key}
            stat={stat}
            {...commonProps}
            isLast={index === statItems.length - 1}
          />
        );
        
      case 'with-bottom-border':
        return <StatWithBottomBorder key={key} stat={stat} {...commonProps} />;
        
      case 'with-top-border':
        return <StatWithTopBorder key={key} stat={stat} {...commonProps} />;
        
      case 'with-left-border':
        return <StatWithLeftBorder key={key} stat={stat} {...commonProps} />;
        
      case 'with-card':
        return (
          <StatWithCard
            key={key}
            stat={stat}
            {...commonProps}
            cardVariant={cardVariant}
            cardPadding={cardPadding}
          />
        );
        
      case 'with-icon':
        return <StatWithIcon key={key} stat={stat} {...commonProps} />;
        
      case 'with-logo':
        return <StatWithLogo key={key} stat={stat} {...commonProps} />;
        
      default:
        return <StatCentered key={key} stat={stat} {...commonProps} />;
    }
  };

  // Choose container based on variant
  let content: React.ReactNode;
  
  if (variant === 'with-separator') {
    content = (
      <HStack 
        spacing="xl" 
        align="center" 
        justify="center"
        wrap={true}
        className={className}
      >
        {statItems.map((stat: StatItem, index: number) => renderStat(stat, index))}
      </HStack>
    );
  } else if (columns && columns >= 1) {
    // If columns prop is set, use Grid component for forced grid layout
    content = (
      <Grid 
        columns={columns}
        gap={gridGap}
        className={className}
      >
        {statItems.map((stat: StatItem, index: number) => renderStat(stat, index))}
      </Grid>
    );
  } else {
    // Default: Use responsive grid-like HStack with wrapping
    content = (
      <HStack 
        spacing="xl" 
        align="stretch" 
        justify="center"
        wrap={true}
        className={className}
      >
        {statItems.map((stat: StatItem, index: number) => renderStat(stat, index))}
      </HStack>
    );
  }

  // Wrap with margin if needed
  if (wrapperStyle) {
    return <div style={wrapperStyle}>{content}</div>;
  }
  
  return <>{content}</>;
};

Stats.displayName = 'Stats';