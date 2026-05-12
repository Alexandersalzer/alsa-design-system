"use client";

import React, { useState } from 'react';
import { Box, Body, SegmentedControl, Icon } from '../../../design/index';
import {
  Squares2X2Icon,
  ListBulletIcon,
  TableCellsIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function SegmentedControlPage() {
  const [value1, setValue1] = useState('list');
  const [value2, setValue2] = useState('day');
  const [value3, setValue3] = useState('all');
  const [iconOnlyValue, setIconOnlyValue] = useState('list');
  const [viewportValue, setViewportValue] = useState('desktop');

  return (
    <ComponentDocPage
      componentName="SegmentedControl"
      description="A control for selecting between multiple options in a compact, segmented button group"
      importStatement={`import { SegmentedControl } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple segmented control with text options',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <SegmentedControl
                value={value1}
                onChange={setValue1}
                options={[
                  { value: 'list', label: 'List' },
                  { value: 'grid', label: 'Grid' },
                  { value: 'table', label: 'Table' },
                ]}
              />
            </Box>
          ),
          code: `const [value, setValue] = useState('list');

<SegmentedControl
  value={value}
  onChange={setValue}
  options={[
    { value: 'list', label: 'List' },
    { value: 'grid', label: 'Grid' },
    { value: 'table', label: 'Table' },
  ]}
/>`,
        },

        {
          title: 'Different Sizes',
          description: 'Available size variants',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SegmentedControl
                  size="sm"
                  value={value1}
                  onChange={setValue1}
                  options={[
                    { value: 'list', label: 'List' },
                    { value: 'grid', label: 'Grid' },
                  ]}
                />
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SegmentedControl
                  size="md"
                  value={value1}
                  onChange={setValue1}
                  options={[
                    { value: 'list', label: 'List' },
                    { value: 'grid', label: 'Grid' },
                  ]}
                />
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
            </Box>
          ),
          code: `<SegmentedControl size="sm" value={value} onChange={setValue} options={options} />

<SegmentedControl size="md" value={value} onChange={setValue} options={options} />`        },

        {
          title: 'Time Period Selector',
          description: 'Common use case for filtering by time periods',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <SegmentedControl
                value={value2}
                onChange={setValue2}
                options={[
                  { value: 'day', label: 'Day' },
                  { value: 'week', label: 'Week' },
                  { value: 'month', label: 'Month' },
                  { value: 'year', label: 'Year' },
                ]}
              />
            </Box>
          ),
          code: `const [period, setPeriod] = useState('day');

<SegmentedControl
  value={period}
  onChange={setPeriod}
  options={[
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'year', label: 'Year' },
  ]}
/>`,
        },

        {
          title: 'Icon Only Mode',
          description: 'Display only icons with tooltips on hover (500ms delay)',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <SegmentedControl
                value={iconOnlyValue}
                onChange={setIconOnlyValue}
                iconOnly
                options={[
                  {
                    value: 'list',
                    label: 'List View',
                    icon: (
                      <Icon size="sm">
                        <ListBulletIcon />
                      </Icon>
                    ),
                  },
                  {
                    value: 'grid',
                    label: 'Grid View',
                    icon: (
                      <Icon size="sm">
                        <Squares2X2Icon />
                      </Icon>
                    ),
                  },
                  {
                    value: 'table',
                    label: 'Table View',
                    icon: (
                      <Icon size="sm">
                        <TableCellsIcon />
                      </Icon>
                    ),
                  },
                ]}
              />
            </Box>
          ),
          code: `import { Icon } from '../../../design/index';
import { ListBulletIcon, Squares2X2Icon, TableCellsIcon } from '@heroicons/react/24/outline';

const [value, setValue] = useState('list');

<SegmentedControl
  value={value}
  onChange={setValue}
  iconOnly
  options={[
    {
      value: 'list',
      label: 'List View',
      icon: <Icon size="sm"><ListBulletIcon /></Icon>,
    },
    {
      value: 'grid',
      label: 'Grid View',
      icon: <Icon size="sm"><Squares2X2Icon /></Icon>,
    },
    {
      value: 'table',
      label: 'Table View',
      icon: <Icon size="sm"><TableCellsIcon /></Icon>,
    },
  ]}
/>`,
        },

        {
          title: 'Icon Only with Custom Tooltips',
          description: 'Override default tooltip text with custom messages',
          preview: (
            <Box
              display="flex"
              justify="center"
              align="center"
            >
              <SegmentedControl
                value={viewportValue}
                onChange={setViewportValue}
                iconOnly
                size="sm"
                options={[
                  {
                    value: 'mobile',
                    label: 'Mobile',
                    tooltip: 'Preview on mobile devices',
                    icon: (
                      <Icon size="sm">
                        <DevicePhoneMobileIcon />
                      </Icon>
                    ),
                  },
                  {
                    value: 'tablet',
                    label: 'Tablet',
                    tooltip: 'Preview on tablet devices',
                    icon: (
                      <Icon size="sm">
                        <DeviceTabletIcon />
                      </Icon>
                    ),
                  },
                  {
                    value: 'desktop',
                    label: 'Desktop',
                    tooltip: 'Preview on desktop screens',
                    icon: (
                      <Icon size="sm">
                        <ComputerDesktopIcon />
                      </Icon>
                    ),
                  },
                ]}
              />
            </Box>
          ),
          code: `<SegmentedControl
  value={viewport}
  onChange={setViewport}
  iconOnly
  size="sm"
  options={[
    {
      value: 'mobile',
      label: 'Mobile',
      tooltip: 'Preview on mobile devices',
      icon: <Icon size="sm"><DevicePhoneMobileIcon /></Icon>,
    },
    {
      value: 'tablet',
      label: 'Tablet',
      tooltip: 'Preview on tablet devices',
      icon: <Icon size="sm"><DeviceTabletIcon /></Icon>,
    },
    {
      value: 'desktop',
      label: 'Desktop',
      tooltip: 'Preview on desktop screens',
      icon: <Icon size="sm"><ComputerDesktopIcon /></Icon>,
    },
  ]}
/>`,
        },

        {
          title: 'Practical Examples',
          description: 'Real-world usage patterns',
          preview: (
            <Box display="flex" direction="column" gap="md">
              <Box>
                <Box display="flex" direction="column" gap="md">
                  <Box>
                    <Body weight="medium">Filter Tasks</Body>
                    <Body size="sm" color="secondary">Choose which tasks to display</Body>
                  </Box>
                  <SegmentedControl
                    value={value3}
                    onChange={setValue3}
                    options={[
                      { value: 'all', label: 'All' },
                      { value: 'active', label: 'Active' },
                      { value: 'completed', label: 'Completed' },
                    ]}
                  />
                </Box>
              </Box>

              <Box>
                <Box display="flex" direction="column" gap="md">
                  <Box>
                    <Body weight="medium">View Mode</Body>
                    <Body size="sm" color="secondary">Select how to display content</Body>
                  </Box>
                  <SegmentedControl
                    value={value1}
                    onChange={setValue1}
                    options={[
                      { value: 'list', label: 'List View' },
                      { value: 'grid', label: 'Grid View' },
                    ]}
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `// Task filter
const [filter, setFilter] = useState('all');

<SegmentedControl
  value={filter}
  onChange={setFilter}
  options={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ]}
/>

// View mode selector
const [viewMode, setViewMode] = useState('list');

<SegmentedControl
  value={viewMode}
  onChange={setViewMode}
  options={[
    { value: 'list', label: 'List View' },
    { value: 'grid', label: 'Grid View' },
  ]}
/>`        },
      ]}
    />
  );
}
