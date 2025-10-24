import React from 'react';
import Image from 'next/image';
import { Button } from '../../../../../system/components/primitives/Button';
import { H2, H3, Body } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section';
import './DualFeatureSection.css';

// ===== TYPES =====
export interface DualFeatureCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  imageUrl: string;
  imageAlt: string;
  onButtonClick?: () => void;
}

export interface DualFeatureSectionProps {
  id?: string;
  className?: string;
  sectionTitle?: string;
  sectionSubtitle?: string;
  cards: [DualFeatureCard, DualFeatureCard]; // Exactly 2 cards
  spacing?: 'sm' | 'md' | 'lg';
  imageHeight?: 'sm' | 'md' | 'lg' | 'xl';
}

// ===== COMPONENT =====
export const DualFeatureSection: React.FC<DualFeatureSectionProps> = ({
  id = "dual-features",
  className,
  sectionTitle,
  sectionSubtitle,
  cards,
  spacing = 'lg',
  imageHeight = 'lg',
  ...props
}) => {
  if (cards.length !== 2) {
    console.warn('DualFeatureSection requires exactly 2 cards');
    return null;
  }

  return (
    <Section 
      id={id}
      className={className}
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-16)'
      }}
      {...props}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <div style={{ maxWidth: 'var(--size-page-content-max-width)', width: '100%' }}>
          {/* Section Header */}
          {(sectionTitle || sectionSubtitle) && (
            <div className="dual-feature-header" data-spacing={spacing}>
              {sectionTitle && (
                <H2 
                  color="primary"
                  weight="bold"
                  style={{
                    textAlign: 'center',
                    margin: 0
                  }}
                >
                  {sectionTitle}
                </H2>
              )}
              {sectionSubtitle && (
                <Body 
                  size="lg"
                  color="secondary"
                  style={{
                    textAlign: 'center',
                    margin: 0,
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                  }}
                >
                  {sectionSubtitle}
                </Body>
              )}
            </div>
          )}

          {/* Cards Grid */}
          <div 
            className="dual-feature-grid"
            data-spacing={spacing}
            data-image-height={imageHeight}
          >
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`dual-feature-card dual-feature-card--${index}`}
              >
                {/* Background Image with Overlay */}
                <div className="dual-feature-image-container">
                  <Image
                    src={card.imageUrl}
                    alt={card.imageAlt}
                    fill
                    className="dual-feature-image"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0} // Prioritize first image
                  />
                  <div className="dual-feature-overlay" />
                </div>

                {/* Content */}
                <div className="dual-feature-content">
                  <div className="dual-feature-text">
                    <H3 
                      color="inverse"
                      weight="semibold"
                      style={{
                        margin: 0,
                        lineHeight: '1.3'
                      }}
                    >
                      {card.title}
                    </H3>
                    
                    <Body 
                      size="md"
                      color="inverse"
                      style={{
                        margin: 0,
                        lineHeight: '1.6',
                        opacity: 0.9
                      }}
                    >
                      {card.description}
                    </Body>
                  </div>

                  <Button
                    variant={card.buttonVariant || 'primary'}
                    size="md"
                    onClick={card.onButtonClick}
                    style={{
                      backgroundColor: 'var(--surface-white)',
                      color: 'var(--text-primary)',
                      border: 'none',
                      fontWeight: '600'
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

DualFeatureSection.displayName = 'DualFeatureSection';

// ===== USAGE EXAMPLE =====
/*
const exampleCards: [DualFeatureCard, DualFeatureCard] = [
  {
    id: 'legal-advice',
    title: 'Rådgivning i skadeståndsrätt',
    description: 'Vi guidar dig genom hela processen, från ansökan till ersättning.',
    buttonText: 'Boka möte',
    buttonVariant: 'primary',
    imageUrl: '/images/legal-advice.jpg',
    imageAlt: 'Juridisk rådgivning i modern advokatbyrå',
    onButtonClick: () => {
      // Handle booking logic
      console.log('Booking meeting...');
    }
  },
  {
    id: 'our-services',
    title: 'Våra tjänster',
    description: 'Läs mer om hur vi hjälper privatpersoner och företag med juridisk rådgivning.',
    buttonText: 'Utforska',
    buttonVariant: 'secondary',
    imageUrl: '/images/legal-team.jpg',
    imageAlt: 'Professionellt juridiskt team i samarbete',
    onButtonClick: () => {
      // Handle navigation to services
      console.log('Exploring services...');
    }
  }
];

<DualFeatureSection
  id="legal-services"
  sectionTitle="Experthjälp inom skadeståndsrätt"
  sectionSubtitle="Vi erbjuder professionell juridisk rådgivning och representerar dig i alla typer av skadeståndsärenden."
  cards={exampleCards}
  spacing="lg"
  imageHeight="lg"
/>
*/
