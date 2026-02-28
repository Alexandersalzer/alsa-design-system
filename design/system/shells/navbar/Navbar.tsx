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
    
    // Render desktop layout (default template or explicit desktop template)
    const desktopTemplate = layout.template?.desktop || layout.template;
    const desktopLayout = desktopTemplate ? { ...layout, template: desktopTemplate } : layout;
    const desktopContent = renderLayoutWithTemplate(
      desktopLayout,
      components,
      sectionKey,
      firstPatternKey,
      patternProps
    );

    // Render mobile menu layout (use mobile template if available, otherwise same as desktop)
    const mobileTemplate = layout.template?.mobile || layout.template;
    const mobileLayout = mobileTemplate ? { ...layout, template: mobileTemplate } : layout;
    const mobileContent = renderLayoutWithTemplate(
      mobileLayout,
      components,
      sectionKey,
      firstPatternKey,
      patternProps
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