'use client';

import { Section, Container } from '../../../../../system/layout';
import { ContactForm, ContactFormData } from '../../../../../system/components/patterns/client/ContactForm';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';
import { sendEmailForm } from '../../../../../../api/contact';
import { useState } from 'react';

interface ContactFormSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Form configuration
  onSubmit?: (data: ContactFormData) => void;
  isLoading?: boolean;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
  
  // Form styling
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fieldSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ContactFormSection: React.FC<ContactFormSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  onSubmit,
  isLoading: externalLoading = false,
  
  // Layout defaults
  containerAlign = 'center',
  containerMaxWidth = 'md',
  
  // Form styling defaults
  spacing = 'lg',
  fieldSpacing = 'md',
  buttonVariant = 'primary',
  buttonSize = 'md'
}) => {
  const [submitting, setSubmitting] = useState(false);
  const isLoading = externalLoading || submitting;
  const { getPageTemplateByLayoutIndex, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get template by layout index
  const template = getPageTemplateByLayoutIndex(currentSlug, templateIndex);
  
  if (!template) {
    console.log(`No template found at layout index ${templateIndex} for page ${currentSlug}`);
    return null;
  }
  
  // Get the template type dynamically
  const templateType = template.type;
  
  // Get blocks from template using its actual type
  const templateBlocks = getTemplateBlocks(template, templateType);
  
  // Extract content using generic functions from CMS with fallbacks matching KJ Marketing
  const nameLabel = getBlockContent(templateBlocks, 'nameLabel') || 'Name';
  const companyLabel = getBlockContent(templateBlocks, 'companyLabel') || 'Company';
  const emailLabel = getBlockContent(templateBlocks, 'emailLabel') || 'Email';
  const messageLabel = getBlockContent(templateBlocks, 'messageLabel') || 'Message';
  const submitButtonText = getBlockContent(templateBlocks, 'submitButton') || 'Submit';
  
  const namePlaceholder = getBlockContent(templateBlocks, 'namePlaceholder') || 'First name';
  const companyPlaceholder = getBlockContent(templateBlocks, 'companyPlaceholder') || 'Company name';
  const emailPlaceholder = getBlockContent(templateBlocks, 'emailPlaceholder') || 'Email address';
  
  // Handle form submission
  const handleFormSubmit = async (data: ContactFormData) => {
    if (onSubmit) {
      onSubmit(data);
      return;
    }
    
    try {
      setSubmitting(true);
      console.log('🔥 Skickar email till admin@blimpify-im.com:', data);
      
      const result = await sendEmailForm('admin@blimpify-im.com', data);
      
      if (result.ok && result.json?.success) {
        alert(result.json?.message || 'Tack! Ditt meddelande har skickats.');
      } else {
        alert(result.error || result.json?.message || 'Kunde inte skicka meddelandet. Försök igen.');
      }
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      alert('Kunde inte skicka meddelandet. Försök igen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Section 
      id={`contact-form-section-${templateIndex}`}
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth="xs"
        style={{ 
            paddingTop: '3rem',
            paddingBottom: '10rem'
        }}
      >
        <ContactForm
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          
          // Labels from CMS
          nameLabel={nameLabel}
          companyLabel={companyLabel}
          emailLabel={emailLabel}
          messageLabel={messageLabel}
          submitButtonText={submitButtonText}
          
          // Placeholders from CMS
          namePlaceholder={namePlaceholder}
          companyPlaceholder={companyPlaceholder}
          emailPlaceholder={emailPlaceholder}
          
          // Layout configuration
          spacing={spacing}
          fieldSpacing={fieldSpacing}
          buttonVariant={buttonVariant}
          buttonSize={buttonSize}
        />
      </Container>
    </Section>
  );
}; 