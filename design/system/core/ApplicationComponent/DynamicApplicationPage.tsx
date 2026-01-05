/**
 * Dynamic Application Page
 * Universal renderer for applications
 */

import React from 'react';
import type { ApplicationRoute } from '../applications/loader';
import PublicBookingPage from '../../bookings/booking/[userId]/page';

interface DynamicApplicationPageProps {
  route: ApplicationRoute;
}

export function DynamicApplicationPage({ route }: DynamicApplicationPageProps) {
  if (route.app === 'bookings') {
    return <PublicBookingPage {...(route.props as { externalId: string })} />;
  }
  
  // Fallback for unknown applications
  return (
    <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
      <h2>Application "{route.app}" not found</h2>
      <p>The requested application is not available.</p>
    </div>
  );
}