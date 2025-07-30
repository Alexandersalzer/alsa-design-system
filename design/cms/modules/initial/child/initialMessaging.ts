export interface EditingMessageHandlers {
  onEditingStatusUpdate: (editing: boolean) => void;
}

export const requestEditingStatus = () => {
  window.parent.postMessage({
    type: 'request-editing-status'
  }, '*');
};

export const setupEditingMessageListener = (handlers: EditingMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    
    if (event.data.type === 'editing-status-update') {
      handlers.onEditingStatusUpdate(event.data.editing);
    } else {
      console.log('Ignoring message with type:', event.data.type);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => {
    window.removeEventListener('message', handleMessage);
  };
}; 