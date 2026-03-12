'use client';

import React from 'react';
import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/shells';
import { renderLayoutWithTemplate } from '../../core/render/layouts';
import { Container } from '../../components';
import { SectionNode } from '../../core/types/nodes';
import { Typography } from '../../components/Typography/Typography';
import { VStack } from '../../components/layout/vStack/VStack';
import './Footer.css';

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
 * Render a single pattern.
 * If pattern has `layout`, uses renderLayoutWithTemplate (items-based patterns).
 * Otherwise falls back to renderShellPattern (legacy hardcoded patterns).
 */
function renderPattern(
  pattern: any,
  patternKey: string,
  sectionKey: string,
  logoDisplay: string | undefined
): React.ReactNode {
  if (pattern.layout) {
    let components: Record<string, any> = pattern.components || {};
    if (pattern.layout.items && Array.isArray(pattern.layout.items)) {
      components = pattern.layout.items.reduce((acc: Record<string, any>, item: any) => {
        return item.components ? { ...acc, ...item.components } : acc;
      }, {});
    }

    const filteredComponents = filterByLogoDisplay(components, logoDisplay);

    const patchedLayout = {
      ...pattern.layout,
      items: pattern.layout.items?.map((item: any) => ({
        ...item,
        components: Object.fromEntries(
          Object.entries(item.components || {}).filter(([k]) => k in filteredComponents)
        ),
      })),
    };

    const content = renderLayoutWithTemplate(
      patchedLayout,
      filteredComponents,
      sectionKey,
      patternKey
    );

    return (
      <Container
        key={patternKey}
        align="center"
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

  const hasTopBorder = Object.values(patterns).some(
    (pattern: any) => pattern?.props?.showTopBorder === true
  );

  // Section-level grid layout (optional)
  const sectionLayout = footerSection.layout as any;
  const useGrid = sectionLayout?.type === 'grid';

  const attribution = (
    <div className="footer__attribution">
      <Typography as="span" variant="body-sm" color="tertiary">
        Made with{' '}
        <a
          href="https://blimpify-im.com"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__attribution-link"
        >
          Blimpify
        </a>
      </Typography>
    </div>
  );

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
      const rendered = renderPattern(pattern, patternKey, sectionKey, patternLogoDisplay);
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
        <VStack spacing="xl" align="center" className="footer__content">
          <div style={gridStyle}>{gridItems}</div>
          {attribution}
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
      return renderPattern(pattern, patternKey, sectionKey, patternLogoDisplay);
    })
    .filter(Boolean);

  if (renderedPatterns.length === 0) return null;

  return (
    <Section
      as="footer"
      sectionKey={sectionKey}
      className={hasTopBorder ? 'footer-with-top-border' : ''}
      {...sectionProps}
    >
      <VStack spacing="xl" align="center" className="footer__content">
        {renderedPatterns}
        {attribution}
      </VStack>
    </Section>
  );
};

export default Footer;
