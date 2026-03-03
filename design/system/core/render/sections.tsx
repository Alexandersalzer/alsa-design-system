'use client';

import { Section } from '../../components/frames/section/Section';
import { SectionNode } from '../types/nodes';
import { renderPattern } from './patterns';
import { renderSectionLayout } from './section-layout';
import { Container } from '../../components/frames/container/Container';
import { VStack } from '../../components/layout/vStack/VStack';
import { Box } from '../../components/layout/box/Box';

/**
 * Props for Sections component
 */
interface SectionsProps {
  sections: Record<string, SectionNode>;
  order: string[];
  locale?: string;
}

/**
 * Renders a single section with its patterns using LayoutRenderer
 */
export function renderSection(
  sectionData: SectionNode,
  sectionKey: string,
  sectionIndex: number,
  locale?: string
): React.ReactNode {
  if (!sectionData?.patterns) return null;

  const { type, patterns, layout, order, props } = sectionData;
  const patternOrder = order || Object.keys(patterns || {});

  // Auto-detect hero: first section + key starts with "hero_"
  const isHero = sectionIndex === 0 && sectionKey.startsWith('hero_');

  // Check if background should be moved from Section to Card
  const wrapInCard = layout?.wrapInCard;
  const hasLayoutBackground = layout?.background && layout.background !== 'default';
  const hasSectionPropsBackground = props?.background && props.background !== 'default';
  // Background is in card if wrapInCard is true AND there's a layout background
  const moveBackgroundToCard = wrapInCard && hasLayoutBackground;
  // Show section background only if there's no layout background and section has one
  const showSectionBackground = !hasLayoutBackground && hasSectionPropsBackground;

  // If layout config exists, use LayoutRenderer
  if (layout) {
    // Build section props
    let sectionProps = props;
    
    // If wrapInCard is true and layout has background, filter out background props (they go to card)
    if (moveBackgroundToCard) {
      sectionProps = Object.keys(props || {}).reduce((acc, key) => {
        // Remove all background-related props when card handles background
        if (key.startsWith('background') || 
            key.startsWith('generative') || 
            key.startsWith('gradient') ||
            key.startsWith('pattern') ||
            key.startsWith('video') ||
            key.startsWith('solid') ||
            key.startsWith('image') ||
            key === 'videoSrc' ||
            key === 'videoPoster') {
          return acc;
        }
        return { ...acc, [key]: (props || {})[key] };
      }, {});
    }
    
    // If wrapInCard is false but layout has background, use layout background on section
    if (!wrapInCard && hasLayoutBackground) {
      sectionProps = {
        ...sectionProps,
        background: layout.background,
        backgroundImage: layout.backgroundImage,
        backgroundSize: layout.backgroundSize,
        backgroundPosition: layout.backgroundPosition,
        backgroundOpacity: layout.backgroundOpacity,
        backgroundTint: layout.backgroundTint,
        imageFadeEdge: layout.imageFadeEdge,
        imageFadeStrength: layout.imageFadeStrength,
        backgroundImageLightModeOpacity: layout.backgroundImageLightModeOpacity
      };
    }

    const layoutContent = renderSectionLayout({
          layout,
          patterns,
          order: patternOrder,
          sectionKey,
          sectionAnimation: props?.animation,
          locale,
        });

    return (
      <Section
        key={sectionKey}
        id={sectionKey}
        height="auto"
        sectionKey={sectionKey}
        applyNavbarVoid={isHero}
        {...sectionProps}
      >
        {layout?.layoutFullHeight ? (
          <Box style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {layoutContent}
          </Box>
        ) : (
          layoutContent
        )}
      </Section>
    );
  }

  // Fallback: Simple vertical stacking (no layout config)
  const renderedPatterns = patternOrder
    .map((patternKey) => renderPattern(patterns[patternKey], patternKey, sectionKey, undefined, locale))
    .filter(Boolean);

  if (renderedPatterns.length === 0) return null;

  return (
    <Section
      key={sectionKey}
      id={sectionKey}
      height="auto"
      sectionKey={sectionKey}
      applyNavbarVoid={isHero}
      {...props}
    >
      <Container>
        <VStack spacing="lg" align="center">
          {renderedPatterns}
        </VStack>
      </Container>
    </Section>
  );
}

/**
 * Main component that renders all sections based on sectionOrder
 */
export function Sections({
  sections,
  order,
  locale
}: SectionsProps) {
  return (
    <>
      {order
        .map((sectionKey: string, index: number) => {
          const sectionData = sections[sectionKey];
          if (!sectionData) return null;

          return renderSection(sectionData, sectionKey, index, locale);
        })
        .filter(Boolean)}
    </>
  );
}

