import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import './TestimonialCard.css';

interface TestimonialCardProps {
  text: string;
  author: string;
  authorInitial: string;
  caseType: string;
  rating: number;
}

export type { TestimonialCardProps };

export function TestimonialCard({ 
  text, 
  author, 
  authorInitial, 
  caseType, 
  rating 
}: TestimonialCardProps) {
  return (
    <Card variant="elevated" className="testimonial-card">
      <VStack spacing="md" className="testimonial-card-content">
        {/* Rating Stars */}
        <div className="testimonial-rating">
          {Array.from({ length: 5 }).map((_, index) => (
            <span 
              key={index} 
              className={`testimonial-star ${index < rating ? 'filled' : 'empty'}`}
            >
              ★
            </span>
          ))}
        </div>

        {/* Quote Text */}
        <Typography 
          variant="body-md" 
          weight="regular" 
          color="secondary"
          className="testimonial-text"
        >
          "{text}"
        </Typography>

        {/* Author Info */}
        <div className="testimonial-author">
          <div className="testimonial-avatar">
            <Typography variant="body-sm" weight="bold" color="primary">
              {authorInitial}
            </Typography>
          </div>
          <VStack spacing="xs" className="testimonial-author-details">
            <Typography variant="body-sm" weight="bold" color="primary">
              {author}
            </Typography>
            <Typography variant="body-xs" weight="regular" color="tertiary">
              {caseType}
            </Typography>
          </VStack>
        </div>
      </VStack>
    </Card>
  );
}