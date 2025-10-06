'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

interface StepItem {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface InteractiveStepSectionProps {
  id?: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref?: string;
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  steps: StepItem[];
}

const InteractiveStepSection = ({ 
  id = "interactive-steps",
  title,
  subtitle,
  buttonText,
  buttonHref,
  buttonVariant = 'primary',
  steps
}: InteractiveStepSectionProps) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .interactive-step-container {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-16);
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          @media (min-width: 1024px) {
            .interactive-step-container {
              flex-direction: row;
              gap: var(--foundation-space-24);
              align-items: flex-start;
            }
          }
          
          .step-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-8);
          }
          
          @media (min-width: 1024px) {
            .step-content {
              max-width: 500px;
            }
          }
          
          .step-visualizer {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-8);
            min-height: 400px;
          }
          
          @media (min-width: 768px) {
            .step-visualizer {
              flex-direction: row;
              align-items: center;
              justify-content: center;
              gap: var(--foundation-space-4);
            }
          }
          
          .step-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: var(--foundation-space-6);
            border-radius: var(--radius-lg);
            background: var(--surface-primary);
            box-shadow: var(--shadow-md);
            transition: all 0.3s ease;
            cursor: pointer;
            border: 2px solid transparent;
            min-height: 200px;
            justify-content: center;
            position: relative;
            flex: 1;
          }
          
          .step-item:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-lg);
          }
          
          .step-item.active {
            border-color: var(--accent-500);
            background: var(--surface-secondary);
          }
          
          .step-number {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-full);
            background: var(--surface-secondary);
            border: 2px solid var(--border-subtle);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            font-size: 1.25rem;
            color: var(--text-secondary);
            margin-bottom: var(--foundation-space-4);
            transition: all 0.3s ease;
          }
          
          .step-item.active .step-number {
            background: var(--accent-500);
            border-color: var(--accent-500);
            color: white;
          }
          
          .step-connector {
            display: none;
            width: 40px;
            height: 2px;
            background: var(--border-subtle);
            position: relative;
            margin: 0 var(--foundation-space-2);
          }
          
          .step-connector::after {
            content: '';
            position: absolute;
            right: -6px;
            top: -4px;
            width: 0;
            height: 0;
            border-left: 8px solid var(--border-subtle);
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
          }
          
          @media (min-width: 768px) {
            .step-connector {
              display: block;
            }
          }
          
          .step-connector.completed {
            background: var(--accent-500);
          }
          
          .step-connector.completed::after {
            border-left-color: var(--accent-500);
          }
          
          .step-icon {
            width: 32px;
            height: 32px;
            color: var(--text-secondary);
            margin-bottom: var(--foundation-space-3);
            transition: all 0.3s ease;
          }
          
          .step-item.active .step-icon {
            color: var(--accent-500);
          }
          
          .step-title {
            font-size: 1.125rem;
            font-weight: 600;
            color: var(--text-primary);
            margin-bottom: var(--foundation-space-2);
            line-height: 1.3;
          }
          
          .step-description {
            font-size: 0.875rem;
            color: var(--text-secondary);
            line-height: 1.5;
          }
          
          .step-item.active .step-title {
            color: var(--accent-500);
          }
          
          @media (max-width: 767px) {
            .step-item {
              min-height: 150px;
            }
            
            .step-number {
              width: 40px;
              height: 40px;
              font-size: 1.125rem;
            }
            
            .step-title {
              font-size: 1rem;
            }
            
            .step-description {
              font-size: 0.8125rem;
            }
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
        <div className="interactive-step-container">
          {/* Left side - Content */}
          <div className="step-content">
            <Stack spacing="lg" align="start">
              <Typography 
                variant="h1"
                weight="bold"
                style={{ 
                  color: 'var(--text-primary)',
                  fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                  lineHeight: '1.1',
                  maxWidth: '400px'
                }}
              >
                {title}
              </Typography>
              
              <Typography 
                variant="body-lg"
                style={{ 
                  color: 'var(--text-secondary)',
                  lineHeight: '1.5',
                  maxWidth: '450px'
                }}
              >
                {subtitle}
              </Typography>
              
              <Button 
                variant={buttonVariant}
                size="lg"
                onClick={() => {
                  if (buttonHref) {
                    if (buttonHref.startsWith('#')) {
                      document.querySelector(buttonHref)?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.href = buttonHref;
                    }
                  }
                }}
              >
                {buttonText}
              </Button>
            </Stack>
          </div>
          
          {/* Right side - Interactive Steps */}
          <div className="step-visualizer">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div 
                  className={`step-item ${activeStep === index ? 'active' : ''}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="step-number">
                    {index + 1}
                  </div>
                  
                  {step.icon && (
                    <div className="step-icon">
                      {step.icon}
                    </div>
                  )}
                  
                  <Typography 
                    variant="h4"
                    weight="semibold"
                    className="step-title"
                  >
                    {step.title}
                  </Typography>
                  
                  <Typography 
                    variant="body-sm"
                    className="step-description"
                  >
                    {step.description}
                  </Typography>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`step-connector ${activeStep > index ? 'completed' : ''}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
};

export default InteractiveStepSection;
