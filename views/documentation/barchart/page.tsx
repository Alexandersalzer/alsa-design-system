"use client";

import React from 'react';
import { Box, Body, BarChart } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { categoryData, regionalSalesData } from '../chartData';

export default function BarChartPage() {
  return (
    <ComponentDocPage
      componentName="BarChart"
      description="Versatile bar chart supporting vertical/horizontal orientation, grouped and stacked variants"
      importStatement={`import { BarChart } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage (Vertical)',
          description: 'Simple vertical bar chart with categorical data',
          preview: (
            <Box>
              <BarChart
                title="Revenue by Type"
                subtitle="Monthly recurring revenue breakdown"
                data={categoryData}
              />
            </Box>
          ),
          code: `import { BarChart } from '../../../design/index';

const data = [
  { label: 'Subscriptions', value: 45000, color: 'accent' },
  { label: 'One-time', value: 28000, color: 'success' },
  { label: 'Enterprise', value: 67000, color: 'info' },
  { label: 'Add-ons', value: 12000, color: 'warning' },
];

<BarChart
  title="Revenue by Type"
  subtitle="Monthly recurring revenue breakdown"
  data={data}
/>`,
        },

        {
          title: 'Horizontal Bars',
          description: 'Horizontal orientation for better label readability',
          preview: (
            <Box>
              <BarChart
                title="Revenue by Type"
                subtitle="Horizontal layout"
                data={categoryData}
                orientation="horizontal"
              />
            </Box>
          ),
          code: `<BarChart
  title="Revenue by Type"
  data={data}
  orientation="horizontal"
/>`,
        },

        {
          title: 'Grouped Bars',
          description: 'Compare multiple series side by side',
          preview: (
            <Box>
              <BarChart
                title="Regional Sales by Quarter"
                subtitle="Grouped comparison"
                series={regionalSalesData.series}
                labels={regionalSalesData.labels}
                variant="grouped"
              />
            </Box>
          ),
          code: `const data = {
  labels: ['North America', 'Europe', 'Asia Pacific'],
  series: [
    { name: 'Q1', data: [145000, 98000, 67000], color: 'accent' },
    { name: 'Q2', data: [162000, 112000, 78000], color: 'success' },
    { name: 'Q3', data: [178000, 125000, 89000], color: 'info' },
  ]
};

<BarChart
  title="Regional Sales"
  series={data.series}
  labels={data.labels}
  variant="grouped"
/>`,
        },

        {
          title: 'Stacked Bars',
          description: 'Show composition and total',
          preview: (
            <Box>
              <BarChart
                title="Regional Sales by Quarter"
                subtitle="Stacked totals"
                series={regionalSalesData.series}
                labels={regionalSalesData.labels}
                variant="stacked"
              />
            </Box>
          ),
          code: `<BarChart
  title="Regional Sales"
  series={series}
  labels={labels}
  variant="stacked"
/>`,
        },

        {
          title: 'Horizontal Grouped',
          description: 'Grouped bars in horizontal orientation',
          preview: (
            <Box>
              <BarChart
                title="Regional Sales by Quarter"
                subtitle="Horizontal grouped comparison"
                series={regionalSalesData.series}
                labels={regionalSalesData.labels}
                variant="grouped"
                orientation="horizontal"
              />
            </Box>
          ),
          code: `<BarChart
  series={series}
  labels={labels}
  variant="grouped"
  orientation="horizontal"
/>`,
        },

        {
          title: 'Horizontal Stacked',
          description: 'Stacked bars in horizontal orientation',
          preview: (
            <Box>
              <BarChart
                title="Regional Sales by Quarter"
                subtitle="Horizontal stacked view"
                series={regionalSalesData.series}
                labels={regionalSalesData.labels}
                variant="stacked"
                orientation="horizontal"
              />
            </Box>
          ),
          code: `<BarChart
  series={series}
  labels={labels}
  variant="stacked"
  orientation="horizontal"
/>`,
        },

        {
          title: 'With Value Labels',
          description: 'Display values on bars',
          preview: (
            <Box>
              <BarChart
                title="Revenue by Type"
                data={categoryData}
                showValues
                valueFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
            </Box>
          ),
          code: `<BarChart
  data={data}
  showValues
  valueFormatter={(v) => \`$\${(v / 1000).toFixed(0)}k\`}
/>`,
        },

        {
          title: 'Without Grid',
          description: 'Clean look without grid lines',
          preview: (
            <Box>
              <BarChart
                title="Revenue by Type"
                data={categoryData}
                showGrid={false}
              />
            </Box>
          ),
          code: `<BarChart
  data={data}
  showGrid={false}
/>`,
        },

        {
          title: 'Custom Value Formatter',
          description: 'Format values with currency, percentages, etc.',
          preview: (
            <Box>
              <BarChart
                title="Revenue by Type"
                subtitle="Formatted as currency"
                data={categoryData}
                valueFormatter={(v) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(v)}
              />
            </Box>
          ),
          code: `<BarChart
  data={data}
  valueFormatter={(v) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(v)
  }
/>`,
        },

        {
          title: 'Responsive Sizing',
          description: 'Auto-adjust to container width',
          preview: (
            <Box>
              <BarChart
                title="Responsive Bar Chart"
                data={categoryData}
                responsive
                aspectRatio="16/9"
              />
            </Box>
          ),
          code: `<BarChart
  data={data}
  responsive
  aspectRatio="16/9"
/>`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Three Variants:</strong> BarChart supports <code>simple</code> (single series),
            <code>grouped</code> (side-by-side comparison), and <code>stacked</code> (composition) variants.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Orientation:</strong> Use <code>orientation="horizontal"</code> for better label readability with long category names.
            Horizontal bars are also great for rankings and comparisons.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Value Formatting:</strong> Use <code>valueFormatter</code> to display values as currency, percentages,
            or any custom format. Perfect for showing exact values on hover or as labels.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
