import LineChart from './LineChart/LineChart';
import Sparkline from './Sparkline/Sparkline';
import BarChart from './BarChart/BarChart';
import DonutChart from './DonutChart/DonutChart';
import AreaChart from './AreaChart/AreaChart';
import { Table } from './Table/Table';
import { IndexTable } from './IndexTable/IndexTable';

export const dataComponents: Record<string, React.ComponentType<any>> = {
  lineChart: LineChart,
  sparkline: Sparkline,
  barChart: BarChart,
  donutChart: DonutChart,
  areaChart: AreaChart,
  table: Table,
  indexTable: IndexTable,
};