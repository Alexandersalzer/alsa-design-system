import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

// Available languages interface
export interface AvailableLanguage {
  id: number;
  name: string;
  code: string;
  is_default: boolean;
  is_active: boolean;
}

// Message handlers interface for child-side
export interface I18nChildHandlers {
  onLanguageChangeRequest?: (languageCode: string) => void;
  onAvailableLanguages?: (languages: AvailableLanguage[]) => void;
  onCustomMessage?: (event: MessageEvent) => void;
}

export class I18nChildHandler {
  private handlers: I18nChildHandlers;
  private currentLanguage: string;

  constructor(handlers: I18nChildHandlers = {}, initialLanguage: string = 'sv') {
    this.handlers = handlers;
    this.currentLanguage = initialLanguage;
  }

  // Handle incoming messages from parent (CMS dashboard)
  handleMessage = (event: MessageEvent) => {
    // Handle language change request from parent
    if (event.data.type === 'language-change-request') {
      console.log('🌍 Child received language change request:', event.data.languageCode);
      
      const languageCode = event.data.languageCode;
      this.currentLanguage = languageCode;
      
      // Call custom handler if provided
      if (this.handlers.onLanguageChangeRequest) {
        this.handlers.onLanguageChangeRequest(languageCode);
      }

      // Send success response back to parent
      this.sendLanguageChangeResponse(true, languageCode);
    }

    // Handle available languages from parent
    if (event.data.type === 'available-languages') {
      console.log('🌍 Child received available languages:', event.data.languages);
      
      if (this.handlers.onAvailableLanguages) {
        this.handlers.onAvailableLanguages(event.data.languages);
      }
    }

    // Handle custom messages through handler
    if (this.handlers.onCustomMessage) {
      this.handlers.onCustomMessage(event);
    }
  };

  // Send language change response back to parent
  sendLanguageChangeResponse = (success: boolean, languageCode: string) => {
    console.log('🌍 Child sending language change response:', { success, languageCode });
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'language-change-response',
        success,
        languageCode
      }, '*');
    }
  };

  // Request available languages from parent
  requestAvailableLanguages = () => {
    console.log('🌍 Child requesting available languages');
    
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'request-available-languages'
      }, '*');
    }
  };

  // Setup message listener for child
  setupMessageListener = () => {
    window.addEventListener('message', this.handleMessage);
    return () => window.removeEventListener('message', this.handleMessage);
  };

  // Update handlers
  updateHandlers = (newHandlers: Partial<I18nChildHandlers>) => {
    this.handlers = { ...this.handlers, ...newHandlers };
  };

  // Get current language
  getCurrentLanguage = () => this.currentLanguage;

  // Set current language
  setCurrentLanguage = (languageCode: string) => {
    this.currentLanguage = languageCode;
  };
}

// Hook for using I18n child messaging in React components
export const useI18nChildMessaging = (
  initialLanguage: string = 'sv',
  onLanguageChange?: (languageCode: string) => void
) => {
  const router = useRouter();
  const pathname = usePathname();

  // Create handler with language change logic
  const handlers: I18nChildHandlers = {
    onLanguageChangeRequest: (languageCode: string) => {
      console.log('🌍 Processing language change in hook:', languageCode);
      
      // Extract the current route without the locale prefix
      const pathSegments = pathname.split('/');
      const currentLocale = pathSegments[1]; // First segment after '/'
      const routeWithoutLocale = pathSegments.slice(2).join('/') || ''; // Rest of the path
      
      // Construct new URL with new language
      const newPath = `/${languageCode}${routeWithoutLocale ? `/${routeWithoutLocale}` : ''}`;
      
      console.log('🌍 Navigating from', pathname, 'to', newPath);
      
      // Navigate to new language URL
      router.push(newPath);
      
      // Call custom callback if provided
      if (onLanguageChange) {
        onLanguageChange(languageCode);
      }
    }
  };

  const childHandler = new I18nChildHandler(handlers, initialLanguage);

  return {
    handler: childHandler,
    setupMessageListener: childHandler.setupMessageListener,
    requestAvailableLanguages: childHandler.requestAvailableLanguages,
    getCurrentLanguage: childHandler.getCurrentLanguage,
    setCurrentLanguage: childHandler.setCurrentLanguage
  };
};

// Utility functions for easier usage

// Setup basic I18n child messaging
export const setupI18nChildMessaging = (
  onLanguageChange: (languageCode: string) => void,
  initialLanguage: string = 'sv'
) => {
  const handlers: I18nChildHandlers = {
    onLanguageChangeRequest: onLanguageChange
  };

  const childHandler = new I18nChildHandler(handlers, initialLanguage);
  return childHandler.setupMessageListener();
};

// Direct language change handler for non-hook usage
export const handleLanguageChangeMessage = (
  router: any,
  pathname: string,
  languageCode: string
) => {
  console.log('🌍 Processing direct language change:', languageCode);
  
  // Extract the current route without the locale prefix
  const pathSegments = pathname.split('/');
  const routeWithoutLocale = pathSegments.slice(2).join('/') || '';
  
  // Construct new URL with new language
  const newPath = `/${languageCode}${routeWithoutLocale ? `/${routeWithoutLocale}` : ''}`;
  
  console.log('🌍 Direct navigation from', pathname, 'to', newPath);
  
  // Navigate to new language URL
  router.push(newPath);
}; 