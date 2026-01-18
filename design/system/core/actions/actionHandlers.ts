/**
 * Action handlers - API calls per action type
 */

import { ActionType, ActionResponse } from './types';

const API_BASE_URL = 'https://api.blimpify-im.com/api/v1';

/**
 * Execute an action (contact, newsletter, etc.)
 */
export async function executeAction(
  actionType: ActionType,
  data: Record<string, any>
): Promise<ActionResponse> {
  const originHost = typeof window !== 'undefined' ? window.location.host : '';
  
  // Extract locale from URL path (e.g., /en/contact, /sv/kontakt)
  const locale = typeof window !== 'undefined' 
    ? window.location.pathname.split('/')[1] || 'en'
    : 'en';

  try {
    const response = await fetch(`${API_BASE_URL}/actions/${actionType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Origin-Host': originHost,
        'X-Locale': locale,
      },
      body: JSON.stringify({
        ...data,
        submittedAt: Date.now(), // För spam-detection
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Something went wrong',
        errors: result.errors,
      };
    }

    return result;
  } catch (error) {
    console.error(`[Action] ${actionType} failed:`, error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}
