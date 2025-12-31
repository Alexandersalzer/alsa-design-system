/**
 * Action system types
 */

export type ActionType = 'navigation' | 'contact' | 'newsletter' | 'booking';

export interface PixelEvent {
  provider: 'meta' | 'google' | 'tiktok';
  event: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: string[];
  pixelEvents?: PixelEvent[];
}

export interface ActionConfig {
  type: ActionType;
}
