'use client';

import { PageProps } from '../../../core/types/nodes';

interface PageBackgroundProps {
  pageProps?: PageProps;
  children: React.ReactNode;
}

/**
 * PageBackground - Renders optional page-level background with content
 * Used to add subtle textures, patterns, or images behind page content
 * 
 * When a background image is set, sections become transparent automatically
 * via the --section-background CSS variable, unless the section explicitly
 * sets its own background variant.
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.backgroundImage;

  if (!hasBackground) {
    return <>{children}</>;
  }

  // Determine if sections should be transparent
  // Defaults to true when background image is set, but can be overridden
  const shouldMakeSectionsTransparent = pageProps.transparentSections !== false;

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    // This CSS variable controls section backgrounds
    ...(shouldMakeSectionsTransparent && {
      '--section-background': 'transparent',
    }),
  } as React.CSSProperties;

  return (
    <div style={wrapperStyle}>
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${pageProps.backgroundImage})`,
          backgroundSize: pageProps.backgroundSize || 'auto',
          backgroundPosition: pageProps.backgroundPosition || 'center',
          backgroundRepeat: 'repeat',
          opacity: pageProps.backgroundOpacity ?? 0.03,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
