/**
 * PostMessage System - Clean Exports
 * 
 * Förenklade exports för postMessage-funktionalitet
 * @author William
 * @since 2025-11-17
 */

// Types (shared with IM-dashboard)
export type { PostMessage, EditingModePayload } from './types';
export { EDITING_MODE_MESSAGE } from './types';

// CORS
export { ALLOWED_ORIGINS, isOriginAllowed } from './cors';

// React components
export { useEditingModeHandler } from './hook';
export { EditingModeHandler } from './EditingModeHandler';
export { useEditingMode } from './useEditingMode';