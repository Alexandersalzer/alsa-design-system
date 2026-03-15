/**
 *   shells/navbar/Navbar.tsx        (renderer — requires layout key in JSON)
 */

'use client';

import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/shells';
import { renderLayoutWithTemplate } from '../../core/render/layouts';
import { SectionNode } from '../../core/types/nodes';
import { NavbarContainer } from './NavbarContainer';

interface NavbarProps {
  section?: Record<string, SectionNode>;
}

const Navbar = ({ section }: NavbarProps) => {
  if (!section) return null;
  
  // Get the first (and usually only) navbar section
  const navbarSection = Object.values(section)[0];
  if (!navbarSection?.patterns) return null;

  const { patterns, order, props: sectionProps } = navbarSection;
  const patternOrder = order || Object.keys(patterns);
  
  // Get sectionKey from the first section
  const sectionKey = Object.keys(section)[0];
  
  // Get first pattern (navbar typically has only one pattern)
  const firstPatternKey = patternOrder[0];
  const pattern = patterns[firstPatternKey];
  
  if (!pattern) return null;

  // Check if pattern uses NEW layout-driven structure
  if ((pattern as any).layout) {
    const patternProps = pattern.props || {};
    const layout = (pattern as any).layout;
    
    // Extract components from layout.items (layout-driven) or fallback to pattern.components (legacy)
    let components = pattern.components || {};
    if (layout.items && Array.isArray(layout.items)) {
      // Merge all components from all items into a single object
      components = layout.items.reduce((acc: Record<string, any>, item: any) => {
        if (item.components) {
          return { ...acc, ...item.components };
        }
        return acc;
      }, {});
    }

    // Helper: filter components by logoDisplay / showLogo / showLogoText
    const filterComponentsByLogoDisplay = (
      comps: Record<string, any>,
      showLogo: boolean,
      showLogoText: boolean
    ) => Object.fromEntries(
      Object.entries(comps).filter(([key, comp]: [string, any]) => {
        if (!showLogo && comp.type === 'logo') return false;
        if (!showLogoText) {
          if (comp.type === 'logotext') return false;
          if ((comp.type === 'heading' || comp.type === 'typography-businessName') &&
              (key.includes('businessName') || key.includes('typography-businessName'))) return false;
        }
        return true;
      })
    );

    // Helper: apply linkVariant to link components
    const applyLinkVariant = (comps: Record<string, any>, linkVariant: string) =>
      Object.fromEntries(
        Object.entries(comps).map(([key, comp]: [string, any]) => {
          if ((comp.type === 'link' || comp.type === 'textlink-menuItem') && !comp.props?.variant) {
            return [key, { ...comp, props: { ...comp.props, variant: linkVariant } }];
          }
          return [key, comp];
        })
      );

    // Helper: build a layout with filtered components embedded back into layout.items
    const buildFilteredLayout = (
      baseLayout: Record<string, any>,
      template: Record<string, any>,
      filteredComps: Record<string, any>
    ) => {
      const patchedItems = baseLayout.items?.map((item: any) => ({
        ...item,
        components: Object.fromEntries(
          Object.entries(item.components || {}).filter(([k]) => k in filteredComps)
        )
      }));
      return { ...baseLayout, template, items: patchedItems };
    };

    // Compute desktop logo visibility
    const logoDisplay = (patternProps as any).logoDisplay;
    const showLogo = logoDisplay ? logoDisplay !== 'text' : patternProps.showLogo !== false;
    const showLogoText = logoDisplay ? logoDisplay !== 'logo' : patternProps.showLogoText !== false;

    // Apply logo filter + linkVariant to desktop components
    let filteredDesktop = filterComponentsByLogoDisplay(components, showLogo, showLogoText);
    const linkVariant = (patternProps as any)?.linkVariant;
    if (linkVariant && linkVariant !== 'default') {
      filteredDesktop = applyLinkVariant(filteredDesktop, linkVariant);
    }

    // Render desktop layout — embed filtered components back into layout.items
    const desktopTemplate = layout.template?.desktop || layout.template;
    const desktopLayout = buildFilteredLayout(layout, desktopTemplate, filteredDesktop);
    const desktopContent = renderLayoutWithTemplate(
      desktopLayout,
      filteredDesktop,
      sectionKey,
      firstPatternKey,
      patternProps,
      undefined,
      undefined
    );

    // Compute mobile logo visibility
    const mobileLogoDisplay = (patternProps as any).mobileLogoDisplay;
    const showLogoMobile = mobileLogoDisplay ? mobileLogoDisplay !== 'text' : !(patternProps as any).hideLogoOnMobile;
    const showLogoTextMobile = mobileLogoDisplay ? mobileLogoDisplay !== 'logo' : !(patternProps as any).hideLogoTextOnMobile;

    // Apply logo filter to mobile components (start from original components, not desktop-filtered)
    let filteredMobile = filterComponentsByLogoDisplay(components, showLogoMobile, showLogoTextMobile);
    if (linkVariant && linkVariant !== 'default') {
      filteredMobile = applyLinkVariant(filteredMobile, linkVariant);
    }

    // Render mobile menu layout — embed filtered components back into layout.items
    const mobileTemplate = layout.template?.mobile || layout.template;
    const mobileLayout = buildFilteredLayout(layout, mobileTemplate, filteredMobile);
    const mobileContent = renderLayoutWithTemplate(
      mobileLayout,
      filteredMobile,
      sectionKey,
      firstPatternKey,
      patternProps,
      undefined,
      undefined
    );

    return (
      <Section
        as="nav"
        sectionKey={sectionKey}
        {...sectionProps}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          paddingTop: '0',
          paddingBottom: '0',
          ...sectionProps?.style,
        }}
      >
        {/* data-pattern-key wrapper lets EditorOverlay identify pattern context for inline editing */}
        <div data-pattern-key={firstPatternKey} style={{ display: 'contents' }}>
          <NavbarContainer
            menuAlign={patternProps.menuAlign}
            mobileMenuAlign={patternProps.mobileMenuAlign}
            backgroundVariant={patternProps.backgroundVariant}
            showBorder={patternProps.showBorder}
            bottomBorderFade={patternProps.bottomBorderFade}
            hideOnScroll={patternProps.hideOnScroll}
            navbarStyle={patternProps.navbarStyle ?? (pattern as any).type}
            pillWidth={patternProps.pillWidth}
            drawerStyle={patternProps.drawerStyle}
            drawerAnimation={patternProps.drawerAnimation}
            mobileMenu={mobileContent}
          >
            {desktopContent}
          </NavbarContainer>
        </div>
      </Section>
    );
  }

  // LEGACY: Use old pattern rendering (NavbarPill, NavbarBar, NavbarCenterPill)
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      return pattern ? renderShellPattern(pattern, patternKey, sectionKey) : null;
    })
    .filter(Boolean);
  
  if (renderedPatterns.length === 0) return null;
  
  return (
    <Section
      as="nav"
      sectionKey={sectionKey}
      {...sectionProps}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingTop: '0',
        paddingBottom: '0',
        ...sectionProps?.style,
      }}
    >
      {renderedPatterns}
    </Section>
  );
};

export default Navbar;