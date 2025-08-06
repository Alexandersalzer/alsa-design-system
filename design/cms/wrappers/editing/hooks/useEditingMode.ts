import { useContext } from 'react';
import { ToggleContext, type ToggleContextType } from '../EditingWrapper';

/**
 * Hook to access editing mode state
 */
export function useEditingMode(): ToggleContextType {
  const context = useContext(ToggleContext);
  if (context === undefined) {
    throw new Error('useEditingMode must be used within an EditingModeWrapper');
  }
  return context;
} 