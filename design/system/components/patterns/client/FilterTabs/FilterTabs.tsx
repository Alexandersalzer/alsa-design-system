// ===============================================
// design/system/components/patterns/client/FilterTabs/FilterTabs.tsx
// FILTER TABS PATTERN - Toggle filter buttons using Tab primitive
// ===============================================

import React, { useState } from 'react';
import { Tab } from '../../../../../system/components/primitives/NavigationTab/Tab';
import { HStack } from '../../../layout/utilities/hStack/HStack';
import { Stack } from '../../../layout/utilities/stack/Stack';

// ===== TYPE DEFINITIONS =====

export interface FilterItem {
  id: string;
  label: string;
  value: string;
}

export interface FilterTabsProps {
  className?: string;
  
  // Content
  filters: FilterItem[];
  
  // State management
  activeFilter?: string;
  onFilterChange?: (filterId: string, filterValue: string) => void;
  
  // Tab styling options
  tabSize?: 'sm' | 'md' | 'lg';
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  useHeadingFont?: boolean;
  
  // Layout options
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  
  // Container spacing
  containerSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// ===== MAIN FILTER TABS COMPONENT =====

export const FilterTabs: React.FC<FilterTabsProps> = ({
  className,
  filters,
  
  // State defaults
  activeFilter,
  onFilterChange,
  
  // Tab styling defaults - matching KJ Marketing style
  tabSize = 'md',
  fontWeight = 'medium',
  useHeadingFont = true,
  
  // Layout defaults
  spacing = 'sm',
  align = 'center',
  justify = 'center',
  wrap = true,
  
  // Container defaults
  containerSpacing = 'lg'
}) => {
  // Internal state if no external state management
  const [internalActiveFilter, setInternalActiveFilter] = useState<string>(
    activeFilter || filters[0]?.value || 'all'
  );
  
  const currentActiveFilter = activeFilter || internalActiveFilter;
  
  const handleFilterClick = (filterId: string, filterValue: string) => {
    if (onFilterChange) {
      onFilterChange(filterId, filterValue);
    } else {
      setInternalActiveFilter(filterValue);
    }
  };
  
  return (
    <div className={`filter-tabs ${className || ''}`}>
      <Stack spacing={containerSpacing} align="center">
        {/* Filter Tabs */}
        <HStack 
          spacing={spacing}
          align={align}
          justify={justify}
          wrap={wrap}
        >
          {filters.map((filter) => (
            <Tab
              key={filter.id}
              variant="page" // Use segment variant for filter-style tabs
              size={tabSize}
              isActive={currentActiveFilter === filter.value}
              onClick={() => handleFilterClick(filter.id, filter.value)}
              fontWeight={fontWeight}
              useHeadingFont={useHeadingFont}
            >
              {filter.label}
            </Tab>
          ))}
        </HStack>
      </Stack>
    </div>
  );
};

FilterTabs.displayName = 'FilterTabs'; 