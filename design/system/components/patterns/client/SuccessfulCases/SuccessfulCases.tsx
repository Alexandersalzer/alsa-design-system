'use client';

import { useState, useEffect, ReactElement } from 'react';
import './SuccessfulCases.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Card } from '../../../../../system/components/primitives/Card';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Icon } from '../../../../../system/components/primitives/Icon';

export interface SuccessCase {
  id: string;
  title: string;
  description: string;
  compensation: string;
  duration: string;
  icon: ReactElement;
}

export interface SuccessfulCasesContent {
  title: string;
  titleAccent?: string;
  subtitle: string;
  cases: SuccessCase[];
}

export interface SuccessfulCasesProps {
  id?: string;
  content: SuccessfulCasesContent;
  className?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const SuccessfulCases = ({ 
  id = "portfolio", 
  content, 
  className,
  autoPlay = true,
  autoPlayInterval = 5000
}: SuccessfulCasesProps) => {
  const { title, titleAccent, subtitle, cases } = content;
  const [currentCase, setCurrentCase] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentCase(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!autoPlay || cases.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentCase((prev) => (prev + 1) % cases.length);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, cases.length]);

  return (
    <Section id={id} className={`successful-cases-section ${className || ''}`}>
      <div className="successful-cases-container">
        {/* Header and Content Grid */}
        <div className="successful-cases-grid">
          {/* Left side - Title and Description */}
          <div className="successful-cases-header">
            <Typography variant="h2" weight="bold" color="heading" className="successful-cases-title">
              {title.split(' ').map((word, index) => {
                if (titleAccent && word === titleAccent) {
                  return (
                    <span key={index} className="successful-cases-title-accent">
                      {word}
                    </span>
                  );
                }
                return word + ' ';
              })}
            </Typography>
            <Typography variant="body-xl" color="secondary" className="successful-cases-subtitle">
              {subtitle}
            </Typography>
          </div>

          {/* Right side - Carousel */}
          <div className="successful-cases-carousel">
            {/* Case Card */}
            <Card className="successful-cases-card">
              {/* Case Icon */}
              <div className="successful-cases-icon-container">
                <Icon color="inverse" className="successful-cases-icon">
                  {cases[currentCase]?.icon}
                </Icon>
              </div>
              
              {/* Case Title */}
              <Typography variant="h4" weight="semibold" color="heading" className="successful-cases-case-title">
                {cases[currentCase]?.title}
              </Typography>
              
              {/* Case Description */}
              <Typography variant="body-lg" color="secondary" className="successful-cases-case-description">
                {cases[currentCase]?.description}
              </Typography>
              
              {/* Case Stats */}
              <div className="successful-cases-stats">
                <div className="successful-cases-stat">
                  <Typography variant="body-sm" color="secondary" className="successful-cases-stat-label">
                    Ersättning
                  </Typography>
                  <Typography variant="h5" weight="bold" color="accent" className="successful-cases-stat-value">
                    {cases[currentCase]?.compensation}
                  </Typography>
                </div>
                <div className="successful-cases-stat">
                  <Typography variant="body-sm" color="secondary" className="successful-cases-stat-label">
                    Handläggningstid
                  </Typography>
                  <Typography variant="h6" weight="semibold" color="primary" className="successful-cases-stat-value">
                    {cases[currentCase]?.duration}
                  </Typography>
                </div>
              </div>
            </Card>

            {/* Navigation Dots */}
            <div className="successful-cases-dots">
              {cases.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`successful-cases-dot ${index === currentCase ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export { SuccessfulCases };
