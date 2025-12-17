/**
 * events.ts
 * Helper functions för att dispatcha app-wide events
 * 
 * Använd dessa istället för att manuellt dispatcha CustomEvent överallt.
 * ErrorProvider lyssnar på dessa events och visar toast automatiskt.
 */

interface EventDetail {
  message: string;
  title?: string;
  technical?: string;
  context?: string;
}

/**
 * Dispatcha error event → Visar röd error toast
 * 
 * @example
 * showError('Kunde inte spara ändringar');
 * 
 * @example
 * showError('Servern svarade inte', {
 *   technical: 'Status 500: Internal Server Error',
 *   context: 'Saving user settings'
 * });
 */
export const showError = (message: string, options?: Omit<EventDetail, 'message'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app:error', {
      detail: { message, ...options }
    }));
  }
};

/**
 * Dispatcha warning event → Visar orange warning toast
 * 
 * @example
 * showWarning('Detta kan ta några minuter');
 */
export const showWarning = (message: string, options?: Omit<EventDetail, 'message'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app:warning', {
      detail: { message, ...options }
    }));
  }
};

/**
 * Dispatcha success event → Visar grön success toast
 * 
 * @example
 * showSuccess('Inställningar sparade!');
 * 
 * @example
 * showSuccess('Domänen har lagts till', { title: 'Klart!' });
 */
export const showSuccess = (message: string, options?: Omit<EventDetail, 'message'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app:success', {
      detail: { message, ...options }
    }));
  }
};

/**
 * Dispatcha info event → Visar blå info toast
 * 
 * @example
 * showInfo('Din webbplats byggs just nu');
 */
export const showInfo = (message: string, options?: Omit<EventDetail, 'message'>) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('app:info', {
      detail: { message, ...options }
    }));
  }
};

/**
 * Helper för att visa API-errors med context
 */
export const showApiError = (
  endpoint: string,
  method: string = 'GET',
  technicalMessage?: string
) => {
  showError('Ett fel inträffade vid kommunikation med servern', {
    technical: technicalMessage,
    context: `API: ${method.toUpperCase()} ${endpoint}`
  });
};

// Export all helpers
export const appEvents = {
  showError,
  showWarning,
  showSuccess,
  showInfo,
  showApiError
};

export default appEvents;

