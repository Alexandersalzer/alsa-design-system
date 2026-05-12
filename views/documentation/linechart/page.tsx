"use client";

import React from 'react';
import { Box, Body, LineChart } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  revenueData,
  metricsComparisonData,
  userGrowthData,
  errorRateData,
  responseTimeData,
  mrrData,
} from '../chartData';

export default function LineChartPage() {
  return (
    <ComponentDocPage
      componentName="LineChart"
      description="Modern line chart with smooth curves, perfect for time series data and trend visualization"
      importStatement={`import { LineChart } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple line chart with single series',
          preview: (
            <Box>
              <LineChart
                title="Monthly Revenue"
                subtitle="Revenue trends over the year"
                series={revenueData.series}
                labels={revenueData.labels}
              />
            </Box>
          ),
          code: `import { LineChart } from '../../../design/index';

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [{
    name: 'Revenue',
    data: [45000, 52000, 48000, 61000, 58000, 67000],
    color: 'accent'
  }]
};

<LineChart
  title="Monthly Revenue"
  subtitle="Revenue trends over the year"
  series={data.series}
  labels={data.labels}
/>`,
        },

        {
          title: 'Multiple Series',
          description: 'Compare multiple metrics on one chart',
          preview: (
            <Box>
              <LineChart
                title="Business Metrics"
                subtitle="Revenue, costs, and profit comparison"
                series={metricsComparisonData.series}
                labels={metricsComparisonData.labels}
              />
            </Box>
          ),
          code: `const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    {
      name: 'Revenue',
      data: [45000, 52000, 48000, 61000, 58000, 67000],
      color: 'accent'
    },
    {
      name: 'Costs',
      data: [32000, 35000, 33000, 38000, 37000, 41000],
      color: 'error',
      dashed: true
    },
    {
      name: 'Profit',
      data: [13000, 17000, 15000, 23000, 21000, 26000],
      color: 'success'
    }
  ]
};

<LineChart
  title="Business Metrics"
  series={data.series}
  labels={data.labels}
/>`,
        },

        {
          title: 'With Area Fill',
          description: 'Show area under the line',
          preview: (
            <Box>
              <LineChart
                title="User Growth"
                subtitle="Active users over 8 weeks"
                series={userGrowthData.series}
                labels={userGrowthData.labels}
                showArea
              />
            </Box>
          ),
          code: `<LineChart
  title="User Growth"
  series={series}
  labels={labels}
  showArea
/>`,
        },

        {
          title: 'Smooth vs Sharp Lines',
          description: 'Curved or straight line segments',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Smooth (default)</Body>
                  <LineChart
                    series={userGrowthData.series}
                    labels={userGrowthData.labels}
                    smooth
                    height={250}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Sharp</Body>
                  <LineChart
                    series={userGrowthData.series}
                    labels={userGrowthData.labels}
                    smooth={false}
                    height={250}
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<LineChart smooth series={data} labels={labels} />

<LineChart smooth={false} series={data} labels={labels} />`,
        },

        {
          title: 'Grid Options',
          description: 'Control grid line visibility',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">With Grid</Body>
                  <LineChart
                    series={userGrowthData.series}
                    labels={userGrowthData.labels}
                    showGrid
                    height={250}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Without Grid</Body>
                  <LineChart
                    series={userGrowthData.series}
                    labels={userGrowthData.labels}
                    showGrid={false}
                    height={250}
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<LineChart showGrid series={data} labels={labels} />

<LineChart showGrid={false} series={data} labels={labels} />`,
        },

        {
          title: 'Custom Y-Axis Formatting',
          description: 'Format axis labels with suffixes or custom formatters',
          preview: (
            <Box>
              <LineChart
                title="Error Rate"
                subtitle="Percentage of failed requests"
                series={errorRateData.series}
                labels={errorRateData.labels}
                yAxisSuffix="%"
              />
            </Box>
          ),
          code: `<LineChart
  title="Error Rate"
  series={series}
  labels={labels}
  yAxisSuffix="%"
  yAxisFormatter={(value) => \`\${value}%\`}
/>`,
        },

        {
          title: 'Dashed Lines',
          description: 'Use dashed lines for projections or secondary data',
          preview: (
            <Box>
              <LineChart
                title="MRR with Projections"
                subtitle="Actual vs projected monthly recurring revenue"
                series={mrrData.series}
                labels={mrrData.labels}
                yAxisFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
            </Box>
          ),
          code: `const data = {
  series: [
    {
      name: 'Actual MRR',
      data: [125, 132, 138, 145, 152, 161, null, null],
      color: 'accent'
    },
    {
      name: 'Projected MRR',
      data: [null, null, null, null, null, 161, 169, 178],
      color: 'accent',
      dashed: true
    }
  ]
};

<LineChart series={data.series} labels={labels} />`,
        },

        {
          title: 'API Performance Monitoring',
          description: 'Multiple percentile lines',
          preview: (
            <Box>
              <LineChart
                title="API Response Times"
                subtitle="Response time percentiles over 24 hours"
                series={responseTimeData.series}
                labels={responseTimeData.labels}
                yAxisFormatter={(v) => `${v}ms`}
              />
            </Box>
          ),
          code: `const perfData = {
  series: [
    { name: 'p50', data: [45, 42, 58, 67, 72, 51], color: 'success' },
    { name: 'p95', data: [89, 87, 112, 134, 145, 98], color: 'warning' },
    { name: 'p99', data: [178, 165, 234, 289, 312, 201], color: 'error' }
  ]
};

<LineChart
  title="API Response Times"
  series={perfData.series}
  labels={labels}
  yAxisFormatter={(v) => \`\${v}ms\`}
/>`,
        },

        {
          title: 'Responsive Sizing',
          description: 'Chart adapts to container width',
          preview: (
            <Box>
              <LineChart
                title="Responsive Chart"
                subtitle="Automatically adjusts to container"
                series={revenueData.series}
                labels={revenueData.labels}
                responsive
                aspectRatio="16/9"
              />
            </Box>
          ),
          code: `<LineChart
  series={series}
  labels={labels}
  responsive
  aspectRatio="16/9"
/>`,
        },

        {
          title: 'Hide Legend',
          description: 'Remove legend for single series or clean look',
          preview: (
            <Box>
              <LineChart
                title="Revenue Trend"
                series={revenueData.series}
                labels={revenueData.labels}
                showLegend={false}
              />
            </Box>
          ),
          code: `<LineChart
  series={series}
  labels={labels}
  showLegend={false}
/>`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Smooth Curves:</strong> LineChart uses Catmull-Rom spline interpolation for smooth, natural-looking curves.
            Set <code>smooth=false</code> for sharp, angular lines.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Multiple Series:</strong> Display multiple lines on the same chart for easy comparison.
            Each series can have its own color and can be dashed for projections or secondary data.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Custom Formatting:</strong> Use <code>yAxisFormatter</code> to format axis labels with currency symbols,
            percentages, or any custom format. Use <code>yAxisSuffix</code> for simple suffix additions.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
