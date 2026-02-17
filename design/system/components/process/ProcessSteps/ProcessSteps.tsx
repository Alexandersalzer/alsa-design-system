// ===============================================
// ProcessSteps.tsx
// Unified component that displays ProcessTimeline on left, step content on right
// Handles 2-column grid layout internally
// ===============================================

'use client';

import React from 'react';
import { ProcessTimeline } from '../../animations/ProcessTimeline/ProcessTimeline';
import { renderComponents } from '../../../core/render/components';
import { ComponentNode } from '../../../core/types/nodes';
import './ProcessSteps.css';

export interface ProcessStepsProps {
  /** Component definitions (heading and body for each step) */
  components: Record<string, ComponentNode>;
  /** Step IDs to render in order */
  order: string[];
  /** Size of timeline node indicators in pixels */
  nodeSize?: number;
  /** Width of the timeline line in pixels */
  lineWidth?: number;
  /** Scroll offset for timeline activation (0-1, default 0.9 = 90% down viewport) */
  scrollOffset?: number;
  /** Custom className */
  className?: string;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({
  components,
  order,
  nodeSize = 24,
  lineWidth = 2,
  scrollOffset = 0.90,
  className = '',
}) => {
  const steps = order.length;

  return (
    <div className={`process-steps ${className}`}>
      {/* Left column: Timeline */}
      <div className="process-steps__timeline">
        <ProcessTimeline
          steps={steps}
          nodeSize={nodeSize}
          lineWidth={lineWidth}
          scrollOffset={scrollOffset}
        />
      </div>

      {/* Right column: Step content */}
      <div className="process-steps__content">
        {order.map((stepId) => {
          const headingKey = `${stepId}_heading`;
          const bodyKey = `${stepId}_body`;

          return (
            <div key={stepId} className="process-steps__step">
              {components[headingKey] && renderComponents(components, [headingKey])}
              {components[bodyKey] && renderComponents(components, [bodyKey])}
            </div>
          );
        })}
      </div>
    </div>
  );
};
