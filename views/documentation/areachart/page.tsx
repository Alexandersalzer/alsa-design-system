"use client";

import React from 'react';
import { Box, Body, AreaChart } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  revenueData,
  stackedAreaData,
  trafficSourcesData,
} from '../chartData';

export default function AreaChartPage() {
  return (
    <ComponentDocPage
      componentName="AreaChart"
      description="Stacked area chart perfect for showing composition over time with beautiful gradient fills"
      importStatement={`import { AreaChart } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Single area series with gradient fill',
          preview: (
            <Box>
              <AreaChart
                title="Monthly Revenue"
                subtitle="Revenue growth over time"
                series={revenueData.series}
                labels={revenueData.labels}
              />
            </Box>
          ),
          code: `import { AreaChart } from '../../../design/index';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [{
    name: 'Revenue',
    data: [45000, 52000, 48000, 61000, 58000, 67000],
    color: 'accent'
  }]
};

<AreaChart
  title="Monthly Revenue"
  subtitle="Revenue growth over time"
  series={data.series}
  labels={data.labels}
/>`,
        },

        {
          title: 'Stacked Areas',
          description: 'Show composition with multiple stacked series',
          preview: (
            <Box>
              <AreaChart
                title="Traffic by Device"
                subtitle="Visits by device type (stacked)"
                series={stackedAreaData.series}
                labels={stackedAreaData.labels}
                stacked
              />
            </Box>
          ),
          code: `const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    { name: 'Mobile', data: [12000, 15000, 14000, 18000, 17000, 21000], color: 'accent' },
    { name: 'Desktop', data: [28000, 32000, 30000, 35000, 38000, 42000], color: 'success' },
    { name: 'Tablet', data: [5000, 6000, 5500, 7000, 7500, 8000], color: 'info' }
  ]
};

<AreaChart
  title="Traffic by Device"
  series={data.series}
  labels={data.labels}
  stacked
/>`,
        },

        {
          title: 'Non-Stacked (Overlapping)',
          description: 'Multiple series without stacking for comparison',
          preview: (
            <Box>
              <AreaChart
                title="Traffic Sources"
                subtitle="Overlapping areas for comparison"
                series={trafficSourcesData.series}
                labels={trafficSourcesData.labels}
                stacked={false}
              />
            </Box>
          ),
          code: `<AreaChart
  title="Traffic Sources"
  series={series}
  labels={labels}
  stacked={false}
/>`,
        },

        {
          title: 'Smooth vs Sharp Curves',
          description: 'Control curve smoothness',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Smooth (default)</Body>
                  <AreaChart
                    series={revenueData.series}
                    labels={revenueData.labels}
                    smooth
                    height={250}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Sharp</Body>
                  <AreaChart
                    series={revenueData.series}
                    labels={revenueData.labels}
                    smooth={false}
                    height={250}
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<AreaChart smooth series={data} labels={labels} />

<AreaChart smooth={false} series={data} labels={labels} />`,
        },

        {
          title: 'Without Grid',
          description: 'Clean presentation without grid lines',
          preview: (
            <Box>
              <AreaChart
                title="Revenue Trend"
                series={revenueData.series}
                labels={revenueData.labels}
                showGrid={false}
              />
            </Box>
          ),
          code: `<AreaChart
  series={series}
  labels={labels}
  showGrid={false}
/>`,
        },

        {
          title: 'Without Legend',
          description: 'Hide legend for single series or cleaner look',
          preview: (
            <Box>
              <AreaChart
                title="Revenue"
                series={revenueData.series}
                labels={revenueData.labels}
                showLegend={false}
              />
            </Box>
          ),
          code: `<AreaChart
  series={series}
  labels={labels}
  showLegend={false}
/>`,
        },

        {
          title: 'Custom Y-Axis Formatting',
          description: 'Format axis values with custom formatter',
          preview: (
            <Box>
              <AreaChart
                title="Revenue Growth"
                subtitle="Formatted as thousands"
                series={revenueData.series}
                labels={revenueData.labels}
                yAxisFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
            </Box>
          ),
          code: `<AreaChart
  series={series}
  labels={labels}
  yAxisFormatter={(v) => \`$\${(v / 1000).toFixed(0)}k\`}
/>`,
        },

        {
          title: 'Traffic Sources (Stacked)',
          description: 'Real-world example with 4 traffic sources',
          preview: (
            <Box>
              <AreaChart
                title="Website Traffic Sources"
                subtitle="Daily visitors by acquisition channel"
                series={trafficSourcesData.series}
                labels={trafficSourcesData.labels}
                stacked
              />
            </Box>
          ),
          code: `const trafficData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    { name: 'Organic', data: [4200, 4800, 5100, 5400, 5800, 3200, 2900], color: 'success' },
    { name: 'Direct', data: [2100, 2400, 2600, 2800, 3100, 1800, 1600], color: 'accent' },
    { name: 'Social', data: [1500, 1800, 2100, 2300, 2600, 1400, 1200], color: 'info' },
    { name: 'Referral', data: [800, 1000, 1200, 1400, 1600, 900, 700], color: 'warning' }
  ]
};

<AreaChart
  title="Website Traffic Sources"
  series={trafficData.series}
  labels={trafficData.labels}
  stacked
/>`,
        },

        {
          title: 'Device Analytics',
          description: 'Mobile, desktop, and tablet usage over time',
          preview: (
            <Box>
              <AreaChart
                title="User Sessions by Device"
                subtitle="Stacked view of all devices"
                series={stackedAreaData.series}
                labels={stackedAreaData.labels}
                stacked
                yAxisFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
            </Box>
          ),
          code: `const deviceData = {
  series: [
    { name: 'Mobile', data: [12000, 15000, 14000, 18000, 17000, 21000, 23000, 25000], color: 'accent' },
    { name: 'Desktop', data: [28000, 32000, 30000, 35000, 38000, 42000, 45000, 48000], color: 'success' },
    { name: 'Tablet', data: [5000, 6000, 5500, 7000, 7500, 8000, 8500, 9000], color: 'info' }
  ]
};

<AreaChart
  title="User Sessions by Device"
  series={deviceData.series}
  labels={labels}
  stacked
  yAxisFormatter={(v) => \`\${(v / 1000).toFixed(0)}k\`}
/>`,
        },

        {
          title: 'Responsive Sizing',
          description: 'Automatically adjusts to container width',
          preview: (
            <Box>
              <AreaChart
                title="Responsive Area Chart"
                series={revenueData.series}
                labels={revenueData.labels}
                responsive
                aspectRatio="16/9"
              />
            </Box>
          ),
          code: `<AreaChart
  series={series}
  labels={labels}
  responsive
  aspectRatio="16/9"
/>`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Perfect for Composition:</strong> AreaChart excels at showing how different categories contribute to a total over time.
            Use stacked mode to show the whole, and individual areas to show parts.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Beautiful Gradients:</strong> Each area has a gradient fill from the series color to transparent,
            creating depth and visual hierarchy. Colors are managed through CSS variables for consistency.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Stacked vs Overlapping:</strong> Use <code>stacked=true</code> to show composition (parts of a whole)
            or <code>stacked=false</code> to compare trends side by side.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
