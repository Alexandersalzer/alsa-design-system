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
    gap = 'md'
  } = patternProps;

  // Extract testimonial data
  const testimonials = Object.entries(components)
    .filter(([_, comp]) => comp.type === 'testimonial' && comp.props)
    .map(([_, comp]) => ({
      type: 'testimonial' as const,
      text: comp.props?.text || '',
      author: comp.props?.author || '',
      authorInitial: comp.props?.authorInitial || '',
      caseType: comp.props?.caseType || '',
      rating: comp.props?.rating || 5,
    }))
    .filter((testimonial) => testimonial.text && testimonial.author);

  if (testimonials.length === 0) return null;

  return (
    <div 
      className={`testimonial-grid-container testimonial-grid--columns-${columns} testimonial-grid--gap-${gap}`}
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