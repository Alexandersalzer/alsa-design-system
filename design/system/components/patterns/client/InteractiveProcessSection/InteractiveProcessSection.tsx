'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { ChevronRightIcon, CheckIcon } from 'lucide-react';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface InteractiveProcessSectionProps {
  id?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  steps: ProcessStep[];
  buttonText?: string;
  buttonHref?: string;
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  onButtonClick?: () => void;
}

const InteractiveProcessSection = ({ 
  id = "interactive-process",
  sectionTitle = "Så här enkelt fungerar det",
  sectionSubtitle = "Tre enkla steg till din ersättning. Vi hanterar allt åt dig.",
  steps,
  buttonText = "Starta din bedömning",
  buttonHref,
  buttonVariant = 'primary',
  onButtonClick
}: InteractiveProcessSectionProps) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .interactive-process-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .process-steps {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-4);
            margin-bottom: var(--foundation-space-8);
          }
          
          @media (min-width: 768px) {
            .process-steps {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
              gap: var(--foundation-space-2);
            }
          }
          
          .step-item {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: var(--foundation-space-6);
            border-radius: var(--radius-lg);
            background: var(--surface-primary);
            box-shadow: var(--shadow-sm);
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
            min-height: 200px;
          }
          
          .step-item:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-md);
            border-color: var(--accent-200);
          }
          
          .step-item.active {
            border-color: var(--accent-500);
            box-shadow: var(--shadow-lg);
            background: var(--accent-50);
          }
          
          .step-item.completed {
            border-color: var(--success-500);
            background: var(--success-50);
          }
          
          .step-number {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-full);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 1.25rem;
            margin-bottom: var(--foundation-space-4);
            transition: all 0.3s ease;
          }
          
          .step-item:not(.active):not(.completed) .step-number {
            background: var(--surface-secondary);
            color: var(--text-secondary);
            border: 2px solid var(--border-subtle);
          }
          
          .step-item.active .step-number {
            background: var(--accent-500);
            color: white;
            border: 2px solid var(--accent-500);
          }
          
          .step-item.completed .step-number {
            background: var(--success-500);
            color: white;
            border: 2px solid var(--success-500);
          }
          
          .step-arrow {
            display: none;
            color: var(--text-tertiary);
            margin: 0 var(--foundation-space-2);
          }
          
          @media (min-width: 768px) {
            .step-arrow {
              display: block;
              align-self: center;
              margin-top: 24px;
            }
          }
          
          .step-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .step-title {
            font-size: 1.125rem;
            font-weight: 600;
            margin-bottom: var(--foundation-space-2);
            line-height: 1.3;
          }
          
          .step-description {
            font-size: 0.875rem;
            line-height: 1.5;
            color: var(--text-secondary);
          }
          
          .section-header {
            text-align: center;
            margin-bottom: var(--foundation-space-12);
          }
          
          .section-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: bold;
            line-height: 1.1;
            margin-bottom: var(--foundation-space-4);
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .section-subtitle {
            font-size: 1.25rem;
            line-height: 1.5;
            color: var(--text-secondary);
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .cta-section {
            text-align: center;
            margin-top: var(--foundation-space-8);
          }
        `
      }} />
      
      <Section 
        id={id}
        style={{
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-32)',
          paddingBottom: 'var(--foundation-space-32)'
        }}
      >
        <div className="interactive-process-container">
          {/* Section Header */}
          <div className="section-header">
            <Typography 
              variant="h1"
              weight="bold"
              style={{ 
                color: 'var(--text-primary)',
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                lineHeight: '1.1',
                marginBottom: 'var(--foundation-space-4)',
                maxWidth: '600px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              {sectionTitle}
            </Typography>
            
            <Typography 
              variant="body-lg"
              style={{ 
                color: 'var(--text-secondary)',
                lineHeight: '1.5',
                maxWidth: '500px',
                marginLeft: 'auto',
                marginRight: 'auto'
              }}
            >
              {sectionSubtitle}
            </Typography>
          </div>

          {/* Interactive Steps */}
          <div className="process-steps">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`step-item ${index === activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`step-number ${index < activeStep ? 'completed' : ''}`}>
                    {index < activeStep ? (
                      <Icon size="sm" color="inverse">
                        <CheckIcon />
                      </Icon>
                    ) : (
                      index + 1
                    )}
                  </div>
                  
                  <div className="step-content">
                    <Typography 
                      variant="h4"
                      weight="semibold"
                      style={{ 
                        color: 'var(--text-primary)',
                        fontSize: '1.125rem',
                        marginBottom: 'var(--foundation-space-2)',
                        lineHeight: '1.3'
                      }}
                    >
                      {step.title}
                    </Typography>
                    
                    <Typography 
                      variant="body-sm"
                      style={{ 
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                      }}
                    >
                      {step.description}
                    </Typography>
                  </div>
                </div>
                
                {/* Arrow between steps (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="step-arrow">
                    <Icon size="md" color="tertiary">
                      <ChevronRightIcon />
                    </Icon>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* CTA Section */}
          <div className="cta-section">
            <Button 
              variant={buttonVariant}
              size="lg"
              onClick={() => {
                if (onButtonClick) {
                  onButtonClick();
                } else if (buttonHref) {
                  window.location.href = buttonHref;
                }
              }}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
};

export default InteractiveProcessSection;
