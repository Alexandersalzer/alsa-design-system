'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { ZapIcon, UsersIcon, ShieldCheckIcon } from 'lucide-react';

interface FeatureItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
  cta?: {
    label: string;
    href: string;
  };
}

interface CleanFeatureGridSectionContent {
  title?: string;
  subtitle?: string;
  features: FeatureItem[];
}

interface CleanFeatureGridSectionProps {
  content: CleanFeatureGridSectionContent;
  id?: string;
}

const CleanFeatureGridSection = ({ content, id = "feature-grid" }: CleanFeatureGridSectionProps) => {
  const { title, subtitle, features } = content;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .feature-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--foundation-space-8);
          }
          
          @media (min-width: 768px) {
            .feature-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          .feature-item {
            background: var(--surface-primary);
            border-radius: var(--radius-lg);
            padding: var(--foundation-space-4);
            animation: fadeInUp 0.6s ease-out;
            border: 1px solid var(--border-subtle);
          }
          
          .feature-icon {
            width: 40px;
            height: 40px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: var(--foundation-space-3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .feature-icon svg {
            width: 20px;
            height: 20px;
            color: var(--text-primary);
            opacity: 0.9;
          }
          
          @media (min-width: 1024px) {
            .feature-item--cta {
              grid-column: span 2;
            }
          }
        `
      }} />
      
      <Section 
        id={id}
        as="section"
        height="auto"
        style={{
          paddingTop: 'var(--foundation-space-32)',
          paddingBottom: 'var(--foundation-space-32)',
          backgroundColor: 'transparent'
        }}
      >
        <div style={{ 
          maxWidth: 'var(--size-page-max-width)',
          margin: '0 auto',
          padding: '0 var(--foundation-space-6)'
        }}>
          <Stack spacing="lg" align="center">
            {(title || subtitle) && (
              <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                <Stack spacing="md" align="center">
                {title && (
                  <Typography 
                    variant="h2" 
                    weight="bold"
                    style={{ 
                      color: 'var(--text-primary)',
                      textAlign: 'center'
                    }}
                  >
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography 
                    variant="body-lg"
                    style={{ 
                      color: 'var(--text-secondary)',
                      textAlign: 'center'
                    }}
                  >
                    {subtitle}
                  </Typography>
                )}
                </Stack>
              </div>
            )}
            
            <div className="feature-grid">
              {features.map((feature, index) => (
                <article 
                  key={index}
                  className={`feature-item ${feature.cta ? 'feature-item--cta' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Stack spacing="md">
                    {feature.icon && (
                      <div className="feature-icon">
                        {feature.icon}
                      </div>
                    )}
                    
                    <Typography 
                      variant={feature.cta ? "h2" : "h3"}
                      weight="bold"
                      style={{ 
                        color: 'var(--text-primary)',
                        fontSize: feature.cta ? '1.5rem' : '1.1rem'
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body-sm"
                      style={{ 
                        color: 'var(--text-secondary)',
                        lineHeight: 'var(--foundation-typography-line-height-relaxed)'
                      }}
                    >
                      {feature.description}
                    </Typography>
                    
                    {feature.cta && (
                      <div style={{ marginTop: 'var(--foundation-space-4)' }}>
                        <Button 
                          variant="primary"
                          size="lg"
                          onClick={() => {
                            if (feature.cta?.href) {
                              window.location.href = feature.cta.href;
                            }
                          }}
                        >
                          {feature.cta.label}
                        </Button>
                      </div>
                    )}
                  </Stack>
                </article>
              ))}
            </div>
          </Stack>
        </div>
      </Section>
    </>
  );
};

export default CleanFeatureGridSection;
