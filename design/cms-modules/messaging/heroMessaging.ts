import { type WebsiteContent } from '@/design/cms-modules/types/content';

export interface HeroMessageHandlers {
  onContentUpdate: (content: WebsiteContent) => void;
  onCssUpdate: (css: string) => void;
  onHeroCssResponse: (css: string, radiusCss?: string) => void;
  onEditingStatusUpdate: (editing: boolean) => void;
  onRadiusUpdate: (css: string) => void;
  onTextAlignUpdate: (css: string) => void;
  onFontUpdate: (fontFamily: string, fontUrl?: string) => void;
}

export const requestHeroCss = (versionId: number) => {
  window.parent.postMessage({
    type: 'request-hero-css',
    versionId: versionId
  }, '*');
};

export const requestEditingStatus = (versionId: number) => {
  window.parent.postMessage({
    type: 'request-editing-status',
    versionId: versionId
  }, '*');
};

export const setupHeroMessageListener = (handlers: HeroMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === 'content-update') {
      handlers.onContentUpdate(event.data.content);
    }
    
    if (event.data.type === 'css-update') {
      handlers.onCssUpdate(event.data.css);
    }
    
    if (event.data.type === 'hero-css-response') {
      handlers.onHeroCssResponse(event.data.css, event.data.radiusCss);
    }
    
    if (event.data.type === 'editing-status-update') {
      handlers.onEditingStatusUpdate(event.data.editing);
    }
    
    if (event.data.type === 'radius-update') {
      handlers.onRadiusUpdate(event.data.css);
    }
    
    if (event.data.type === 'text-align-update') {
      handlers.onTextAlignUpdate(event.data.css);
    }
    
    if (event.data.type === 'font-update') {
      handlers.onFontUpdate(event.data.fontFamily, event.data.fontUrl);
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

// Utility functions for CSS parsing
export const extractBorderRadius = (css: string): string => {
  const match = css.match(/\.hero-container\s*\{[^}]*border-radius:\s*([^;]+);/);
  return match ? match[1].trim() : '1rem';
};

export const extractTextAlign = (css: string): string => {
  const match = css.match(/\.hero-container\s*\{[^}]*text-align:\s*([^;]+);/);
  return match ? match[1].trim() : 'center';
};

// Dynamic CSS management
export const applyDynamicCss = (cssId: string, css: string, editing: boolean) => {
  if (editing && css) {
    let styleElement = document.getElementById(cssId);
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = cssId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  } else {
    const styleElement = document.getElementById(cssId);
    if (styleElement) {
      styleElement.remove();
    }
  }
};

// Font loading utility
export const loadGoogleFont = (fontUrl: string, fontFamily: string, callback: (fontFamily: string) => void) => {
  const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
  if (!existingLink) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontUrl;
    link.onload = () => {
      callback(fontFamily);
    };
    document.head.appendChild(link);
  } else {
    callback(fontFamily);
  }
}; 