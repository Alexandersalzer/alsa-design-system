interface DimensionData {
  width: string;
  height: string;
  borderRadius: string;
  position: {
    top: number;
    left: number;
    right: number;
    bottom: number;
  };
}

/**
 * Sends dimension data to parent window
 */
const sendDimensionsToParent = (type: 'container-dimensions' | 'section-dimensions', dimensions: DimensionData) => {
  window.parent.postMessage({
    type,
    dimensions
  }, '*');
};

/**
 * Gets element dimensions and position
 */
const getElementDimensions = (element: Element): DimensionData | null => {
  const rect = element.getBoundingClientRect();
  const width = element.getAttribute('data-container-width') || element.getAttribute('data-section-width');
  const height = element.getAttribute('data-container-height') || element.getAttribute('data-section-height');
  const borderRadius = element.getAttribute('data-container-border-radius') || element.getAttribute('data-section-border-radius');

  if (!width || !height || !borderRadius) {
    return null;
  }

  return {
    width,
    height,
    borderRadius,
    position: {
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom
    }
  };
};

/**
 * Sends container dimensions to parent window
 */
export const sendContainerDimensions = (containerName: string) => {
  const containerElement = document.querySelector(`[data-container-name="${containerName}"]`);
  if (!containerElement) return;

  const dimensions = getElementDimensions(containerElement);
  if (dimensions) {
    sendDimensionsToParent('container-dimensions', dimensions);
  }
};

/**
 * Sends section dimensions to parent window
 */
export const sendSectionDimensions = (sectionName: string) => {
  const sectionElement = document.querySelector(`[data-section-name="${sectionName}"]`);
  if (!sectionElement) return;

  const dimensions = getElementDimensions(sectionElement);
  if (dimensions) {
    // For sections, we need to use actual computed dimensions for width/height
    const rect = sectionElement.getBoundingClientRect();
    const borderRadius = sectionElement.getAttribute('data-section-border-radius');
    
    if (borderRadius) {
      sendDimensionsToParent('section-dimensions', {
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        borderRadius,
        position: {
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom
        }
      });
    }
  }
};

/**
 * Sends both container and section dimensions
 */
export const sendBothDimensions = (containerName: string, sectionName: string) => {
  sendContainerDimensions(containerName);
  sendSectionDimensions(sectionName);
};

/**
 * Sets up dimension messaging with automatic updates on resize
 */
export const setupDimensionMessaging = (
  containerName: string, 
  sectionName: string
) => {
  const sendDimensions = () => {
    sendBothDimensions(containerName, sectionName);
  };

  // Send dimensions initially with a small delay to ensure DOM is ready
  const timeout = setTimeout(sendDimensions, 100);

  // Send dimensions on window resize
  window.addEventListener('resize', sendDimensions);

  // Cleanup function
  return () => {
    clearTimeout(timeout);
    window.removeEventListener('resize', sendDimensions);
  };
};

/**
 * Message handler for dimension requests from parent
 */
export const handleDimensionRequest = (containerName: string, sectionName: string) => {
  return (event: MessageEvent) => {
    if (event.data.type === 'request-dimensions') {
      sendBothDimensions(containerName, sectionName);
    }
  };
}; 