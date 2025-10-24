// ===============================================
// LineChart Demo Component
// ===============================================

import React from 'react';
import { LineChart, LineChartDataPoint } from './design/system/components/primitives/LineChart';

const sampleData: LineChartDataPoint[] = [
  { x: 'Jan', y: 65 },
  { x: 'Feb', y: 59 },
  { x: 'Mar', y: 80 },
  { x: 'Apr', y: 81 },
  { x: 'May', y: 56 },
  { x: 'Jun', y: 55 },
  { x: 'Jul', y: 40 },
  { x: 'Aug', y: 62 },
  { x: 'Sep', y: 78 },
  { x: 'Oct', y: 85 },
  { x: 'Nov', y: 92 },
  { x: 'Dec', y: 88 }
];

const websiteTrafficData: LineChartDataPoint[] = [
  { x: '00:00', y: 120 },
  { x: '04:00', y: 80 },
  { x: '08:00', y: 200 },
  { x: '12:00', y: 350 },
  { x: '16:00', y: 280 },
  { x: '20:00', y: 180 },
  { x: '24:00', y: 150 }
];

const revenueData: LineChartDataPoint[] = [
  { x: 1, y: 1000 },
  { x: 2, y: 1200 },
  { x: 3, y: 1100 },
  { x: 4, y: 1400 },
  { x: 5, y: 1600 },
  { x: 6, y: 1500 },
  { x: 7, y: 1800 },
  { x: 8, y: 2000 },
  { x: 9, y: 1900 },
  { x: 10, y: 2200 }
];

export const LineChartDemo: React.FC = () => {
  return (
    <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
      {/* Monthly Performance Chart */}
      <LineChart
        data={sampleData}
        title="Monthly Performance"
        subtitle="Website visitors over the year"
        xAxisLabel="Month"
        yAxisLabel="Visitors"
        width={400}
        height={300}
        lineColor="var(--color-primary)"
        showGrid={true}
        showAxes={true}
        showLabels={true}
        showDots={true}
        animate={true}
      />

      {/* Daily Traffic Chart */}
      <LineChart
        data={websiteTrafficData}
        title="Daily Traffic"
        subtitle="Website traffic throughout the day"
        xAxisLabel="Time"
        yAxisLabel="Visitors"
        width={400}
        height={300}
        lineColor="var(--color-success)"
        showGrid={true}
        showAxes={true}
        showLabels={true}
        showDots={true}
        animate={true}
      />

      {/* Revenue Growth Chart */}
      <LineChart
        data={revenueData}
        title="Revenue Growth"
        subtitle="Monthly revenue progression"
        xAxisLabel="Month"
        yAxisLabel="Revenue (€)"
        width={400}
        height={300}
        lineColor="var(--color-warning)"
        showGrid={true}
        showAxes={true}
        showLabels={true}
        showDots={true}
        animate={true}
      />

      {/* Minimal Chart */}
      <LineChart
        data={sampleData.slice(0, 6)}
        title="Simple Chart"
        width={400}
        height={300}
        lineColor="var(--color-accent)"
        showGrid={false}
        showAxes={true}
        showLabels={true}
        showDots={false}
        animate={false}
      />
    </div>
  );
};

export default LineChartDemo;












