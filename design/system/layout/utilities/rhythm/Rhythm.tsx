// ===============================================
// src/design-system/components/patterns/page/Rhythm.tsx
// RHYTHM COMPONENT - Baseline grid layout with positioned elements
// ===============================================

import React, { ReactNode } from 'react';

// ===== TYPE DEFINITIONS =====

export interface RhythmItemProps {
  children: ReactNode;
  at: number; // Position on the baseline grid (1, 2, 3, etc.)
  className?: string;
}

export interface RhythmProps {
  children: ReactNode;
  className?: string;
  
  // Base unit for baseline grid spacing
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

  // Tillgängliga units: xs = 8px, sm = 12px, md = 16px (standard), lg = 24px, xl = 32px, 2xl = 48px
  
  // Alignment
  align?: 'start' | 'center' | 'end' | 'stretch';
  
  // Direction
  direction?: 'column' | 'row';
  
  // Maximum baseline grid points (for validation)
  maxPoints?: number;
}

// ===== SIMPLE CLASS CONCATENATION =====
function buildClasses(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(' ');
}

// ===== RHYTHM ITEM COMPONENT =====

export const RhythmItem: React.FC<RhythmItemProps> = ({
  children,
  at,
  className,
}) => {
  return (
    <div 
      className={buildClasses('baseline-grid-item', className)}
      style={{ '--baseline-grid-position': at } as React.CSSProperties}
      data-baseline-grid-at={at}
    >
      {children}
    </div>
  );
};

// ===== MAIN RHYTHM COMPONENT =====

export const Rhythm = React.forwardRef<HTMLDivElement, RhythmProps>(({
  children,
  className,
  unit = 'md',
  align = 'stretch',
  direction = 'column',
  maxPoints = 12,
  ...props
}, ref) => {
  
  // Build CSS classes
  const classes = buildClasses(
    'baseline-grid',
    `baseline-grid--unit-${unit}`,
    `baseline-grid--${direction}`,
    align !== 'stretch' && `baseline-grid--align-${align}`,
    className
  );

  // Process children to extract baseline grid positions
  const rhythmChildren = React.Children.toArray(children);
  const maxPosition = Math.max(
    1, // Default minimum position
    ...rhythmChildren
      .filter((child): child is React.ReactElement<RhythmItemProps> => 
        React.isValidElement(child) && child.type === RhythmItem
      )
      .map(child => child.props.at || 1)
  );

  return (
    <div 
      ref={ref} 
      className={classes}
      style={{
        '--baseline-grid-max-position': Math.min(maxPosition, maxPoints),
        '--baseline-grid-direction': direction,
      } as React.CSSProperties}
      {...props}
    >
      {children}
    </div>
  );
});

Rhythm.displayName = 'Rhythm';
RhythmItem.displayName = 'RhythmItem';

// ===== CONVENIENCE HOOKS =====

export const useRhythm = (unit: RhythmProps['unit'] = 'md') => {
  return {
    Item: RhythmItem,
    unit,
  };
}; 