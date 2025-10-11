// ===============================================
// design/system/components/patterns/client/PKLTestimonials/PKLTestimonials.tsx
// PKL TESTIMONIALS SECTION - Client feedback carousel
// ===============================================

'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// ===== TYPE DEFINITIONS =====

export interface PKLTestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export interface PKLTestimonialsContent {
  label?: string;
  heading: string;
  description: string;
  testimonials: PKLTestimonial[];
}

export interface PKLTestimonialsProps {
  content: PKLTestimonialsContent;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN PKL TESTIMONIALS COMPONENT =====

export const PKLTestimonials: React.FC<PKLTestimonialsProps> = ({ 
  content, 
  id = "pkl-testimonials",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description,
    testimonials
  } = content;

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .pkl-testimonials-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .pkl-testimonials-wrapper {
            border: 1px solid var(--border-light);
            border-radius: var(--radius-2xl);
            padding: var(--foundation-space-12);
          }
          
          .pkl-testimonials-grid {
            display: grid;
            grid-template-columns: 1fr 1.5fr;
            gap: var(--foundation-space-16);
            align-items: center;
          }
          
          .pkl-testimonials-header {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-6);
            text-align: left;
          }
          
          .pkl-testimonials-content {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-6);
          }
          
          .pkl-testimonial-card {
            background: var(--surface-muted);
            border-radius: var(--radius-xl);
            padding: var(--foundation-space-8);
            border: 1px solid var(--border-light);
            box-shadow: var(--shadow-sm);
            min-height: 280px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }
          
          .pkl-testimonial-body {
            display: flex;
            gap: var(--foundation-space-6);
            align-items: flex-start;
          }
          
          .pkl-testimonial-image {
            width: 80px;
            height: 80px;
            border-radius: var(--radius-lg);
            object-fit: cover;
            flex-shrink: 0;
            border: 2px solid var(--border-medium);
          }
          
          .pkl-testimonial-image-placeholder {
            width: 80px;
            height: 80px;
            border-radius: var(--radius-lg);
            background: var(--surface-subtle);
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid var(--border-medium);
            color: var(--text-tertiary);
            font-size: var(--foundation-typography-size-2xl);
            font-weight: var(--font-weight-bold);
          }
          
          .pkl-testimonial-quote {
            flex: 1;
            color: var(--text-primary);
            font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-lg)' : 'var(--foundation-typography-size-md)'};
            line-height: 1.7;
            font-style: italic;
          }
          
          .pkl-testimonial-author {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-1);
            padding-top: var(--foundation-space-4);
            border-top: 1px solid var(--border-light);
          }
          
          .pkl-testimonial-name {
            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
            font-size: var(--foundation-typography-size-md);
          }
          
          .pkl-testimonial-role {
            color: var(--text-tertiary);
            font-size: var(--foundation-typography-size-sm);
          }
          
          .pkl-testimonials-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
          
          .pkl-testimonials-arrows {
            display: flex;
            gap: var(--foundation-space-3);
          }
          
          .pkl-testimonial-arrow {
            width: 44px;
            height: 44px;
            border-radius: var(--radius-md);
            background: var(--surface-subtle);
            border: 1px solid var(--border-medium);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--text-secondary);
          }
          
          .pkl-testimonial-arrow:hover {
            background: var(--surface-card);
            border-color: var(--accent-500);
            color: var(--accent-500);
            transform: translateY(-2px);
          }
          
          .pkl-testimonial-arrow:active {
            transform: translateY(0);
          }
          
          .pkl-testimonial-arrow svg {
            width: 20px;
            height: 20px;
          }
          
          .pkl-testimonials-dots {
            display: flex;
            gap: var(--foundation-space-2);
          }
          
          .pkl-testimonial-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--surface-subtle);
            border: 1px solid var(--border-medium);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .pkl-testimonial-dot.active {
            background: var(--accent-500);
            border-color: var(--accent-500);
            width: 24px;
            border-radius: var(--radius-full);
          }
          
          .pkl-testimonial-dot:hover:not(.active) {
            background: var(--surface-card);
            transform: scale(1.2);
          }
          
          @media (max-width: 1024px) {
            .pkl-testimonials-grid {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-10);
            }
            
            .pkl-testimonials-header {
              text-align: center;
            }
            
            .pkl-testimonial-card {
              min-height: auto;
            }
          }
          
          @media (max-width: 640px) {
            .pkl-testimonials-wrapper {
              padding: var(--foundation-space-6);
            }
            
            .pkl-testimonial-body {
              flex-direction: column;
              align-items: center;
              text-align: center;
            }
            
            .pkl-testimonial-card {
              padding: var(--foundation-space-6);
            }
            
            .pkl-testimonials-controls {
              flex-direction: column;
              gap: var(--foundation-space-4);
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="pkl-testimonials-container">
          <div className="pkl-testimonials-wrapper">
            <div className="pkl-testimonials-grid">
              {/* Left Side - Header */}
              <div className="pkl-testimonials-header">
                <Stack spacing="md" align="start">
                  {label && (
                    <Typography 
                      variant="label-sm" 
                      color="accent"
                      weight="medium"
                    >
                      {label}
                    </Typography>
                  )}
                  
                  <Typography 
                    variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                    weight="semibold"
                    color="primary"
                    as="h2"
                  >
                    {heading}
                  </Typography>
                  
                  <Typography 
                    variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                    color="secondary"
                  >
                    {description}
                  </Typography>
                </Stack>
              </div>
              
              {/* Right Side - Testimonial Carousel */}
              <div className="pkl-testimonials-content">
                {/* Testimonial Card */}
                <div className="pkl-testimonial-card">
                  <div className="pkl-testimonial-body">
                    {/* Image */}
                    {currentTestimonial.image ? (
                      <img 
                        src={currentTestimonial.image} 
                        alt={currentTestimonial.author}
                        className="pkl-testimonial-image"
                      />
                    ) : (
                      <div className="pkl-testimonial-image-placeholder">
                        {currentTestimonial.author.charAt(0)}
                      </div>
                    )}
                    
                    {/* Quote */}
                    <div className="pkl-testimonial-quote">
                      "{currentTestimonial.quote}"
                    </div>
                  </div>
                  
                  {/* Author Info */}
                  <div className="pkl-testimonial-author">
                    <div className="pkl-testimonial-name">
                      {currentTestimonial.author}
                    </div>
                    <div className="pkl-testimonial-role">
                      {currentTestimonial.role}
                    </div>
                  </div>
                </div>
                
                {/* Controls */}
                <div className="pkl-testimonials-controls">
                  {/* Navigation Arrows */}
                  <div className="pkl-testimonials-arrows">
                    <button 
                      className="pkl-testimonial-arrow" 
                      onClick={handlePrevious}
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeftIcon />
                    </button>
                    <button 
                      className="pkl-testimonial-arrow" 
                      onClick={handleNext}
                      aria-label="Next testimonial"
                    >
                      <ChevronRightIcon />
                    </button>
                  </div>
                  
                  {/* Dots Indicator */}
                  <div className="pkl-testimonials-dots">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        className={`pkl-testimonial-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Go to testimonial ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

PKLTestimonials.displayName = 'PKLTestimonials';

