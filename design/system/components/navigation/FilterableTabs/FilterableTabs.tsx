'use client';

import React, { useState, useEffect } from 'react';
import { TabGroup, Tab } from '../Tabs/Tabs';
import { cn } from '../../../utils/cn';
import './FilterableTabs.css';

export interface FilterableTabsProps {
  tabs: Array<{
    id: string;
    label: string;
    filter: string;
  }>;
  targetId: string;
  variant?: 'solid' | 'line' | 'subtle' | 'enclosed' | 'outline' | 'plain';
  isAccent?: boolean;
  defaultFilter?: string;
  className?: string;
}

export const FilterableTabs: React.FC<FilterableTabsProps> = ({
  tabs,
  targetId,
  variant = 'subtle',
  isAccent = true,
  defaultFilter = 'all',
  className,
}) => {
  const [activeFilter, setActiveFilter] = useState(defaultFilter);

  useEffect(() => {
    const targetElement = document.querySelector(`[data-grid-id="${targetId}"]`);
    if (!targetElement) return;

    const items = targetElement.querySelectorAll('[data-filter-tags]');

    items.forEach((item) => {
      const htmlItem = item as HTMLElement;
      const filterTags = htmlItem.dataset.filterTags?.split(',') || [];

      if (activeFilter === 'all' || filterTags.includes(activeFilter)) {
        htmlItem.style.display = '';
        // Trigger fade in animation
        htmlItem.classList.remove('filtered-out');
        htmlItem.classList.add('filtered-in');
      } else {
        // Trigger fade out animation
        htmlItem.classList.add('filtered-out');
        htmlItem.classList.remove('filtered-in');
        setTimeout(() => {
          if (htmlItem.classList.contains('filtered-out')) {
            htmlItem.style.display = 'none';
          }
        }, 200);
      }
    });
  }, [activeFilter, targetId]);

  return (
    <TabGroup
      variant={variant}
      isAccent={isAccent}
      justify="center"
      className={cn('filterable-tabs', className)}
    >
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          variant={variant}
          isAccent={isAccent}
          isActive={activeFilter === tab.filter}
          onClick={() => setActiveFilter(tab.filter)}
        >
          {tab.label}
        </Tab>
      ))}
    </TabGroup>
  );
};

FilterableTabs.displayName = 'FilterableTabs';

export default FilterableTabs;
