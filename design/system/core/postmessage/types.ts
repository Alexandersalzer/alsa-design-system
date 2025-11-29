/**
 * PostMessage Types - Shared with IM-dashboard
 * 
 * Återanvänder samma interfaces som IM-dashboard för konsistens
 * @author William
 * @since 2025-11-17
 */

import type { DesignTokens } from '../types/design';

export interface PostMessage<T = any> {
  type: string;
  payload: T;
}


/**
 * Meddelanden från parent till client iframe
 */
export const PARENT_TO_CLIENT_MESSAGES = {
  TOGGLE_EDITING_MODE: 'TOGGLE_EDITING_MODE',
  UPDATE_DESIGN_TOKENS: 'UPDATE_DESIGN_TOKENS',
  DESIGN_TOKENS_UPDATE: 'DESIGN_TOKENS_UPDATE',
  REQUEST_HEIGHT: 'REQUEST_HEIGHT',
} as const;

/**
 * Meddelanden från client iframe till parent
 */
export const CLIENT_TO_PARENT_MESSAGES = {
  IFRAME_HEIGHT: 'IFRAME_HEIGHT',
} as const;


export interface EditingModePayload {
  isEditing: boolean;
}

export interface DesignTokensPayload {
  designTokens: DesignTokens; // Samma struktur som design.json globalStyles
}

export interface DesignTokenUpdatesPayload {
  updates: Partial<DesignTokens>; // Partiella uppdateringar
}

export interface HeightPayload {
  height: number;
  iframeId?: string;
}

export interface RequestHeightPayload {
  iframeId: string;
  width: number;
}