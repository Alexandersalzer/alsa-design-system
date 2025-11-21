/**
 * Editing State Management
 * 
 * Skalbar lösning för att hantera editing mode state
 * Använder headers på server-side och DOM class på client-side
 * @author William
 * @since 2025-11-20
 */

// No longer need headers import for client-side only approach

/**
 * Kontrollerar om editing mode är aktivt
 * Server-side: Kollar headers för x-editing-mode eller x-blimpify-editing
 * Client-side: Kollar DOM class på html elementet
 */
export async function getEditingMode(): Promise<boolean> {
  // Client-side check
  if (typeof window !== 'undefined') {
    return document.documentElement.classList.contains('editing-mode');
  }
  
  // Server-side alltid false för statisk generering
  // EditingModeHandler uppdaterar DOM class dynamiskt
  return false;
}