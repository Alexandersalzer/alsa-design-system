// ===============================================
// src/design-system/components/primitives/Typography/index.ts
// FIXED - Updated export file to match enhanced Typography component
// ===============================================

export {
  Typography,
  Heading,
  Display,  // ✅ Now included
  Body,
  Label,
  Code,
  TypographyGroup,
  withTypography,
  buildTypographyClasses,
  getDefaultElement,
  getColorValue,  // ✅ New utility function
  createTypographyClasses,  // ✅ Updated structure
  createTabTypographyProps,  // ✅ New utility for tabs
  createNavigationTypographyProps  // ✅ New utility for navigation
} from './Typography';

export type {
  TypographyVariant,
  TypographyWeight,
  TypographyColor,  // ✅ Enhanced with all design system colors
  TypographyAlign,
  TypographyProps,
  TypographyOwnProps,
  HeadingProps,
  DisplayProps,  // ✅ Now included
  BodyProps,
  LabelProps,
  CodeProps,
  TypographyGroupProps,
  WithTypographyProps
} from './Typography';

// ===============================================
// MIGRATION GUIDE - Updated usage examples
// ===============================================

/*

// ✅ NEW: Enhanced color options for navigation
import { Label, createNavigationTypographyProps } from '@/design-system/components/primitives/Typography';

const NavigationItem = ({ active, disabled, children }) => {
  const typographyProps = createNavigationTypographyProps(active, disabled);
  
  return (
    <Label
      size={typographyProps.size}
      weight={typographyProps.weight}
      color={typographyProps.color}  // ← Will be nav-selected, nav-default, or nav-disabled
    >
      {children}
    </Label>
  );
};

// ✅ NEW: Tab component integration
import { createTabTypographyProps } from '@/design-system/components/primitives/Typography';

const Tab = ({ variant, size, active, disabled, children }) => {
  const typographyProps = createTabTypographyProps(variant, size, active, disabled);
  
  return (
    <Label {...typographyProps}>
      {children}
    </Label>
  );
};*/