// ===============================================
// src/app/dashboard/admin/documentation/chartData.ts
// SAMPLE CHART DATA
// 14 realistic datasets for testing and examples
// ===============================================

/**
 * Sample chart data for demonstrations
 * Stripe-inspired realistic data
 */

// Revenue data (monthly)
export const revenueData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  series: [
    {
      name: 'Revenue',
      data: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 69000, 78000, 82000, 89000, 95000],
      color: 'accent' as const,
    },
  ],
};

// Multiple metrics
export const metricsComparisonData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  series: [
    {
      name: 'Revenue',
      data: [45000, 52000, 48000, 61000, 58000, 67000],
      color: 'accent' as const,
    },
    {
      name: 'Costs',
      data: [32000, 35000, 33000, 38000, 37000, 41000],
      color: 'error' as const,
      dashed: true,
    },
    {
      name: 'Profit',
      data: [13000, 17000, 15000, 23000, 21000, 26000],
      color: 'success' as const,
    },
  ],
};

// User growth
export const userGrowthData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
  series: [
    {
      name: 'Active Users',
      data: [1240, 1580, 1820, 2100, 2450, 2780, 3120, 3580],
      color: 'info' as const,
    },
  ],
};

// Sparkline data (compact metrics)
export const sparklineData = {
  revenue: [45, 52, 48, 61, 58, 67, 72, 69, 78, 82, 89, 95],
  users: [1240, 1580, 1820, 2100, 2450, 2780, 3120, 3580, 3920, 4280, 4650, 5120],
  conversion: [2.4, 2.8, 2.6, 3.1, 3.4, 3.7, 3.5, 3.9, 4.2, 4.0, 4.5, 4.8],
  churn: [0.8, 0.7, 0.9, 0.6, 0.7, 0.5, 0.6, 0.4, 0.5, 0.4, 0.3, 0.3],
};

// Bar chart data (categories)
export const categoryData = [
  { label: 'Subscriptions', value: 45000, color: 'accent' as const },
  { label: 'One-time', value: 28000, color: 'success' as const },
  { label: 'Enterprise', value: 67000, color: 'info' as const },
  { label: 'Add-ons', value: 12000, color: 'warning' as const },
];

// Regional sales
export const regionalSalesData = {
  labels: ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'],
  series: [
    {
      name: 'Q1',
      data: [145000, 98000, 67000, 34000, 28000],
      color: 'accent' as const,
    },
    {
      name: 'Q2',
      data: [162000, 112000, 78000, 41000, 35000],
      color: 'success' as const,
    },
    {
      name: 'Q3',
      data: [178000, 125000, 89000, 48000, 42000],
      color: 'info' as const,
    },
  ],
};

// Funnel / conversion data
export const conversionFunnelData = {
  labels: ['Visits', 'Sign-ups', 'Trials', 'Paid', 'Retained'],
  series: [
    {
      name: 'Conversion',
      data: [100000, 28000, 12000, 6800, 5900],
      color: 'accent' as const,
    },
  ],
};

// Time series (hourly)
export const hourlyTrafficData = {
  labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
  series: [
    {
      name: 'Requests',
      data: [
        120, 95, 78, 62, 58, 71, 102, 145, 189, 234, 278, 312,
        325, 318, 295, 287, 312, 345, 378, 362, 328, 289, 234, 178
      ],
      color: 'accent' as const,
    },
  ],
};

// Error rate (should show declining trend)
export const errorRateData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: 'Error Rate %',
      data: [2.4, 2.1, 1.8, 1.6, 1.3, 1.1, 0.9],
      color: 'error' as const,
    },
  ],
};

// API response times
export const responseTimeData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  series: [
    {
      name: 'p50',
      data: [45, 42, 58, 67, 72, 51],
      color: 'success' as const,
    },
    {
      name: 'p95',
      data: [89, 87, 112, 134, 145, 98],
      color: 'warning' as const,
    },
    {
      name: 'p99',
      data: [178, 165, 234, 289, 312, 201],
      color: 'error' as const,
    },
  ],
};

// MRR (Monthly Recurring Revenue) with projections
export const mrrData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  series: [
    {
      name: 'Actual MRR',
      data: [125000, 132000, 138000, 145000, 152000, 161000, 161000, 161000],
      color: 'accent' as const,
    },
    {
      name: 'Projected MRR',
      data: [125000, 132000, 138000, 145000, 152000, 161000, 169000, 178000],
      color: 'accent' as const,
      dashed: true,
    },
  ],
};

// Browser market share (Donut Chart)
export const browserShareData = [
  { label: 'Chrome', value: 65.4, color: 'accent' as const },
  { label: 'Safari', value: 18.8, color: 'success' as const },
  { label: 'Edge', value: 5.2, color: 'info' as const },
  { label: 'Firefox', value: 3.1, color: 'warning' as const },
  { label: 'Other', value: 7.5, color: 'error' as const },
];

// Storage usage (Donut Chart)
export const storageUsageData = [
  { label: 'Photos', value: 842, color: 'accent' as const },
  { label: 'Videos', value: 456, color: 'info' as const },
  { label: 'Documents', value: 234, color: 'success' as const },
  { label: 'Other', value: 167, color: 'warning' as const },
];

// Team productivity (Donut Chart)
export const teamProductivityData = [
  { label: 'Development', value: 38.2, color: 'accent' as const },
  { label: 'Design', value: 23.5, color: 'success' as const },
  { label: 'Marketing', value: 18.9, color: 'info' as const },
  { label: 'Sales', value: 12.3, color: 'warning' as const },
  { label: 'Support', value: 7.1, color: 'error' as const },
];

// Stacked area chart data
export const stackedAreaData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
  series: [
    {
      name: 'Mobile',
      data: [12000, 15000, 14000, 18000, 17000, 21000, 23000, 25000],
      color: 'accent' as const,
    },
    {
      name: 'Desktop',
      data: [28000, 32000, 30000, 35000, 38000, 42000, 45000, 48000],
      color: 'success' as const,
    },
    {
      name: 'Tablet',
      data: [5000, 6000, 5500, 7000, 7500, 8000, 8500, 9000],
      color: 'info' as const,
    },
  ],
};

// Traffic sources (Area Chart)
export const trafficSourcesData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  series: [
    {
      name: 'Organic',
      data: [4200, 4800, 5100, 5400, 5800, 3200, 2900],
      color: 'success' as const,
    },
    {
      name: 'Direct',
      data: [2100, 2400, 2600, 2800, 3100, 1800, 1600],
      color: 'accent' as const,
    },
    {
      name: 'Social',
      data: [1500, 1800, 2100, 2300, 2600, 1400, 1200],
      color: 'info' as const,
    },
    {
      name: 'Referral',
      data: [800, 1000, 1200, 1400, 1600, 900, 700],
      color: 'warning' as const,
    },
  ],
};

export default {
  revenueData,
  metricsComparisonData,
  userGrowthData,
  sparklineData,
  categoryData,
  regionalSalesData,
  conversionFunnelData,
  hourlyTrafficData,
  errorRateData,
  responseTimeData,
  mrrData,
  browserShareData,
  storageUsageData,
  teamProductivityData,
  stackedAreaData,
  trafficSourcesData,
};
