import { VStack } from './vStack';
import { HStack } from './hStack';
import { Rhythm } from './rhythm';
import { Grid } from './grid';
import { Box } from './box';
import { Divider } from './divider';
import { Card } from './Card';
import { ResizeHandle } from './ResizeHandle';
import { Accordion } from './Accordion';
import { Sticky } from './Sticky';
import { AnimatedBox } from './AnimatedBox';
import { OverflowContainer } from './OverflowContainer';
import { Spacer } from './Spacer';

export const layoutComponents: Record<string, React.ComponentType<any>> = {
  vStack: VStack,
  hStack: HStack,
  rhythm: Rhythm,
  grid: Grid,
  box: Box,
  divider: Divider,
  card: Card,
  resizeHandle: ResizeHandle,
  accordion: Accordion,
  sticky: Sticky,
  animatedBox: AnimatedBox,
  overflowContainer: OverflowContainer,
  spacer: Spacer,
};