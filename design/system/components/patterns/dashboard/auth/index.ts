// ===============================================
// src/design-system/components/patterns/auth/index.ts
// AUTH PATTERN EXPORTS
// ===============================================

// AuthCard component and sub-components
export { 
  AuthCard, 
  AuthCardHeader, 
  AuthCardBody, 
  AuthCardFooter 
} from './AuthCard';

export type { 
  AuthCardProps, 
  AuthCardHeaderProps, 
  AuthCardBodyProps, 
  AuthCardFooterProps 
} from './AuthCard';

// AuthForm component and sub-components
export {
  AuthForm,
  AuthFormActions,
  AuthFormFields,
  AuthFormFooter,
  AuthSubmitButton
} from './AuthForm';

export type {
  AuthFormProps,
  AuthFormActionsProps,
  AuthFormFieldsProps,
  AuthFormFooterProps,
  AuthSubmitButtonProps
} from './AuthForm';

// AuthField component and specialized fields
export {
  AuthField,
  EmailField,
  PasswordField,
  UsernameField
} from './AuthField';

export type {
  AuthFieldProps,
  EmailFieldProps,
  PasswordFieldProps,
  UsernameFieldProps
} from './AuthField';

// In /src/design-system/components/patterns/auth/index.ts
export { AuthContainer } from './AuthContainer';
export type { AuthContainerProps } from './AuthContainer';