// ===============================================
// design/system/components/patterns/client/FeatureGrid/FeatureGrid.tsx
// FEATURE GRID PATTERN - Asymmetric grid with feature cards
// ===============================================

import React from 'react';
import { Card } from '../../../../../system/components/primitives/Card';
import { H4, Body } from '../../../../../system/components/primitives/Typography';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import './FeatureGrid.css';

// ===== TYPE DEFINITIONS =====

export interface FeatureItem {
  id: string;
  icon: string; // Path to icon image in /images/icons/
  title: string;
  description: string;
}

export interface FeatureGridProps {
  className?: string;
  
  // Content
  features: FeatureItem[];
  
  // Layout options
  spacing?: 'sm' | 'md' | 'lg';
  
  // Optional click handler for features
  onFeatureClick?: (feature: FeatureItem) => void;
}

// ===== MAIN FEATURE GRID COMPONENT =====

export const FeatureGrid: React.FC<FeatureGridProps> = ({
  className,
  features,
  spacing = 'md',
  onFeatureClick
}) => {
  // Ensure we have exactly 4 features for the asymmetric layout
  const displayFeatures = features.slice(0, 4);
  
  return (
    <div className={`feature-grid-container ${className || ''}`}>
      <div 
        className="feature-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gridTemplateRows: 'auto auto',
          gap: `var(--foundation-space-${spacing})`,
          width: '100%'
        }}
      >
        {displayFeatures.map((feature, index) => (
          <Card
            key={feature.id}
            variant="default"
            radius="lg"
            padding="lg"
            interactive={true}
            className={`feature-card feature-card--${index}`}
            style={{
              background: 'var(--surface-primary)',
              boxShadow: 'var(--shadow-md)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer',
              // Asymmetric layout: left card spans 2 rows
              ...(index === 0 && {
                gridRow: 'span 2',
                minHeight: '320px'
              }),
              ...(index === 1 && {
                minHeight: '150px'
              }),
              ...(index === 2 && {
                minHeight: '150px'
              }),
              ...(index === 3 && {
                minHeight: '150px'
              })
            }}
            onCardClick={() => {
              if (onFeatureClick) {
                onFeatureClick(feature);
              }
            }}
          >
            <Stack spacing={index === 0 ? 'lg' : 'md'} align="start">
              {/* Icon */}
              <div 
                className="feature-icon"
                style={{
                  width: index === 0 ? '72px' : '56px',
                  height: index === 0 ? '72px' : '56px',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--surface-secondary)',
                  padding: index === 0 ? '12px' : '8px'
                }}
              >
                <img
                  src={feature.icon}
                  alt={`${feature.title} icon`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
              
              {/* Title */}
              <H4 
                color="primary"
                weight="semibold"
                style={{
                  fontSize: index === 0 ? '1.375rem' : '1.125rem',
                  lineHeight: '1.3',
                  margin: 0
                }}
              >
                {feature.title}
              </H4>
              
              {/* Description */}
              <Body 
                size={index === 0 ? 'md' : 'sm'}
                color="secondary"
                style={{
                  lineHeight: '1.6',
                  margin: 0
                }}
              >
                {feature.description}
              </Body>
            </Stack>
          </Card>
        ))}
      </div>
    </div>
  );
};

FeatureGrid.displayName = 'FeatureGrid';

// ===== USAGE EXAMPLE =====
/*
const exampleFeatures: FeatureItem[] = [
  {
    id: 'expertise',
    icon: '/images/icons/expertise.png',
    title: 'Expertis inom skadeståndsrätt',
    description: 'Vår djupa kunskap inom skadeståndsrätt säkerställer att du får den ersättning du förtjänar.'
  },
  {
    id: 'support',
    icon: '/images/icons/support.png',
    title: '24/7 Support',
    description: 'Vi finns här för dig när du behöver oss som mest.'
  },
  {
    id: 'success',
    icon: '/images/icons/success.png',
    title: 'Hög framgångsgrad',
    description: 'Över 95% av våra klienter får ersättning.'
  },
  {
    id: 'free',
    icon: '/images/icons/free.png',
    title: 'Ingen kostnad',
    description: 'Du betalar ingenting förrän vi vinner ditt ärende.'
  }
];

<FeatureGrid 
  features={exampleFeatures}
  spacing="lg"
  onFeatureClick={(feature) => {
    console.log('Feature clicked:', feature.title);
    // Navigate to feature details or trigger modal
  }}
/>
*/
