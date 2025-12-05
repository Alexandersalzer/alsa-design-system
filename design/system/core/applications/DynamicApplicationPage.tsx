// blimpify-ui/design/system/core/applications/DynamicApplicationPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import type { ApplicationRoute } from './loader';

interface DynamicApplicationPageProps {
  route: ApplicationRoute;
}

export function DynamicApplicationPage({ route }: DynamicApplicationPageProps) {
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComponent() {
      try {
        if (route.app === 'booking') {
          // Dynamic import prevents server-side evaluation
          const module = await import('../../bookings/booking/[userId]/page');
          setComponent(() => module.default);
        }
        setLoading(false);
      } catch (error) {
        console.error('Failed to load application component:', error);
        setLoading(false);
      }
    }

    loadComponent();
  }, [route.app]);

  if (loading) {
    return (
      <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!Component) {
    return (
      <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
        <h2>Application "{route.app}" not found</h2>
        <p>The requested application is not available.</p>
      </div>
    );
  }

  // Type assertion since we know booking requires userId and loader provides it
  return <Component {...(route.props as { userId: number })} />;
}