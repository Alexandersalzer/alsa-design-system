// ===============================================
// design/system/components/patterns/client/PKLPortfolio/PKLPortfolio.tsx
// PKL PORTFOLIO SECTION - Case studies and success stories
// ===============================================

'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Card } from '../../../../../system/components/primitives/Card';

// ===== TYPE DEFINITIONS =====

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  challenge: string;
  result: string;
  impact: string;
  image?: string;
  tags?: string[];
}

export interface PKLPortfolioContent {
  label?: string;
  heading: string;
  description: string;
  cases: CaseStudy[];
  ctaText?: string;
  ctaHref?: string;
}

export interface PKLPortfolioProps {
  content: PKLPortfolioContent;
  onCtaClick?: () => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN PORTFOLIO COMPONENT =====

export const PKLPortfolio: React.FC<PKLPortfolioProps> = ({ 
  content, 
  onCtaClick,
  id = "pkl-portfolio",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description, 
    cases,
    ctaText,
    ctaHref
  } = content;

  const [selectedCase, setSelectedCase] = useState<string | null>(cases[0]?.id || null);
  const currentCase = cases.find(c => c.id === selectedCase);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    }
  };

  return (
    <>
      <style>{`
        .pkl-portfolio-outer-container {
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-portfolio-header {
          text-align: center;
          max-width: var(--size-page-content-max-width);
          margin: 0 auto var(--foundation-space-12);
        }
        
        .pkl-portfolio-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: var(--foundation-space-8);
          align-items: start;
        }
        
        .pkl-portfolio-cases-list {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-3);
          position: sticky;
          top: 120px;
        }
        
        .pkl-portfolio-case-tab {
          padding: var(--foundation-space-5);
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }
        
        .pkl-portfolio-case-tab:hover {
          border-color: var(--accent-500);
          transform: translateX(4px);
        }
        
        .pkl-portfolio-case-tab.active {
          background: var(--accent-500);
          border-color: var(--accent-500);
        }
        
        .pkl-portfolio-case-tab.active .pkl-portfolio-case-tab-title,
        .pkl-portfolio-case-tab.active .pkl-portfolio-case-tab-client {
          color: white;
        }
        
        .pkl-portfolio-case-tab-title {
          color: var(--text-primary);
          font-size: var(--foundation-typography-size-md);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--foundation-space-1);
        }
        
        .pkl-portfolio-case-tab-client {
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-sm);
        }
        
        .pkl-portfolio-case-detail {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-8);
          min-height: 500px;
        }
        
        .pkl-portfolio-case-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: var(--radius-md);
          margin-bottom: var(--foundation-space-6);
          background: var(--surface-subtle);
        }
        
        .pkl-portfolio-tags {
          display: flex;
          flex-wrap: wrap;
          gap: var(--foundation-space-2);
          margin-bottom: var(--foundation-space-6);
        }
        
        .pkl-portfolio-tag {
          padding: var(--foundation-space-2) var(--foundation-space-4);
          background: var(--surface-subtle);
          border-radius: var(--radius-full);
          font-size: var(--foundation-typography-size-xs);
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
        }
        
        .pkl-portfolio-section-title {
          color: var(--text-primary);
          font-size: var(--foundation-typography-size-md);
          font-weight: var(--font-weight-semibold);
          margin-bottom: var(--foundation-space-3);
          display: flex;
          align-items: center;
          gap: var(--foundation-space-2);
        }
        
        .pkl-portfolio-section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: var(--accent-500);
          border-radius: var(--radius-full);
        }
        
        .pkl-portfolio-impact {
          background: linear-gradient(135deg, var(--accent-600), var(--accent-500));
          padding: var(--foundation-space-6);
          border-radius: var(--radius-md);
          margin-top: var(--foundation-space-6);
        }
        
        .pkl-portfolio-impact-text {
          color: white;
          font-size: var(--foundation-typography-size-xl);
          font-weight: var(--font-weight-semibold);
          line-height: 1.4;
        }
        
        .pkl-portfolio-cta {
          text-align: center;
          margin-top: var(--foundation-space-12);
          padding-top: var(--foundation-space-12);
          border-top: 1px solid var(--border-medium);
        }
        
        @media (max-width: 1024px) {
          .pkl-portfolio-grid {
            grid-template-columns: 1fr;
          }
          
          .pkl-portfolio-cases-list {
            position: static;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }
        
        @media (max-width: 768px) {
          .pkl-portfolio-cases-list {
            grid-template-columns: 1fr;
          }
          
          .pkl-portfolio-case-detail {
            padding: var(--foundation-space-6);
          }
          
          .pkl-portfolio-case-image {
            height: 200px;
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
        <div className="pkl-portfolio-outer-container">
          {/* Header */}
          <div className="pkl-portfolio-header">
            <Stack spacing="md" align="center">
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
            </Stack>
          </div>

          {/* Portfolio Grid */}
          <div className="pkl-portfolio-grid">
            {/* Cases List (Sidebar) */}
            <div className="pkl-portfolio-cases-list">
              {cases.map((caseStudy) => (
                <div
                  key={caseStudy.id}
                  className={`pkl-portfolio-case-tab ${selectedCase === caseStudy.id ? 'active' : ''}`}
                  onClick={() => setSelectedCase(caseStudy.id)}
                >
                  <div className="pkl-portfolio-case-tab-title">
                    {caseStudy.title}
                  </div>
                  <div className="pkl-portfolio-case-tab-client">
                    {caseStudy.client}
                  </div>
                </div>
              ))}
            </div>

            {/* Case Detail */}
            {currentCase && (
              <div className="pkl-portfolio-case-detail">
                {currentCase.image && (
                  <img 
                    src={currentCase.image} 
                    alt={currentCase.title}
                    className="pkl-portfolio-case-image"
                  />
                )}
                
                {/* Tags */}
                {currentCase.tags && currentCase.tags.length > 0 && (
                  <div className="pkl-portfolio-tags">
                    {currentCase.tags.map((tag, index) => (
                      <span key={index} className="pkl-portfolio-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <Stack spacing="lg">
                  {/* Title & Client */}
                  <div>
                    <Typography 
                      variant={textScale === 'lg' ? 'h2' : textScale === 'sm' ? 'h4' : 'h3'}
                      weight="semibold"
                      color="primary"
                      as="h3"
                    >
                      {currentCase.title}
                    </Typography>
                    <Typography 
                      variant="body-md"
                      color="secondary"
                      style={{ marginTop: 'var(--foundation-space-2)' }}
                    >
                      {currentCase.client} • {currentCase.industry}
                    </Typography>
                  </div>
                  
                  {/* Challenge */}
                  <div>
                    <div className="pkl-portfolio-section-title">
                      Utmaning
                    </div>
                    <Typography 
                      variant={textScale === 'lg' ? 'body-md' : 'body-sm'}
                      color="secondary"
                    >
                      {currentCase.challenge}
                    </Typography>
                  </div>
                  
                  {/* Result */}
                  <div>
                    <div className="pkl-portfolio-section-title">
                      Lösning & Resultat
                    </div>
                    <Typography 
                      variant={textScale === 'lg' ? 'body-md' : 'body-sm'}
                      color="secondary"
                    >
                      {currentCase.result}
                    </Typography>
                  </div>
                  
                  {/* Impact */}
                  <div className="pkl-portfolio-impact">
                    <Typography 
                      variant="body-sm"
                      style={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        marginBottom: 'var(--foundation-space-2)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 'var(--font-weight-medium)'
                      }}
                    >
                      Påverkan
                    </Typography>
                    <div className="pkl-portfolio-impact-text">
                      {currentCase.impact}
                    </div>
                  </div>
                </Stack>
              </div>
            )}
          </div>

          {/* CTA */}
          {ctaText && (
            <div className="pkl-portfolio-cta">
              <Stack spacing="md" align="center">
                <Typography 
                  variant="h4"
                  weight="semibold"
                  color="primary"
                >
                  Vill du också uppnå liknande resultat?
                </Typography>
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleCtaClick}
                >
                  {ctaText}
                </Button>
              </Stack>
            </div>
          )}
        </div>
      </Section>
    </>
  );
};

