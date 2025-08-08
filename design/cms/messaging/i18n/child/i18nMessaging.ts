export interface I18nMessageHandlers {
  onLocaleChange: (locale: string) => void;
  onLocaleSync: (locale: string) => void;
}

// Request current locale from parent
export const requestCurrentLocale = () => {
  console.log('🌐 Child requesting current locale from parent');
  window.parent.postMessage({
    type: 'request-current-locale'
  }, '*');
};

// Setup message listener for i18n messages
export const setupI18nMessageListener = (handlers: I18nMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    console.log('🌐 Child received message:', event.data);
    
    // Handle locale change command from parent
    if (event.data.type === 'locale-change') {
      console.log('🌐 Child handling locale change:', event.data.locale);
      handlers.onLocaleChange(event.data.locale);
    }
    
    // Handle locale sync from parent (for initial synchronization)
    if (event.data.type === 'locale-sync') {
      console.log('🌐 Child handling locale sync:', event.data.locale);
      handlers.onLocaleSync(event.data.locale);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
};

// Utility function to setup basic locale synchronization
export const setupBasicLocaleSynchronization = (
  onLocaleChange: (locale: string) => void
) => {
  return setupI18nMessageListener({
    onLocaleChange,
    onLocaleSync: onLocaleChange // Use same handler for both change and sync
  });
}; 