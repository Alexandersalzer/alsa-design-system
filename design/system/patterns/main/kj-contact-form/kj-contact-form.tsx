// ===============================================
// blimpify-ui/design/system/patterns/main/_kj-contact-form/_kj-contact-form.tsx
// KJ CONTACT FORM - Custom contact form for KJ's portfolio
// ===============================================

import React from 'react';
import { VStack, HStack } from '../../../components/layout';
import { Button } from '../../../components';
import { Input } from '../../../components';
import { Icon } from '../../../components';
import { 
  EnvelopeIcon, 
  ArrowRightIcon,
  UserIcon,
  BuildingOfficeIcon 
} from '@heroicons/react/24/outline';

export interface KJContactFormProps {
  components?: Record<string, any>;
  settings?: Record<string, any>;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const KJContactForm: React.FC<KJContactFormProps> = ({ 
  components,
  settings,
  onSubmit 
}) => {
  // Extract component data from JSON structure
  const nameData = components?.input_lKz6fm || {};
  const businessData = components?.input_lKz6fl || {};
  const emailData = components?.input_lKz6ft || {};
  const messageData = components?.textarea_lKz6fb || {};
  const buttonData = components?.action_H9gpTr || {};

  // Icon mapping
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      email: EnvelopeIcon,
      user: UserIcon,
      building: BuildingOfficeIcon,
      rightArrow: ArrowRightIcon,
    };
    return iconMap[iconName];
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    } else {
      // Default form handling
      const formData = new FormData(e.currentTarget);
      console.log('Form submitted:', Object.fromEntries(formData));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="kj-contact-form">
      <VStack spacing="lg" align="stretch">
        {/* Name and Business Name Row */}
        <HStack spacing="md" align="start" className="kj-contact-form__row">
          {/* Name Input */}
          <div style={{ flex: 1, width: '100%' }}>
            <Input
              type="text"
              name="name"
              label={nameData.label}
              placeholder={nameData.placeholder}
              leftIcon={
                nameData.leftIcon ? (
                  <Icon size="sm" color="secondary">
                    {React.createElement(getIcon(nameData.leftIcon))}
                  </Icon>
                ) : undefined
              }
              fullWidth
              size="md"
              radius="md"
              required
            />
          </div>

          {/* Business Name Input */}
          <div style={{ flex: 1, width: '100%' }}>
            <Input
              type="text"
              name="businessName"
              label={businessData.label}
              placeholder={businessData.placeholder}
              leftIcon={
                businessData.leftIcon ? (
                  <Icon size="sm" color="secondary">
                    {React.createElement(getIcon(businessData.leftIcon))}
                  </Icon>
                ) : undefined
              }
              fullWidth
              size="md"
              radius="md"
              required
            />
          </div>
        </HStack>

        {/* Email Input */}
        <Input
          type="email"
          name="email"
          label={emailData.label}
          placeholder={emailData.placeholder}
          leftIcon={
            emailData.leftIcon ? (
              <Icon size="sm" color="secondary">
                {React.createElement(getIcon(emailData.leftIcon))}
              </Icon>
            ) : undefined
          }
          fullWidth
          size="md"
          radius="md"
          required
        />

        {/* Message Textarea */}
        <div className="input-group input-group--full-width">
          {messageData.label && (
            <label className="input-label" style={{ textAlign: 'left' }}>
              {messageData.label}
            </label>
          )}
          <textarea
            name="message"
            placeholder={messageData.placeholder}
            className="input input--md input--full-width"
            rows={4}
            style={{
              minHeight: '120px',
              resize: 'vertical',
              textAlign: 'left',
            }}
            required
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant={buttonData.content?.type || 'primary'}
          size="lg"
          radius="md"
          rightIcon={
            buttonData.content?.rightIcon ? (
              <Icon 
                size="sm" 
                color={
                  buttonData.content?.type === 'primary' ? 'button-primary' :
                  buttonData.content?.type === 'secondary' ? 'button-secondary' :
                  buttonData.content?.type === 'accent' ? 'button-accent' :
                  buttonData.content?.type === 'ghost' ? 'button-ghost' :
                  buttonData.content?.type === 'destructive' ? 'button-destructive' :
                  'button-primary'
                }
              >
                {React.createElement(getIcon(buttonData.content.rightIcon))}
              </Icon>
            ) : undefined
          }
          style={{ width: '100%' }}
        >
          {buttonData.content?.content || 'Skicka'}
        </Button>
      </VStack>
    </form>
  );
};

KJContactForm.displayName = 'KJContactForm';