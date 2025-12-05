/**
 * Dynamic Application Page
 * Universal renderer for applications
 */
'use client';

import React from 'react';
import type { ApplicationRoute } from './loader';
import PublicBookingPage from '../../bookings/booking/[userId]/page';

interface DynamicApplicationPageProps {
  route: ApplicationRoute;
}

export function DynamicApplicationPage({ route }: DynamicApplicationPageProps) {
  // For now, we only have booking - in the future this could be dynamic
  if (route.app === 'booking') {
    return <PublicBookingPage {...route.props} />;
  }
  
  // Fallback for unknown applications
  return (
    <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
      <h2>Application "{route.app}" not found</h2>
      <p>The requested application is not available.</p>
    </div>
  );
}