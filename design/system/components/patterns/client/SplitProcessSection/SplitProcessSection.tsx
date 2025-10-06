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
    items?: ProcessItem[];
    title?: string;
    description?: string;
    buttonText?: string;
    buttonHref?: string;
    buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  };
  rightSide: {
    items?: ProcessItem[];
    title?: string;
    description?: string;
    buttonText?: string;
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
  
  // Determine which side has items and which has content
  const leftHasItems = leftSide.items && leftSide.items.length > 0;
  const rightHasItems = rightSide.items && rightSide.items.length > 0;
  
  // If left has items, use original structure, otherwise swap
  const itemsSide = leftHasItems ? leftSide : rightSide;
  const contentSide = leftHasItems ? rightSide : leftSide;

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
          
          @media (max-width: 1023px) {
            .split-process-container {
              align-items: start;
            }
            
            .right-content {
              order: -1;
            }
          }
          
          @media (min-width: 1024px) {
            .split-process-container {
              grid-template-columns: 1fr 1fr;
              gap: var(--foundation-space-24);
            }
            
            .split-process-container.swapped-order {
              grid-template-columns: 1fr 1fr;
            }
            
            .split-process-container.swapped-order .process-grid {
              order: 2;
            }
            
            .split-process-container.swapped-order .right-content {
              order: 1;
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
              max-width: 600px;
            }
          }
          
          .process-item {
            padding: var(--foundation-space-6);
            border-radius: var(--radius-md);
            transition: all 0.3s ease;
            min-height: 200px;
            height: 200px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
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
            justify-content: flex-start;
            min-height: 100%;
            height: 100%;
          }
          
          @media (max-width: 1023px) {
            .right-content {
              justify-content: flex-start;
              align-items: flex-start;
              min-height: auto;
              height: auto;
            }
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
        style={{
          backgroundColor: 'transparent',
          paddingTop: 'var(--foundation-space-32)',
          paddingBottom: 'var(--foundation-space-32)'
        }}
      >
        <div 
          className={`split-process-container ${leftHasItems ? 'original-order' : 'swapped-order'}`}
          style={{ 
            maxWidth: 'var(--size-page-max-width)',
            margin: '0 auto',
            padding: '0 var(--foundation-space-6)'
          }}
        >
            {/* Items Side - Process Items Grid */}
            <div className="process-grid">
              {itemsSide.items?.map((item, index) => (
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
                        fontSize: '1.5rem',
                        lineHeight: '1.3'
                      }}
                    >
                      {item.title}
                    </Typography>
                    
                    <Typography 
                      variant="body-lg"
                      style={{ 
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        fontSize: '1.125rem'
                      }}
                    >
                      {item.description}
                    </Typography>
                  </Stack>
                </div>
              ))}
            </div>
            
            {/* Content Side - Header, Description and Button */}
            <div className="right-content">
              <Stack spacing="lg" align="start">
                <Typography 
                  variant="h1"
                  weight="bold"
                  style={{ 
                    color: 'var(--text-primary)',
                    fontSize: 'clamp(3rem, 6vw, 5rem)',
                    lineHeight: '1.1',
                    maxWidth: '400px'
                  }}
                >
                  {contentSide.title}
                </Typography>
                
                <Typography 
                  variant="body-lg"
                  style={{ 
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5',
                    maxWidth: '450px'
                  }}
                >
                  {contentSide.description}
                </Typography>
                
                <Button 
                  variant={contentSide.buttonVariant || 'primary'}
                  size="lg"
                  onClick={() => {
                    if (contentSide.buttonHref) {
                      window.location.href = contentSide.buttonHref;
                    }
                  }}
                >
                  {contentSide.buttonText}
                </Button>
              </Stack>
            </div>
        </div>
      </Section>
    </>
  );
};

export default SplitProcessSection;
