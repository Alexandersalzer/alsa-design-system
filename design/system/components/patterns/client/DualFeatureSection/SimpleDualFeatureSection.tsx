import React from 'react';
import { Button } from '../../../../../system/components/primitives/Button';
import { H2, H3, Body } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section';

// ===== TYPES =====
export interface SimpleDualFeatureCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl?: string; // Bakgrundsbild för det stora kortet
  imageAlt?: string;
  onButtonClick?: () => void;
}

export interface SimpleDualFeatureSectionProps {
  id?: string;
  className?: string;
  sectionTitle?: string;
  cards: [SimpleDualFeatureCard, SimpleDualFeatureCard];
}

// ===== COMPONENT =====
export const SimpleDualFeatureSection: React.FC<SimpleDualFeatureSectionProps> = ({
  id = "dual-features",
  className,
  sectionTitle,
  cards,
  ...props
}) => {
  if (cards.length !== 2) {
    console.warn('SimpleDualFeatureSection requires exactly 2 cards');
    return null;
  }

  return (
    <Section 
      id={id}
      className={className}
            style={{
              backgroundColor: 'transparent',
              paddingTop: 'var(--foundation-space-24)', // Samma padding som Om oss
              paddingBottom: 'var(--foundation-space-40)' // Samma padding som stats-sektionen
            }}
      {...props}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        {/* Section Header */}
        {sectionTitle && (
          <div style={{ marginBottom: 'var(--foundation-space-16)', textAlign: 'center' }}>
            <H2 
              color="primary"
              weight="bold"
              style={{ margin: 0 }}
            >
              {sectionTitle}
            </H2>
          </div>
        )}

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--foundation-space-8)',
          width: '100%',
          maxWidth: 'var(--size-page-max-width)', // Samma bredd som stats-sektionen
          margin: '0 auto'
        }}>
          {cards.map((card) => (
            <div
              key={card.id}
              style={{
                position: 'relative',
                height: '700px', // Mycket högre korten
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: card.imageUrl ? `url(${card.imageUrl})` : 'var(--surface-secondary)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                alignItems: 'flex-end',
                padding: 'var(--foundation-space-8)' // Mer padding för större kort
              }}
            >
              {/* Overlay för bättre kontrast */}
              {card.imageUrl && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
                  zIndex: 1
                }} />
              )}

              {/* Innehållskort */}
              <div
                style={{
                  background: 'var(--surface-primary)', // Använd design system färg
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: 'var(--radius-lg)',
                  width: '100%',
                  height: '140px', // Samma höjd för alla kort
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--foundation-space-3)', // Mindre mellanrum
                  position: 'relative',
                  zIndex: 2,
                  opacity: 1
                }}
              >
                <H3 
                  color="primary"
                  weight="semibold"
                  style={{ margin: 0, fontSize: '1.1rem' }} // Mindre titel
                >
                  {card.title}
                </H3>
                
                <Body 
                  size="sm" // Mindre text
                  color="secondary"
                  style={{ margin: 0, flex: 1 }}
                >
                  {card.description}
                </Body>

                <Button
                  variant="accent"
                  size="sm" // Mindre knapp
                  onClick={card.onButtonClick}
                >
                  {card.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

SimpleDualFeatureSection.displayName = 'SimpleDualFeatureSection';
