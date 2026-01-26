import { VStack } from './vStack/VStack';
import { HStack } from './hStack/HStack';
import { Rhythm } from './rhythm/Rhythm';
import { Grid } from './grid/Grid';
import { Box } from './box/Box';
import { Divider } from './divider/Divider';
import { Card } from './Card/Card';
import { ResizeHandle } from './ResizeHandle/ResizeHandle';
import { Accordion } from './Accordion/Accordion';
import { Sticky } from './Sticky/Sticky';
import { AnimatedBox } from './AnimatedBox/AnimatedBox';
import { OverflowContainer } from './OverflowContainer/OverflowContainer';
import { Spacer } from './Spacer/Spacer';

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