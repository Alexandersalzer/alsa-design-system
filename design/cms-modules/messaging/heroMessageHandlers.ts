import { type WebsiteContent, type Template } from '../../cms-modules/types/content';
import { 
  extractBorderRadius, 
  extractTextAlign, 
  loadGoogleFont,
  type HeroMessageHandlers 
} from '../../cms-modules/messaging/heroMessaging';

interface HeroMessageHandlerParams {
  setBackgroundImage: (image: string | null) => void;
  setHeroCss: (css: string) => void;
  setRadiusCss: (css: string) => void;
  setEditing: (editing: boolean) => void;
  setCurrentBorderRadius: (radius: string) => void;
  setCurrentTextAlign: (align: string) => void;
  setCurrentFontFamily: (font: string) => void;
}

export const createHeroMessageHandlers = (params: HeroMessageHandlerParams): HeroMessageHandlers => {
  const {
    setBackgroundImage,
    setHeroCss,
    setRadiusCss,
    setEditing,
    setCurrentBorderRadius,
    setCurrentTextAlign,
    setCurrentFontFamily
  } = params;

  return {
    onContentUpdate: (content: WebsiteContent) => {
      let page;
      if (Array.isArray(content.pages)) {
        page = content.pages[0]; // Get first page if it's an array
      } else {
        page = content.pages[Object.keys(content.pages)[0]]; // Get first page if it's an object
      }
      
      if (page) {
        // Look for hero template in the page templates
        let heroTemplate;
        if (Array.isArray(page.templates)) {
          heroTemplate = page.templates.find((template: Template) => template.type === 'hero');
        }
        
        if (heroTemplate && heroTemplate.image_url) {
          setBackgroundImage(heroTemplate.image_url);
        }
      }
    },

    onCssUpdate: (css: string) => {
      setHeroCss(css);
      const newTextAlign = extractTextAlign(css);
      setCurrentTextAlign(newTextAlign);
    },

    onHeroCssResponse: (css: string, radiusCss?: string) => {
      setHeroCss(css);
      setRadiusCss(radiusCss || '');
      if (radiusCss) {
        const initialRadius = extractBorderRadius(radiusCss);
        setCurrentBorderRadius(initialRadius);
      }
      if (css) {
        const initialTextAlign = extractTextAlign(css);
        setCurrentTextAlign(initialTextAlign);
      }
    },

    onEditingStatusUpdate: (editing: boolean) => {
      setEditing(editing);
    },

    onRadiusUpdate: (css: string) => {
      setRadiusCss(css);
      const newRadius = extractBorderRadius(css);
      setCurrentBorderRadius(newRadius);
    },

    onTextAlignUpdate: (css: string) => {
      setHeroCss(css);
      const newTextAlign = extractTextAlign(css);
      setCurrentTextAlign(newTextAlign);
    },

    onFontUpdate: (fontFamily: string, fontUrl?: string) => {
      if (fontUrl) {
        loadGoogleFont(fontUrl, fontFamily, setCurrentFontFamily);
      } else {
        setCurrentFontFamily(fontFamily);
      }
    }
  };
}; 