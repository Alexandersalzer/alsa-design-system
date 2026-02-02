// ===============================================
// design/system/components/layout/hStack/HStack.tsx
// UPDATED TO ACCEPT ALL DIV PROPS
// ===============================================
import React, { ReactNode, HTMLAttributes } from 'react';
import './HStack.css';

// ===== TYPE DEFINITIONS =====
type JustifyValue = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
type DirectionValue = 'row' | 'row-reverse' | 'column' | 'column-reverse';

type AlignValue = 'start' | 'center' | 'end' | 'baseline' | 'stretch';

export interface HStackProps extends HTMLAttributes<HTMLDivElement> { // ✅ Extend HTMLAttributes
  children: ReactNode;
  className?: string;
  // Spacing between items
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Alignment
  align?: AlignValue;
  justify?: JustifyValue;
  // Mobile-specific align (overrides align on mobile)
  mobileAlign?: AlignValue;
  // Mobile-specific justify (overrides justify on mobile)
  mobileJustify?: JustifyValue;
  // Wrapping behavior
  wrap?: boolean;
  // Direction
  direction?: 'row' | 'row-reverse';
  // Mobile-specific direction (overrides direction on mobile)
  mobileDirection?: DirectionValue;
}

// ===== SIMPLE CLASS CONCATENATION =====
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

// ===== MAIN HStack COMPONENT =====
export const HStack = React.forwardRef<HTMLDivElement, HStackProps>(({
  children,
  className,
  spacing = 'md',
  align = 'center',
  justify = 'start',
  mobileAlign,
  mobileJustify,
  wrap = false,
  direction = 'row',
  mobileDirection,
  ...props // ✅ Now includes onClick and other HTML props
}, ref) => {
  // Build CSS classes
  const classes = buildClasses(
    'hStack',
    `hStack--spacing-${spacing}`,
    `hStack--align-${align}`,
    justify !== 'start' && `hStack--justify-${justify}`,
    mobileAlign && `hStack--mobileAlign-${mobileAlign}`,
    mobileJustify && `hStack--mobileJustify-${mobileJustify}`,
    wrap && 'hStack--wrap',
    direction !== 'row' && `hStack--${direction}`,
    mobileDirection && `hStack--mobileDirection-${mobileDirection}`,
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

HStack.displayName = 'HStack';