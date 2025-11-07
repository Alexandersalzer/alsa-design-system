'use client';

import { Section, Container } from '../../../components';
import { SectionBody } from '../../../patterns/shared/sectionBody/SectionBody';
import { ContactForm, ContactFormData } from '../../../../system/patterns/client/ContactForm';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';
import { sendEmailFormUniversal, sendEmailForm } from '../../../../../api/contact';
import { useState } from 'react';
import { SuccessToast, ErrorToast } from '../../../components/feedback';

interface ContactFormSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Form configuration
  onSubmit?: (data: ContactFormData) => void;
  isLoading?: boolean;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // SectionBody configuration
  headingAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  headingVariant?: 'display-xl' | 'display-lg' | 'display-md' | 'h1' | 'h2';
  bodyAs?: 'p' | 'span' | 'div';
  bodyVariant?: 'body-xl' | 'body-lg' | 'body-md';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
  headingBodySpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  bodyFormSpacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  
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
  
  // SectionBody defaults
  headingAs = 'h2',
  headingVariant = 'display-lg',
  bodyAs = 'p',
  bodyVariant = 'body-lg',
  textAlign = 'center',
  maxWidth = '700px',
  headingBodySpacing = 'md',
  bodyFormSpacing = 'xl',
  
  // Form styling defaults
  spacing = 'lg',
  fieldSpacing = 'md',
  buttonVariant = 'accent',
  buttonSize = 'md',
  
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; message: string; title?: string } | null>(null);
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
  
  // Extract SectionBody content (heading + subtitle)
  const heading = getBlockContent(templateBlocks, 'title') || '';
  const body = getBlockContent(templateBlocks, 'subtitle') || '';
  
  // Extract form field labels and placeholders
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
      console.log('🌍 Skickar universellt kontaktformulär för current domain:', typeof window !== 'undefined' ? window.location.host : 'unknown');
      
      // Försök först med universal endpoint
      let result = await sendEmailFormUniversal(data);
      
      // Om universal inte fungerar, fallback till admin@blimpify-im.com
      if (!result.ok) {
        console.log('⚠️ Universal endpoint misslyckades, använder fallback till admin@blimpify-im.com');
        result = await sendEmailForm('admin@blimpify-im.com', data);
      }
      
      if (result.ok && result.json?.success) {
        setToastMessage({
          type: 'success',
          title: 'Meddelande skickat!',
          message: 'Tack för ditt meddelande! Vi har mottagit din förfrågan och återkommer inom 24 timmar.'
        });
      } else {
        setToastMessage({
          type: 'error',
          title: 'Kunde inte skicka meddelandet',
          message: 'Något gick fel när meddelandet skulle skickas. Vänligen försök igen eller kontakta oss direkt.'
        });
      }
    } catch (error: any) {
      console.error('Error sending contact form:', error);
      
      // Final fallback - försök skicka till admin direkt
      try {
        console.log('🔧 Använder sista fallback - skickar direkt till admin@blimpify-im.com');
        const fallbackResult = await sendEmailForm('admin@blimpify-im.com', data);
        if (fallbackResult.ok) {
          setToastMessage({
            type: 'success',
            title: 'Meddelande skickat!',
            message: 'Tack för ditt meddelande! Vi har mottagit din förfrågan och återkommer inom 24 timmar.'
          });
        } else {
          setToastMessage({
            type: 'error',
            title: 'Tekniska problem',
            message: 'Vi har tekniska problem just nu. Vänligen försök igen om en stund eller kontakta oss direkt.'
          });
        }
      } catch (fallbackError) {
        console.error('Final fallback failed:', fallbackError);
        setToastMessage({
          type: 'error',
          title: 'Tekniska problem',
          message: 'Vi har tekniska problem just nu. Vänligen försök igen om en stund eller kontakta oss direkt.'
        });
      }
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
      >
        {/* SectionBody for heading and subtitle */}
        {(heading || body) && (

            <SectionBody
              heading={heading || undefined}
              headingAs={headingAs}
              headingVariant={headingVariant}
              headingColor="heading"
              headingWeight="bold"
              body={body || undefined}
              bodyAs={bodyAs}
              bodyVariant={bodyVariant}
              bodyColor="body"
              bodyWeight="regular"
              textAlign={textAlign}
              maxWidth={maxWidth}
              headingBodySpacing={headingBodySpacing}
            />
        )}
        
        {/* Contact Form */}
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
      
      {/* Toast meddelanden */}
      {toastMessage && (
        <>
          {toastMessage.type === 'success' ? (
            <SuccessToast
              title={toastMessage.title}
              onClose={() => setToastMessage(null)}
              autoDismiss={true}
              duration={5000}
            >
              {toastMessage.message}
            </SuccessToast>
          ) : (
            <ErrorToast
              title={toastMessage.title}
              onClose={() => setToastMessage(null)}
              autoDismiss={true}
              duration={7000}
            >
              {toastMessage.message}
            </ErrorToast>
          )}
        </>
      )}
    </Section>
  );
};