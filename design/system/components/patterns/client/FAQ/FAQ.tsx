'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQContent {
  title: string;
  subtitle: string;
  items: FAQItem[];
}

interface FAQProps {
  content: FAQContent;
}

const FAQ = ({ content }: FAQProps) => {
  const { title, subtitle, items } = content;

  return (
    <div 
      id="faq" 
      role="region" 
      aria-label="Vanliga frågor"
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)',
        width: '100%'
      }}
    >
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl" align="center">
          {/* Header */}
          <div style={{ maxWidth: '800px', width: '100%' }}>
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
                  if (word === 'frågor') {
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
                  maxWidth: '650px',
                  textAlign: 'center',
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                }}
              >
                {subtitle}
              </Typography>
            </Stack>
          </div>

          {/* FAQ Grid */}
          <div style={{ width: '100%' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
                gap: 'var(--foundation-space-8)'
              }}
            >
              {items.map((item, index) => (
                <Card 
                  key={index} 
                  variant="elevated"
                  padding="lg"
                  style={{
                    background: 'var(--surface-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--foundation-radius-lg)',
                    transition: 'all var(--foundation-motion-duration-normal) ease'
                  }}
                >
                  <Stack spacing="md">
                    <Typography 
                      variant="h4" 
                      weight="semibold" 
                      color="heading"
                      style={{
                        fontSize: 'var(--foundation-typography-size-lg)',
                        lineHeight: 'var(--foundation-typography-line-height-tight)'
                      }}
                    >
                      {item.question}
                    </Typography>
                    <Typography 
                      variant="body-md" 
                      color="secondary"
                      style={{
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                      }}
                    >
                      {item.answer}
                    </Typography>
                  </Stack>
                </Card>
              ))}
            </div>
          </div>
        </Stack>
      </Container>
    </div>
  );
};

export { FAQ };
export type { FAQItem, FAQContent, FAQProps };
