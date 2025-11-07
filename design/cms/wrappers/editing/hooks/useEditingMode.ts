export interface ToggleContextType {
  isEditingMode: boolean;
}

/**
 * Hook to access editing mode state
 * Note: Always returns false since editing mode has been removed
 */
export function useEditingMode(): ToggleContextType {
  return { isEditingMode: false };
} 