// Interface for message handlers in child component
export interface I18nMessageHandlers {
  onLanguageChange: (language: string) => void;
  onLanguageChangeRequest?: () => string; // Return current language
}

// Send language change response to parent
export const sendLanguageChangeResponse = (success: boolean, language: string) => {
  console.log('📤 Sending language change response to parent:', { success, language });
  
  if (window.parent) {
    window.parent.postMessage({
      type: 'language-change-response',
      success,
      language
    }, '*');
  }
};

// Request language change from parent (if child wants to initiate)
export const requestLanguageChange = (language: string) => {
  console.log('📤 Requesting language change to parent:', language);
  
  if (window.parent) {
    window.parent.postMessage({
      type: 'request-language-change',
      language
    }, '*');
  }
};

// Setup message listener for i18n messages
export const setupI18nMessageListener = (handlers: I18nMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    // Handle language changes from parent
    if (event.data.type === 'language-change') {
      console.log('📨 Received language change from parent:', event.data.language);
      
      try {
        handlers.onLanguageChange(event.data.language);
        
        // Send success response back to parent
        sendLanguageChangeResponse(true, event.data.language);
      } catch (error) {
        console.error('Failed to handle language change:', error);
        
        // Send error response back to parent
        sendLanguageChangeResponse(false, event.data.language);
      }
    }

    // Handle language change requests from parent (if parent wants to know current language)
    if (event.data.type === 'request-current-language') {
      console.log('📨 Parent requested current language');
      
      if (handlers.onLanguageChangeRequest) {
        const currentLanguage = handlers.onLanguageChangeRequest();
        
        if (window.parent) {
          window.parent.postMessage({
            type: 'current-language-response',
            language: currentLanguage
          }, '*');
        }
      }
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
};

// Utility function to get current language from URL path (for Next.js [locale] routing)
export const getCurrentLanguageFromPath = (): string => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    // Assume first segment is locale (e.g., /sv/home -> sv)
    if (segments.length > 0) {
      return segments[0];
    }
  }
  
  return 'sv'; // Default fallback
};

// Helper to update URL for language change (for Next.js [locale] routing)
export const updateUrlForLanguageChange = (newLanguage: string) => {
  if (typeof window !== 'undefined') {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    // Replace first segment (current locale) with new language
    if (segments.length > 0) {
      segments[0] = newLanguage;
    } else {
      segments.unshift(newLanguage);
    }
    
    const newPath = '/' + segments.join('/');
    
    // Use router.push or window.location depending on context
    console.log('🔄 Would navigate to:', newPath);
    return newPath;
  }
  
  return `/${newLanguage}`;
}; 