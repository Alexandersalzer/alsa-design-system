'use client';

import { ReactElement } from 'react';
import { Typography } from '../../../components/Typography';
import { Button } from '../../../../system/components';
import { Icon } from '../../../components/media';
import { Section } from '../../../components/frames/section/Section';
import { Container } from '../../../components/frames/container/Container';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';

export interface CTAButton {
  text: string;
  href?: string;
  variant: 'accent' | 'secondary' | 'primary' | 'ghost';
  icon?: ReactElement;
  onClick?: () => void;
}

export interface CTAInfo {
  label: string;
  value: string;
}

export interface CTAContent {
  title: string;
  subtitle: string;
  buttons: CTAButton[];
  info?: CTAInfo[];
}

export interface CTAProps {
  id?: string;
  content: CTAContent;
  className?: string;
}

const CTA = ({ id = "cta", content, className }: CTAProps) => {
  const { title, subtitle, buttons, info = [] } = content;

  return (
    <Section 
      id={id} 
      className={className}
      style={{
        backgroundColor: 'var(--surface-card)',
        paddingTop: 'var(--foundation-space-20)',
        paddingBottom: 'var(--foundation-space-20)',
        borderTop: '1px solid var(--border-default)',
        borderBottom: '1px solid var(--border-default)'
      }}
    >
      <Container align="center">
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <VStack spacing="lg" align="center">
            {/* Title */}
            <Typography 
              variant="h2" 
              weight="bold" 
              color="inverse"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'center',
                color: 'var(--surface-page)'
              }}
            >
              {title}
            </Typography>
            
            {/* Subtitle */}
            <div style={{ maxWidth: 'var(--size-page-narrow-max-width)', width: '100%' }}>
              <Typography 
                variant="body-lg" 
                color="inverse"
                style={{
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                  textAlign: 'center',
                  color: 'var(--surface-page)',
                  opacity: 0.9
                }}
              >
                {subtitle}
              </Typography>
            </div>

            {/* Buttons */}
            <div style={{ 
              display: 'flex', 
              gap: 'var(--foundation-space-4)', 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              {buttons.map((button, index) => (
                <Button
                  key={index}
                  variant={button.variant}
                  size="lg"
                  onClick={button.href ? () => window.location.href = button.href! : button.onClick}
                  rightIcon={button.icon ? <div style={{ width: '20px', height: '20px', color: button.variant === 'accent' ? 'white' : 'var(--text-primary)' }}>{button.icon}</div> : undefined}
                  style={button.variant === 'accent' ? { color: 'white' } : undefined}
                >
                  {button.text}
                </Button>
              ))}
            </div>
            
            {/* Info Section */}
            {info.length > 0 && (
              <div style={{ maxWidth: '600px', width: '100%' }}>
                <VStack spacing="sm" align="center">
                  {info.map((item, index) => (
                    <Typography key={index} variant="body-sm" color="inverse" style={{ textAlign: 'center', color: 'var(--surface-page)', opacity: 0.8 }}>
                      <strong>{item.label}:</strong> {item.value}
                    </Typography>
                  ))}
                </VStack>
              </div>
            )}
          </VStack>
        </div>
      </Container>
    </Section>
  );
};

export { CTA };
