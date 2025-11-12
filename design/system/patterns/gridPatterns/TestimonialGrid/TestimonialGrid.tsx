'use client';

import React from 'react';
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
    columns?: number; // Number of masonry columns
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
    columns = 3, // Number of masonry columns
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
    <div 
      className={`testimonial-grid-container testimonial-grid--columns-${columns} testimonial-grid--gap-${gap}`}
      style={{ maxWidth, margin: '0 auto' }}
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
    </div>
  );
};

TestimonialGrid.displayName = 'TestimonialGrid';