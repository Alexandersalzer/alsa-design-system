import React from 'react';
import { Button } from '../../../../../system/components/primitives/Button';
import { H2, H3, Body } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section';
import { Card } from '../../../../../system/components/primitives/Card';

// ===== TYPES =====
export interface SimpleDualFeatureCard {
  id: string;
  title: string;
  description: string;
  buttonText: string;
  imageUrl?: string; // Lägg till stöd för bilder
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
            width: '100%'
          }}>
            {cards.map((card) => (
              <Card
                key={card.id}
                variant="default"
                radius="lg"
                padding="lg"
                interactive={false}
                style={{
                  background: card.imageUrl ? `url(${card.imageUrl})` : 'var(--surface-primary)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  boxShadow: 'var(--shadow-md)',
                  minHeight: '400px', // Gör korten högre och mer rektangulära
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  padding: 0 // Override Card padding
                }}
              >
                {/* Overlay för bättre textläsbarhet när det finns en bakgrundsbild */}
                {card.imageUrl && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 100%)',
                    zIndex: 1
                  }} />
                )}
                
                {/* Innehåll */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  padding: 'var(--foundation-space-8)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--foundation-space-4)',
                  height: '100%',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <H3 
                      color={card.imageUrl ? "inverse" : "primary"}
                      weight="semibold"
                      style={{ margin: 0, marginBottom: 'var(--foundation-space-4)' }}
                    >
                      {card.title}
                    </H3>
                    
                    <Body 
                      size="md"
                      color={card.imageUrl ? "inverse" : "secondary"}
                      style={{ margin: 0 }}
                    >
                      {card.description}
                    </Body>
                  </div>

                  <Button
                    variant={card.imageUrl ? "secondary" : "primary"}
                    size="md"
                    onClick={card.onButtonClick}
                    style={{ 
                      alignSelf: 'flex-start', 
                      marginTop: 'var(--foundation-space-4)',
                      ...(card.imageUrl && {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      })
                    }}
                  >
                    {card.buttonText}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

SimpleDualFeatureSection.displayName = 'SimpleDualFeatureSection';
