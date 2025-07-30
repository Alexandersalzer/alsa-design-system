export interface EditingMessageHandlers {
  onEditingStatusUpdate: (editing: boolean) => void;
}

export const requestEditingStatus = () => {
  window.parent.postMessage({
    type: 'request-editing-status'
    // No versionId needed - parent knows its own context
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

export const getVersionFromUrl = (): number | null => {
  const searchParams = new URLSearchParams(window.location.search);
  const versionParam = searchParams.get('version');
  
  return versionParam ? parseInt(versionParam, 10) : null;
}; 