'use client';

import { ReactElement } from 'react';
import './CTA.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Section } from '../../../../../system/layout/frames/section/Section';

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
    <Section id={id} className={`cta-section ${className || ''}`}>
      <div className="cta-container">
        <div className="cta-content">
          <Typography variant="h3" weight="semibold" color="heading" className="cta-title">
            {title}
          </Typography>
          
          <div className="cta-subtitle-container">
            <Typography variant="body-lg" color="secondary" className="cta-subtitle">
              {subtitle}
            </Typography>
          </div>

          <div className="cta-buttons">
            {buttons.map((button, index) => {
              const buttonElement = (
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
              );

              return buttonElement;
            })}
          </div>
          
          {info.length > 0 && (
            <div className="cta-info">
              {info.map((item, index) => (
                <Typography key={index} variant="body-sm" color="secondary" className="cta-info-item">
                  <strong>{item.label}:</strong> {item.value}
                </Typography>
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export { CTA };
