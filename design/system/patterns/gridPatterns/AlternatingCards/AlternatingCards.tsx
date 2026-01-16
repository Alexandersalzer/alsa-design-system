// ===============================================
// AlternatingCards.tsx - COMPLETE FIX
// ===============================================

'use client';

import React from 'react';
import { VStack } from '../../../components';
import { PatternNode } from '../../../core/types/nodes';
import { patternProps, getPatternOrder } from '../../../core/utils/props';
import { cardsRegistry } from '../../cards/registry';
import { cn } from '../../../utils/cn';
import './AlternatingCards.css';

// Image size presets for responsive, fluid sizing
const IMAGE_SIZE_PRESETS = {
  // NEW: Viewport-based preset (default) - scales with screen size
  viewport: {
    desktop: { height: '80vh', minHeight: '400px', maxHeight: '900px', aspectRatio: undefined },
    tablet: { height: '60vh', minHeight: '350px', maxHeight: '700px', aspectRatio: undefined },
    mobile: { height: '50vh', minHeight: '300px', maxHeight: '600px', aspectRatio: undefined }
  },
  tall: {
    desktop: { height: '100%', minHeight: '400px', maxHeight: '600px', aspectRatio: undefined },
    tablet: { height: '100%', minHeight: '350px', maxHeight: '500px', aspectRatio: undefined },
    mobile: { height: undefined, aspectRatio: '3/4', minHeight: '300px', maxHeight: undefined }
  },
  standard: {
    desktop: { height: '100%', minHeight: '300px', maxHeight: '450px', aspectRatio: undefined },
    tablet: { height: '100%', minHeight: '280px', maxHeight: '400px', aspectRatio: undefined },
    mobile: { height: undefined, aspectRatio: '4/3', minHeight: '250px', maxHeight: undefined }
  },
  compact: {
    desktop: { height: '100%', minHeight: '200px', maxHeight: '350px', aspectRatio: undefined },
    tablet: { height: '100%', minHeight: '200px', maxHeight: '300px', aspectRatio: undefined },
    mobile: { height: undefined, aspectRatio: '16/9', minHeight: '200px', maxHeight: undefined }
  },
  responsive: {
    desktop: { height: undefined, minHeight: undefined, maxHeight: undefined, aspectRatio: '4/3' },
    tablet: { height: undefined, minHeight: undefined, maxHeight: undefined, aspectRatio: '4/3' },
    mobile: { height: undefined, minHeight: undefined, maxHeight: undefined, aspectRatio: '4/3' }
  },
  custom: { desktop: null, tablet: null, mobile: null }
} as const;

export const AlternatingCards: React.FC<PatternNode> = (patternNode) => {
  const { components = {} } = patternNode;
  const getPatternProps = patternProps(patternNode);
  const componentOrder = getPatternOrder(patternNode);
  
  const {
    gap = '2xl',
    cardGap = '20%',
    reverseFirst = false,

    // Preset-based sizing
    imageSizePreset = 'viewport', // Changed default to 'viewport'

    // Direct viewport-based height controls (overrides preset if provided)
    imageHeightDesktop = '80vh',
    imageHeightTablet = '60vh',
    imageHeightMobile = '50vh',

    // Min/max height controls for safety
    imageMinHeightDesktop = '400px',
    imageMinHeightTablet = '350px',
    imageMinHeightMobile = '300px',
    imageMaxHeightDesktop = '900px',
    imageMaxHeightTablet = '700px',
    imageMaxHeightMobile = '600px',

    // Object positioning - smart defaults for different aspect ratios
    imageObjectPosition = 'center',
    imageObjectFit = 'cover',

    // Legacy props (for backward compatibility and custom preset)
    imageAspectRatio,
    imageHeight,
    imageMinHeight,
    imageMaxHeight,

    textAlign = 'left',
    verticalAlign = 'center'
  } = getPatternProps();

  // Generate CSS custom properties for image sizing based on preset
  const getImageStyleVars = () => {
    const presetConfig = IMAGE_SIZE_PRESETS[imageSizePreset as keyof typeof IMAGE_SIZE_PRESETS] || IMAGE_SIZE_PRESETS.viewport;

    // Custom preset - use legacy props or new direct controls
    if (imageSizePreset === 'custom') {
      return {
        '--image-height-desktop': imageHeight || imageHeightDesktop,
        '--image-min-height-desktop': imageMinHeight || imageMinHeightDesktop,
        '--image-max-height-desktop': imageMaxHeight || imageMaxHeightDesktop,
        '--image-aspect-ratio-desktop': imageAspectRatio || 'auto',
        '--image-aspect-ratio-tablet': imageAspectRatio || 'auto',
        '--image-aspect-ratio-mobile': imageAspectRatio || '4/3',
        '--image-object-position': imageObjectPosition,
        '--image-object-fit': imageObjectFit,
      };
    }

    // Viewport preset - use direct controls if provided, otherwise use preset
    if (imageSizePreset === 'viewport') {
      return {
        '--image-height-desktop': imageHeightDesktop,
        '--image-min-height-desktop': imageMinHeightDesktop,
        '--image-max-height-desktop': imageMaxHeightDesktop,
        '--image-aspect-ratio-desktop': 'auto',

        '--image-height-tablet': imageHeightTablet,
        '--image-min-height-tablet': imageMinHeightTablet,
        '--image-max-height-tablet': imageMaxHeightTablet,
        '--image-aspect-ratio-tablet': 'auto',

        '--image-height-mobile': imageHeightMobile,
        '--image-min-height-mobile': imageMinHeightMobile,
        '--image-max-height-mobile': imageMaxHeightMobile,
        '--image-aspect-ratio-mobile': 'auto',

        '--image-object-position': imageObjectPosition,
        '--image-object-fit': imageObjectFit,
      };
    }

    // Other presets - use preset configuration
    return {
      '--image-height-desktop': presetConfig.desktop?.height || 'auto',
      '--image-min-height-desktop': presetConfig.desktop?.minHeight || 'auto',
      '--image-max-height-desktop': presetConfig.desktop?.maxHeight || 'none',
      '--image-aspect-ratio-desktop': presetConfig.desktop?.aspectRatio || 'auto',

      '--image-height-tablet': presetConfig.tablet?.height || 'auto',
      '--image-min-height-tablet': presetConfig.tablet?.minHeight || 'auto',
      '--image-max-height-tablet': presetConfig.tablet?.maxHeight || 'none',
      '--image-aspect-ratio-tablet': presetConfig.tablet?.aspectRatio || 'auto',

      '--image-height-mobile': presetConfig.mobile?.height || 'auto',
      '--image-min-height-mobile': presetConfig.mobile?.minHeight || '250px',
      '--image-max-height-mobile': presetConfig.mobile?.maxHeight || 'none',
      '--image-aspect-ratio-mobile': presetConfig.mobile?.aspectRatio || '4/3',

      '--image-object-position': imageObjectPosition,
      '--image-object-fit': imageObjectFit,
    };
  };

  return (
    <VStack
      spacing={gap}
      collapseSpacing="never"
      className="alternating-cards"
      style={getImageStyleVars() as React.CSSProperties}
    >
      {componentOrder.map((key, index) => {
        const component = components[key];
        if (!component) {
          console.warn(`Component "${key}" not found in components`);
          return null;
        }
        
        const CardComponent = cardsRegistry[component.type];
        if (!CardComponent) {
          console.warn(`Card type "${component.type}" not found in registry. Available: ${Object.keys(cardsRegistry).join(', ')}`);
          return null;
        }
        
        const shouldReverse = reverseFirst ? index % 2 === 0 : index % 2 !== 0;
        
        return (
          <div
            key={key}
            className={cn(
              "alternating-cards__item",
              shouldReverse && "alternating-cards__item--reverse",
              `alternating-cards__item--text-${textAlign}`,
              `alternating-cards__item--vertical-${verticalAlign}`
            )}
            style={{
              '--card-gap': cardGap
            } as React.CSSProperties}
          >
            <CardComponent
              componentKey={key}
              {...component.props}
              // ✅ Pattern props override card defaults (only if provided)
              {...(imageAspectRatio && !imageHeight && { imageAspectRatio })}
              {...(imageHeight && { imageHeight })}
              {...(imageMinHeight && { imageMinHeight })}
              {...(imageMaxHeight && { imageMaxHeight })}
              {...(imageObjectFit && { imageObjectFit })}
              {...(imageObjectPosition && { imageObjectPosition })}
            />
          </div>
        );
      })}
    </VStack>
  );
};

export default AlternatingCards;