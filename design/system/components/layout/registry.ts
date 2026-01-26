import { Grid, GridItem } from './grid/Grid';
import { VStack } from './vStack/VStack';
import { HStack } from './hStack/HStack';
import { Box } from './box/Box';

export const layoutComponents: Record<string, React.ComponentType<any>> = {
  grid: Grid,
  gridItem: GridItem,
  vstack: VStack,
  hstack: HStack,
  box: Box,
};