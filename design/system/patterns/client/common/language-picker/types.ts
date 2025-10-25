import { type SupportedLocale } from '../../../../utils/locale';

export interface LanguagePickerProps {
  // Styling props
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact';
  placeholder?: string;
  className?: string;
  
  // Language options (optional override)
  languageOptions?: Array<{
    value: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  
  // PostMessage sync (för editing mode)
  isEditingMode?: boolean;
  enablePostMessageSync?: boolean; // Explicit opt-in
  
  // Callbacks
  onLanguageChange?: (languageCode: string) => void; // Extra callback
  
  // Controlled mode (optional)
  value?: string;
  onChange?: (value: string | null) => void;
}

export interface LanguagePickerState {
  selectedLanguage: SupportedLocale;
} 