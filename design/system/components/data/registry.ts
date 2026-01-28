import { Table } from './Table/Table';
import { IndexTable } from './IndexTable/IndexTable';
import { LineChart } from './LineChart/LineChart';
import { BarChart } from './BarChart/BarChart';
import { AreaChart } from './AreaChart/AreaChart';
import { DonutChart } from './DonutChart/DonutChart';
import { Sparkline } from './Sparkline/Sparkline';

export const dataComponents: Record<string, React.ComponentType<any>> = {
  table: Table,
  indexTable: IndexTable,
  lineChart: LineChart,
  barChart: BarChart,
  areaChart: AreaChart,
  donutChart: DonutChart,
  sparkline: Sparkline,
};