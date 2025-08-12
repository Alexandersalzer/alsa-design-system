// ===============================================
// design/system/components/patterns/client/FilterTabs/FilterTabs.tsx
// FILTER TABS PATTERN - Toggle filter buttons using Tab primitive
// ===============================================

import React, { useState } from 'react';
import { Tab } from '../../../../../system/components/primitives/NavigationTab/Tab';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

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
    activeFilter || filters[0]?.id || ''
  );
  
  const currentActiveFilter = activeFilter || internalActiveFilter;
  
  const handleFilterClick = (filterId: string, filterValue: string) => {
    if (onFilterChange) {
      onFilterChange(filterId, filterValue);
    } else {
      setInternalActiveFilter(filterId);
    }
  };
  
  return (
    <div className={`filter-tabs ${className || ''}`}>
      <Stack spacing={containerSpacing} align="center">
        {/* Filter Tabs */}
        <Cluster 
          spacing={spacing}
          align={align}
          justify={justify}
          wrap={wrap}
        >
          {filters.map((filter) => (
            <Tab
              key={filter.id}
              variant="segment" // Use segment variant for filter-style tabs
              size={tabSize}
              isActive={currentActiveFilter === filter.id}
              onClick={() => handleFilterClick(filter.id, filter.value)}
              fontWeight={fontWeight}
              useHeadingFont={useHeadingFont}
            >
              {filter.label}
            </Tab>
          ))}
        </Cluster>
      </Stack>
    </div>
  );
};

FilterTabs.displayName = 'FilterTabs'; 