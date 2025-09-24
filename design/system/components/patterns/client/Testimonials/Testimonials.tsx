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
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: 'var(--foundation-space-8)'
              }}
            >
              {testimonials.map((testimonial) => (
                <Card 
                  key={testimonial.id} 
                  variant="elevated"
                  padding="lg"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--foundation-radius-xl)',
                    height: '320px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Background Pattern */}
                  <div style={{
                    position: 'absolute',
                    top: '-50px',
                    right: '-50px',
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    zIndex: 0
                  }} />
                  
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                    <Stack spacing="sm">
                    {/* Quotation Marks */}
                    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <div style={{
                        fontSize: '2.5rem',
                        color: 'var(--accent-500)',
                        opacity: 0.3,
                        lineHeight: 1,
                        fontFamily: 'serif',
                        fontWeight: 'bold'
                      }}>
                        "
                      </div>
                    </div>
                    
                    {/* Testimonial Text */}
                    <div style={{ flex: 1, paddingLeft: 'var(--foundation-space-3)' }}>
                      <Typography 
                        variant="body-md" 
                        color="primary"
                        style={{
                          lineHeight: 'var(--foundation-typography-line-height-normal)',
                          textAlign: 'left',
                          fontStyle: 'italic',
                          fontSize: '0.95rem'
                        }}
                      >
                        {testimonial.text}
                      </Typography>
                    </div>
                    
                    {/* Rating Stars */}
                    <div style={{ paddingLeft: 'var(--foundation-space-3)' }}>
                      <Cluster spacing="xs" align="center">
                        {[...Array(testimonial.rating || 5)].map((_, i) => (
                          <div 
                            key={i} 
                            style={{
                              width: '16px',
                              height: '16px',
                              color: 'var(--accent-500)',
                              fill: 'currentColor'
                            }}
                          >
                            <StarIcon />
                          </div>
                        ))}
                      </Cluster>
                    </div>
                    
                    {/* Author Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-3)', paddingLeft: 'var(--foundation-space-3)' }}>
                      {/* Silhouette Avatar */}
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          position: 'relative',
                          boxShadow: '0 6px 20px rgba(99, 102, 241, 0.3)'
                        }}
                      >
                        {/* Silhouette Icon */}
                        <div style={{
                          width: '28px',
                          height: '28px',
                          background: 'var(--primary-white)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative'
                        }}>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            background: 'var(--accent-500)',
                            borderRadius: '50%',
                            position: 'absolute',
                            top: '5px'
                          }} />
                          <div style={{
                            width: '14px',
                            height: '14px',
                            background: 'var(--accent-500)',
                            borderRadius: '50%',
                            position: 'absolute',
                            bottom: '3px'
                          }} />
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <Typography variant="body-sm" weight="semibold" color="primary">
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body-xs" color="secondary">
                          {testimonial.caseType}
                        </Typography>
                      </div>
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
