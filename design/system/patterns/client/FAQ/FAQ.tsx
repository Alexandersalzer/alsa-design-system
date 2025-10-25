'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../system/components/primitives/Typography';
import { Icon } from '../../../../system/components/primitives/Icon';
import { Section } from '../../../components/frames/section/Section';
import { Container } from '../../../components/frames/container/Container';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import './FAQ.css';
import { Button, Card } from '@blimpify-im/ui';

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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set([0]));

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
          
          @media (max-width: 640px) {
            .faq-container {
              width: 100% !important;
              max-width: 100% !important;
              padding: 0 var(--foundation-space-4) !important;
            }
            .faq-item {
              padding: 0 var(--foundation-space-2) !important;
            }
            .faq-question {
              font-size: 1.25rem !important;
            }
          }
          @media (min-width: 641px) and (max-width: 1024px) {
            .faq-container {
              width: 90% !important;
              max-width: 90% !important;
            }
            .faq-question {
              font-size: 1.375rem !important;
            }
          }
          @media (min-width: 1025px) {
            .faq-container {
              width: var(--size-page-content-max-width) !important;
            }
            .faq-question {
              font-size: 1.5rem !important;
            }
          }
        `
      }} />
      <Section 
      id={id}
      as="section"
      height="auto"
      style={{
        paddingTop: 'var(--foundation-space-24)', // Samma padding som Om oss
        paddingBottom: 'var(--foundation-space-16)', // Samma padding som Om oss
        minHeight: '800px' // Lägg till minsta höjd för hela sektionen
      }}
    >
      <Container maxWidth="xl" align="center">
        <VStack spacing="xl" align="center">
          {/* Header */}
          <div style={{ maxWidth: '800px', width: '100%' }}>
            <VStack spacing="lg" align="center">
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
                  maxWidth: 'var(--size-page-narrow-max-width)',
                  textAlign: 'center',
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                }}
              >
                {subtitle}
              </Typography>
            </VStack>
          </div>

          {/* FAQ Items */}
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <VStack spacing="md">
              {items.map((item, index) => {
                const isExpanded = expandedItems.has(index);
                
                return (
                  <Card 
                    key={index}
                    className="faq-item"
                    style={{
                      width: '100%', // Fast bredd för varje FAQ-item
                      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                      paddingBottom: 'var(--foundation-space-6)',
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
                    <VStack spacing="md">
                      <HStack justify="between" align="center">
                      <Typography 
                        variant="h3" 
                        weight="semibold"
                        className="faq-question"
                        style={{ 
                          color: 'var(--text-primary)',
                          textAlign: 'left',
                          flex: 1,
                          fontSize: '1.5rem'
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
                          className={`faq-chevron ${isExpanded ? 'expanded' : ''}`}
                        >
                          <ChevronDownIcon />
                        </Icon>
                      </Button>
                    </HStack>
                    
                    {isExpanded && (
                      <div style={{
                        marginTop: 'var(--foundation-space-4)',
                        animation: 'fadeInDown 0.3s ease-out'
                      }}>
                        <Typography 
                          variant="body-md"
                          style={{ 
                            color: 'var(--text-primary)',
                            opacity: 0.9,
                            lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                            textAlign: 'left',
                            width: '100%' // Fast bredd för svars-texten
                          }}
                        >
                          {item.answer}
                        </Typography>
                      </div>
                    )}
                  </VStack>
                  </Card>
                );
              })}
            </VStack>
          </div>
        </VStack>
      </Container>
    </Section>
    </>
  );
};

export { FAQ };
export type { FAQItem, FAQContent, FAQProps };
