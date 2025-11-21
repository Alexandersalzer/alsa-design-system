/**
 * PostMessage Types - Shared with IM-dashboard
 * 
 * Återanvänder samma interfaces som IM-dashboard för konsistens
 * @author William
 * @since 2025-11-17
 */

export interface PostMessage<T = any> {
  type: string;
  payload: T;
}

export interface EditingModePayload {
  isEditing: boolean;
  websiteVersionId?: number;
}

export interface DesignTokensPayload {
  designTokens: any; // Samma struktur som design.json globalStyles
  websiteVersionId?: number;
}

export const EDITING_MODE_MESSAGE = 'TOGGLE_EDITING_MODE';
export const DESIGN_TOKENS_MESSAGE = 'UPDATE_DESIGN_TOKENS';