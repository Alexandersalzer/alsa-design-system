/**
 * PostMessage System - Clean Exports
 * 
 * Förenklade exports för postMessage-funktionalitet
 * @author William
 * @since 2025-11-17
 */

// Types (shared with IM-dashboard)
export type { 
  PostMessage, 
  EditingModePayload, 
  DesignTokensPayload,
  HeightPayload,
  RequestHeightPayload
} from './types';
export { MESSAGE_TYPES } from './types';

// CORS
export { ALLOWED_ORIGINS, isOriginAllowed } from './cors';

// React hooks (modern approach)
export { 
  useEditMode, 
  useDesignCSS, 
  useIFrameHeight, 
  useDesignTokenUpdates,
  useHeightSync 
} from './hooks';


export { EditingModeHandler } from './EditingModeHandler';
export { applyEditingMode } from './applyEditingMode';