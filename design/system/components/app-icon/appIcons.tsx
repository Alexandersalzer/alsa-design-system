// ===============================================
// App Icon SVG Components
// Abstrakta SVG-motiv för varje app (iOS/macOS-stil)
// INTE emojis eller generiska icon-fonts
// ===============================================

import React from 'react';

export interface AppIconSVGProps {
  className?: string;
  size?: number;
}

// Bokningssystem - Abstrakt kalender/tidsblock-mönster
export const BookingsIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Bakgrund - subtil gradient */}
    <rect width="64" height="64" rx="14" fill="url(#bookings-bg)" />
    <defs>
      <linearGradient id="bookings-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt kalender-grid */}
    <g opacity="0.9">
      {/* Tidsblock - vertikala staplar */}
      <rect x="12" y="16" width="8" height="32" rx="2" fill="var(--accent-500, #3b82f6)" />
      <rect x="24" y="20" width="8" height="28" rx="2" fill="var(--accent-500, #3b82f6)" />
      <rect x="36" y="14" width="8" height="34" rx="2" fill="var(--accent-500, #3b82f6)" />
      <rect x="48" y="22" width="8" height="26" rx="2" fill="var(--accent-500, #3b82f6)" />
      
      {/* Tidslinje - horisontell accent */}
      <line x1="8" y1="12" x2="56" y2="12" stroke="var(--accent-600, #2563eb)" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// Analytics - Abstrakt diagram/våg-mönster
export const AnalyticsIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#analytics-bg)" />
    <defs>
      <linearGradient id="analytics-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt linjediagram */}
    <g opacity="0.9">
      <path
        d="M 12 48 L 20 40 L 28 32 L 36 24 L 44 28 L 52 20"
        stroke="var(--accent-500, #3b82f6)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M 12 48 L 20 40 L 28 32 L 36 24 L 44 28 L 52 20 L 52 48 L 12 48"
        fill="var(--accent-500, #3b82f6)"
        fillOpacity="0.2"
      />
      
      {/* Data-punkter */}
      <circle cx="20" cy="40" r="2.5" fill="var(--accent-600, #2563eb)" />
      <circle cx="28" cy="32" r="2.5" fill="var(--accent-600, #2563eb)" />
      <circle cx="36" cy="24" r="2.5" fill="var(--accent-600, #2563eb)" />
      <circle cx="44" cy="28" r="2.5" fill="var(--accent-600, #2563eb)" />
      <circle cx="52" cy="20" r="2.5" fill="var(--accent-600, #2563eb)" />
    </g>
  </svg>
);

// E-commerce - Abstrakt shopping/korg-mönster
export const EcommerceIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#ecommerce-bg)" />
    <defs>
      <linearGradient id="ecommerce-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt shopping-korg */}
    <g opacity="0.9">
      {/* Korg-form */}
      <path
        d="M 18 24 L 18 50 L 46 50 L 46 24 L 20 24"
        stroke="var(--accent-500, #3b82f6)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Handtag */}
      <path
        d="M 20 24 Q 20 18 26 18 Q 32 18 32 24"
        stroke="var(--accent-500, #3b82f6)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Produkter i korgen - abstrakta former */}
      <circle cx="26" cy="36" r="4" fill="var(--accent-500, #3b82f6)" opacity="0.6" />
      <rect x="32" y="32" width="8" height="8" rx="1" fill="var(--accent-500, #3b82f6)" opacity="0.6" />
      <circle cx="40" cy="42" r="3" fill="var(--accent-500, #3b82f6)" opacity="0.6" />
    </g>
  </svg>
);

// Email Marketing - Abstrakt flöde/linjer (inte kuvert)
export const EmailMarketingIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#email-bg)" />
    <defs>
      <linearGradient id="email-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt flöde - linjer som representerar kommunikation */}
    <g opacity="0.9">
      {/* Utgående meddelanden */}
      <path
        d="M 16 20 L 32 32 L 48 20"
        stroke="var(--accent-500, #3b82f6)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 16 28 L 32 40 L 48 28"
        stroke="var(--accent-500, #3b82f6)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 16 36 L 32 48 L 48 36"
        stroke="var(--accent-500, #3b82f6)"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      
      {/* Nod-punkter */}
      <circle cx="32" cy="32" r="3" fill="var(--accent-600, #2563eb)" />
      <circle cx="16" cy="28" r="2" fill="var(--accent-500, #3b82f6)" />
      <circle cx="48" cy="28" r="2" fill="var(--accent-500, #3b82f6)" />
    </g>
  </svg>
);

// CRM - Abstrakt nätverk/noder
export const CRMIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#crm-bg)" />
    <defs>
      <linearGradient id="crm-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt nätverk - noder och kopplingar */}
    <g opacity="0.9">
      {/* Noder */}
      <circle cx="32" cy="24" r="5" fill="var(--accent-500, #3b82f6)" />
      <circle cx="20" cy="40" r="4" fill="var(--accent-500, #3b82f6)" />
      <circle cx="44" cy="40" r="4" fill="var(--accent-500, #3b82f6)" />
      <circle cx="32" cy="48" r="3" fill="var(--accent-500, #3b82f6)" />
      
      {/* Kopplingar */}
      <line x1="32" y1="24" x2="20" y2="40" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" />
      <line x1="32" y1="24" x2="44" y2="40" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" />
      <line x1="20" y1="40" x2="32" y2="48" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" />
      <line x1="44" y1="40" x2="32" y2="48" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" />
    </g>
  </svg>
);

// Invoicing - Abstrakt dokument/linjer
export const InvoicingIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#invoicing-bg)" />
    <defs>
      <linearGradient id="invoicing-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt dokument med linjer */}
    <g opacity="0.9">
      {/* Dokument-form */}
      <rect x="18" y="16" width="28" height="36" rx="2" fill="var(--accent-500, #3b82f6)" fillOpacity="0.15" stroke="var(--accent-500, #3b82f6)" strokeWidth="2.5" />
      
      {/* Text-linjer (abstrakta) */}
      <line x1="24" y1="26" x2="40" y2="26" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="32" x2="36" y2="32" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="38" x2="40" y2="38" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="44" x2="32" y2="44" stroke="var(--accent-500, #3b82f6)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Checkmark/stämpel */}
      <path d="M 38 40 L 42 44 L 46 38" stroke="var(--accent-600, #2563eb)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </g>
  </svg>
);

// Automation - Abstrakt kugghjul/flöde
export const AutomationIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#automation-bg)" />
    <defs>
      <linearGradient id="automation-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt kugghjul/flöde */}
    <g opacity="0.9">
      {/* Kugghjul */}
      <circle cx="32" cy="32" r="12" fill="none" stroke="var(--accent-500, #3b82f6)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="6" fill="var(--accent-500, #3b82f6)" />
      
      {/* Kuggar */}
      <rect x="30" y="18" width="4" height="6" rx="1" fill="var(--accent-500, #3b82f6)" />
      <rect x="30" y="40" width="4" height="6" rx="1" fill="var(--accent-500, #3b82f6)" />
      <rect x="18" y="30" width="6" height="4" rx="1" fill="var(--accent-500, #3b82f6)" />
      <rect x="40" y="30" width="6" height="4" rx="1" fill="var(--accent-500, #3b82f6)" />
      
      {/* Pilar - flöde */}
      <path d="M 48 24 L 44 20" stroke="var(--accent-600, #2563eb)" strokeWidth="2" strokeLinecap="round" />
      <path d="M 16 24 L 20 20" stroke="var(--accent-600, #2563eb)" strokeWidth="2" strokeLinecap="round" />
    </g>
  </svg>
);

// Contact/Lead Capture - Abstrakt form/nätverk
export const ContactIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#contact-bg)" />
    <defs>
      <linearGradient id="contact-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Abstrakt form/kontakt */}
    <g opacity="0.9">
      {/* Form-fält */}
      <rect x="18" y="20" width="28" height="6" rx="1" fill="var(--accent-500, #3b82f6)" fillOpacity="0.3" />
      <rect x="18" y="30" width="28" height="6" rx="1" fill="var(--accent-500, #3b82f6)" fillOpacity="0.3" />
      <rect x="18" y="40" width="20" height="6" rx="1" fill="var(--accent-500, #3b82f6)" fillOpacity="0.3" />
      
      {/* Submit-pil */}
      <path d="M 42 40 L 48 36 L 42 32" stroke="var(--accent-600, #2563eb)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Lead-punkt */}
      <circle cx="50" cy="36" r="4" fill="var(--accent-600, #2563eb)" />
    </g>
  </svg>
);

// Default/Placeholder - Neutral abstrakt form
export const DefaultAppIcon: React.FC<AppIconSVGProps> = ({ className, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="64" height="64" rx="14" fill="url(#default-bg)" />
    <defs>
      <linearGradient id="default-bg" x1="0" y1="0" x2="64" y2="64">
        <stop offset="0%" stopColor="var(--accent-500, #3b82f6)" stopOpacity="0.1" />
        <stop offset="100%" stopColor="var(--accent-600, #2563eb)" stopOpacity="0.15" />
      </linearGradient>
    </defs>
    
    {/* Neutral abstrakt form */}
    <g opacity="0.9">
      <circle cx="32" cy="32" r="12" fill="none" stroke="var(--accent-500, #3b82f6)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="6" fill="var(--accent-500, #3b82f6)" />
    </g>
  </svg>
);

// Icon mapping function
export const getAppIcon = (appKey: string): React.FC<AppIconSVGProps> => {
  const iconMap: Record<string, React.FC<AppIconSVGProps>> = {
    'bookings': BookingsIcon,
    'analytics': AnalyticsIcon,
    'ecommerce': EcommerceIcon,
    'email-marketing': EmailMarketingIcon,
    'crm': CRMIcon,
    'invoicing': InvoicingIcon,
    'automation': AutomationIcon,
    'contact': ContactIcon,
  };
  
  return iconMap[appKey] || DefaultAppIcon;
};

