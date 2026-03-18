// ===============================================
// src/design-system/components/primitives/Typography/index.ts
// COMPLETE TYPOGRAPHY EXPORTS - EVERYTHING YOU NEED
// ===============================================

// ===== MAIN TYPOGRAPHY COMPONENTS =====
export {
  Typography,
  Display,
  Body,
  Label,
  Code,
  TypographyGroup,
  JsonText
} from './Typography';

// ===== SIMPLE HEADING COMPONENTS - H1 through H6 =====
export {
  H1,
  H2, 
  H3,
  H4,
  H5,
  H6
} from './Typography';

// ===== DYNAMIC HEADING COMPONENT =====
export {
  Heading  // Dynamic heading with level 1-6 prop
} from './Typography';

// ===== TYPES =====
export type {
  TypographyProps,
  TypographyVariant,
  TypographyWeight,
  TypographyColor,
  TypographyAlign,
  TypographyOwnProps,
  DisplayProps,
  BodyProps,
  LabelProps,
  CodeProps,
  TypographyGroupProps,
  WithTypographyProps,
  TextSpan
} from './Typography';

// ===== UTILITY FUNCTIONS =====
export {
  buildTypographyClasses,
  createNavigationTypographyProps,
  createTypographyClasses,
  createTabTypographyProps,
  getColorValue,
  getDefaultElement,
  withTypography
} from './Typography';


// ===== USAGE EXAMPLES =====
/*
// ✅ SUPER EASY IMPORTS:

// Import just the headings you need:
import { H1, H3, H6 } from '@blimpify-im/ui';

// Import everything:
import { 
  H1, H2, H3, H4, H5, H6, 
  Body, Label, Display 
} from '@blimpify-im/ui';

// ✅ THEN USE THEM SIMPLY:

// Editor TopBar
<H3>Website Editor</H3>

// Dashboard
<H1>Analytics Dashboard</H1>
<H2>Revenue Overview</H2>
<H4>Monthly Sales</H4>

// Cards
<H4>John Doe</H4>
<H6 color="secondary">Administrator</H6>

// With other typography
<Body size="md">Here's some content...</Body>
<Label size="sm">Form Label</Label>

// Override defaults when needed
<H3 color="accent" weight="bold">Special Title</H3>
<H5 color="error">Error Message</H5>

// Legacy compatibility (still works but deprecated)
<Heading level={3}>Old Way</Heading>  // Use <H3> instead
*/