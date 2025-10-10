'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { ArrowRightIcon, ChartBarIcon, CogIcon, DocumentTextIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export interface ServiceCard {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface OurExpertiseContent {
  subheading: string;
  heading: string;
  description: string;
  services: ServiceCard[];
}

export interface OurExpertiseProps {
  content: OurExpertiseContent;
  id?: string;
}

export const OurExpertise: React.FC<OurExpertiseProps> = ({ 
  content, 
  id = "our-expertise" 
}) => {
  const { subheading, heading, description, services } = content;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .our-expertise-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .our-expertise-header {
            max-width: var(--size-page-content-max-width);
            margin-bottom: var(--foundation-space-12);
          }
          
          .service-card {
            background: var(--surface-muted);
            border-radius: var(--radius-md);
            padding: var(--foundation-space-6);
            box-shadow: var(--shadow-sm);
            transition: all var(--foundation-motion-fast);
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          
          .service-card:hover {
            transform: scale(1.02);
            box-shadow: var(--shadow-md);
          }
          
          .service-card-icon {
            margin-bottom: var(--foundation-space-4);
            color: var(--primary-500);
          }
          
          .service-card-title {
            margin-bottom: var(--foundation-space-3);
            color: var(--text-primary);
          }
          
          .service-card-description {
            color: var(--text-secondary);
            flex-grow: 1;
            margin-bottom: var(--foundation-space-4);
          }
          
          .service-card-arrow {
            position: absolute;
            top: var(--foundation-space-4);
            right: var(--foundation-space-4);
            opacity: 0.6;
            transition: all var(--foundation-motion-fast);
            color: var(--text-tertiary);
          }
          
          .service-card:hover .service-card-arrow {
            opacity: 1;
            transform: translateX(2px);
          }
          
          .our-expertise-grid {
            gap: var(--foundation-space-6);
          }
          
          @media (max-width: 768px) {
            .our-expertise-grid {
              grid-template-columns: 1fr;
              gap: var(--foundation-space-4);
            }
            
            .our-expertise-header {
              margin-bottom: var(--foundation-space-8);
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .our-expertise-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          @media (min-width: 1025px) {
            .our-expertise-grid {
              grid-template-columns: repeat(4, 1fr);
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop: 'var(--foundation-space-24)',
          paddingBottom: 'var(--foundation-space-24)'
        }}
      >
        <div className="our-expertise-container">
          {/* Header Area */}
          <div className="our-expertise-header">
            <Stack spacing="lg">
              {/* Subheading */}
              <Typography 
                variant="label-sm" 
                color="primary"
                weight="medium"
              >
                {subheading}
              </Typography>
              
              {/* Main Heading */}
              <Typography 
                variant="h2" 
                weight="semibold"
                color="primary"
                as="h2"
              >
                {heading}
              </Typography>
              
              {/* Description */}
              <Typography 
                variant="body-md"
                color="secondary"
                style={{
                  maxWidth: 'var(--size-page-narrow-max-width)'
                }}
              >
                {description}
              </Typography>
            </Stack>
          </div>
          
          {/* Services Grid */}
          <Grid 
            columns={4} 
            gap="lg" 
            collapseOn="tablet"
            minItemWidth="250px"
            className="our-expertise-grid"
          >
            {services.map((service, index) => (
              <div key={index} className="service-card">
                {/* Arrow Icon */}
                <ArrowRightIcon 
                  className="service-card-arrow"
                  style={{ width: '20px', height: '20px' }}
                />
                
                {/* Service Icon */}
                <div className="service-card-icon">
                  <Icon size="md" color="primary">
                    {service.icon as React.ReactElement}
                  </Icon>
                </div>
                
                {/* Service Title */}
                <Typography 
                  variant="h4" 
                  weight="semibold"
                  className="service-card-title"
                  as="h3"
                >
                  {service.title}
                </Typography>
                
                {/* Service Description */}
                <Typography 
                  variant="body-sm"
                  color="secondary"
                  className="service-card-description"
                >
                  {service.description}
                </Typography>
              </div>
            ))}
          </Grid>
        </div>
      </Section>
    </>
  );
};

OurExpertise.displayName = 'OurExpertise';
