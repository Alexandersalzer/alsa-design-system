'use client';

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import {
  GB, SE, DE, DK, US, NO, FI, FR, ES, IT, NL, BE, AT, CH, PL,
  CZ, RO, GR, PT, IE, HR, LT, LV, EE, SK, SI, BG, HU, LU, MT, CY
} from 'country-flag-icons/react/3x2';

export interface FlagProps extends React.HTMLAttributes<HTMLDivElement> {
  country: string; // Can be emoji (🇩🇪), country code (de), or country name (germany)
  size?: 'sm' | 'md' | 'lg';
  variant?: 'rounded' | 'circle' | 'square';
}

// Emoji to country code mapping
const EMOJI_TO_CODE: Record<string, string> = {
  '🇸🇪': 'se', '🇳🇴': 'no', '🇩🇰': 'dk', '🇫🇮': 'fi',
  '🇩🇪': 'de', '🇬🇧': 'gb', '🇺🇸': 'us', '🇫🇷': 'fr',
  '🇪🇸': 'es', '🇮🇹': 'it', '🇳🇱': 'nl', '🇧🇪': 'be',
  '🇦🇹': 'at', '🇨🇭': 'ch', '🇵🇱': 'pl', '🇨🇿': 'cz',
  '🇷🇴': 'ro', '🇬🇷': 'gr', '🇵🇹': 'pt', '🇮🇪': 'ie',
  '🇭🇷': 'hr', '🇱🇹': 'lt', '🇱🇻': 'lv', '🇪🇪': 'ee',
  '🇸🇰': 'sk', '🇸🇮': 'si', '🇧🇬': 'bg', '🇭🇺': 'hu',
  '🇱🇺': 'lu', '🇲🇹': 'mt', '🇨🇾': 'cy',
};

// Country code to SVG flag component mapping
const FLAG_COMPONENTS: Record<string, any> = {
  // Nordic countries
  'se': SE, 'sweden': SE, 'sv': SE,
  'no': NO, 'norway': NO,
  'dk': DK, 'denmark': DK, 'da': DK,
  'fi': FI, 'finland': FI,

  // Major European countries
  'de': DE, 'germany': DE, 'german': DE,
  'gb': GB, 'uk': GB, 'united-kingdom': GB, 'england': GB, 'en': GB,
  'us': US, 'usa': US, 'america': US, 'united-states': US,
  'fr': FR, 'france': FR, 'french': FR,
  'es': ES, 'spain': ES, 'spanish': ES,
  'it': IT, 'italy': IT, 'italian': IT,
  'nl': NL, 'netherlands': NL, 'dutch': NL,
  'be': BE, 'belgium': BE,
  'at': AT, 'austria': AT,
  'ch': CH, 'switzerland': CH,
  'pl': PL, 'poland': PL, 'polish': PL,

  // Other European countries
  'cz': CZ, 'czech': CZ, 'czech-republic': CZ,
  'ro': RO, 'romania': RO, 'romanian': RO,
  'gr': GR, 'greece': GR, 'greek': GR,
  'pt': PT, 'portugal': PT, 'portuguese': PT,
  'ie': IE, 'ireland': IE, 'irish': IE,
  'hr': HR, 'croatia': HR, 'croatian': HR,
  'lt': LT, 'lithuania': LT, 'lithuanian': LT,
  'lv': LV, 'latvia': LV, 'latvian': LV,
  'ee': EE, 'estonia': EE, 'estonian': EE,
  'sk': SK, 'slovakia': SK, 'slovak': SK,
  'si': SI, 'slovenia': SI, 'slovenian': SI,
  'bg': BG, 'bulgaria': BG, 'bulgarian': BG,
  'hu': HU, 'hungary': HU, 'hungarian': HU,
  'lu': LU, 'luxembourg': LU,
  'mt': MT, 'malta': MT, 'maltese': MT,
  'cy': CY, 'cyprus': CY,
};

export const Flag = forwardRef<HTMLDivElement, FlagProps>(
  ({
    country,
    size = 'md',
    variant = 'rounded',
    className,
    style,
    ...props
  }, ref) => {

    // Convert emoji to country code if needed
    const normalizedCountry = EMOJI_TO_CODE[country] || country.toLowerCase();
    const FlagComponent = FLAG_COMPONENTS[normalizedCountry];

    if (!FlagComponent) {
      console.warn(`Flag component not found for country: ${country}`);
      return null;
    }

    const sizeMap = {
      sm: '24px',
      md: '32px',
      lg: '48px',
    };

    const flagWidth = sizeMap[size];

    return (
      <div
        ref={ref}
        className={cn(
          'flag',
          `flag--${size}`,
          `flag--${variant}`,
          className
        )}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: flagWidth,
          ...(variant === 'rounded' && {
            padding: 'var(--space-2xs)',
            backgroundColor: 'var(--surface-base)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }),
          ...(variant === 'circle' && {
            padding: 'var(--space-2xs)',
            backgroundColor: 'var(--surface-base)',
            borderRadius: '50%',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }),
          ...(variant === 'square' && {
            padding: 'var(--space-2xs)',
            backgroundColor: 'var(--surface-base)',
            borderRadius: 'var(--radius-xs)',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }),
          ...style,
        }}
        aria-label={`${country.toUpperCase()} flag`}
        {...props}
      >
        <FlagComponent style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>
    );
  }
);

Flag.displayName = 'Flag';
