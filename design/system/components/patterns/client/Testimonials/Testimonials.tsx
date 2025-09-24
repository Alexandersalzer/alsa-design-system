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
        paddingTop: 'var(--foundation-space-16)'
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
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--foundation-radius-lg)',
                    height: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Stack spacing="md">
                    {/* Rating Stars */}
                    <Cluster spacing="xs" align="center">
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
                    </Cluster>
                    
                    {/* Testimonial Text */}
                    <div style={{ flex: 1 }}>
                      <Typography 
                        variant="body-md" 
                        color="secondary"
                        style={{
                          lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                          textAlign: 'left'
                        }}
                      >
                        "{testimonial.text}"
                      </Typography>
                    </div>
                    
                    {/* Author Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-4)' }}>
                      <div
                        style={{
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        <Typography variant="body-md" weight="bold" color="inverse">
                          {testimonial.authorInitial}
                        </Typography>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-1)' }}>
                        <Typography variant="body-md" weight="semibold" color="primary">
                          {testimonial.author}
                        </Typography>
                        <Typography variant="body-sm" color="secondary">
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
