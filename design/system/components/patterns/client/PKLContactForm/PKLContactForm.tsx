// ===============================================
// design/system/components/patterns/client/PKLContactForm/PKLContactForm.tsx
// PKL CONTACT FORM - Full contact form with name, email, company, message
// ===============================================

'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Input } from '../../../../../system/components/primitives/Input';
import { Textarea } from '../../../../../system/components/primitives/Textarea';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

// ===== TYPE DEFINITIONS =====

export interface PKLContactFormData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message: string;
}

export interface PKLContactFormContent {
  label?: string;
  heading: string;
  description: string;
  namePlaceholder?: string;
  emailPlaceholder?: string;
  companyPlaceholder?: string;
  phonePlaceholder?: string;
  messagePlaceholder?: string;
  buttonText?: string;
}

export interface PKLContactFormProps {
  content: PKLContactFormContent;
  onSubmit?: (data: PKLContactFormData) => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

// ===== MAIN CONTACT FORM COMPONENT =====

export const PKLContactForm: React.FC<PKLContactFormProps> = ({ 
  content, 
  onSubmit,
  id = "pkl-contact-form",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    label,
    heading, 
    description,
    namePlaceholder = "Ditt namn",
    emailPlaceholder = "Din e-postadress",
    companyPlaceholder = "Företagsnamn (valfritt)",
    phonePlaceholder = "Telefonnummer (valfritt)",
    messagePlaceholder = "Berätta kort om era behov...",
    buttonText = "Skicka meddelande"
  } = content;

  const [formData, setFormData] = useState<PKLContactFormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        console.log('Form submitted:', formData);
      }
      setSubmitSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', company: '', phone: '', message: '' });
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .pkl-contact-form-outer-container {
          max-width: var(--size-page-narrow-max-width);
          margin: 0 auto;
          padding: 0 var(--foundation-space-6);
        }
        
        .pkl-contact-form-header {
          text-align: center;
          margin-bottom: var(--foundation-space-12);
        }
        
        .pkl-contact-form-card {
          background: var(--surface-card);
          border: 1px solid var(--border-medium);
          border-radius: var(--radius-lg);
          padding: var(--foundation-space-10);
          box-shadow: var(--shadow-md);
        }
        
        .pkl-contact-form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--foundation-space-4);
        }
        
        .pkl-contact-form-field {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-2);
        }
        
        .pkl-contact-form-field-full {
          grid-column: 1 / -1;
        }
        
        .pkl-contact-form-success {
          background: var(--accent-500);
          color: white;
          padding: var(--foundation-space-4);
          border-radius: var(--radius-md);
          text-align: center;
          margin-bottom: var(--foundation-space-4);
        }
        
        @media (max-width: 768px) {
          .pkl-contact-form-card {
            padding: var(--foundation-space-6);
          }
          
          .pkl-contact-form-grid {
            grid-template-columns: 1fr;
          }
          
          .pkl-contact-form-field-full {
            grid-column: 1;
          }
        }
      `}</style>

      <Section 
        id={id} 
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="pkl-contact-form-outer-container">
          {/* Header */}
          <div className="pkl-contact-form-header">
            <Stack spacing="md" align="center">
              {label && (
                <Typography 
                  variant="label-sm" 
                  color="accent"
                  weight="medium"
                >
                  {label}
                </Typography>
              )}
              
              <Typography 
                variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                weight="semibold" 
                color="primary" 
                as="h2"
              >
                {heading}
              </Typography>
              
              <Typography 
                variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                color="secondary"
              >
                {description}
              </Typography>
            </Stack>
          </div>

          {/* Form Card */}
          <div className="pkl-contact-form-card">
            {submitSuccess && (
              <div className="pkl-contact-form-success">
                <Typography variant="body-md" weight="medium">
                  Tack! Vi återkommer inom 24 timmar.
                </Typography>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="pkl-contact-form-grid">
                {/* Name */}
                <div className="pkl-contact-form-field">
                  <Typography variant="body-sm" weight="medium" color="primary">
                    Namn *
                  </Typography>
                  <Input
                    type="text"
                    placeholder={namePlaceholder}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                {/* Email */}
                <div className="pkl-contact-form-field">
                  <Typography variant="body-sm" weight="medium" color="primary">
                    E-post *
                  </Typography>
                  <Input
                    type="email"
                    placeholder={emailPlaceholder}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                {/* Company */}
                <div className="pkl-contact-form-field">
                  <Typography variant="body-sm" weight="medium" color="primary">
                    Företag
                  </Typography>
                  <Input
                    type="text"
                    placeholder={companyPlaceholder}
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                
                {/* Phone */}
                <div className="pkl-contact-form-field">
                  <Typography variant="body-sm" weight="medium" color="primary">
                    Telefon
                  </Typography>
                  <Input
                    type="tel"
                    placeholder={phonePlaceholder}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                
                {/* Message */}
                <div className="pkl-contact-form-field pkl-contact-form-field-full">
                  <Typography variant="body-sm" weight="medium" color="primary">
                    Meddelande *
                  </Typography>
                  <Textarea
                    placeholder={messagePlaceholder}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                  />
                </div>
                
                {/* Submit Button */}
                <div className="pkl-contact-form-field-full">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.message.trim()}
                    style={{ width: '100%', marginTop: 'var(--foundation-space-4)' }}
                  >
                    {buttonText}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
};

