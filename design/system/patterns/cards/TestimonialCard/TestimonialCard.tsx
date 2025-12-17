import React from 'react';
import { Card, VStack, Typography } from '../../../components';
import { Avatar } from '../../../components/media/Avatar';
import './TestimonialCard.css';

interface TestimonialCardProps {
  componentKey?: string;
  text: string;
  author: string;
  authorInitial: string;
  caseType: string;
  rating: number;
}

export type { TestimonialCardProps };

export function TestimonialCard({ 
  componentKey,
  text, 
  author, 
  authorInitial, 
  caseType, 
  rating 
}: TestimonialCardProps) {
  return (
    <Card variant="outlined" className="testimonial-card" data-component-key={componentKey}>
      <VStack spacing="md" className="testimonial-card-content">
        {/* Author Info at top */}
        <div className="testimonial-author">
          <Avatar
            name={author}
            variant="outline"
            size="md"
            shape="full"
            colorPalette="gray"
          />
          <VStack spacing="xs" className="testimonial-author-details">
            <Typography variant="body-sm" weight="bold" color="primary">
              {author}
            </Typography>
            <Typography variant="body-xs" weight="regular" color="tertiary">
              {caseType}
            </Typography>
          </VStack>
        </div>

        {/* Quote Text at bottom */}
        <Typography 
          variant="body-md" 
          weight="regular" 
          color="secondary"
          className="testimonial-text"
        >
          {text}
        </Typography>
      </VStack>
    </Card>
  );
}