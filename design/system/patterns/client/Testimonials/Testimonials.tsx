'use client';

import { Typography } from '../../../components/Typography';
import { Card } from '../../../components/layout';
import { Section } from '../../../components/frames/section/Section';
import { Container } from '../../../components/frames/container/Container';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { StarIcon } from '@heroicons/react/24/solid';
import { Avatar } from '../../../components/media/Avatar/Avatar';

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
  content?: TestimonialsContent;
  className?: string;
  
  // NEW: Support components structure from JSON
  components?: Record<string, {
    type: 'testimonial';
    content: Testimonial;
  }>;
}

const Testimonials = ({ 
  id = "testimonials", 
  content, 
  className,
  components 
}: TestimonialsProps) => {
  // Transform components into testimonials array if provided
  const testimonials = components
    ? Object.values(components)
        .filter(comp => comp.type === 'testimonial')
        .map(comp => comp.content)
    : content?.testimonials || [];

  return (
    <Section 
      id={id} 
      className={className}
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)'
      }}
    >
      <Container align="center">
        <VStack spacing="xl" align="center">
          {/* Testimonials Grid */}
          <div style={{ width: '100%', maxWidth: 'var(--size-page-max-width)' }}>
            <div
              className="testimonials-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--foundation-space-6)'
              }}
            >
              {testimonials.map((testimonial) => (
                <Card 
                  key={testimonial.id} 
                  variant="elevated"
                  padding="md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--foundation-radius-xl)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <VStack spacing="md" align="start">
                    {/* Author Info - Now at the top */}
                    <HStack spacing="sm" align="center">
                      <Avatar
                        name={testimonial.author}
                        size="md"
                        variant="subtle"
                        colorPalette="gray"
                      />
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-1)', flex: 1 }}>
                        <Typography variant="body-sm" weight="semibold" color="primary" style={{ textAlign: 'left' }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body-xs" color="secondary" style={{ textAlign: 'left' }}>
                          {testimonial.caseType}
                        </Typography>
                      </div>
                    </HStack>

                    {/* Rating Stars */}
                    <HStack spacing="xs" align="center">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <div 
                          key={i} 
                          style={{
                            width: '20px',
                            height: '20px',
                            color: 'var(--accent-500)',
                            fill: 'currentColor'
                          }}
                        >
                          <StarIcon />
                        </div>
                      ))}
                    </HStack>
                    
                    {/* Testimonial Text */}
                    <Typography 
                      variant="body-sm" 
                      color="primary"
                      style={{
                        lineHeight: 'var(--foundation-typography-line-height-normal)',
                        textAlign: 'left',
                        fontSize: '0.9rem'
                      }}
                    >
                      {testimonial.text}
                    </Typography>
                  </VStack>
                </Card>
              ))}
            </div>
          </div>
        </VStack>
      </Container>
    </Section>
  );
};

export { Testimonials };