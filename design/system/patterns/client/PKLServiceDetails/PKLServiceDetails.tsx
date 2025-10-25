// ===============================================
// design/system/components/patterns/client/PKLServiceDetails/PKLServiceDetails.tsx
// PKL SERVICE DETAILS - Detailed service offerings with features
// ===============================================

'use client';

import React from 'react';
import { Typography } from '../../../../system/components/primitives/Typography';
import { Section } from '../../../components'
import { VStack } from '../../../components/layout';

// ===== TYPE DEFINITIONS =====

export interface ServiceDetail {
  icon?: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export interface PKLServiceDetailsContent {
  label?: string;
  heading: string;
  description: string;
  services: ServiceDetail[];
}

export interface PKLServiceDetailsProps {
  content: PKLServiceDetailsContent;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN SERVICE DETAILS COMPONENT =====

export const PKLServiceDetails: React.FC<PKLServiceDetailsProps> = ({ 
  content, 
  id = "pkl-service-details",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description, 
    services
  } = content;

  // Dynamisk grid baserat på antal services
  const gridColumns = services.length === 2 
    ? 'repeat(2, 1fr)'
    : services.length === 3
    ? 'repeat(3, 1fr)'
    : services.length === 4
    ? 'repeat(2, 1fr)'  // 2x2 för 4 kort
    : 'repeat(auto-fit, minmax(300px, 1fr))';

  return (
    <>
      <style>{`
        .pkl-service-details-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-service-details-header {
          text-align: center;
          max-width: var(--size-page-content-max-width);
          margin: 0 auto var(--foundation-space-12);
        }
        
        .pkl-service-details-grid {
          display: grid;
          grid-template-columns: ${gridColumns};
          gap: var(--foundation-space-8);
        }
        
        .pkl-service-card {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-8);
        }
        
        .pkl-service-icon {
          margin-bottom: var(--foundation-space-4);
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
        
        .pkl-service-icon svg {
          width: 32px;
          height: 32px;
          color: var(--accent-500);
        }
        
        .pkl-service-title {
          color: var(--text-primary);
          margin-bottom: var(--foundation-space-3);
        }
        
        .pkl-service-description {
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: var(--foundation-space-4);
        }
        
        .pkl-service-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-2);
        }
        
        .pkl-service-feature-item {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: var(--foundation-space-2);
        }
        
        .pkl-service-feature-bullet {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-500);
          flex-shrink: 0;
        }
        
        @media (max-width: 1024px) {
          .pkl-service-details-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        
        @media (max-width: 768px) {
          .pkl-service-details-grid {
            grid-template-columns: 1fr !important;
            gap: var(--foundation-space-6);
          }
          
          .pkl-service-card {
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
        <div className="pkl-service-details-outer-container">
          {/* Header */}
          <div className="pkl-service-details-header">
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

          {/* Services Grid */}
          <div className="pkl-service-details-grid">
            {services.map((service, index) => (
              <div key={index} className="pkl-service-card">
                {/* Icon */}
                {service.icon && (
                  <div className="pkl-service-icon">
                    {service.icon}
                  </div>
                )}
                
                {/* Title */}
                <Typography 
                  variant={textScale === 'lg' ? 'h3' : textScale === 'sm' ? 'body-lg' : 'h4'}
                  weight="semibold"
                  color="primary"
                  as="h3"
                  className="pkl-service-title"
                >
                  {service.title}
                </Typography>
                
                {/* Description */}
                <Typography 
                  variant={textScale === 'lg' ? 'body-md' : 'body-sm'}
                  color="secondary"
                  className="pkl-service-description"
                >
                  {service.description}
                </Typography>
                
                {/* Features List */}
                {service.features && service.features.length > 0 && (
                  <ul className="pkl-service-features">
                    {service.features.map((feature, fIndex) => (
                      <li key={fIndex} className="pkl-service-feature-item">
                        <span className="pkl-service-feature-bullet" />
                        <Typography 
                          variant="body-sm"
                          color="secondary"
                        >
                          {feature}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

