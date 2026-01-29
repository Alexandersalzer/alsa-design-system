'use client';

import { PageProps } from '../../../core/types/nodes';

interface PageBackgroundProps {
  pageProps?: PageProps;
  children: React.ReactNode;
}

/**
 * PageBackground - Renders optional page-level background with content
 * Used to add subtle textures, patterns, or images behind page content
 */
export function PageBackground({ pageProps, children }: PageBackgroundProps) {
  const hasBackground = !!pageProps?.backgroundImage;

  if (!hasBackground) {
    return <>{children}</>;
  }

  return (
    <div style={{ position: 'relative', isolation: 'isolate' }}>
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
