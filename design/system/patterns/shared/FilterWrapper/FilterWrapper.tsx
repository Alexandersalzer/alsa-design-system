import React, { useState } from 'react';
import { TabGroup, Tab } from '../../../components';
import { patternRegistry } from '../../registry';

interface TabItem {
  label: string;
  value: string;
}

interface FilterWrapperProps {
  props: {
    tabs: TabItem[];
    filterKey: string; // e.g. "category"
    defaultTab?: string;
    childType: string; // pattern type to render as child
    childProps?: Record<string, any>; // extra props for child pattern
  };
  components: Record<string, any>; // items for the child pattern
}

export const FilterWrapper: React.FC<FilterWrapperProps> = ({
  props,
  components
}) => {
  const { tabs, filterKey, defaultTab, childType, childProps = {} } = props;
  const [activeTab, setActiveTab] = useState(defaultTab || (tabs[0]?.value ?? ''));

  // Flatten items (assume all are valid for now)
  const items = Object.entries(components).map(([, comp]) => ({ ...comp }));

  // Filter items by tab
  const filteredItems = activeTab === 'all'
    ? items
    : items.filter(item => item[filterKey] === activeTab);

  // Get the child pattern component from the registry
  const ChildPattern = patternRegistry[childType];

  return (
    <div>
      <TabGroup>
        {tabs.map(tab => (
          <Tab
            key={tab.value}
            isActive={activeTab === tab.value}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </Tab>
        ))}
      </TabGroup>
      {ChildPattern && (
        <ChildPattern
          {...childProps}
          components={filteredItems.reduce((acc, item, i) => {
            acc[`item_${i}`] = item;
            return acc;
          }, {} as Record<string, any>)}
        />
      )}
    </div>
  );
};
