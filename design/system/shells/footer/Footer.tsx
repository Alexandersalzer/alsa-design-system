'use client';

import React from 'react';
import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/shells';
import { renderLayoutWithTemplate } from '../../core/render/layouts';
import { Container } from '../../components';
import { SectionNode } from '../../core/types/nodes';
import { VStack } from '../../components/layout/vStack/VStack';
import { HStack } from '../../components/layout/hStack/HStack';
import { Body } from '../../components/Typography';
import { TextLink } from '../../components/actions/TextLink';
import './Footer.css';

function MadeWithBlimpify({ inverse }: { inverse?: boolean }) {
  return (
    <HStack spacing="xs" align="center">
      <Body size="xs" color={inverse ? 'secondary' : 'tertiary'}>Made with</Body>
      <TextLink
        href="https://blimpify-im.com"
        target="_blank"
        rel="noopener noreferrer"
        variant={inverse ? 'inverse' : 'secondary'}
        size="sm"
        underline="none"
        skipClient
      >
        Blimpify
      </TextLink>
    </HStack>
  );
}

interface FooterProps {
  section?: Record<string, SectionNode>;
}

/** Filter logo/logotext components based on logoDisplay section prop */
function filterByLogoDisplay(
  components: Record<string, any>,
  logoDisplay: string | undefined
): Record<string, any> {
  if (!logoDisplay || logoDisplay === 'both') return components;
  const showLogo = logoDisplay !== 'text' && logoDisplay !== 'none';
  const showLogoText = logoDisplay !== 'logo' && logoDisplay !== 'none';
  return Object.fromEntries(
    Object.entries(components).filter(([, comp]: [string, any]) => {
      if (!showLogo && comp.type === 'logo') return false;
      if (!showLogoText && comp.type === 'logotext') return false;
      return true;
    })
  );
}

/**
 * Map contentAlign values to hstack justify and vstack align values.
 * Only applied as a default — layouts that already declare justify/align keep theirs.
 */
const ALIGN_TO_JUSTIFY: Record<string, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
};

/**
 * Render a single pattern.
 * If pattern has `layout`, uses renderLayoutWithTemplate (items-based patterns).
 * Otherwise falls back to renderShellPattern (legacy hardcoded patterns).
 * When noContainer is true, skips the Container wrapper (used for inline bottom row).
 */
function renderPattern(
  pattern: any,
  patternKey: string,
  sectionKey: string,
  logoDisplay: string | undefined,
  contentAlign?: string,
  noContainer?: boolean
): React.ReactNode {
  if (pattern.layout) {
    let components: Record<string, any> = pattern.components || {};
    if (pattern.layout.items && Array.isArray(pattern.layout.items)) {
      components = pattern.layout.items.reduce((acc: Record<string, any>, item: any) => {
        return item.components ? { ...acc, ...item.components } : acc;
      }, {});
    }

    const filteredComponents = filterByLogoDisplay(components, logoDisplay);

    // Apply contentAlign as a default to the root layout if it has no explicit alignment set.
    // hstack: inject into `justify` only if not already set.
    // vstack: inject into `align` only if not already set.
    const layoutType = pattern.layout.type;
    const alignDefault = contentAlign ? ALIGN_TO_JUSTIFY[contentAlign] : undefined;
    const alignPatch =
      alignDefault && layoutType === 'hstack' && !pattern.layout.justify
        ? { justify: alignDefault }
        : alignDefault && layoutType === 'vstack' && !pattern.layout.align
        ? { align: alignDefault }
        : {};

    const patchedLayout = {
      ...pattern.layout,
      ...alignPatch,
      items: pattern.layout.items?.map((item: any) => ({
        ...item,
        components: Object.fromEntries(
          Object.entries(item.components || {}).filter(([k]) => k in filteredComponents)
        ),
      })),
    };

    const containerAlign =
      contentAlign === 'start' ? 'left' : contentAlign === 'end' ? 'right' : 'center';

    const layoutContext = alignDefault
      ? { forcedAlignment: alignDefault as 'start' | 'center' | 'end' }
      : undefined;

    const content = renderLayoutWithTemplate(
      patchedLayout,
      filteredComponents,
      sectionKey,
      patternKey,
      undefined,
      undefined,
      undefined,
      layoutContext
    );

    if (noContainer) return content;

    return (
      <Container
        key={patternKey}
        align={containerAlign as 'left' | 'center' | 'right'}
        height="auto"
        noPadding={true}
        patternKey={patternKey}
      >
        {content}
      </Container>
    );
  }

  return renderShellPattern(pattern, patternKey, sectionKey);
}

const Footer = ({ section }: FooterProps) => {
  if (!section) return null;

  const footerSection = Object.values(section)[0] as any;
  if (!footerSection?.patterns) return null;

  const { patterns, order, props: sectionProps } = footerSection;
  const patternOrder: string[] = order || Object.keys(patterns);
  const sectionKey = Object.keys(section)[0];
  const logoDisplay = (sectionProps as any)?.logoDisplay;
  const contentAlign: 'start' | 'center' | 'end' = (sectionProps as any)?.contentAlign ?? 'center';
  const showMadeByBlimpify: boolean = (sectionProps as any)?.showMadeByBlimpify !== false;
  const isInverse: boolean = (sectionProps as any)?.background === 'inverse';

  const hasTopBorder = Object.values(patterns).some(
    (pattern: any) => pattern?.props?.showTopBorder === true
  );

  // Section-level grid layout (optional)
  const sectionLayout = footerSection.layout as any;
  const useGrid = sectionLayout?.type === 'grid';

  // ── Grid layout: section owns columns, each pattern has colSpan ──────────
  if (useGrid) {
    const cols = sectionLayout.columns ?? { base: 1, md: 2, lg: 4 };
    const gap = sectionLayout.gap ?? 'lg';

    const getColCount = (v: number | Record<string, number>) =>
      typeof v === 'number' ? v : v.lg ?? v.md ?? v.base ?? 1;

    const gridStyle: React.CSSProperties = {
      display: 'grid',
      gridTemplateColumns: `repeat(${getColCount(cols)}, minmax(0, 1fr))`,
      gap: `var(--foundation-space-${gap}, 1.5rem)`,
      width: '100%',
    };

    const gridItems = patternOrder.map((patternKey) => {
      const pattern = patterns[patternKey] as any;
      if (!pattern) return null;
      const colSpan = pattern.colSpan ?? 1;
      const patternLogoDisplay = pattern.props?.logoDisplay ?? logoDisplay;
      const rendered = renderPattern(pattern, patternKey, sectionKey, patternLogoDisplay, contentAlign);
      return rendered ? (
        <div key={patternKey} style={{ gridColumn: `span ${colSpan}` }}>
          {rendered}
        </div>
      ) : null;
    });

    return (
      <Section
        as="footer"
        sectionKey={sectionKey}
        className={hasTopBorder ? 'footer-with-top-border' : ''}
        {...sectionProps}
      >
        <VStack spacing="xl" align={contentAlign} className="footer__content">
          <div style={gridStyle}>{gridItems}</div>
          {showMadeByBlimpify && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
              <MadeWithBlimpify inverse={isInverse} />
            </div>
          )}
        </VStack>
      </Section>
    );
  }

  // ── Default: vstack ───────────────────────────────────────────────────────
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey] as any;
      if (!pattern) return null;
      const patternLogoDisplay = pattern.props?.logoDisplay ?? logoDisplay;
      return renderPattern(pattern, patternKey, sectionKey, patternLogoDisplay, contentAlign);
    })
    .filter(Boolean);

  if (renderedPatterns.length === 0) return null;

  // Render last pattern without Container so MadeWithBlimpify can sit inline next to it
  const lastPatternKey = showMadeByBlimpify ? patternOrder[patternOrder.length - 1] : null;
  const lastPatternData = lastPatternKey ? patterns[lastPatternKey] : null;
  const lastPatternLogoDisplay = lastPatternData?.props?.logoDisplay ?? logoDisplay;
  const lastPatternContent = lastPatternKey && lastPatternData
    ? renderPattern(lastPatternData, lastPatternKey, sectionKey, lastPatternLogoDisplay, contentAlign, true)
    : null;

  const bodyPatterns = showMadeByBlimpify ? renderedPatterns.slice(0, -1) : renderedPatterns;

  return (
    <Section
      as="footer"
      sectionKey={sectionKey}
      className={hasTopBorder ? 'footer-with-top-border' : ''}
      {...sectionProps}
    >
      <VStack spacing="xl" align={contentAlign} className="footer__content">
        {bodyPatterns}
        {showMadeByBlimpify && (
          <HStack spacing="lg" align="center">
            {lastPatternContent}
            <MadeWithBlimpify inverse={isInverse} />
          </HStack>
        )}
      </VStack>
    </Section>
  );
};

export default Footer;
