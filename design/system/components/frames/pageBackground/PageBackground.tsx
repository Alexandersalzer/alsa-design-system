'use client';

import { PageProps } from '../../../core/types/nodes';

interface PageBackgroundProps {
  pageProps?: PageProps;
  children: React.ReactNode;
}

/**
 * PageBackground - Renders optional page-level background with content
 * Used to add subtle textures, patterns, colors or images behind page content
 * 
 * Features:
 * - backgroundColor: Solid color background
 * - backgroundImage: Image/pattern with configurable opacity
 * - backgroundOverlay: Color tint on top of image
 * - transparentSections: Makes child sections transparent (default: true)
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.backgroundImage || !!pageProps?.backgroundColor;

  if (!hasBackground) {
    return <>{children}</>;
  }

  // Determine if sections should be transparent
  const shouldMakeSectionsTransparent = pageProps.transparentSections !== false;

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    isolation: 'isolate',
    // This CSS variable controls section backgrounds
    ...(shouldMakeSectionsTransparent && {
      '--section-background': 'transparent',
    }),
    // Apply background color to wrapper if set
    ...(pageProps.backgroundColor && {
      backgroundColor: pageProps.backgroundColor,
    }),
  } as React.CSSProperties;

  return (
    <div style={wrapperStyle}>
      {/* Background image layer */}
      {pageProps.backgroundImage && (
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
      )}
      
      {/* Color overlay layer (on top of image) */}
      {pageProps.backgroundOverlay && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: pageProps.backgroundOverlay,
            opacity: pageProps.backgroundOverlayOpacity ?? 0.5,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}
      
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  );
}
