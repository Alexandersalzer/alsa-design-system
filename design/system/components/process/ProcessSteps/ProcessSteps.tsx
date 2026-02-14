// ===============================================
// ProcessSteps.tsx
// Unified component for process timeline + step content
// Timeline on left, step content on right
// ===============================================

'use client';

import React from 'react';
import { ProcessTimeline } from '../../animations/ProcessTimeline/ProcessTimeline';
import { VStack } from '../../layout/vStack/VStack';
import { ComponentNode } from '../../../core/types/nodes';
import { renderComponents } from '../../../core/render/components';
import './ProcessSteps.css';

export interface ProcessStepsProps {
  /** Component definitions for headings and bodies */
  components: Record<string, ComponentNode>;
  /** Step IDs in render order (e.g., ['step1', 'step2', 'step3']) */
  order: string[];
  /** Size of timeline node indicators */
  nodeSize?: number;
  /** Width of timeline connecting line */
  lineWidth?: number;
  /** Scroll offset for timeline activation (0-1) */
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
  const stepCount = order.length;

  return (
    <div className={`process-steps ${className}`}>
      {/* Left column: Timeline */}
      <div className="process-steps__timeline">
        <ProcessTimeline
          steps={stepCount}
          nodeSize={nodeSize}
          lineWidth={lineWidth}
          scrollOffset={scrollOffset}
        />
      </div>

      {/* Right column: Step content */}
      <div className="process-steps__content">
        <VStack spacing="3xl">
          {order.map((stepId) => {
            const headingKey = `${stepId}_heading`;
            const bodyKey = `${stepId}_body`;

            // Render heading and body for this step
            const stepComponents = renderComponents(
              components,
              [headingKey, bodyKey]
            );

            return (
              <div key={stepId} className="process-steps__step">
                <VStack spacing="xs">
                  {stepComponents}
                </VStack>
              </div>
            );
          })}
        </VStack>
      </div>
    </div>
  );
};
