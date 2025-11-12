'use client';

import React from 'react';
import { Grid } from '../../../components';
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
    minItemWidth?: string; // Simplified approach - e.g. '280px' for testimonials
    maxColumns?: number; // Optional column limit
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

// ===== PATTERN PROPS =====

// ===== MAIN TESTIMONIAL GRID PATTERN =====
export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  props: patternProps = {},
  components = {}
}) => {
  const {
    minItemWidth = '280px', // Optimized for testimonial cards
    maxColumns = 3, // Prevent too many columns on very wide screens
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

  return (
    <div className="testimonial-grid-container" style={{ maxWidth, margin: '0 auto' }}>
      <Grid
        minItemWidth={minItemWidth}
        maxColumns={maxColumns}
        gap={gap}
        className="testimonial-grid"
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`testimonial-${index}`}
            text={testimonial.text}
            author={testimonial.author}
            authorInitial={testimonial.authorInitial}
            caseType={testimonial.caseType}
            rating={testimonial.rating}
          />
        ))}
      </Grid>
    </div>
  );
};

TestimonialGrid.displayName = 'TestimonialGrid';