/* ==============================================
   src/design-system/components/patterns/dashboard/ThemeControls/ThemeControls.tsx
   PROPER VERSION - Expects external theme context
   ============================================== */

   'use client';

   import React, { useState } from 'react';
   import { Button } from '../../../primitives/Button';
   import { H4 } from '../../../primitives/Typography';
   import Icon from '../../../primitives/Icon';
   import { MoonIcon, SunIcon, PaletteIcon } from 'lucide-react';
   import { extractColorsFromImage, applyColorsWithThemeManager, ExtractedColors } from '../../../../utils/colorExtraction';
   
   // Define the interface that the consuming app's theme context must implement
   export interface ThemeControlsContextType {
     currentTheme: string;
     isDark: boolean;
     setTheme: (theme: string) => void;
     toggleDarkMode: () => void;
     setBrandColor: (color: string) => void;
     isHydrated?: boolean;
   }
   
   interface BrandColor {
     name: string;
     value: string;
     color: string;
   }
   
   interface ThemeControlsProps {
     themeContext: ThemeControlsContextType;  // Accept theme context as prop
     logoUrl?: string;  // Optional logo URL for brand color extraction
   }
   
   export function ThemeControls({ themeContext, logoUrl }: ThemeControlsProps) {
     const { currentTheme, isDark, setTheme, toggleDarkMode, setBrandColor } = themeContext;
     const [extractingColors, setExtractingColors] = useState(false);
   
     const brandColors: BrandColor[] = [
       { name: 'Purple', value: 'purple', color: '#A855F7' },
       { name: 'Blue', value: 'blue', color: '#3182CE' },
       { name: 'Teal', value: 'teal', color: '#319795' },
       { name: 'Pink', value: 'pink', color: '#D53F8C' },
       { name: 'Indigo', value: 'indigo', color: '#5A67D8' },
       { name: 'Cyan', value: 'cyan', color: '#00B5D8' },
     ];
   
     const getCurrentBrandColor = (): string => {
       for (const color of brandColors) {
         if (currentTheme.includes(color.value)) {
           return color.value;
         }
       }
       return 'purple'; // default
     };

     const handleExtractBrandColors = async () => {
       if (!logoUrl) return;
       
       setExtractingColors(true);
       try {
         const colors = await extractColorsFromImage(logoUrl);
         applyColorsWithThemeManager(colors);
         console.log('🎨 Brand colors extracted from logo:', colors);
       } catch (error) {
         console.error('Failed to extract colors from logo:', error);
       } finally {
         setExtractingColors(false);
       }
     };
   
     return (
       <div className="theme-controls">
         {/* Dark Mode Toggle */}
         <div className="theme-section">
           <H4>Appearance</H4>
           <Button
             variant="ghost"
             size="sm"
             onClick={toggleDarkMode}
             className="theme-toggle"
           >
             <Icon>
               {isDark ? <SunIcon /> : <MoonIcon />}
             </Icon>
             {isDark ? 'Light Mode' : 'Dark Mode'}
           </Button>
         </div>
   
         {/* Brand Color Picker */}
         <div className="theme-section">
           <H4>Brand Color</H4>
           <div className="color-options">
             {brandColors.map((color) => (
               <button
                 key={color.value}
                 className={`color-swatch ${
                   getCurrentBrandColor() === color.value ? 'active' : ''
                 }`}
                 style={{ backgroundColor: color.color }}
                 onClick={() => setBrandColor(color.value)}
                 title={color.name}
                 aria-label={`Switch to ${color.name} theme`}
               />
             ))}
           </div>
         </div>

         {/* Brand Colors from Logo */}
         {logoUrl && (
           <div className="theme-section">
             <H4>Brand Colors from Logo</H4>
             <Button
               variant="secondary"
               size="sm"
               onClick={handleExtractBrandColors}
               disabled={extractingColors}
               className="extract-colors-btn"
             >
               <Icon>
                 <PaletteIcon />
               </Icon>
               {extractingColors ? 'Extracting...' : 'Extract from Logo'}
             </Button>
             <p className="extract-colors-description">
               Extract brand colors from your uploaded logo and apply them to your theme.
             </p>
           </div>
         )}
   
         {/* Quick Theme Presets */}
         <div className="theme-section">
           <H4>Quick Themes</H4>
           <div className="theme-presets">
             <Button 
               size="sm" 
               variant={currentTheme === 'light' ? 'primary' : 'secondary'}
               onClick={() => setTheme('light')}
             >
               Light
             </Button>
             <Button 
               size="sm" 
               variant={currentTheme === 'dark' ? 'primary' : 'secondary'}
               onClick={() => setTheme('dark')}
             >
               Dark
             </Button>
             <Button 
               size="sm" 
               variant={currentTheme === 'blue' ? 'primary' : 'secondary'}
               onClick={() => setTheme('blue')}
             >
               Blue
             </Button>
             <Button 
               size="sm" 
               variant={currentTheme === 'dark-teal' ? 'primary' : 'secondary'}
               onClick={() => setTheme('dark-teal')}
             >
               Dark Teal
             </Button>
           </div>
         </div>
       </div>
     );
   }
   
   // Alternative version that uses a hook - for when the consuming app provides a hook
   interface ThemeControlsWithHookProps {
     useThemeHook: () => ThemeControlsContextType;
     logoUrl?: string;  // Optional logo URL for brand color extraction
   }
   
   export function ThemeControlsWithHook({ useThemeHook, logoUrl }: ThemeControlsWithHookProps) {
     const themeContext = useThemeHook();
     return <ThemeControls themeContext={themeContext} logoUrl={logoUrl} />;
   }