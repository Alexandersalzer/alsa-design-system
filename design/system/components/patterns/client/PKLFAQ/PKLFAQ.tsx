'use client';

import React, { useState } from 'react';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PKLFAQContent {
  label?: string;
  title: string;
  subtitle: string;
  items: FAQItem[];
}

export interface PKLFAQProps {
  content: PKLFAQContent;
  id?: string;
  expandAll?: boolean;
}

export const PKLFAQ: React.FC<PKLFAQProps> = ({ 
  content, 
  id = "faq",
  expandAll = false 
}) => {
  const { label, title, subtitle, items } = content;
  
  // Initialize with first item expanded or all if expandAll is true
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    new Set(expandAll ? items.map((_, i) => i) : [0])
  );

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
      <style>{`
        .pkl-faq-section {
          background: var(--surface-page);
          padding-top: var(--foundation-space-16);
          padding-bottom: var(--foundation-space-16);
        }
        
        .pkl-faq-header {
          text-align: left;
          margin-bottom: var(--foundation-space-12);
        }
        
        .pkl-faq-accordion {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .pkl-faq-item {
          background: var(--surface-subtle);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-6);
          margin-bottom: var(--foundation-space-4);
          box-shadow: var(--shadow-xs);
          border: 1px solid var(--border-light);
          transition: all 0.2s ease;
          cursor: pointer;
        }
        
        .pkl-faq-item:hover {
          background: var(--surface-muted);
          box-shadow: var(--shadow-sm);
        }
        
        .pkl-faq-item:last-child {
          margin-bottom: 0;
        }
        
        .pkl-faq-question-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--foundation-space-4);
        }
        
        .pkl-faq-question {
          flex: 1;
          color: var(--text-primary);
          font-size: var(--foundation-typography-size-lg);
          font-weight: var(--font-weight-medium);
          line-height: 1.4;
        }
        
        .pkl-faq-icon {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          color: var(--accent-500);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .pkl-faq-icon.expanded {
          transform: rotate(180deg);
        }
        
        .pkl-faq-answer {
          margin-top: var(--foundation-space-5);
          padding-top: var(--foundation-space-5);
          border-top: 1px solid var(--border-subtle);
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-md);
          line-height: 1.75;
          animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .pkl-faq-section {
            padding-top: var(--foundation-space-12);
            padding-bottom: var(--foundation-space-12);
          }
          
          .pkl-faq-header {
            margin-bottom: var(--foundation-space-8);
          }
          
          .pkl-faq-item {
            padding: var(--foundation-space-5);
          }
          
          .pkl-faq-question {
            font-size: var(--foundation-typography-size-md);
          }
          
          .pkl-faq-answer {
            font-size: var(--foundation-typography-size-sm);
          }
        }
      `}</style>

      <Section id={id} as="section" className="pkl-faq-section">
        <Container maxWidth="lg">
          <Stack spacing="xl">
            {/* Header Area */}
            <div className="pkl-faq-header">
              <Stack spacing="md" align="start">
                {label && (
                  <Typography variant="label-sm" color="accent" weight="medium">
                    {label}
                  </Typography>
                )}
                <Typography variant="h2" weight="semibold" color="primary" as="h2">
                  {title}
                </Typography>
                <Typography 
                  variant="body-md" 
                  color="secondary"
                  style={{ maxWidth: 'var(--size-page-content-max-width)' }}
                >
                  {subtitle}
                </Typography>
              </Stack>
            </div>

            {/* Accordion / Questions */}
            <div className="pkl-faq-accordion">
              {items.map((item, index) => {
                const isExpanded = expandedItems.has(index);
                
                return (
                  <div 
                    key={index} 
                    className="pkl-faq-item"
                    onClick={() => toggleExpanded(index)}
                  >
                    <div className="pkl-faq-question-row">
                      <div className="pkl-faq-question">
                        {item.question}
                      </div>
                      <div className={`pkl-faq-icon ${isExpanded ? 'expanded' : ''}`}>
                        {isExpanded ? (
                          <MinusIcon style={{ width: '100%', height: '100%' }} />
                        ) : (
                          <PlusIcon style={{ width: '100%', height: '100%' }} />
                        )}
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="pkl-faq-answer">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Stack>
        </Container>
      </Section>
    </>
  );
};

