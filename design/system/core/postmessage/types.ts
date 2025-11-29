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

/**
 * Alla postMessage typer som används i systemet
 * Synkroniserat med IM-dashboard för konsistens
 */
export const MESSAGE_TYPES = {
  TOGGLE_EDITING_MODE: 'TOGGLE_EDITING_MODE',
  UPDATE_DESIGN_TOKENS: 'UPDATE_DESIGN_TOKENS',
  DESIGN_TOKENS_UPDATE: 'DESIGN_TOKENS_UPDATE',
  REQUEST_HEIGHT: 'REQUEST_HEIGHT',
  IFRAME_HEIGHT: 'IFRAME_HEIGHT',
} as const;

export interface EditingModePayload {
  isEditing: boolean;
}

export interface DesignTokensPayload {
  designTokens: any; // Samma struktur som design.json globalStyles
}

export interface HeightPayload {
  height: number;
  iframeId?: string;
}

export interface RequestHeightPayload {
  iframeId: string;
  width: number;
}