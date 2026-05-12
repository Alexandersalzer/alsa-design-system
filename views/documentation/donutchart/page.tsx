"use client";

import React from 'react';
import { Box, Body, DonutChart } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  browserShareData,
  storageUsageData,
  teamProductivityData,
} from '../chartData';

export default function DonutChartPage() {
  return (
    <ComponentDocPage
      componentName="DonutChart"
      description="Pie and donut charts for showing proportions and composition with interactive legends"
      importStatement={`import { DonutChart } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Donut Chart',
          description: 'Default donut with center hole and legend',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Browser Market Share"
                subtitle="Desktop browser usage"
                data={browserShareData}
              />
            </Box>
          ),
          code: `import { DonutChart } from '../../../design/index';

const data = [
  { label: 'Chrome', value: 65.4, color: 'accent' },
  { label: 'Safari', value: 18.8, color: 'success' },
  { label: 'Edge', value: 5.2, color: 'info' },
  { label: 'Firefox', value: 3.1, color: 'warning' },
  { label: 'Other', value: 7.5, color: 'error' },
];

<DonutChart
  title="Browser Market Share"
  subtitle="Desktop browser usage"
  data={data}
/>`,
        },

        {
          title: 'Pie Chart (Full Circle)',
          description: 'Set innerRadius to 0 for a pie chart',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Browser Market Share"
                subtitle="As a pie chart"
                data={browserShareData}
                innerRadius={0}
              />
            </Box>
          ),
          code: `<DonutChart
  title="Browser Market Share"
  data={data}
  innerRadius={0}
/>`,
        },

        {
          title: 'With Center Text',
          description: 'Display total or key metric in center',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Storage Usage"
                subtitle="Total: 1.7 GB"
                data={storageUsageData}
                centerText="1.7 GB"
                centerSubtext="Used"
              />
            </Box>
          ),
          code: `<DonutChart
  title="Storage Usage"
  data={data}
  centerText="1.7 GB"
  centerSubtext="Used"
/>`,
        },

        {
          title: 'With Values in Legend',
          description: 'Show exact values alongside percentages',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Storage Usage"
                data={storageUsageData}
                showValues
                valueFormatter={(v) => `${v} MB`}
              />
            </Box>
          ),
          code: `<DonutChart
  title="Storage Usage"
  data={data}
  showValues
  valueFormatter={(v) => \`\${v} MB\`}
/>`,
        },

        {
          title: 'Different Inner Radius',
          description: 'Control the donut thickness',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center">
                <Body size="xs" color="secondary" weight="semibold">Thin (0.7)</Body>
                <DonutChart
                  data={browserShareData}
                  innerRadius={0.7}
                  size={200}
                  showLegend={false}
                />
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center">
                <Body size="xs" color="secondary" weight="semibold">Medium (0.6)</Body>
                <DonutChart
                  data={browserShareData}
                  innerRadius={0.6}
                  size={200}
                  showLegend={false}
                />
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center">
                <Body size="xs" color="secondary" weight="semibold">Thick (0.4)</Body>
                <DonutChart
                  data={browserShareData}
                  innerRadius={0.4}
                  size={200}
                  showLegend={false}
                />
              </Box>
            </Box>
          ),
          code: `<DonutChart data={data} innerRadius={0.7} />

<DonutChart data={data} innerRadius={0.6} />

<DonutChart data={data} innerRadius={0.4} />`,
        },

        {
          title: 'Without Labels',
          description: 'Hide percentage labels on slices',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Browser Share"
                data={browserShareData}
                showLabels={false}
              />
            </Box>
          ),
          code: `<DonutChart
  data={data}
  showLabels={false}
/>`,
        },

        {
          title: 'Without Legend',
          description: 'Show chart only, no legend',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Browser Share"
                data={browserShareData}
                showLegend={false}
              />
            </Box>
          ),
          code: `<DonutChart
  data={data}
  showLegend={false}
/>`,
        },

        {
          title: 'Custom Size',
          description: 'Adjust chart diameter',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-3">
              <Box display="flex" justify="center">
                <DonutChart
                  data={browserShareData}
                  size={200}
                  showLegend={false}
                />
              </Box>
              <Box display="flex" justify="center">
                <DonutChart
                  data={browserShareData}
                  size={250}
                  showLegend={false}
                />
              </Box>
              <Box display="flex" justify="center">
                <DonutChart
                  data={browserShareData}
                  size={300}
                  showLegend={false}
                />
              </Box>
            </Box>
          ),
          code: `<DonutChart data={data} size={200} />

<DonutChart data={data} size={250} />

<DonutChart data={data} size={300} />`,
        },

        {
          title: 'Team Productivity',
          description: 'Real-world example with center metric',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Team Time Allocation"
                subtitle="Hours spent by department"
                data={teamProductivityData}
                centerText="100%"
                centerSubtext="Utilized"
                showValues
                valueFormatter={(v) => `${v}%`}
              />
            </Box>
          ),
          code: `const teamData = [
  { label: 'Development', value: 38.2, color: 'accent' },
  { label: 'Design', value: 23.5, color: 'success' },
  { label: 'Marketing', value: 18.9, color: 'info' },
  { label: 'Sales', value: 12.3, color: 'warning' },
  { label: 'Support', value: 7.1, color: 'error' },
];

<DonutChart
  title="Team Time Allocation"
  data={teamData}
  centerText="100%"
  centerSubtext="Utilized"
  showValues
  valueFormatter={(v) => \`\${v}%\`}
/>`,
        },

        {
          title: 'Storage Breakdown',
          description: 'File storage usage by type',
          preview: (
            <Box display="flex" justify="center">
              <DonutChart
                title="Cloud Storage"
                subtitle="1.7 GB of 2 GB used"
                data={storageUsageData}
                centerText="85%"
                centerSubtext="Full"
                showValues
                valueFormatter={(v) => `${v} MB`}
              />
            </Box>
          ),
          code: `const storageData = [
  { label: 'Photos', value: 842, color: 'accent' },
  { label: 'Videos', value: 456, color: 'info' },
  { label: 'Documents', value: 234, color: 'success' },
  { label: 'Other', value: 167, color: 'warning' },
];

<DonutChart
  title="Cloud Storage"
  data={storageData}
  centerText="85%"
  centerSubtext="Full"
  showValues
  valueFormatter={(v) => \`\${v} MB\`}
/>`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Pie vs Donut:</strong> Use <code>innerRadius=0</code> for a traditional pie chart,
            or <code>innerRadius=0.6</code> (default) for a donut chart. Donuts work better when you want to display
            a center metric or total.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Interactive Legend:</strong> The legend shows each slice's label, color marker, and optionally
            the value and percentage. Perfect for detailed data exploration.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Center Text:</strong> Use <code>centerText</code> and <code>centerSubtext</code> to display
            key metrics like totals, percentages, or status in the center of the donut.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Best For:</strong> DonutChart works best with 3-7 categories. Too many slices make the chart
            hard to read. Consider grouping small values into an "Other" category.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
