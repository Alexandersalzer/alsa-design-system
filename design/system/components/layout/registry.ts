import { Grid, GridItem } from './grid/Grid';
import { VStack } from './vStack/VStack';
import { HStack } from './hStack/HStack';
import { Box } from './box/Box';
import { Card } from './Card/Card';
import { Accordion } from './Accordion/Accordion';
import { Sticky } from './Sticky/Sticky';
import { AnimatedBox } from './AnimatedBox/AnimatedBox';
import { OverflowContainer } from './OverflowContainer/OverflowContainer';
import { Spacer } from './Spacer/Spacer';
import { Divider } from './divider/Divider';
import { Rhythm } from './rhythm/Rhythm';
import { Bleed } from './bleed/Bleed';
import { MasonryGrid, MasonryItem } from './MasonryGrid/MasonryGrid';
import { Overlay } from './Overlay/Overlay';

export const layoutComponents: Record<string, React.ComponentType<any>> = {
  grid: Grid,
  gridItem: GridItem,
  vstack: VStack,
  hstack: HStack,
  box: Box,
  card: Card,
  accordion: Accordion,
  sticky: Sticky,
  animatedBox: AnimatedBox,
  overflowContainer: OverflowContainer,
  spacer: Spacer,
  divider: Divider,
  rhythm: Rhythm,
  bleed: Bleed,
  masonryGrid: MasonryGrid,
  masonryItem: MasonryItem,
  overlay: Overlay,
};