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
    console.log('Child received message:', event.data);
    
    if (event.data.type === 'editing-status-update') {
      console.log('Processing editing-status-update:', event.data.editing);
      handlers.onEditingStatusUpdate(event.data.editing);
      console.log('Called onEditingStatusUpdate handler');
    } else {
      console.log('Ignoring message with type:', event.data.type);
    }
  };

  console.log('Setting up editing message listener on child side');
  window.addEventListener('message', handleMessage);
  
  return () => {
    console.log('Cleaning up editing message listener on child side');
    window.removeEventListener('message', handleMessage);
  };
}; 