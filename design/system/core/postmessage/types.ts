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
  // Editing Mode
  TOGGLE_EDITING_MODE: 'TOGGLE_EDITING_MODE',
  
  // Design Tokens
  UPDATE_DESIGN_TOKENS: 'UPDATE_DESIGN_TOKENS',      // Initial load från databas
  DESIGN_TOKENS_UPDATE: 'DESIGN_TOKENS_UPDATE',      // Live updates
  
  // Height Communication
  SEND_HEIGHT: 'SEND_HEIGHT',
  REQUEST_HEIGHT: 'REQUEST_HEIGHT',
  IFRAME_HEIGHT: 'IFRAME_HEIGHT',
  
  // Future message types
  UPDATE_CONTENT: 'UPDATE_CONTENT',
  SELECT_COMPONENT: 'SELECT_COMPONENT',
} as const;

export interface EditingModePayload {
  isEditing: boolean;
}

export interface DesignTokensPayload {
  designTokens: any; // Samma struktur som design.json globalStyles
}