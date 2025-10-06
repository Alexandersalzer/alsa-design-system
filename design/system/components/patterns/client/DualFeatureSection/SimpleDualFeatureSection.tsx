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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 640px) {
            .dual-features-grid {
              grid-template-columns: 1fr !important;
              gap: var(--foundation-space-4) !important;
            }
            .dual-feature-card {
              height: 400px !important;
              padding: var(--foundation-space-4) !important;
            }
            .dual-feature-content {
              height: 160px !important;
              padding: var(--foundation-space-3) !important;
            }
            .dual-feature-button {
              font-size: 0.875rem !important;
              padding: var(--foundation-space-2) var(--foundation-space-3) !important;
            }
            .dual-feature-title {
              font-size: 1rem !important;
            }
            .dual-feature-description {
              font-size: 0.875rem !important;
              -webkit-line-clamp: 2 !important;
            }
          }
          @media (min-width: 641px) and (max-width: 1024px) {
            .dual-features-grid {
              grid-template-columns: 1fr !important;
              gap: var(--foundation-space-6) !important;
            }
            .dual-feature-card {
              height: 500px !important;
              padding: var(--foundation-space-6) !important;
            }
            .dual-feature-content {
              height: 150px !important;
            }
            .dual-feature-button {
              font-size: 0.9rem !important;
            }
            .dual-feature-title {
              font-size: 1.125rem !important;
            }
          }
          @media (min-width: 1025px) {
            .dual-features-grid {
              grid-template-columns: repeat(2, 1fr) !important;
            }
            .dual-feature-card {
              height: 700px !important;
            }
            .dual-feature-content {
              height: 140px !important;
            }
            .dual-feature-title {
              font-size: 1.1rem !important;
            }
          }
        `
      }} />
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
        <div 
          className="dual-features-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--foundation-space-8)',
            width: '100%',
            maxWidth: 'var(--size-page-max-width)', // Samma bredd som stats-sektionen
            margin: '0 auto'
          }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="dual-feature-card"
              style={{
                position: 'relative',
                height: '700px', // Mycket högre korten
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                background: card.imageUrl ? `url(${card.imageUrl})` : 'var(--surface-secondary)',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
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
                className="dual-feature-content"
                style={{
                  background: 'var(--surface-primary)', // Använd design system färg
                  boxShadow: 'var(--shadow-lg)',
                  borderRadius: 'var(--radius-lg)',
                  width: '100%',
                  height: '140px', // Samma höjd för alla kort
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--foundation-space-2)', // Mindre mellanrum
                  position: 'relative',
                  zIndex: 2,
                  opacity: 1,
                  padding: 'var(--foundation-space-4)'
                }}
              >
                <H3 
                  color="primary"
                  weight="semibold"
                  className="dual-feature-title"
                  style={{ margin: 0, fontSize: '1.1rem' }} // Mindre titel
                >
                  {card.title}
                </H3>
                
                <Body 
                  size="sm" // Mindre text
                  color="secondary"
                  className="dual-feature-description"
                  style={{ 
                    margin: 0, 
                    flex: 1,
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {card.description}
                </Body>

                <Button
                  variant="accent"
                  size="sm" // Mindre knapp
                  className="dual-feature-button"
                  onClick={card.onButtonClick}
                  style={{ marginTop: 'auto', flexShrink: 0 }}
                >
                  {card.buttonText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
    </>
  );
};

SimpleDualFeatureSection.displayName = 'SimpleDualFeatureSection';
