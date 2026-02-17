// ===============================================
// ProcessTimeline.tsx
// Vertical process timeline with scroll-based progressive fill
// Composition of RailSegments that forms a continuous vertical line
// ===============================================

'use client';

import React from 'react';
import { RailSegment } from '../ProgressRail/RailSegment';
import './ProcessTimeline.css';

export interface ProcessTimelineProps {
  /** Number of steps in the timeline */
  steps?: number;
  /** Size of the node indicators */
  nodeSize?: number;
  /** Width of the connecting line */
  lineWidth?: number;
  /** Color of active line */
  activeLineColor?: string;
  /** Color of inactive line */
  inactiveLineColor?: string;
  /** Color of active node */
  activeNodeColor?: string;
  /** Color of inactive node */
  inactiveNodeColor?: string;
  /** Scroll offset to trigger activation (0-1) */
  scrollOffset?: number;
  /** Custom className */
  className?: string;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({
  steps = 4,
  nodeSize = 24,
  lineWidth = 2,
  activeLineColor,
  inactiveLineColor,
  activeNodeColor,
  inactiveNodeColor,
  scrollOffset = 0.90,
  className = '',
}) => {
  // Generate array of steps
  const stepNumbers = Array.from({ length: steps }, (_, i) => i + 1);

  return (
    <div className={`process-timeline ${className}`}>
      {stepNumbers.map((num, index) => {
        // Determine segment type
        let type: 'start' | 'middle' | 'end';
        if (index === 0) {
          type = 'start';
        } else if (index === stepNumbers.length - 1) {
          type = 'end';
        } else {
          type = 'middle';
        }

        return (
          <RailSegment
            key={`step-${num}`}
            type={type}
            content={String(num)}
            variant="connected"
            nodeSize={nodeSize}
            lineWidth={lineWidth}
            activeLineColor={activeLineColor}
            inactiveLineColor={inactiveLineColor}
            activeNodeColor={activeNodeColor}
            inactiveNodeColor={inactiveNodeColor}
            scrollOffset={scrollOffset}
          />
        );
      })}
    </div>
  );
};
