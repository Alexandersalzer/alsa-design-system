// ===============================================
// src/design-system/components/layout/Bleed/Bleed.tsx
// LAYOUT PRIMITIVE FOR BREAKING OUT OF CONTAINER PADDING
// ===============================================

import React, { forwardRef, ReactNode, CSSProperties } from 'react';
import { cn } from '../../../utils/cn';

// Spacing token type - matches the design system spacing scale
type SpacingToken =
  | 'none' | '0'
  | 'xs' | '1' | '2' | '3'
  | 'sm' | '4' | '5'
  | 'md' | '6' | '8'
  | 'lg' | '10' | '12'
  | 'xl' | '16' | '20'
  | '2xl' | '24' | '32' | '40';

export interface BleedProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;

  // Logical properties (preferred)
  inline?: SpacingToken | string | number;
  block?: SpacingToken | string | number;
  inlineStart?: SpacingToken | string | number;
  inlineEnd?: SpacingToken | string | number;
  blockStart?: SpacingToken | string | number;
  blockEnd?: SpacingToken | string | number;

  // Polymorphic component support
  as?: React.ElementType;

  // AsChild pattern support (Radix-style composition)
  asChild?: boolean;

  className?: string;
  style?: CSSProperties;
}

/**
 * Maps spacing tokens to CSS variable values
 * Returns the CSS variable for known tokens, or the raw value for custom values
 */
const getSpacingValue = (value: SpacingToken | string | number | undefined): string | undefined => {
  if (value === undefined) return undefined;

  // Handle numeric values
  if (typeof value === 'number') {
    return `${value}px`;
  }

  // Map tokens to CSS variables
  const tokenMap: Record<string, string> = {
    'none': 'var(--foundation-space-0)',
    '0': 'var(--foundation-space-0)',
    'xs': 'var(--foundation-space-2)',
    '1': 'var(--foundation-space-1)',
    '2': 'var(--foundation-space-2)',
    '3': 'var(--foundation-space-3)',
    'sm': 'var(--foundation-space-4)',
    '4': 'var(--foundation-space-4)',
    '5': 'var(--foundation-space-5)',
    'md': 'var(--foundation-space-6)',
    '6': 'var(--foundation-space-6)',
    '8': 'var(--foundation-space-8)',
    'lg': 'var(--foundation-space-10)',
    '10': 'var(--foundation-space-10)',
    '12': 'var(--foundation-space-12)',
    'xl': 'var(--foundation-space-16)',
    '16': 'var(--foundation-space-16)',
    '20': 'var(--foundation-space-20)',
    '2xl': 'var(--foundation-space-24)',
    '24': 'var(--foundation-space-24)',
    '32': 'var(--foundation-space-32)',
    '40': 'var(--foundation-space-40)',
  };

  // Return mapped token or raw value
  return tokenMap[value as string] || value;
};

/**
 * Converts a spacing value to a negative margin
 */
const toNegativeMargin = (value: string | undefined): string | undefined => {
  if (!value) return undefined;

  // If it's a CSS variable, wrap it in calc()
  if (value.startsWith('var(')) {
    return `calc(-1 * ${value})`;
  }

  // If it's a raw value, negate it
  if (value.startsWith('-')) {
    return value; // Already negative
  }

  return `-${value}`;
};

/**
 * Bleed Component
 *
 * A layout primitive that breaks out of parent container padding using negative margins.
 * Uses logical CSS properties for better internationalization support.
 *
 * @example
 * // Break out horizontally
 * <Box padding="xl">
 *   <Bleed inline="xl">
 *     <Media />
 *   </Bleed>
 * </Box>
 *
 * @example
 * // Break out only at the top
 * <Section>
 *   <Bleed blockStart="xl">
 *     <HeroMedia />
 *   </Bleed>
 * </Section>
 *
 * @example
 * // Use with asChild for composition
 * <Bleed inline="md" asChild>
 *   <img src="..." alt="..." />
 * </Bleed>
 */
export const Bleed = forwardRef<HTMLElement, BleedProps>(
  (
    {
      children,
      inline,
      block,
      inlineStart,
      inlineEnd,
      blockStart,
      blockEnd,
      as: Component = 'div',
      asChild = false,
      className,
      style,
      ...props
    },
    ref
  ) => {
    // Build the inline style with negative margins
    const bleedStyles: CSSProperties = {
      ...style,
    };

    // Apply inline margins (horizontal in LTR, vertical in vertical writing modes)
    if (inline) {
      const value = toNegativeMargin(getSpacingValue(inline));
      if (value) {
        bleedStyles.marginInline = value;
      }
    }

    // Apply block margins (vertical in LTR, horizontal in vertical writing modes)
    if (block) {
      const value = toNegativeMargin(getSpacingValue(block));
      if (value) {
        bleedStyles.marginBlock = value;
      }
    }

    // Apply individual directional margins (override inline/block if specified)
    if (inlineStart) {
      const value = toNegativeMargin(getSpacingValue(inlineStart));
      if (value) {
        bleedStyles.marginInlineStart = value;
      }
    }

    if (inlineEnd) {
      const value = toNegativeMargin(getSpacingValue(inlineEnd));
      if (value) {
        bleedStyles.marginInlineEnd = value;
      }
    }

    if (blockStart) {
      const value = toNegativeMargin(getSpacingValue(blockStart));
      if (value) {
        bleedStyles.marginBlockStart = value;
      }
    }

    if (blockEnd) {
      const value = toNegativeMargin(getSpacingValue(blockEnd));
      if (value) {
        bleedStyles.marginBlockEnd = value;
      }
    }

    // Handle asChild pattern (Radix-style composition)
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        className: cn('bleed', className, (children as any).props?.className),
        style: {
          ...(children as any).props?.style,
          ...bleedStyles,
        },
        ref,
      });
    }

    // Default rendering
    return (
      <Component
        ref={ref}
        className={cn('bleed', className)}
        style={bleedStyles}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Bleed.displayName = 'Bleed';

/* ===== USAGE EXAMPLES =====

// ✅ Break out of container padding horizontally
<Box padding="xl">
  <Bleed inline="xl">
    <img src="/hero.jpg" alt="Hero" />
  </Bleed>
</Box>

// ✅ Full bleed (all directions)
<Section padding="2xl">
  <Bleed inline="2xl" block="2xl">
    <BackgroundMedia />
  </Bleed>
</Section>

// ✅ Break out only at top (common for hero sections)
<Section>
  <Bleed blockStart="xl">
    <HeroMedia />
  </Bleed>
  <Content />
</Section>

// ✅ Asymmetric bleed (left side only)
<Box padding="lg">
  <Bleed inlineStart="lg">
    <SidebarImage />
  </Bleed>
</Box>

// ✅ With asChild for composition (no wrapper div)
<Card padding="md">
  <Bleed inline="md" blockEnd="md" asChild>
    <img src="/product.jpg" alt="Product" className="product-image" />
  </Bleed>
</Card>

// ✅ Using numeric values (px)
<Container>
  <Bleed inline={24}>
    <Media />
  </Bleed>
</Container>

// ✅ Using custom CSS values
<Box padding="xl">
  <Bleed inline="var(--custom-spacing)">
    <CustomComponent />
  </Bleed>
</Box>

// ✅ Polymorphic component (render as different element)
<Section>
  <Bleed as="article" blockStart="lg" className="hero-article">
    <HeroContent />
  </Bleed>
</Section>

===== NON-GOALS (What Bleed should NOT do) =====

❌ Don't add background colors
❌ Don't add padding
❌ Don't add borders
❌ Don't automatically detect navbar height
❌ Don't add hero-specific logic
❌ Don't apply z-index
❌ Don't modify display property

Bleed is purely structural - it only applies negative margins.

*/
