// ===============================================
// design/system/components/patterns/client/PKLTestimonials/PKLTestimonials.tsx
// PKL TESTIMONIALS SECTION - Carousel-based client testimonials
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
  avatar?: string;
}

export interface PKLTestimonialsContent {
  label: string;
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
  const { label, heading, description, testimonials } = content;
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .pkl-testimonials-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .pkl-testimonials-grid {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: var(--foundation-space-16);
            align-items: start;
          }
          
          .pkl-testimonials-intro {
            position: sticky;
            top: 120px;
          }
          
          .pkl-testimonials-carousel {
            position: relative;
          }
          
          .pkl-testimonials-track {
            overflow: hidden;
            border-radius: var(--radius-lg);
          }
          
          .pkl-testimonials-slides {
            display: flex;
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            transform: translateX(-${activeIndex * 100}%);
          }
          
          .pkl-testimonial-card {
            min-width: 100%;
            padding: var(--foundation-space-8);
            background: var(--surface-subtle);
            border: 1px solid var(--border-light);
            border-radius: var(--radius-lg);
            display: flex;
            gap: var(--foundation-space-6);
            align-items: flex-start;
          }
          
          .pkl-testimonial-avatar {
            width: 80px;
            height: 80px;
            border-radius: var(--radius-full);
            object-fit: cover;
            flex-shrink: 0;
            border: 2px solid var(--border-medium);
          }
          
          .pkl-testimonial-avatar-placeholder {
            width: 80px;
            height: 80px;
            border-radius: var(--radius-full);
            background: var(--surface-muted);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 2px solid var(--border-medium);
            font-size: var(--foundation-typography-size-2xl);
            font-weight: var(--font-weight-semibold);
            color: var(--accent-500);
          }
          
          .pkl-testimonial-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-4);
          }
          
          .pkl-testimonial-quote {
            color: var(--text-primary);
            font-size: ${textScale === 'lg' ? 'var(--foundation-typography-size-lg)' : textScale === 'sm' ? 'var(--foundation-typography-size-sm)' : 'var(--foundation-typography-size-md)'};
            line-height: 1.7;
            font-style: italic;
          }
          
          .pkl-testimonial-author {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-1);
            margin-top: var(--foundation-space-2);
          }
          
          .pkl-testimonial-author-name {
            color: var(--text-primary);
            font-size: var(--foundation-typography-size-sm);
            font-weight: var(--font-weight-semibold);
          }
          
          .pkl-testimonial-author-role {
            color: var(--text-secondary);
            font-size: var(--foundation-typography-size-xs);
          }
          
          .pkl-testimonials-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: var(--foundation-space-6);
          }
          
          .pkl-testimonials-nav {
            display: flex;
            gap: var(--foundation-space-3);
          }
          
          .pkl-testimonials-nav-button {
            width: 40px;
            height: 40px;
            border-radius: var(--radius-md);
            background: var(--surface-card);
            border: 1px solid var(--border-medium);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s ease;
            color: var(--text-secondary);
          }
          
          .pkl-testimonials-nav-button:hover {
            background: var(--surface-muted);
            border-color: var(--accent-500);
            color: var(--accent-500);
          }
          
          .pkl-testimonials-nav-button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          
          .pkl-testimonials-dots {
            display: flex;
            gap: var(--foundation-space-2);
          }
          
          .pkl-testimonials-dot {
            width: 8px;
            height: 8px;
            border-radius: var(--radius-full);
            background: var(--surface-muted);
            border: 1px solid var(--border-medium);
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .pkl-testimonials-dot.active {
            background: var(--accent-500);
            border-color: var(--accent-500);
            width: 24px;
          }
          
          .pkl-testimonials-dot:hover:not(.active) {
            background: var(--border-strong);
          }
          
          @media (max-width: 1024px) {
            .pkl-testimonials-grid {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-10);
            }
            
            .pkl-testimonials-intro {
              position: static;
            }
          }
          
          @media (max-width: 768px) {
            .pkl-testimonial-card {
              flex-direction: column;
              padding: var(--foundation-space-6);
            }
            
            .pkl-testimonial-avatar,
            .pkl-testimonial-avatar-placeholder {
              width: 60px;
              height: 60px;
            }
            
            .pkl-testimonials-controls {
              flex-direction: column-reverse;
              gap: var(--foundation-space-4);
              align-items: stretch;
            }
            
            .pkl-testimonials-dots {
              justify-content: center;
            }
            
            .pkl-testimonials-nav {
              justify-content: space-between;
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
          <div className="pkl-testimonials-grid">
            {/* Left Side - Introduction */}
            <div className="pkl-testimonials-intro">
              <Stack spacing="lg" align="start">
                <Typography 
                  variant="label-sm" 
                  color="accent"
                  weight="medium"
                >
                  {label}
                </Typography>
                
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
                  style={{ lineHeight: 1.7 }}
                >
                  {description}
                </Typography>
              </Stack>
            </div>
            
            {/* Right Side - Carousel */}
            <div className="pkl-testimonials-carousel">
              <div className="pkl-testimonials-track">
                <div className="pkl-testimonials-slides">
                  {testimonials.map((testimonial, index) => (
                    <div key={testimonial.id} className="pkl-testimonial-card">
                      {/* Avatar */}
                      {testimonial.avatar ? (
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="pkl-testimonial-avatar"
                        />
                      ) : (
                        <div className="pkl-testimonial-avatar-placeholder">
                          {testimonial.author.charAt(0)}
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="pkl-testimonial-content">
                        <blockquote className="pkl-testimonial-quote">
                          "{testimonial.quote}"
                        </blockquote>
                        
                        <div className="pkl-testimonial-author">
                          <div className="pkl-testimonial-author-name">
                            {testimonial.author}
                          </div>
                          <div className="pkl-testimonial-author-role">
                            {testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Controls */}
              <div className="pkl-testimonials-controls">
                {/* Navigation Arrows */}
                <div className="pkl-testimonials-nav">
                  <button 
                    onClick={prevSlide}
                    className="pkl-testimonials-nav-button"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeftIcon style={{ width: '20px', height: '20px' }} />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="pkl-testimonials-nav-button"
                    aria-label="Next testimonial"
                  >
                    <ChevronRightIcon style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
                
                {/* Dots Indicator */}
                <div className="pkl-testimonials-dots">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`pkl-testimonials-dot ${index === activeIndex ? 'active' : ''}`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
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

