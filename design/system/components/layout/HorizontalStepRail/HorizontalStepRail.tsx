// ===============================================
// HorizontalStepRail.tsx
// Static horizontal connector rail for process/step sections
// Renders: node — line — node — line — node
// No scroll animation, fully static
// ===============================================

import React from 'react';
import './HorizontalStepRail.css';

const colorMap: Record<string, string> = {
  accent: 'var(--surface-accent)',
  default: 'var(--border-default)',
  subtle: 'var(--border-subtle)',
};

export interface HorizontalStepRailProps {
  /** Number of step nodes */
  steps?: number;
  /** Color token: 'accent' | 'default' | 'subtle' or a CSS value */
  color?: string;
  /** Line height in px */
  lineWidth?: number;
  /** Node diameter in px */
  nodeSize?: number;
  /** Additional CSS class */
  className?: string;
}

export const HorizontalStepRail: React.FC<HorizontalStepRailProps> = ({
  steps = 3,
  color = 'accent',
  lineWidth = 2,
  nodeSize = 10,
  className = '',
}) => {
  const resolvedColor = colorMap[color] ?? color;

  const items: React.ReactNode[] = [];

  for (let i = 0; i < steps; i++) {
    items.push(
      <div
        key={`node-${i}`}
        className="horizontal-step-rail__node"
        style={{
          width: nodeSize,
          height: nodeSize,
          background: resolvedColor,
          flexShrink: 0,
        }}
      />
    );
    if (i < steps - 1) {
      items.push(
        <div
          key={`line-${i}`}
          className="horizontal-step-rail__line"
          style={{
            height: lineWidth,
            background: resolvedColor,
          }}
        />
      );
    }
  }

  return (
    <div
      className={`horizontal-step-rail ${className}`}
      aria-hidden="true"
    >
      {items}
    </div>
  );
};

HorizontalStepRail.displayName = 'HorizontalStepRail';
