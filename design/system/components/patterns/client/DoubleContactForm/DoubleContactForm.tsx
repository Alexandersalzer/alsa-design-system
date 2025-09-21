'use client';

import { ReactElement } from 'react';
import './DoubleContactForm.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Card } from '../../../../../system/components/primitives/Card';
import { Picker } from '../../../../../system/components/primitives/Picker';

export interface ContactInfo {
  type: 'phone' | 'email' | 'address';
  title: string;
  value: string;
  subtitle: string;
  icon: ReactElement;
}

export interface ContactAction {
  text: string;
  variant: 'accent' | 'secondary' | 'primary' | 'ghost';
  icon?: ReactElement;
  href?: string;
  onClick?: () => void;
}

export interface FormField {
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select';
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  rows?: number;
}

export interface DoubleContactFormContent {
  title: string;
  subtitle: string;
  visualImage?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  formTitle: string;
  formSubtitle: string;
  fields: FormField[];
  submitButton: {
    text: string;
    icon?: ReactElement;
  };
  contactInfoTitle: string;
  contactInfoSubtitle: string;
  contactInfo: ContactInfo[];
  actions: ContactAction[];
}

export interface DoubleContactFormProps {
  id?: string;
  content: DoubleContactFormContent;
  className?: string;
  onSubmit?: (formData: Record<string, string>) => void;
}

const DoubleContactForm = ({ id = "double-contact-form", content, className, onSubmit }: DoubleContactFormProps) => {
  const {
    title,
    subtitle,
    visualImage,
    formTitle,
    formSubtitle,
    fields,
    submitButton,
    contactInfoTitle,
    contactInfoSubtitle,
    contactInfo,
    actions
  } = content;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData.get(field.name) as string;
      if (value) data[field.name] = value;
    });
    
    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <Section id={id} className={`double-contact-form-section ${className || ''}`}>
      <div className="double-contact-form-container">
        {/* Visual */}
        {visualImage && (
          <div className="double-contact-form-visual">
            <img
              src={visualImage.src}
              alt={visualImage.alt}
              width={visualImage.width || 150}
              height={visualImage.height || 150}
              className="visual-image"
            />
          </div>
        )}
        
        {/* Header */}
        <div className="double-contact-form-header">
          <Typography variant="h2" weight="bold" color="heading" className="double-contact-form-title">
            {title}
          </Typography>
          <Typography variant="body-lg" color="secondary" className="double-contact-form-subtitle">
            {subtitle}
          </Typography>
        </div>
        
        {/* Form & Info Grid */}
        <div className="double-contact-form-grid">
          {/* Contact Form */}
          <div className="double-contact-form-form-container">
            <div className="double-contact-form-form-header">
              <Typography variant="h3" weight="semibold" color="heading" className="double-contact-form-form-title">
                {formTitle}
              </Typography>
              <Typography variant="body-md" color="secondary" className="double-contact-form-form-subtitle">
                {formSubtitle}
              </Typography>
            </div>
            
            <form onSubmit={handleSubmit} className="double-contact-form-form">
              {fields.map((field, index) => (
                <div key={field.name} className={`double-contact-form-field ${field.type === 'textarea' ? 'field-textarea' : ''}`}>
                  <label className="double-contact-form-label">
                    {field.label} {field.required && '*'}
                  </label>
                  
                  {field.type === 'select' ? (
                    <Picker
                      label=""
                      placeholder={field.placeholder}
                      options={field.options || []}
                      size="md"
                      variant="compact"
                      radius="md"
                    />
                  ) : field.type === 'textarea' ? (
                    <textarea
                      name={field.name}
                      required={field.required}
                      rows={field.rows || 4}
                      placeholder={field.placeholder}
                      className="double-contact-form-textarea"
                    />
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="double-contact-form-input"
                    />
                  )}
                </div>
              ))}
              
              {/* Submit Button */}
              <Button 
                type="submit"
                variant="accent" 
                size="lg" 
                className="double-contact-form-submit-button"
                rightIcon={submitButton.icon ? <Icon color="inverse">{submitButton.icon}</Icon> : undefined}
                style={{ color: 'white' }}
              >
                {submitButton.text}
              </Button>
            </form>
          </div>
          
          {/* Contact Information */}
          <Card className="double-contact-form-info-card">
            <div className="double-contact-form-info-header">
              <Typography variant="h3" weight="semibold" color="heading" className="double-contact-form-info-title">
                {contactInfoTitle}
              </Typography>
              <Typography variant="body-md" color="secondary" className="double-contact-form-info-subtitle">
                {contactInfoSubtitle}
              </Typography>
            </div>
            
            <div className="double-contact-form-info-items">
              {contactInfo.map((info, index) => (
                <div key={index} className="double-contact-form-info-item">
                  <div className="double-contact-form-info-icon">
                    <Icon color="inverse" className="info-icon">
                      {info.icon}
                    </Icon>
                  </div>
                  <div className="double-contact-form-info-content">
                    <Typography variant="body-md" weight="semibold" color="primary" className="info-title">
                      {info.title}
                    </Typography>
                    <Typography variant="body-lg" color="secondary" className="info-value">
                      {info.value}
                    </Typography>
                    <Typography variant="body-sm" color="secondary" className="info-subtitle">
                      {info.subtitle}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Action Buttons */}
            <div className="double-contact-form-actions">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  size="lg"
                  className="double-contact-form-action-button"
                  rightIcon={action.icon ? <Icon color={action.variant === 'accent' ? 'inverse' : 'primary'}>{action.icon}</Icon> : undefined}
                  onClick={action.href ? () => window.location.href = action.href! : action.onClick}
                  style={action.variant === 'accent' ? { color: 'white' } : undefined}
                >
                  {action.text}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
};

export { DoubleContactForm };

