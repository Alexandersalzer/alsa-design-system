'use client';

import React from 'react';
import { VStack } from '../../../components';
import { TestimonialCard } from '../../cards/TestimonialCard';
import './TestimonialGrid.css';

// ===== COMPONENT TYPE DEFINITIONS =====
export interface TestimonialData {
  type: 'testimonial';
  text: string;
  author: string;
  authorInitial: string;
  caseType: string;
  rating: number;
}

// ===== PATTERN PROPS =====
export interface TestimonialGridProps {
  props?: {
    columns?: number;
    gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    maxWidth?: string;
  };
  components?: Record<string, {
    type: string;
    content?: {
      text: string;
      author: string;
      authorInitial: string;
      caseType: string;
      rating: number;
    };
  }>;
}

// ===== MASONRY DISTRIBUTION ALGORITHM =====
function distributeTestimonials(testimonials: TestimonialData[], columnCount: number): TestimonialData[][] {
  const columns: TestimonialData[][] = Array.from({ length: columnCount }, () => []);
  const columnHeights = Array(columnCount).fill(0);

  testimonials.forEach((testimonial) => {
    // Estimate height based on text length (rough approximation)
    const estimatedHeight = 200 + (testimonial.text.length * 0.8);
    
    // Find column with minimum height
    const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
    
    // Add testimonial to shortest column
    columns[shortestColumnIndex].push(testimonial);
    columnHeights[shortestColumnIndex] += estimatedHeight;
  });

  return columns;
}

// ===== MAIN TESTIMONIAL GRID PATTERN =====
export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    columns = 3,
    gap = 'md',
    maxWidth = '1200px'
  } = patternProps;

  // Extract testimonial data
  const testimonials = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'testimonial' && comp.content)
    .map(([_, comp]) => ({
      type: 'testimonial' as const,
      text: comp.content!.text || '',
      author: comp.content!.author || '',
      authorInitial: comp.content!.authorInitial || '',
      caseType: comp.content!.caseType || '',
      rating: comp.content!.rating || 5,
    }))
    .filter((testimonial) => testimonial.text && testimonial.author);

  if (testimonials.length === 0) return null;

  // Distribute testimonials across columns for balanced heights
  const distributedColumns = distributeTestimonials(testimonials, columns);

  return (
    <div 
      className="testimonial-grid-container" 
      style={{ maxWidth, margin: '0 auto' }}
    >
      <div className={`testimonial-grid testimonial-grid--columns-${columns} testimonial-grid--gap-${gap}`}>
        {distributedColumns.map((columnTestimonials, columnIndex) => (
          <VStack 
            key={`testimonial-column-${columnIndex}`}
            spacing={gap}
            className="testimonial-column"
          >
            {columnTestimonials.map((testimonial, testimonialIndex) => (
              <TestimonialCard
                key={`testimonial-${columnIndex}-${testimonialIndex}`}
                text={testimonial.text}
                author={testimonial.author}
                authorInitial={testimonial.authorInitial}
                caseType={testimonial.caseType}
                rating={testimonial.rating}
              />
            ))}
          </VStack>
        ))}
      </div>
    </div>
  );
};

TestimonialGrid.displayName = 'TestimonialGrid';