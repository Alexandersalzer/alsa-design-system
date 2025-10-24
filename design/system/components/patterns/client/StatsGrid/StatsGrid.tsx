// ===============================================
// design/system/components/patterns/client/StatsGrid/StatsGrid.tsx
// STATS GRID PATTERN - Display statistics in a grid layout like KJ Marketing
// ===============================================

import React from 'react';
import { Typography, TypographyColor } from '../../../../../system/components/primitives/Typography';
import { VStack } from '../../../layout/utilities/vStack/VStack';
import { HStack } from '../../../layout/utilities/hStack/HStack';
import { ResponsiveGrid } from '../../../layout/utilities/grid/Grid';

// ===== TYPE DEFINITIONS =====

export interface StatItem {
  id: string;
  number: string;
  label: string;
}

export interface StatsGridProps {
  className?: string;
  
  // Content
  stats: StatItem[];
  
  // Typography variants for numbers
  numberVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  numberWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  numberColor?: TypographyColor;
  
  // Typography variants for labels
  labelVariant?: 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs' | 'label-lg' | 'label-md' | 'label-sm';
  labelWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  labelColor?: TypographyColor;
  
  // Layout options
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  
  // Grid configuration
  minItemWidth?: string;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

// ===== MAIN STATS GRID COMPONENT =====

export const StatsGrid: React.FC<StatsGridProps> = ({
  className,
  stats,
  
  // Typography defaults - matching KJ Marketing style
  numberVariant = 'display-lg',
  numberWeight = 'bold',
  numberColor = 'primary',
  
  labelVariant = 'body-md',
  labelWeight = 'regular',
  labelColor = 'secondary',
  
  // Layout defaults
  spacing = 'xs',
  align = 'center',
  
  // Grid defaults
  minItemWidth = '200px',
  gap = 'lg'
}) => {
  return (
    <div className={`stats-grid ${className || ''}`}>
      <ResponsiveGrid
        minItemWidth={minItemWidth}
        gap={gap}
        style={{
          justifyItems: 'center',
          alignItems: 'start'
        }}
      >
        {stats.map((stat) => (
          <div key={stat.id} style={{ textAlign: 'center' }}>
            <VStack 
              spacing={spacing} 
              align={align}
            >
              {/* Large Number */}
              <Typography
                variant={numberVariant}
                weight={numberWeight}
                color={numberColor}
                align="center"
              >
                {stat.number}
              </Typography>
              
              {/* Label */}
              <Typography
                variant={labelVariant}
                weight={labelWeight}
                color={labelColor}
                align="center"
              >
                {stat.label}
              </Typography>
            </VStack>
          </div>
        ))}
      </ResponsiveGrid>
    </div>
  );
};

StatsGrid.displayName = 'StatsGrid'; 