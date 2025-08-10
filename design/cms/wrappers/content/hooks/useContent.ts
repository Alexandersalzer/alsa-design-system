import { useContext } from 'react';
import { ContentContext } from '../ContentProvider';

/**
 * Main hook to access content context
 */
export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
} 