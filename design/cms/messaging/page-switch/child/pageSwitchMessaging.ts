export interface PageSwitchMessageHandlers {
  onPageSwitchUpdate: (pageSlug: string, locale: string) => void;
}

export const sendCurrentPageInfo = (pageSlug: string, locale: string) => {
  window.parent.postMessage({
    type: 'current-page-info',
    pageSlug,
    locale
  }, '*');
};

export const setupPageSwitchMessageListener = (handlers: PageSwitchMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'page-switch-update') {
      handlers.onPageSwitchUpdate(event.data.pageSlug, event.data.locale);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}; 