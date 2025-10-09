'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PKLFAQContent {
  label?: string;
  title: string;
  description?: string;
  faqs: FAQItem[];
}

export interface PKLFAQProps {
  content: PKLFAQContent;
  id?: string;
  expandAll?: boolean;
}

export const PKLFAQ: React.FC<PKLFAQProps> = ({ 
  content, 
  id = "pkl-faq",
  expandAll = false 
}) => {
  const { label, title, description, faqs } = content;
  
  // Track which FAQs are expanded
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    expandAll ? new Set(faqs.map(f => f.id)) : new Set()
  );

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const isExpanded = (itemId: string) => expandedItems.has(itemId);

  return (
    <>
      <style>{`
        .pkl-faq-section {
          background: var(--surface-page);
        }
        
        .pkl-faq-header {
          text-align: left;
          max-width: var(--size-page-content-max-width);
        }
        
        .pkl-faq-accordion-container {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .pkl-faq-accordion {
          background: var(--surface-subtle);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-4);
          box-shadow: var(--shadow-xs);
        }
        
        .pkl-faq-item {
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.2s ease;
        }
        
        .pkl-faq-item:last-child {
          border-bottom: none;
        }
        
        .pkl-faq-item:hover {
          background: var(--surface-hover);
        }
        
        .pkl-faq-question-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--foundation-space-6);
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          gap: var(--foundation-space-4);
          transition: background 0.2s ease;
        }
        
        .pkl-faq-question-text {
          flex: 1;
          color: var(--text-primary);
          font-size: var(--foundation-typography-size-md);
          font-weight: var(--font-weight-medium);
          line-height: 1.5;
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
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.3s ease,
                      padding 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .pkl-faq-answer.collapsed {
          max-height: 0;
          opacity: 0;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-faq-answer.expanded {
          max-height: 1000px;
          opacity: 1;
          padding: 0 var(--foundation-space-6) var(--foundation-space-6);
        }
        
        .pkl-faq-answer-content {
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-sm);
          line-height: 1.75;
        }
        
        @media (max-width: 768px) {
          .pkl-faq-accordion {
            padding: var(--foundation-space-2);
          }
          
          .pkl-faq-question-button {
            padding: var(--foundation-space-5);
          }
          
          .pkl-faq-answer.expanded {
            padding: 0 var(--foundation-space-5) var(--foundation-space-5);
          }
          
          .pkl-faq-answer.collapsed {
            padding: 0 var(--foundation-space-5);
          }
        }
      `}</style>

      <Section 
        id={id} 
        as="section" 
        className="pkl-faq-section"
        style={{
          paddingTop: 'var(--foundation-space-16)',
          paddingBottom: 'var(--foundation-space-16)'
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing="xl" align="start">
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
                {description && (
                  <Typography 
                    variant="body-md" 
                    color="secondary"
                    style={{ maxWidth: 'var(--size-page-content-max-width)' }}
                  >
                    {description}
                  </Typography>
                )}
              </Stack>
            </div>

            {/* Accordion / Questions */}
            <div className="pkl-faq-accordion-container">
              <div className="pkl-faq-accordion">
                {faqs.map((faq, index) => {
                  const expanded = isExpanded(faq.id);
                  
                  return (
                    <div key={faq.id} className="pkl-faq-item">
                      <button
                        className="pkl-faq-question-button"
                        onClick={() => toggleItem(faq.id)}
                        aria-expanded={expanded}
                        aria-controls={`faq-answer-${faq.id}`}
                      >
                        <span className="pkl-faq-question-text">
                          {faq.question}
                        </span>
                        <div className={`pkl-faq-icon ${expanded ? 'expanded' : ''}`}>
                          {expanded ? (
                            <MinusIcon style={{ width: '100%', height: '100%' }} />
                          ) : (
                            <PlusIcon style={{ width: '100%', height: '100%' }} />
                          )}
                        </div>
                      </button>
                      
                      <div
                        id={`faq-answer-${faq.id}`}
                        className={`pkl-faq-answer ${expanded ? 'expanded' : 'collapsed'}`}
                      >
                        <div className="pkl-faq-answer-content">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Stack>
        </Container>
      </Section>
    </>
  );
};

