'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

export interface PKLFAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface PKLFAQContent {
  label?: string;
  title: string;
  description?: string;
  faqs: PKLFAQItem[];
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
        .pkl-faq-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-faq-container {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: var(--foundation-space-12);
          align-items: start;
        }
        
        .pkl-faq-header {
          text-align: left;
          position: sticky;
          top: 120px;
          max-width: var(--size-page-content-max-width);
        }
        
        .pkl-faq-accordion-container {
          width: 100%;
        }
        
        .pkl-faq-accordion {
          background: transparent;
          border-radius: 0;
          padding: 0;
          box-shadow: none;
        }
        
        .pkl-faq-item {
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.2s ease;
          background: transparent;
        }
        
        .pkl-faq-item:last-child {
          border-bottom: none;
        }
        
        .pkl-faq-item:hover {
          background: transparent;
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
        
        @media (max-width: 1024px) {
          .pkl-faq-container {
            grid-template-columns: 1fr;
            gap: var(--foundation-space-8);
          }
          
          .pkl-faq-header {
            position: static;
          }
        }
        
        @media (max-width: 768px) {
          .pkl-faq-accordion {
            padding: 0;
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
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop: 'var(--foundation-space-16)',
          paddingBottom: 'var(--foundation-space-16)'
        }}
      >
        <div className="pkl-faq-outer-container">
          <div className="pkl-faq-container">
            {/* Header Area - Left Side */}
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
                  >
                    {description}
                  </Typography>
                )}
              </Stack>
            </div>

            {/* Accordion / Questions - Right Side */}
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
          </div>
        </div>
      </Section>
    </>
  );
};

