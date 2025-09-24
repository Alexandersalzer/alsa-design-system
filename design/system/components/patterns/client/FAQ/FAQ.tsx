'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

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
  id?: string;
}

const FAQ = ({ content, id = "faq" }: FAQProps) => {
  const { title, subtitle, items } = content;
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
      <Section 
      id={id}
      as="section"
      height="auto"
      style={{
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-24)'
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
                {title}
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

          {/* FAQ Items */}
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <Stack spacing="md">
              {items.map((item, index) => {
                const isExpanded = expandedItems.has(index);
                
                return (
                  <Card 
                    key={index} 
                    variant="elevated"
                    padding="lg"
                    style={{
                      background: 'var(--surface-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--foundation-radius-lg)',
                      cursor: 'pointer',
                      transition: 'all var(--foundation-duration-fast) var(--foundation-easing-ease-out)'
                    }}
                    onClick={() => toggleExpanded(index)}
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    aria-label={`${item.question}. Klicka för att ${isExpanded ? 'dölja' : 'visa'} svaret.`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleExpanded(index);
                      }
                    }}
                  >
                    <Stack spacing="md">
                      <Cluster justify="between" align="center">
                      <Typography 
                        variant="h4" 
                        weight="semibold" 
                        color="heading"
                        style={{
                          fontSize: 'var(--foundation-typography-size-lg)',
                          lineHeight: 'var(--foundation-typography-line-height-tight)',
                          flex: 1,
                          marginRight: 'var(--foundation-space-3)'
                        }}
                      >
                        {item.question}
                      </Typography>
                      <Button
                        variant="ghost"
                        size="sm"
                        style={{
                          padding: 'var(--foundation-space-1)',
                          minWidth: 'auto',
                          flexShrink: 0
                        }}
                        aria-label={isExpanded ? 'Dölj svar' : 'Visa svar'}
                      >
                        <Icon 
                          size="sm" 
                          color="secondary"
                          style={{
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform var(--foundation-duration-fast) var(--foundation-easing-ease-out)'
                          }}
                        >
                          <ChevronDownIcon />
                        </Icon>
                      </Button>
                    </Cluster>
                    
                    {isExpanded && (
                      <div style={{
                        animation: 'fadeInDown var(--foundation-duration-normal) var(--foundation-easing-ease-out)'
                      }}>
                        <Typography 
                          variant="body-md" 
                          color="secondary"
                          style={{
                            lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                            paddingTop: 'var(--foundation-space-2)',
                            borderTop: '1px solid var(--border-subtle)'
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </div>
                    )}
                  </Stack>
                  </Card>
                );
              })}
            </Stack>
          </div>
        </Stack>
      </Container>
    </Section>
    </>
  );
};

export { FAQ };
export type { FAQItem, FAQContent, FAQProps };
