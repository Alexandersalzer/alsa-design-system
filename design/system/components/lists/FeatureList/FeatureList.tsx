// ===============================================
// design/system/components/lists/FeatureList/FeatureList.tsx
// Feature list with icon bullet points
// ===============================================

import React from 'react';
import { Check, CheckCircle, Circle } from 'lucide-react';
import { Body } from '../../primitives/Typography/Typography';
import { cn } from '../../../utils/cn';
import './FeatureList.css';

// ===== TYPE DEFINITIONS =====

export type FeatureListIcon = 'check' | 'checkCircle' | 'dot' | 'bullet';
export type FeatureListSize = 'sm' | 'md' | 'lg';
export type FeatureListColor = 'default' | 'accent' | 'success' | 'muted';

export interface FeatureListItem {
  text: string;
  /** Override icon for this specific item */
  icon?: FeatureListIcon;
}

export interface FeatureListProps {
  /** Array of items — either plain strings or objects with text + optional icon override */
  items?: (string | FeatureListItem)[];
  /** Icon style used for all items (overridable per-item) */
  icon?: FeatureListIcon;
  /** Icon color */
  color?: FeatureListColor;
  /** Text + icon size */
  size?: FeatureListSize;
  /** Gap between list items */
  spacing?: 'xs' | 'sm' | 'md';
  className?: string;
  componentKey?: string;
}

// ===== SIZE MAP =====
// SVG pixel sizes per size + icon type
const SVG_SIZE: Record<FeatureListSize, { regular: number; dot: number }> = {
  sm: { regular: 14, dot: 7  },
  md: { regular: 18, dot: 9  },
  lg: { regular: 22, dot: 11 },
};

// ===== ICON RENDERER =====
function renderIcon(icon: FeatureListIcon, size: FeatureListSize) {
  const { regular, dot } = SVG_SIZE[size];
  switch (icon) {
    case 'check':
      return <Check width={regular} height={regular} strokeWidth={2.5} />;
    case 'checkCircle':
      return <CheckCircle width={regular} height={regular} strokeWidth={2} />;
    case 'dot':
      return <Circle width={dot} height={dot} fill="currentColor" strokeWidth={0} />;
    case 'bullet':
      return <span className="feature-list__bullet" aria-hidden="true" />;
  }
}

function resolveItem(item: string | FeatureListItem): FeatureListItem {
  return typeof item === 'string' ? { text: item } : item;
}

// ===== COMPONENT =====

export const FeatureList: React.FC<FeatureListProps> = ({
  items = [],
  icon = 'check',
  color = 'accent',
  size = 'md',
  spacing = 'sm',
  className,
  componentKey,
}) => {
  if (items.length === 0) return null;

  return (
    <ul
      className={cn(
        'feature-list',
        `feature-list--${size}`,
        `feature-list--spacing-${spacing}`,
        `feature-list--color-${color}`,
        className
      )}
      data-component-key={componentKey}
    >
      {items.map((raw, i) => {
        const item = resolveItem(raw);
        return (
          <li key={i} className="feature-list__item">
            <span className="feature-list__icon" aria-hidden="true">
              {renderIcon(item.icon ?? icon, size)}
            </span>
            <Body size={size} color="secondary" className="feature-list__text" preserveLineBreaks={false}>{item.text}</Body>
          </li>
        );
      })}
    </ul>
  );
};

FeatureList.displayName = 'FeatureList';
