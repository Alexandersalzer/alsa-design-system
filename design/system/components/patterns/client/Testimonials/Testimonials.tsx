'use client';

import './Testimonials.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { StarIcon } from '@heroicons/react/24/solid';

export interface Testimonial {
  id: string;
  text: string;
  author: string;
  authorInitial: string;
  caseType: string;
  rating?: number; // Default 5 stars
}

export interface TestimonialsContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export interface TestimonialsProps {
  id?: string;
  content: TestimonialsContent;
  className?: string;
}

const Testimonials = ({ id = "testimonials", content, className }: TestimonialsProps) => {
  const { title, titleAccent, subtitle, testimonials } = content;

  return (
    <Section id={id} className={`testimonials-section ${className || ''}`}>
      <div className="testimonials-container">
        {/* Header */}
        <div className="testimonials-header">
          <Typography 
            variant="h2" 
            weight="bold"
            color="heading"
            className="testimonials-title"
          >
            {title.split(' ').map((word, index) => {
              if (titleAccent && word === titleAccent) {
                return (
                  <span key={index} className="testimonials-title-accent">
                    {word}
                  </span>
                );
              }
              return word + ' ';
            })}
          </Typography>
          
          <Typography 
            variant="body-xl" 
            color="secondary"
            className="testimonials-subtitle"
          >
            {subtitle}
          </Typography>
        </div>

        {/* Testimonials Grid */}
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="testimonial-card">
              {/* Rating Stars */}
              <div className="testimonial-rating">
                {[...Array(testimonial.rating || 5)].map((_, i) => (
                  <div key={i} className="star-icon">
                    <StarIcon />
                  </div>
                ))}
              </div>
              
              {/* Testimonial Text */}
              <Typography 
                variant="body-md" 
                color="secondary" 
                className="testimonial-text"
              >
                "{testimonial.text}"
              </Typography>
              
              {/* Author Info */}
              <div className="testimonial-author">
                <div className="author-avatar">
                  <Typography variant="body-md" weight="bold" color="inverse">
                    {testimonial.authorInitial}
                  </Typography>
                </div>
                <div className="author-details">
                  <Typography variant="body-md" weight="semibold" color="primary" className="author-name">
                    {testimonial.author}
                  </Typography>
                  <Typography variant="body-sm" color="secondary" className="author-case">
                    {testimonial.caseType}
                  </Typography>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export { Testimonials };
