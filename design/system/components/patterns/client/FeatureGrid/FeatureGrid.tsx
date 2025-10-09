// ===============================================
// design/system/components/patterns/client/FeatureGrid/FeatureGrid.tsx
// FEATURE GRID PATTERN - Asymmetric grid with feature cards
// ===============================================

import React from 'react';
import { Card } from '../../../../../system/components/primitives/Card';
import { H4, Body } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { ZapIcon, UserCheckIcon, ShieldIcon } from 'lucide-react';
import './FeatureGrid.css';

// ===== TYPE DEFINITIONS =====

export interface FeatureItem {
  id: string;
  icon?: React.ReactNode; // Optional React icon component
  title: string;
  description: string;
  backgroundImage?: string; // Optional background image URL
}

export interface FeatureGridProps {
  id?: string;
  className?: string;
  
  // Content
  features: FeatureItem[];
  
  // Layout options
  spacing?: 'sm' | 'md' | 'lg';
}

// ===== MAIN FEATURE GRID COMPONENT =====

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  id = "features",
  className,
  features,
  spacing = 'lg'
}) => {
  // Ensure we have exactly 4 features for the asymmetric layout
  const displayFeatures = features.slice(0, 4);
  
  return (
    <Section 
      id={id}
      className={className}
      style={{
        backgroundColor: 'transparent',
        paddingTop: 'var(--foundation-space-40)',
        paddingBottom: 'var(--foundation-space-32)'
      }}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <div 
          className="feature-grid"
          data-spacing={spacing}
        >
        {displayFeatures.map((feature, index) => (
          <Card
            key={feature.id}
            variant="default"
            radius="lg"
            padding="lg"
            interactive={false}
            className={`feature-card feature-card--${index}`}
            style={{
              backgroundImage: feature.backgroundImage ? `url('${feature.backgroundImage}')` : undefined,
              backgroundColor: 'var(--surface-primary)',
              boxShadow: 'var(--shadow-md)',
              position: 'relative',
              overflow: 'hidden',
              padding: 'var(--foundation-space-8)',
              backgroundSize: feature.backgroundImage ? 'cover' : undefined,
              backgroundPosition: feature.backgroundImage ? 'center' : undefined,
              backgroundRepeat: feature.backgroundImage ? 'no-repeat' : undefined,
              // Diagonal asymmetric layout: top-left (0) and bottom-right (3) are large
              ...(index === 0 && {
                gridColumn: '1',
                gridRow: '1 / span 2',
                minHeight: '480px'
              }),
              ...(index === 1 && {
                gridColumn: '2',
                gridRow: '1',
                minHeight: '240px'
              }),
              ...(index === 2 && {
                gridColumn: '1',
                gridRow: '3',
                minHeight: '240px'
              }),
              ...(index === 3 && {
                gridColumn: '2',
                gridRow: '2 / span 2',
                minHeight: '480px'
              })
            }}
          >
            <div style={{ position: 'relative', zIndex: 2 }}>
              <Stack 
                spacing={index === 0 || index === 3 ? 'xl' : 'lg'} 
                align="start"
              >
              {/* Icon - Only show if icon is provided */}
              {feature.icon && (
                <div 
                  className="feature-icon"
                  style={{
                    width: '64px',
                    height: '64px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-500)',
                    padding: '12px',
                    color: 'white'
                  }}
                >
                  {React.cloneElement(feature.icon as React.ReactElement<any>, {
                    style: { width: '100%', height: '100%', strokeWidth: 2, color: 'inherit' }
                  })}
                </div>
              )}
              
              {/* Title */}
              <H4 
                color="primary"
                weight="semibold"
                style={{
                  fontSize: '1.5rem',
                  lineHeight: '1.3',
                  margin: 0
                }}
              >
                {feature.title}
              </H4>
              
              {/* Description */}
              <Body 
                size="md"
                color="secondary"
                style={{
                  lineHeight: '1.6',
                  margin: 0
                }}
              >
                {feature.description}
              </Body>
              </Stack>
            </div>
          </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

FeatureGrid.displayName = 'FeatureGrid';

// ===== USAGE EXAMPLE =====
/*
import { ZapIcon, UserCheckIcon, ShieldIcon, ClockIcon } from 'lucide-react';

const exampleFeatures: FeatureItem[] = [
  {
    id: 'expertise',
    icon: <ZapIcon />,
    title: 'Expertis inom skadeståndsrätt',
    description: 'Vår djupa kunskap inom skadeståndsrätt säkerställer att du får den ersättning du förtjänar.'
  },
  {
    id: 'support',
    icon: <ClockIcon />,
    title: '24/7 Support',
    description: 'Vi finns här för dig när du behöver oss som mest.'
  },
  {
    id: 'success',
    icon: <ShieldIcon />,
    title: 'Hög framgångsgrad',
    description: 'Över 95% av våra klienter får ersättning.'
  },
  {
    id: 'free',
    icon: <UserCheckIcon />,
    title: 'Ingen kostnad',
    description: 'Du betalar ingenting förrän vi vinner ditt ärende.'
  }
];

<FeatureGrid 
  features={exampleFeatures}
  spacing="lg"
/>
*/
