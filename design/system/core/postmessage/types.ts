/**
 * PostMessage Types
 * 
 * TypeScript interfaces för postMessage-kommunikation mellan parent och iframe:s
 * @author William
 * @since 2025-11-17
 */

export interface PostMessageData {
  type: 'TOGGLE_EDITING_MODE' | 'EDITING_MODE_UPDATED';
  payload: EditingModePayload;
  source?: string;
  timestamp?: number;
}

export interface EditingModePayload {
  isEditing: boolean;
  websiteVersionId?: number;
  success?: boolean;
}