import {
  Body,
  Heading,
  Typography,
  Label,
  Display
} from './Typography';
import { CountUp } from '../animations/CountUp/CountUp';

export const typographyComponents: Record<string, React.ComponentType<any>> = {
  body: Body,
  heading: Heading,
  label: Label,
  typography: Typography,
  display: Display,
  countup: CountUp,
};