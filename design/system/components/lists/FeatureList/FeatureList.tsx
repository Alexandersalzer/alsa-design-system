// ===============================================
// design/system/components/lists/FeatureList/FeatureList.tsx
// Feature list with icon bullet points
// ===============================================

import React from 'react';
import { Check, CheckCircle, Circle, Dot } from 'lucide-react';
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

// ===== ICON RESOLVER =====

const ICONS: Record<FeatureListIcon, React.FC<{ className?: string }>> = {
  check: ({ className }) => <Check className={className} strokeWidth={2.5} />,
  checkCircle: ({ className }) => <CheckCircle className={className} strokeWidth={2} />,
  dot: ({ className }) => <Dot className={className} strokeWidth={3} />,
  bullet: ({ className }) => (
    <span className={cn('feature-list__bullet', className)} aria-hidden="true" />
  ),
};

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
        const IconComponent = ICONS[item.icon ?? icon];
        return (
          <li key={i} className="feature-list__item">
            <span className="feature-list__icon" aria-hidden="true">
              <IconComponent className="feature-list__icon-svg" />
            </span>
            <span className="feature-list__text">{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
};

FeatureList.displayName = 'FeatureList';
