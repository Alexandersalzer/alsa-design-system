'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
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
    <Section 
      id={id} 
      className={className}
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-24)'
      }}
    >
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div style={{ maxWidth: 'var(--size-page-max-width)', width: '100%' }}>
            <Stack spacing="lg" align="center">
            <Typography 
              variant="h2" 
              weight="bold" 
              color="heading"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'center'
              }}
            >
                {title.split(' ').map((word, index) => {
                  if (titleAccent && word === titleAccent) {
                    return (
                      <span 
                        key={index} 
                        style={{
                          background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text'
                        }}
                      >
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
                style={{
                  maxWidth: '700px',
                  textAlign: 'left',
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* Testimonials Grid */}
          <div style={{ width: '100%', maxWidth: 'var(--size-page-max-width)' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
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
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1, paddingTop: 'var(--foundation-space-1)' }}>
                    <Stack spacing="sm">
                    {/* Testimonial Text */}
                    <div style={{ flex: 1, minHeight: '60px' }}>
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
                    </div>
                    
                    {/* Author Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-2)', paddingTop: 'var(--foundation-space-1)' }}>
                      {/* Simple Avatar */}
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #1f2937, #64748b)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'relative',
                          boxShadow: '0 4px 16px rgba(31, 41, 55, 0.2)'
                        }}
                      >
                        {/* Simple Person Icon */}
                        <div style={{
                          width: '20px',
                          height: '20px',
                          color: 'var(--primary-white)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '100%', height: '100%' }}>
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                          </svg>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-1)', flex: 1 }}>
                        <Typography variant="body-sm" weight="semibold" color="primary" style={{ textAlign: 'left' }}>
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body-xs" color="secondary" style={{ textAlign: 'left' }}>
                          {testimonial.caseType}
                        </Typography>
                      </div>
                    </div>
                    
                    {/* Rating Stars - moved to bottom */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 'var(--foundation-space-1)' }}>
                      <Cluster spacing="xs" align="center">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{
                              width: '14px',
                              height: '14px',
                              color: 'var(--accent-500)',
                              fill: 'currentColor'
                            }}
                          >
                            <StarIcon />
                          </div>
                        ))}
                      </Cluster>
                    </div>
                    </Stack>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </Section>
  );
};

export { Testimonials };
