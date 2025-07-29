export interface EditingMessageHandlers {
  onEditingStatusUpdate: (editing: boolean) => void;
}

export const requestEditingStatus = (versionId?: number) => {
  window.parent.postMessage({
    type: 'request-editing-status',
    versionId: versionId || 12 // Use dummy value since parent ignores it anyway
  }, '*');
};

export const setupEditingMessageListener = (handlers: EditingMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'editing-status-update') {
      handlers.onEditingStatusUpdate(event.data.editing);
    }
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
};

export const getVersionFromUrl = (): number | null => {
  const searchParams = new URLSearchParams(window.location.search);
  const versionParam = searchParams.get('version');
  
  return versionParam ? parseInt(versionParam, 10) : null;
}; 