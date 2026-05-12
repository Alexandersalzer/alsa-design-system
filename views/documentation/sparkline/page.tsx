"use client";

import React from 'react';
import { Box, Body, Sparkline } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { sparklineData } from '../chartData';

export default function SparklinePage() {
  return (
    <ComponentDocPage
      componentName="Sparkline"
      description="Compact mini-chart perfect for dashboards and KPI cards. Shows trends at a glance."
      importStatement={`import { Sparkline } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple sparkline with data array',
          preview: (
            <Box>
              <Sparkline data={sparklineData.revenue} />
            </Box>
          ),
          code: `import { Sparkline } from '../../../design/index';

const data = [45, 52, 48, 61, 58, 67, 72, 69, 78, 82, 89, 95];

<Sparkline data={data} />`,
        },

        {
          title: 'With Value Display',
          description: 'Show current value and label',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box>
                <Sparkline
                  data={sparklineData.revenue}
                  showValue
                  valueLabel="Revenue"
                  valueFormatter={(v) => `$${v}k`}
                />
              </Box>
              <Box>
                <Sparkline
                  data={sparklineData.users}
                  showValue
                  valueLabel="Active Users"
                  color="success"
                />
              </Box>
            </Box>
          ),
          code: `<Sparkline
  data={revenueData}
  showValue
  valueLabel="Revenue"
  valueFormatter={(v) => \`$\${v}k\`}
/>`,
        },

        {
          title: 'With Trend Indicator',
          description: 'Display percentage change with up/down indicator',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box>
                <Sparkline
                  data={sparklineData.revenue}
                  showValue
                  showTrend
                  valueLabel="Revenue"
                  valueFormatter={(v) => `$${v}k`}
                  color="accent"
                />
              </Box>
              <Box>
                <Sparkline
                  data={sparklineData.churn}
                  showValue
                  showTrend
                  valueLabel="Churn Rate"
                  valueFormatter={(v) => `${v}%`}
                  color="error"
                />
              </Box>
            </Box>
          ),
          code: `<Sparkline
  data={data}
  showValue
  showTrend
  valueLabel="Revenue"
  valueFormatter={(v) => \`$\${v}k\`}
/>`,
        },

        {
          title: 'Color Variants',
          description: 'Different color themes for various metrics',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-2 sm:grid-cols-3">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Accent</Body>
                  <Sparkline data={sparklineData.revenue} color="accent" showValue valueLabel="Revenue" />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Success</Body>
                  <Sparkline data={sparklineData.users} color="success" showValue valueLabel="Users" />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Info</Body>
                  <Sparkline data={sparklineData.conversion} color="info" showValue valueLabel="Conv. Rate" />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Warning</Body>
                  <Sparkline data={sparklineData.revenue} color="warning" showValue valueLabel="Pending" />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Error</Body>
                  <Sparkline data={sparklineData.churn} color="error" showValue valueLabel="Errors" />
                </Box>
              </Box>
            </Box>
          ),
          code: `<Sparkline data={data} color="accent" />

<Sparkline data={data} color="success" />

<Sparkline data={data} color="info" />

<Sparkline data={data} color="warning" />

<Sparkline data={data} color="error" />`        },

        {
          title: 'Line vs Area',
          description: 'With or without area fill',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">With Area</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    showArea
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Line Only</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    showArea={false}
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<Sparkline data={data} showArea />

<Sparkline data={data} showArea={false} />`        },

        {
          title: 'Smooth vs Sharp',
          description: 'Curved or straight line segments',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Smooth</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    smooth
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Sharp</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    smooth={false}
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<Sparkline data={data} smooth />

<Sparkline data={data} smooth={false} />`        },

        {
          title: 'Custom Sizes',
          description: 'Adjust width and height',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Small (80x30)</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    width={80}
                    height={30}
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Default (120x40)</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Large (160x60)</Body>
                  <Sparkline
                    data={sparklineData.revenue}
                    width={160}
                    height={60}
                    showValue
                    valueLabel="Revenue"
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<Sparkline data={data} width={80} height={30} />

<Sparkline data={data} width={120} height={40} />

<Sparkline data={data} width={160} height={60} />`        },

        {
          title: 'Dashboard KPI Cards',
          description: 'Real-world usage in dashboard cards',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <Box>
                <Sparkline
                  data={sparklineData.revenue}
                  showValue
                  showTrend
                  valueLabel="MRR"
                  valueFormatter={(v) => `$${v}k`}
                  color="accent"
                />
              </Box>
              <Box>
                <Sparkline
                  data={sparklineData.users}
                  showValue
                  showTrend
                  valueLabel="Active Users"
                  color="success"
                />
              </Box>
              <Box>
                <Sparkline
                  data={sparklineData.conversion}
                  showValue
                  showTrend
                  valueLabel="Conversion"
                  valueFormatter={(v) => `${v}%`}
                  color="info"
                />
              </Box>
              <Box>
                <Sparkline
                  data={sparklineData.churn}
                  showValue
                  showTrend
                  valueLabel="Churn Rate"
                  valueFormatter={(v) => `${v}%`}
                  color="error"
                />
              </Box>
            </Box>
          ),
          code: `// Dashboard KPI Card Example
<Box>
  <Sparkline
    data={revenueData}
    showValue
    showTrend
    valueLabel="MRR"
    valueFormatter={(v) => \`$\${v}k\`}
    color="accent"
  />
</Box>`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Perfect for Dashboards:</strong> Sparklines are designed to show trends at a glance in compact spaces.
            They work great in KPI cards, table cells, and dashboard widgets.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Minimal Footprint:</strong> Unlike full charts, sparklines are small and focus on the shape of the trend
            rather than precise values. Use them to give users quick insights without overwhelming the interface.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Value Formatters:</strong> Use the <code>valueFormatter</code> prop to customize how values are displayed
            (currency, percentages, abbreviations, etc.).
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
