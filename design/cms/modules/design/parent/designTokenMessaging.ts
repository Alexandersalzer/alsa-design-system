import React from 'react';

// Type definitions for parent design token messaging
export interface DesignTokenParentConfig {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  availableFonts?: Array<{id: number, name: string, url: string}>;
}

export class DesignTokenParentHandler {
  private config: DesignTokenParentConfig;

  constructor(config: DesignTokenParentConfig) {
    this.config = config;
  }

  // Send accent color update to iframe for real-time preview
  sendAccentColorUpdate = (color: string) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'accent-color-update',
        color: color
      }, '*');
    }
  };

  // Send radius update to iframe for real-time preview
  sendRadiusUpdate = (size: string) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'radius-update',
        size: size
      }, '*');
    }
  };

  // Send theme update to iframe for real-time preview
  sendThemeUpdate = (isDark: boolean) => {
    if (this.config.iframeRef.current) {
      this.config.iframeRef.current.contentWindow?.postMessage({
        type: 'theme-update',
        isDark: isDark
      }, '*');
    }
  };

  // Send font update to iframe with both family and URL
  sendFontUpdate = (fontFamily: string) => {
    // Find the selected font from available fonts to get the URL
    const selectedFont = this.config.availableFonts?.find(font => 
      fontFamily.includes(font.name) || font.name.toLowerCase() === fontFamily.toLowerCase()
    );
    
    if (selectedFont) {
      if (this.config.iframeRef.current) {
        this.config.iframeRef.current.contentWindow?.postMessage({
          type: 'font-update',
          fontFamily: `${selectedFont.name}, sans-serif`,
          fontUrl: selectedFont.url
        }, '*');
      }
    } else {
      console.warn('Font not found in available fonts:', fontFamily);
    }
  };

  // Update config
  updateConfig = (newConfig: Partial<DesignTokenParentConfig>) => {
    this.config = { ...this.config, ...newConfig };
  };
}

// Utility functions for design token messaging

// Send accent color update (utility function)
export const sendAccentColorUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  color: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'accent-color-update',
      color: color
    }, '*');
  }
};

// Send radius update (utility function)
export const sendRadiusUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  size: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'radius-update',
      size: size
    }, '*');
  }
};

// Send theme update (utility function)
export const sendThemeUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  isDark: boolean
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'theme-update',
      isDark: isDark
    }, '*');
  }
};

// Send font update (utility function)
export const sendFontUpdate = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  fontFamily: string,
  fontUrl: string
) => {
  if (iframeRef.current?.contentWindow) {
    iframeRef.current.contentWindow.postMessage({
      type: 'font-update',
      fontFamily: fontFamily,
      fontUrl: fontUrl
    }, '*');
  }
};

// Send font update with font lookup (utility function)
export const sendFontUpdateWithLookup = (
  iframeRef: React.RefObject<HTMLIFrameElement | null>,
  fontFamily: string,
  availableFonts: Array<{id: number, name: string, url: string}>
) => {
  // Find the selected font from available fonts to get the URL
  const selectedFont = availableFonts.find(font => 
    fontFamily.includes(font.name) || font.name.toLowerCase() === fontFamily.toLowerCase()
  );
  
  if (selectedFont) {
    sendFontUpdate(iframeRef, `${selectedFont.name}, sans-serif`, selectedFont.url);
  } else {
    console.warn('Font not found in available fonts:', fontFamily);
  }
}; 