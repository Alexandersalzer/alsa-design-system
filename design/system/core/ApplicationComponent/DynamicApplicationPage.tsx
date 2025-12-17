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
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('[DYNAMIC APP] 🎨 DynamicApplicationPage rendering');
  console.log(`[DYNAMIC APP] App: ${route.app}`);
  console.log(`[DYNAMIC APP] Path: ${route.path}`);
  console.log(`[DYNAMIC APP] Props:`, route.props);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
  
  // For now, we only have booking - in the future this could be dynamic
  if (route.app === 'bookings') {
    console.log('[DYNAMIC APP] ✅ Rendering PublicBookingPage component');
    // Type assertion since we know booking requires externalId and loader provides it
    return <PublicBookingPage {...(route.props as { externalId: string })} />;
  }
  
  console.log('[DYNAMIC APP] ❌ Unknown application, showing fallback');
  // Fallback for unknown applications
  return (
    <div style={{ padding: 'var(--foundation-space-xl)', textAlign: 'center' }}>
      <h2>Application "{route.app}" not found</h2>
      <p>The requested application is not available.</p>
    </div>
  );
}