'use client';

import React from 'react';
import { TestimonialCard } from '../../cards/TestimonialCard';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, patternProps, useMapComponents, getPatternOrder } from '../../../core/utils/props';
import './TestimonialGrid.css';

// ===== COMPONENT TYPE DEFINITIONS =====
export interface TestimonialData {
  type: 'testimonial';
  componentKey: string;
  text: string;
  author: string;
  authorInitial: string;
  caseType: string;
  rating: number;
}

// ===== MAIN TESTIMONIAL GRID PATTERN =====
export const TestimonialGrid: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getComponent = componentProps(components);
  const getPatternProps = patternProps(patternNode);
  const mapComponentsOfType = useMapComponents(components);
  const componentOrder = getPatternOrder(patternNode);

  // Extract pattern props with defaults
  const {
    columns = 3, // Number of masonry columns
    gap = 'md'
  } = getPatternProps();

  // Extract testimonials using the order from PatternNode
  const testimonials: TestimonialData[] = componentOrder
    .reduce<TestimonialData[]>((acc, key) => {
      const component = components[key];
      if (!component || component.type !== 'testimonial') return acc;
      
      const props = component.props || {};
      const text = props.text || '';
      const author = props.author || '';
      
      if (!text || !author) return acc;
      
      acc.push({
        type: 'testimonial',
        componentKey: key,
        text,
        author,
        authorInitial: props.authorInitial || '',
        caseType: props.caseType || '',
        rating: props.rating || 5,
      });
      
      return acc;
    }, []);

  if (testimonials.length === 0) return null;

  return (
    <div 
      className={`testimonial-grid-container testimonial-grid--columns-${columns} testimonial-grid--gap-${gap}`}
    >
      {testimonials.map((testimonial, index) => (
        <TestimonialCard
          key={`testimonial-${index}`}
          componentKey={testimonial.componentKey}
          text={testimonial.text}
          author={testimonial.author}
          authorInitial={testimonial.authorInitial}
          caseType={testimonial.caseType}
          rating={testimonial.rating}
        />
      ))}
    </div>
  );
};

TestimonialGrid.displayName = 'TestimonialGrid';