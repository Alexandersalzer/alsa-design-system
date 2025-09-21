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
    <Section 
      id={id} 
      className={className}
      style={{
        backgroundColor: 'var(--surface-card)',
        backdropFilter: 'blur(15px)',
        paddingTop: 'var(--foundation-space-20)',
        paddingBottom: 'var(--foundation-space-20)'
      }}
    >
      <Container maxWidth="2xl" align="center">
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
          <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
            <Stack spacing="md" align="center">
            <Typography 
              variant="h2" 
              weight="bold" 
              color="heading"
              style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.2rem)'
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
            columns={2} 
            gap="xl"
            minItemWidth="300px"
            collapseOn="mobile"
            style={{ maxWidth: '1000px', width: '100%' }}
          >
            {/* Contact Form */}
            <Card 
              variant="elevated" 
              padding="lg"
              style={{ height: 'fit-content' }}
            >
              <Stack spacing="lg">
                <Stack spacing="sm">
                  <Typography variant="h3" weight="semibold" color="heading">
                    {formTitle}
                  </Typography>
                  <Typography variant="body-md" color="secondary">
                    {formSubtitle}
                  </Typography>
                </Stack>
                
                <form onSubmit={handleSubmit}>
                  <Stack spacing="lg">
                    {fields.map((field, index) => (
                      <div key={field.name} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--foundation-space-2)' }}>
                        <label 
                          style={{ 
                            fontWeight: 'var(--foundation-typography-weight-semibold)',
                            color: 'var(--text-primary)',
                            fontSize: 'var(--foundation-typography-size-sm)'
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
                        ) : field.type === 'textarea' ? (
                          <Textarea
                            name={field.name}
                            required={field.required}
                            rows={field.rows || 4}
                            placeholder={field.placeholder}
                            size="md"
                          />
                        ) : (
                          <Input
                            type={field.type}
                            name={field.name}
                            required={field.required}
                            placeholder={field.placeholder}
                            size="md"
                          />
                        )}
                      </div>
                    ))}
                    
                    {/* Submit Button */}
                    <Button 
                      type="submit"
                      variant="accent" 
                      size="lg" 
                      style={{ width: '100%' }}
                      rightIcon={submitButton.icon ? <Icon color="inverse">{submitButton.icon}</Icon> : undefined}
                    >
                      {submitButton.text}
                    </Button>
                  </Stack>
                </form>
              </Stack>
            </Card>
            
            {/* Contact Information */}
            <Card 
              variant="elevated" 
              padding="lg"
              style={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack spacing="lg">
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
                      <Cluster spacing="md" align="start" key={index}>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                            width: 'clamp(40px, 6vw, 48px)',
                            height: 'clamp(40px, 6vw, 48px)',
                            borderRadius: 'var(--foundation-radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}
                        >
                          <Icon 
                            color="inverse"
                            style={{
                              width: 'clamp(20px, 3vw, 24px)',
                              height: 'clamp(20px, 3vw, 24px)'
                            }}
                          >
                            {info.icon}
                          </Icon>
                        </div>
                        <Stack spacing="xs">
                          <Typography variant="body-md" weight="semibold" color="primary">
                            {info.title}
                          </Typography>
                          <Typography variant="body-lg" color="secondary">
                            {info.value}
                          </Typography>
                          <Typography variant="body-sm" color="secondary">
                            {info.subtitle}
                          </Typography>
                        </Stack>
                      </Cluster>
                    ))}
                  </Stack>
                </div>
                
                {/* Action Buttons */}
                <Stack spacing="md">
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      variant={action.variant}
                      size="lg"
                      style={{ width: '100%' }}
                      rightIcon={action.icon ? <Icon color={action.variant === 'accent' ? 'inverse' : 'primary'}>{action.icon}</Icon> : undefined}
                      onClick={action.href ? () => window.location.href = action.href! : action.onClick}
                    >
                      {action.text}
                    </Button>
                  ))}
                </Stack>
                </Stack>
              </div>
            </Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  );
};

export { DoubleContactForm };

