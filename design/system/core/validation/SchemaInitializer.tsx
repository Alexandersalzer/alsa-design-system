// ===============================================
// blimpify-ui/design/system/core/validation/SchemaInitializer.tsx
// Schema initialization component for client-side apps
// ===============================================

'use client';

import { useEffect, useState } from 'react';
import { registerAllSchemas } from './registerSchemas';

/**
 * Schema initializer component that registers all schemas
 * Should be placed at the root of the app to ensure schemas are loaded
 */
export const SchemaInitializer: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [schemasRegistered, setSchemasRegistered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      registerAllSchemas();
      setSchemasRegistered(true);
    } catch (err) {
      console.error('Failed to register schemas:', err);
      setError(err instanceof Error ? err.message : 'Unknown schema registration error');
      setSchemasRegistered(true); // Still render children even if schema registration fails
    }
  }, []);

  // Don't show loading state - initialize silently

  if (process.env.NODE_ENV === 'development' && error) {
    return (
      <div>
        <div style={{ 
          padding: '16px', 
          background: '#ffebee',
          border: '2px solid #f44336',
          color: '#c62828',
          margin: '20px',
          borderRadius: '4px'
        }}>
          <strong>⚠️ Schema Registration Error:</strong>
          <p>{error}</p>
          <p><em>Validation will be disabled. Check console for details.</em></p>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * Hook to check if schemas are ready
 * Useful for conditional rendering based on schema availability
 */
export const useSchemas = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Simple check - in a real app you might want more sophisticated detection
    const timer = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return { ready };
};