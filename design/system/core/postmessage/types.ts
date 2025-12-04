/**
 * PostMessage Types - Shared with IM-dashboard
 * 
 * Återanvänder samma interfaces som IM-dashboard för konsistens
 * @author William
 * @since 2025-11-17
 */

import type { DesignTokens } from '../types/design';

export interface BaseMessage<T = any> {
  type: string;
  payload: T;
}


/**
 * Meddelanden från parent till client iframe
 */
export const ParentToClientMessage = {
  SetEditingMode: 'SET_EDITING_MODE',
  SetInitialDesignTokens: 'SET_INITIAL_DESIGN_TOKENS',
  UpdateDesignToken: 'UPDATE_DESIGN_TOKEN',
  RequestIframeHeight: 'REQUEST_IFRAME_HEIGHT',
  UpdateComponentContent: 'UPDATE_COMPONENT_CONTENT',
  UpdateHtmlAttributes: 'UPDATE_HTML_ATTRIBUTES',
} as const;


/**
 * Meddelanden från client iframe till parent
 */
export const ClientToParentMessage = {
  RequestedIframeHeight: 'REQUESTED_IFRAME_HEIGHT',
} as const;


export interface EditingStatePayload {
  isEditing: boolean;
}

export interface DesignTokensPayload {
  designTokens: DesignTokens; // Samma struktur som design.json globalStyles
}

export interface DesignTokenUpdatePayload {
  updates: Partial<DesignTokens>; // Partiella uppdateringar
}

export interface RequestedHeightPayload {
  height: number;
  iframeId?: string;
}

export interface ComponentContentUpdatePayload {
  componentKey: string;
  fieldKey: string;
  content: string;
}

export interface RequestHeightPayload {
  iframeId: string;
  width: number;
}

export interface HtmlAttributesPayload {
  attributes: Record<string, string | null>; // null = remove attribute
}