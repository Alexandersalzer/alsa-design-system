'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

interface ProcessItem {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface SplitProcessSectionContent {
  leftSide: {
    items: ProcessItem[];
  };
  rightSide: {
    title: string;
    description: string;
    buttonText: string;
    buttonHref?: string;
    buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  };
}

interface SplitProcessSectionProps {
  content: SplitProcessSectionContent;
  id?: string;
}

const SplitProcessSection = ({ content, id = "split-process" }: SplitProcessSectionProps) => {
  const { leftSide, rightSide } = content;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .split-process-container {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--foundation-space-16);
            align-items: stretch;
          }
          
          @media (min-width: 1024px) {
            .split-process-container {
              grid-template-columns: 1fr 1fr;
              gap: var(--foundation-space-24);
            }
          }
          
          .process-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: var(--foundation-space-6);
            height: 100%;
            align-content: start;
          }
          
          @media (min-width: 768px) {
            .process-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: var(--foundation-space-8);
            }
          }
          
          .process-item {
            padding: var(--foundation-space-6);
            border-radius: var(--radius-md);
            transition: all 0.3s ease;
          }
          
          .process-item:hover {
            transform: translateY(-2px);
          }
          
          .process-icon {
            width: 48px;
            height: 48px;
            background: var(--surface-secondary);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: var(--foundation-space-4);
            border: 1px solid var(--border-subtle);
          }
          
          .process-icon svg {
            width: 24px;
            height: 24px;
            color: var(--text-primary);
          }
          
          .right-content {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            min-height: 100%;
            height: 100%;
          }
          
          @media (min-width: 1024px) {
            .right-content {
              padding-left: var(--foundation-space-8);
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
          <div className="split-process-container">
            {/* Left Side - Process Items Grid */}
            <div className="process-grid">
              {leftSide.items.map((item, index) => (
                <div key={index} className="process-item">
                  <Stack spacing="md" align="start">
                    {item.icon && (
                      <div className="process-icon">
                        {item.icon}
                      </div>
                    )}
                    
                    <Typography 
                      variant="h4"
                      weight="semibold"
                      style={{ 
                        color: 'var(--text-primary)',
                        fontSize: '1.25rem',
                        lineHeight: '1.3'
                      }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Typography 
                      variant="body-md"
                      style={{ 
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Stack>
                </div>
              ))}
            </div>
            
            {/* Right Side - Header, Description and Button */}
            <div className="right-content">
              <div style={{ flex: 1 }}>
                <Typography 
                  variant="h1"
                  weight="bold"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontSize: '5rem',
                    lineHeight: '1.1',
                    marginBottom: 'var(--foundation-space-4)',
                    maxWidth: '400px'
                  }}
                >
                  {rightSide.title}
                </Typography>
                
                <Typography 
                  variant="body-lg"
                  style={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    maxWidth: '450px',
                    marginBottom: 'var(--foundation-space-4)'
                  }}
                >
                  {rightSide.description}
                </Typography>
              </div>
              
              <div style={{ marginTop: 'auto' }}>
                <Button 
                  variant={rightSide.buttonVariant || 'primary'}
                  size="lg"
                  onClick={() => {
                    if (rightSide.buttonHref) {
                      window.location.href = rightSide.buttonHref;
                    }
                  }}
                >
                  {rightSide.buttonText}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default SplitProcessSection;
