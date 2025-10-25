// ===============================================
// design/system/components/patterns/client/PKLValues/PKLValues.tsx
// PKL VALUES SECTION - Company values and principles
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../system/components/primitives/Typography';
import { VStack } from '../../../components/layout';
import { Section } from '../../../components'

// ===== TYPE DEFINITIONS =====

export interface Value {
  title: string;
  description: string;
}

export interface PKLValuesContent {
  label?: string;
  heading: string;
  description: string;
  values: Value[];
}

export interface PKLValuesProps {
  content: PKLValuesContent;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN VALUES COMPONENT =====

export const PKLValues: React.FC<PKLValuesProps> = ({ 
  content, 
  id = "pkl-values",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description, 
    values
  } = content;

  // Dynamisk grid baserat på antal värderingar
  const gridColumns = values.length === 3 
    ? 'repeat(3, 1fr)'  // 3 kort = 3 kolumner
    : values.length === 4 
    ? 'repeat(2, 1fr)'  // 4 kort = 2x2
    : 'repeat(auto-fit, minmax(280px, 1fr))'; // Annat = auto

  return (
    <>
      <style>{`
        .pkl-values-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-values-header {
          text-align: center;
          max-width: var(--size-page-content-max-width);
          margin: 0 auto var(--foundation-space-12);
        }
        
        .pkl-values-grid {
          display: grid;
          grid-template-columns: ${gridColumns};
          gap: var(--foundation-space-8);
        }
        
        .pkl-values-card {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-8);
        }
        
        .pkl-values-card-title {
          color: var(--text-primary);
          margin-bottom: var(--foundation-space-3);
        }
        
        .pkl-values-card-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin: 0;
        }
        
        @media (max-width: 1024px) {
          .pkl-values-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: var(--foundation-space-6);
          }
        }
        
        @media (max-width: 768px) {
          .pkl-values-grid {
            grid-template-columns: 1fr !important;
            gap: var(--foundation-space-6);
          }
          
          .pkl-values-card {
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
        <div className="pkl-values-outer-container">
          {/* Header */}
          <div className="pkl-values-header">
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

          {/* Values Grid */}
          <div className="pkl-values-grid">
            {values.map((value, index) => (
              <div 
                key={index}
                className="pkl-values-card"
              >
                <Typography 
                  variant={textScale === 'lg' ? 'h3' : textScale === 'sm' ? 'body-lg' : 'h4'}
                  weight="semibold"
                  color="primary"
                  as="h3"
                  className="pkl-values-card-title"
                >
                  {value.title}
                </Typography>
                
                <Typography 
                  variant={textScale === 'lg' ? 'body-md' : 'body-sm'}
                  color="secondary"
                  className="pkl-values-card-description"
                >
                  {value.description}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

