import { LineChart } from './LineChart';
import { Sparkline } from './Sparkline';
import { BarChart } from './BarChart';
import { DonutChart } from './DonutChart';
import { AreaChart } from './AreaChart';
import { Table } from './Table';
import { IndexTable } from './IndexTable';

export const dataComponents: Record<string, React.ComponentType<any>> = {
  lineChart: LineChart,
  sparkline: Sparkline,
  barChart: BarChart,
  donutChart: DonutChart,
  areaChart: AreaChart,
  table: Table,
  indexTable: IndexTable,
};