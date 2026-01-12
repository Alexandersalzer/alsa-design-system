import React from 'react';
import { PatternNode } from '../../../core/types/nodes';
import { getPatternOrder } from '../../../core/utils/props';
import { ProcessCard } from '../ProcessCard/ProcessCard';
import './ProcessStepCard.css';

interface ProcessStepCardProps {
  componentKey?: string;
  stickyTitle?: string;
  stickyDescription?: string;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg' | 'xl';
  components?: Record<string, any>;
  order?: string[];
}

export type { ProcessStepCardProps };

export function ProcessStepCard({
  componentKey,
  stickyTitle,
  stickyDescription,
  columns = 2,
  gap = 'lg',
  components = {},
  order = []
}: ProcessStepCardProps) {
  const componentOrder = order.length > 0 ? order : Object.keys(components);

  return (
    <div
      className={`process-step-card gap-${gap}`}
      data-component-key={componentKey}
      style={{
        '--columns': columns,
      } as React.CSSProperties}
    >
      {componentOrder.map((key) => {
        const component = components[key];
        if (!component) {
          console.warn(`Component "${key}" not found in components`);
          return null;
        }

        if (component.type !== 'processCard') {
          console.warn(`Only processCard type is supported in ProcessStepCard, got: ${component.type}`);
          return null;
        }

        return (
          <ProcessCard
            key={key}
            componentKey={key}
            {...component.props}
          />
        );
      })}
    </div>
  );
}
