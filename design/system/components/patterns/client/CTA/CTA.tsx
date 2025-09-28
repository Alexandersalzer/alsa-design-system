'use client';

import { ReactElement } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

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
      <Container maxWidth="xl" align="center">
        <div style={{ maxWidth: '800px', width: '100%' }}>
          <Stack spacing="lg" align="center">
            {/* Title */}
            <Typography 
              variant="h3" 
              weight="semibold" 
              color="heading"
              style={{
                fontSize: 'clamp(1.8rem, 3vw, 2.2rem)',
                textAlign: 'center'
              }}
            >
              {title}
            </Typography>
            
            {/* Subtitle */}
            <div style={{ maxWidth: '600px', width: '100%' }}>
              <Typography 
                variant="body-lg" 
                color="secondary"
                style={{
                  lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                  textAlign: 'center'
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
                  rightIcon={button.icon ? <Icon color={button.variant === 'accent' ? 'inverse' : 'primary'}>{button.icon}</Icon> : undefined}
                  style={button.variant === 'accent' ? { color: 'white' } : undefined}
                >
                  {button.text}
                </Button>
              ))}
            </div>
            
            {/* Info Section */}
            {info.length > 0 && (
              <div style={{ maxWidth: '600px', width: '100%' }}>
                <Stack spacing="sm" align="center">
                  {info.map((item, index) => (
                    <Typography key={index} variant="body-sm" color="secondary" style={{ textAlign: 'center' }}>
                      <strong>{item.label}:</strong> {item.value}
                    </Typography>
                  ))}
                </Stack>
              </div>
            )}
          </Stack>
        </div>
      </Container>
    </Section>
  );
};

export { CTA };
