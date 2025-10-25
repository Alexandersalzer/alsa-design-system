// ===============================================
// design/system/components/patterns/client/PKLContactInfo/PKLContactInfo.tsx
// PKL CONTACT INFO - Contact methods display
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../system/components/primitives/Typography';
import { VStack } from '../../../components/layout';
import { Section } from '../../../components'

// ===== TYPE DEFINITIONS =====

export interface ContactMethod {
  icon?: React.ReactNode;
  title: string;
  value: string;
  description: string;
}

export interface PKLContactInfoContent {
  label?: string;
  heading: string;
  description: string;
  methods: ContactMethod[];
}

export interface PKLContactInfoProps {
  content: PKLContactInfoContent;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN CONTACT INFO COMPONENT =====

export const PKLContactInfo: React.FC<PKLContactInfoProps> = ({ 
  content, 
  id = "pkl-contact-info",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description, 
    methods
  } = content;

  // Dynamisk grid baserat på antal metoder
  const gridColumns = methods.length === 3 
    ? 'repeat(3, 1fr)'
    : methods.length === 2
    ? 'repeat(2, 1fr)'
    : 'repeat(auto-fit, minmax(280px, 1fr))';

  return (
    <>
      <style>{`
        .pkl-contact-info-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-contact-info-header {
          text-align: center;
          max-width: var(--size-page-content-max-width);
          margin: 0 auto var(--foundation-space-12);
        }
        
        .pkl-contact-info-grid {
          display: grid;
          grid-template-columns: ${gridColumns};
          gap: var(--foundation-space-8);
        }
        
        .pkl-contact-card {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-8);
          text-align: center;
        }
        
        .pkl-contact-icon {
          margin-bottom: var(--foundation-space-4);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .pkl-contact-icon svg {
          width: 32px;
          height: 32px;
          color: var(--accent-500);
        }
        
        .pkl-contact-title {
          color: var(--text-primary);
          margin-bottom: var(--foundation-space-2);
        }
        
        .pkl-contact-value {
          color: var(--accent-500);
          margin-bottom: var(--foundation-space-2);
        }
        
        .pkl-contact-description {
          color: var(--text-secondary);
          margin: 0;
        }
        
        @media (max-width: 1024px) {
          .pkl-contact-info-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .pkl-contact-info-grid {
            grid-template-columns: 1fr !important;
            gap: var(--foundation-space-6);
          }
          
          .pkl-contact-card {
            padding: var(--foundation-space-6);
          }
        }
      `}</style>

      <Section 
        id={id} 
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="pkl-contact-info-outer-container">
          {/* Header */}
          <div className="pkl-contact-info-header">
            <VStack spacing="md" align="center">
              {label && (
                <Typography 
                  variant="label-sm" 
                  color="accent"
                  weight="medium"
                >
                  {label}
                </Typography>
              )}
              
              <Typography 
                variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                weight="semibold" 
                color="primary" 
                as="h2"
              >
                {heading}
              </Typography>
              
              <Typography 
                variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                color="secondary"
              >
                {description}
              </Typography>
            </VStack>
          </div>

          {/* Contact Methods Grid */}
          <div className="pkl-contact-info-grid">
            {methods.map((method, index) => (
              <div key={index} className="pkl-contact-card">
                {/* Icon */}
                {method.icon && (
                  <div className="pkl-contact-icon">
                    {method.icon}
                  </div>
                )}
                
                {/* Title */}
                <Typography 
                  variant={textScale === 'lg' ? 'h4' : 'body-lg'}
                  weight="semibold"
                  color="primary"
                  as="h3"
                  className="pkl-contact-title"
                >
                  {method.title}
                </Typography>
                
                {/* Value */}
                <Typography 
                  variant="body-md"
                  weight="medium"
                  className="pkl-contact-value"
                >
                  {method.value}
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant="body-sm"
                  color="secondary"
                  className="pkl-contact-description"
                >
                  {method.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

