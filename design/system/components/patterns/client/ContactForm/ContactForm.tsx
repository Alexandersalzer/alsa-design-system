// ===============================================
// design/system/components/patterns/client/ContactForm/ContactForm.tsx
// CONTACT FORM PATTERN - Name, Company, Email, Message fields with validation
// ===============================================

import React, { useState } from 'react';
import { Stack } from '../../../layout/utilities/stack/Stack';
import { Cluster } from '../../../layout/utilities/cluster/Cluster';
import { Input } from '../../../../../system/components/primitives/Input';
import { Textarea } from '../../../../../system/components/primitives/Textarea';
import { Button } from '../../../../../system/components/primitives/Button';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Icon, ArrowRightIcon } from '../../../../../system/components/primitives/Icon';
// ===== TYPE DEFINITIONS =====

export interface ContactFormData {
  name: string;
  company: string;
  email: string;
  message: string;
}

export interface ContactFormProps {
  className?: string;
  
  // Form configuration
  onSubmit?: (data: ContactFormData) => void;
  isLoading?: boolean;
  
  // Field labels (for CMS integration)
  nameLabel?: string;
  companyLabel?: string;
  emailLabel?: string;
  messageLabel?: string;
  submitButtonText?: string;
  
  // Placeholder texts
  namePlaceholder?: string;
  companyPlaceholder?: string;
  emailPlaceholder?: string;
  
  // Validation messages
  nameErrorMessage?: string;
  companyErrorMessage?: string;
  emailErrorMessage?: string;
  messageErrorMessage?: string;
  
  // Layout configuration
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fieldSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
}

// ===== MAIN CONTACT FORM COMPONENT =====

export const ContactForm: React.FC<ContactFormProps> = ({
  className,
  onSubmit,
  isLoading = false,
  
  // Labels with defaults matching KJ Marketing form
  nameLabel = "Name",
  companyLabel = "Company",
  emailLabel = "Email",
  messageLabel = "Message",
  submitButtonText = "Submit",
  
  // Placeholders with defaults matching KJ Marketing form
  namePlaceholder = "First name",
  companyPlaceholder = "Company name",
  emailPlaceholder = "Email address",
  
  // Error messages
  nameErrorMessage = "Name is required",
  companyErrorMessage = "Company is required",
  emailErrorMessage = "Valid email is required",
  messageErrorMessage = "Message is required",
  
  // Layout defaults
  spacing = 'lg',
  fieldSpacing = 'sm',
  buttonVariant = 'primary',
  buttonSize = 'sm'
}) => {
  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    message: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactFormData, boolean>>>({});
  
  // Handle input changes
  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  // Handle blur events
  const handleBlur = (field: keyof ContactFormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, formData[field]);
  };
  
  // Validate individual field
  const validateField = (field: keyof ContactFormData, value: string) => {
    let error = '';
    
    switch (field) {
      case 'name':
        // Removed required validation - no error for empty name
        break;
      case 'company':
        // Removed required validation - no error for empty company
        break;
      case 'email':
        // Only validate email format if there's a value
        if (value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = emailErrorMessage;
        }
        break;
      case 'message':
        // Removed required validation - no error for empty message
        break;
    }
    
    setErrors(prev => ({ ...prev, [field]: error || undefined }));
    return !error;
  };
  
  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {};
    let isValid = true;
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      const field = key as keyof ContactFormData;
      if (!validateField(field, formData[field])) {
        isValid = false;
      }
    });
    
    // Mark all fields as touched
    setTouched({
      name: true,
      company: true,
      email: true,
      message: true
    });
    
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <Stack spacing="sm">
        {/* Name and Company in a Cluster (horizontal layout) */}
        <Cluster spacing={fieldSpacing} wrap={true}>
          {/* Name Field */}
          <Stack spacing="xs" flexChild={true}>
            <Typography variant="label-sm" weight="bold" color="primary" align="left">
              {nameLabel}
            </Typography>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder={namePlaceholder}
              error={touched.name ? errors.name : undefined}
              size="md"
              radius="sm"
            />
          </Stack>
          
          {/* Company Field */}
          <Stack spacing="xs" flexChild={true}>
            <Typography variant="label-sm" weight="bold" color="primary" align="left">
              {companyLabel}
            </Typography>
            <Input
              value={formData.company}
              onChange={(e) => handleChange('company', e.target.value)}
              onBlur={() => handleBlur('company')}
              placeholder={companyPlaceholder}
              error={touched.company ? errors.company : undefined}
              size="md"
              radius="sm"
            />
          </Stack>
        </Cluster>
        
        {/* Email Field */}
        <Stack spacing="xs">
          <Typography variant="label-sm" weight="bold" color="primary" align="left">
            {emailLabel}
          </Typography>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder={emailPlaceholder}
            error={touched.email ? errors.email : undefined}
            size="md"
            radius="sm"
          />
        </Stack>
        
        {/* Message Field */}
        <Stack spacing="xs">
          <Typography variant="label-sm" weight="bold" color="primary" align="left">
            {messageLabel}
          </Typography>
          <Textarea
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            onBlur={() => handleBlur('message')}
            error={touched.message ? errors.message : undefined}
            size="md"
            minRows={4}
            maxRows={8}
            autoResize={true}
          />
        </Stack>
        
        {/* Submit Button */}
        <Button
          type="submit"
          variant={buttonVariant}
          size={buttonSize}
          disabled={isLoading}
          rightIcon={<Icon color="inverse"><ArrowRightIcon/></Icon>}
        >
          {isLoading ? 'Sending...' : submitButtonText}
        </Button>
      </Stack>
    </form>
  );
};

ContactForm.displayName = 'ContactForm'; 