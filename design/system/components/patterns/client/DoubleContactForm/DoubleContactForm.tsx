'use client';

import { ReactElement } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Card } from '../../../../../system/components/primitives/Card';
import { Picker } from '../../../../../system/components/primitives/Picker';
import { Input } from '../../../../../system/components/primitives/Input';
import { Textarea } from '../../../../../system/components/primitives/Textarea';

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
  contactInfoTitle?: string;
  contactInfoSubtitle?: string;
  contactInfo?: ContactInfo[];
  actions?: ContactAction[];
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
    actions = []
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
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 640px) {
            .contact-form-grid {
              grid-template-columns: 1fr !important;
              gap: var(--foundation-space-3) !important;
            }
            .contact-form-container {
              padding: var(--foundation-space-4) !important;
            }
            .contact-form-title {
              font-size: 1.25rem !important;
            }
            .contact-form-subtitle {
              font-size: 0.875rem !important;
            }
            .contact-form-button {
              width: 100% !important;
              font-size: 0.875rem !important;
              padding: var(--foundation-space-3) var(--foundation-space-4) !important;
            }
          }
          @media (min-width: 641px) and (max-width: 1024px) {
            .contact-form-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: var(--foundation-space-4) !important;
            }
            .contact-form-container {
              padding: var(--foundation-space-6) !important;
            }
            .contact-form-title {
              font-size: 1.375rem !important;
            }
            .contact-form-subtitle {
              font-size: 1rem !important;
            }
          }
          @media (min-width: 1025px) {
            .contact-form-grid {
              grid-template-columns: repeat(2, 1fr) !important;
              gap: var(--foundation-space-6) !important;
            }
            .contact-form-container {
              padding: var(--foundation-space-8) !important;
            }
            .contact-form-title {
              font-size: 1.5rem !important;
            }
            .contact-form-subtitle {
              font-size: 1.125rem !important;
            }
          }
        `
      }} />
    <Section 
      id={id} 
      className={className}
      style={{
        backgroundColor: 'var(--surface-card)',
        backdropFilter: 'blur(15px)',
        paddingTop: 'var(--foundation-space-16)',
        paddingBottom: 'var(--foundation-space-16)',
        paddingLeft: 'var(--foundation-space-4)',
        paddingRight: 'var(--foundation-space-4)'
      }}
    >
        <Stack spacing="xl" align="center">
          {/* Visual */}
          {visualImage && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={visualImage.src}
                alt={visualImage.alt}
                width={visualImage.width || 150}
                height={visualImage.height || 150}
                style={{
                  width: 'clamp(100px, 12vw, 150px)',
                  height: 'clamp(100px, 12vw, 150px)',
                  objectFit: 'contain',
                  objectPosition: 'center'
                }}
              />
            </div>
          )}
          
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: 'var(--size-page-max-width)', width: '100%' }}>
            <Stack spacing="md" align="center">
            <Typography 
              variant="h2" 
              weight="bold" 
              color="heading"
              style={{
                fontSize: 'clamp(2.25rem, 4vw, 3rem)',
                lineHeight: 'var(--foundation-typography-line-height-tight)',
                textAlign: 'center'
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="body-lg" 
              color="secondary"
              style={{
                lineHeight: 'var(--foundation-typography-line-height-relaxed)',
                fontSize: 'clamp(1rem, 2vw, 1.125rem)'
              }}
            >
              {subtitle}
            </Typography>
            </Stack>
          </div>
          
          {/* Form & Info Grid */}
          <Grid 
            columns={contactInfo && contactInfo.length > 0 ? 2 : 1} 
            gap="lg"
            minItemWidth="280px"
            collapseOn="mobile"
            style={{ maxWidth: 'var(--size-page-narrow-max-width)', width: '100%' }}
          >
            {/* Contact Form */}
            <Card 
              variant="elevated" 
              padding="md"
              className="contact-form-container"
              style={{ height: 'fit-content' }}
            >
              <Stack spacing="md">
                <Stack spacing="sm">
                  <Typography variant="h3" weight="semibold" color="heading" className="contact-form-title">
                    {formTitle}
                  </Typography>
                  <Typography variant="body-md" color="secondary" className="contact-form-subtitle">
                    {formSubtitle}
                  </Typography>
                </Stack>
                
                <form onSubmit={handleSubmit}>
                  <Stack spacing="md">
                    {/* First Row: Name and Email */}
                    <div 
                      className="contact-form-grid"
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: 'var(--foundation-space-4)'
                      }}
                    >
                      {fields.filter(field => field.name === 'name' || field.name === 'email').map((field) => (
                        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-2)' }}>
                          <label 
                            style={{ 
                              fontWeight: 'var(--foundation-typography-weight-semibold)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--foundation-typography-size-sm)',
                              textAlign: 'left',
                              display: 'block'
                            }}
                          >
                            {field.label}
                            {field.required && <span style={{ color: 'var(--accent-500)' }}> *</span>}
                          </label>
                          <Input
                            type={field.type === 'textarea' || field.type === 'select' ? 'text' : field.type as 'text' | 'email' | 'tel'}
                            name={field.name}
                            required={field.required}
                            placeholder={field.placeholder}
                            size="md"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Second Row: Phone and Case Type */}
                    <div 
                      className="contact-form-grid"
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                        gap: 'var(--foundation-space-4)'
                      }}
                    >
                      {fields.filter(field => field.name === 'phone' || field.name === 'caseType').map((field) => (
                        <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-2)' }}>
                          <label 
                            style={{ 
                              fontWeight: 'var(--foundation-typography-weight-semibold)',
                              color: 'var(--text-primary)',
                              fontSize: 'var(--foundation-typography-size-sm)',
                              textAlign: 'left',
                              display: 'block'
                            }}
                          >
                            {field.label}
                            {field.required && <span style={{ color: 'var(--accent-500)' }}> *</span>}
                          </label>
                          {field.type === 'select' ? (
                            <Picker
                              placeholder={field.placeholder}
                              options={field.options || []}
                              size="md"
                              variant="compact"
                              radius="md"
                            />
                          ) : (
                            <Input
                              type={field.type as 'text' | 'email' | 'tel'}
                              name={field.name}
                              required={field.required}
                              placeholder={field.placeholder}
                              size="md"
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Message field (full width) */}
                    {fields.filter(field => field.type === 'textarea').map((field) => (
                      <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-2)' }}>
                        <label 
                          style={{ 
                            fontWeight: 'var(--foundation-typography-weight-semibold)',
                            color: 'var(--text-primary)',
                            fontSize: 'var(--foundation-typography-size-sm)',
                            textAlign: 'left',
                            display: 'block'
                          }}
                        >
                          {field.label}
                          {field.required && <span style={{ color: 'var(--accent-500)' }}> *</span>}
                        </label>
                        <Textarea
                          name={field.name}
                          required={field.required}
                          rows={field.rows || 4}
                          placeholder={field.placeholder}
                          size="md"
                        />
                      </div>
                    ))}
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit"
                      variant="accent" 
                      size="lg" 
                      className="contact-form-button"
                      style={{ width: '100%' }}
                      rightIcon={submitButton.icon ? <div style={{ width: '20px', height: '20px', color: 'white' }}>{submitButton.icon}</div> : undefined}
                    >
                      {submitButton.text}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Card>
            
            {/* Contact Information - Only show if contactInfo is provided */}
            {contactInfo && contactInfo.length > 0 && (
              <Card 
                variant="elevated" 
                padding="md"
                style={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Stack spacing="md">
                  <Stack spacing="sm">
                    <Typography variant="h3" weight="semibold" color="heading">
                      {contactInfoTitle}
                    </Typography>
                    <Typography variant="body-md" color="secondary">
                      {contactInfoSubtitle}
                    </Typography>
                  </Stack>
                
                  <div style={{ flex: 1 }}>
                    <Stack spacing="lg">
                      {contactInfo.map((info, index) => (
                        <Stack spacing="md" align="center" key={index}>
                          <div
                            style={{
                              background: 'linear-gradient(135deg, #1f2937, #64748b)',
                              width: 'clamp(48px, 8vw, 64px)',
                              height: 'clamp(48px, 8vw, 64px)',
                              borderRadius: 'var(--foundation-radius-full)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              boxShadow: '0 4px 16px rgba(31, 41, 55, 0.2)'
                            }}
                          >
                            <div style={{
                              width: 'clamp(24px, 4vw, 32px)',
                              height: 'clamp(24px, 4vw, 32px)',
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {info.icon}
                            </div>
                          </div>
                          <Stack spacing="xs" align="center">
                            <Typography variant="body-md" weight="semibold" color="primary" style={{ textAlign: 'center' }}>
                              {info.title}
                            </Typography>
                            <Typography variant="body-lg" color="secondary" style={{ textAlign: 'center' }}>
                              {info.value}
                            </Typography>
                            <Typography variant="body-sm" color="secondary" style={{ textAlign: 'center' }}>
                              {info.subtitle}
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                    </Stack>
                  </div>
                  
                   {/* Action Buttons */}
                   {actions.length > 0 && (
                     <Stack spacing="md">
                       {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant}
                        size="lg"
                        style={{ width: '100%' }}
                        rightIcon={action.icon ? <div style={{ width: '20px', height: '20px', color: action.variant === 'accent' ? 'white' : 'var(--text-primary)' }}>{action.icon}</div> : undefined}
                        onClick={action.href ? () => window.location.href = action.href! : action.onClick}
                      >
                        {action.text}
                      </Button>
                       ))}
                     </Stack>
                   )}
                  </Stack>
                </div>
              </Card>
            )}
          </Grid>
        </Stack>
    </Section>
    </>
  );
};

export { DoubleContactForm };

