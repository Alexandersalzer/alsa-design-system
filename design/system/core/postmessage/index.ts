/**
 * PostMessage System - Clean Exports
 * 
 * Förenklade exports för postMessage-funktionalitet
 * @author William
 * @since 2025-11-17
 */

// Types (shared with IM-dashboard)
export type { 
  BaseMessage, 
  EditingStatePayload, 
  DesignTokensPayload,
  RequestedHeightPayload,
  RequestHeightPayload,
  DesignTokenUpdatePayload
} from './types';
export { ClientToParentMessage, ParentToClientMessage } from './types';

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


export { EditingHandler } from './EditingHandler';
export { applyEditingMode } from './hooks/applyEditingMode';