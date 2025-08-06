import React from 'react';

export interface DesignTokenMessageHandlers {
  onAccentColorUpdate: (color: string) => void;
  onRadiusUpdate: (size: string) => void;
  onThemeUpdate: (isDark: boolean) => void;
  onFontUpdate: (fontName: string, fontUrl: string) => void;
}

interface DesignTokenMessageHandlerParams {
  setAccentColor: (color: string) => void;
  setRadius?: (size: string) => void;
  setIsDark?: (isDark: boolean) => void;
  setFontName?: (fontName: string) => void;
}

export const createDesignTokenMessageHandlers = (params: DesignTokenMessageHandlerParams): DesignTokenMessageHandlers => {
  const { setAccentColor, setRadius, setIsDark, setFontName } = params;

  return {
    onAccentColorUpdate: (color: string) => {
      // Update CSS custom property for accent color
      const root = document.documentElement;
      root.style.setProperty('--accent-color', color);
      
      // Call the state setter if provided
      setAccentColor(color);
      
    },

    onRadiusUpdate: (size: string) => {
      // Update all radius scale CSS custom properties to use the selected scale
      const root = document.documentElement;
      
      // Update all selected radius scale variables to use the chosen scale
      root.style.setProperty('--selected-radius-scale-none', `var(--foundation-radius-${size}-none)`);
      root.style.setProperty('--selected-radius-scale-xs', `var(--foundation-radius-${size}-xs)`);
      root.style.setProperty('--selected-radius-scale-sm', `var(--foundation-radius-${size}-sm)`);
      root.style.setProperty('--selected-radius-scale-md', `var(--foundation-radius-${size}-md)`);
      root.style.setProperty('--selected-radius-scale-lg', `var(--foundation-radius-${size}-lg)`);
      root.style.setProperty('--selected-radius-scale-xl', `var(--foundation-radius-${size}-xl)`);
      root.style.setProperty('--selected-radius-scale-2xl', `var(--foundation-radius-${size}-2xl)`);
      root.style.setProperty('--selected-radius-scale-full', `var(--foundation-radius-${size}-full)`);
      
      // Call the state setter if provided
      if (setRadius) {
        setRadius(size);
      }
      
    },

    onThemeUpdate: (isDark: boolean) => {
      // Update CSS custom property for theme control
      const root = document.documentElement;
      root.style.setProperty('--is-dark', isDark ? '1' : '0');
      
      // Call the state setter if provided
      if (setIsDark) {
        setIsDark(isDark);
      }
      
    },

    onFontUpdate: (fontName: string, fontUrl: string) => {
      // Update the design-tokens.css file dynamically
      updateDesignTokensFont(fontName, fontUrl);
      
      // Call the state setter if provided
      if (setFontName) {
        setFontName(fontName);
      }
      
    }
  };
};

// Function to update the design-tokens.css file with new font
const updateDesignTokensFont = (fontName: string, fontUrl: string) => {
  // Find the design-tokens.css link element
  const designTokensLink = document.querySelector('link[href="/design/design-tokens.css"]') as HTMLLinkElement;
  
  if (designTokensLink) {
    // Create a new CSS content with updated font
    const newCssContent = `@import url('${fontUrl}'); 

:root {
  /* Main accent color - change this to update the entire color scheme */
  --accent-color: #2c3a3f;

  /* Theme control variable - 0 for light, 1 for dark */
  --is-dark: 0;

  /* Font configuration */
  --font-primary-name: '${fontName}';

  --selected-radius-scale-none: var(--foundation-radius-2xl-none);
  --selected-radius-scale-xs: var(--foundation-radius-2xl-xs);
  --selected-radius-scale-sm: var(--foundation-radius-2xl-sm);
  --selected-radius-scale-md: var(--foundation-radius-2xl-md);
  --selected-radius-scale-lg: var(--foundation-radius-2xl-lg);
  --selected-radius-scale-xl: var(--foundation-radius-2xl-xl);
  --selected-radius-scale-2xl: var(--foundation-radius-2xl-2xl);
  --selected-radius-scale-full: var(--foundation-radius-2xl-full);
}`;

    // Create a new blob with the updated CSS
    const blob = new Blob([newCssContent], { type: 'text/css' });
    const newUrl = URL.createObjectURL(blob);
    
    // Update the href to use the new CSS
    designTokensLink.href = newUrl;
    
    // Also update the CSS custom property directly for immediate effect
    const root = document.documentElement;
    root.style.setProperty('--font-primary-name', `'${fontName}'`);
    
  } else {
    // Fallback: just update the CSS custom property
    const root = document.documentElement;
    root.style.setProperty('--font-primary-name', `'${fontName}'`);
  }
};

// Helper function to handle design token messages
export const handleDesignTokenMessage = (
  event: MessageEvent,
  handlers: DesignTokenMessageHandlers
) => {
  const { type, color, size, isDark, fontFamily, fontUrl } = event.data;

  switch (type) {
    case 'accent-color-update':
      if (color && handlers.onAccentColorUpdate) {
        handlers.onAccentColorUpdate(color);
      }
      break;
    case 'radius-update':
      if (size && handlers.onRadiusUpdate) {
        handlers.onRadiusUpdate(size);
      }
      break;
    case 'theme-update':
      if (isDark !== undefined && handlers.onThemeUpdate) {
        handlers.onThemeUpdate(isDark);
      }
      break;
    case 'font-update':
      if (fontFamily && fontUrl && handlers.onFontUpdate) {
        // Extract font name from fontFamily string (e.g., "Outfit, sans-serif" -> "Outfit")
        const fontName = fontFamily.split(',')[0].trim();
        handlers.onFontUpdate(fontName, fontUrl);
      }
      break;
    default:
      // Not a design token message, ignore
      break;
  }
};

// Setup design token message listener (separate from content messaging)
export const setupDesignTokenMessageListener = (handlers: DesignTokenMessageHandlers) => {
  const handleMessage = (event: MessageEvent) => {
    handleDesignTokenMessage(event, handlers);
  };

  window.addEventListener('message', handleMessage);
  
  return () => window.removeEventListener('message', handleMessage);
}; 