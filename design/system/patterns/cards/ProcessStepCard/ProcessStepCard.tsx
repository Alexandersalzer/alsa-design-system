import React from 'react';
import { ProcessCard } from '../ProcessCard/ProcessCard';
import { Image } from '../../../components/media/Image';
import { Grid } from '../../../components';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './ProcessStepCard.css';

interface ProcessStepCardProps {
  componentKey?: string;
  stickyTitle?: string;
  stickyDescription?: string;
  stickyIcon?: string;
  stepImageSrc?: string;
  stepImageAlt?: string;
  stepImageAspectRatio?: '1/1' | '3/2' | '2/3' | '4/3' | '3/4' | '16/9' | '9/16' | string;
  columns?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  components?: Record<string, any>;
  order?: string[];
}

export type { ProcessStepCardProps };

export function ProcessStepCard({
  componentKey,
  stickyTitle,
  stepImageSrc,
  stepImageAlt,
  stepImageAspectRatio = '21/9',
  columns = 2,
  gap = 'lg',
  components = {},
  order = []
}: ProcessStepCardProps) {
  const componentOrder = order.length > 0 ? order : Object.keys(components);

  return (
    <div className="process-step-card-wrapper" data-component-key={componentKey}>
      {/* Optional step image above the grid */}
      {stepImageSrc && (
        <div className="process-step-image">
          <Image
            src={`${CDN_BASE_URL}${stepImageSrc}`}
            alt={stepImageAlt || stickyTitle || 'Process step'}
            width="100%"
            aspectRatio={stepImageAspectRatio}
            objectFit="cover"
            radius="lg"
            loading="lazy"
            showSkeleton={true}
          />
        </div>
      )}

      {/* Grid of process cards using proper Grid component */}
      <Grid columns={columns} gap={gap}>
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
      </Grid>
    </div>
  );
}
