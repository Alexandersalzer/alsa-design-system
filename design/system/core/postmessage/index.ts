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
  DesignTokenUpdatePayload,
  ComponentContentUpdatePayload,
  HtmlAttributesPayload
} from './types';
export { ClientToParentMessage, ParentToClientMessage } from './types';

// CORS
export { ALLOWED_ORIGINS, isOriginAllowed } from './cors';


export { EditingHandler } from './EditingHandler';
export { applyEditingMode } from './hooks';