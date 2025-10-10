'use client';

import React, { useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Input } from '../../../../../system/components/primitives/Input';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';

export interface ContactAssessmentContent {
  title: string;
  subtitle: string;
  inputPlaceholder: string;
  buttonText: string;
  images: string[];
  imageAlts?: string[];
}

export interface ContactAssessmentProps {
  content: ContactAssessmentContent;
  onSubmit?: (email: string) => void;
  id?: string;
  paddingTop?: string;
  paddingBottom?: string;
  textScale?: 'sm' | 'md' | 'lg';
}

export const ContactAssessment: React.FC<ContactAssessmentProps> = ({ 
  content, 
  onSubmit,
  id = "contact-assessment",
  paddingTop = 'var(--foundation-space-24)',
  paddingBottom = 'var(--foundation-space-24)',
  textScale = 'md'
}) => {
  const { 
    title, 
    subtitle, 
    inputPlaceholder,
    buttonText,
    images,
    imageAlts = []
  } = content;

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(email);
      } else {
        // Default behavior - could integrate with email service
        console.log('Email submitted:', email);
      }
      setEmail('');
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .contact-assessment-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .contact-assessment-card {
            background: var(--surface-card);
            border-radius: var(--radius-lg);
            padding: var(--foundation-space-12);
            position: relative;
            overflow: hidden;
          }
          
          .contact-assessment-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, var(--surface-card) 0%, var(--surface-muted) 100%);
            z-index: 0;
          }
          
          .contact-assessment-content {
            position: relative;
            z-index: 1;
          }
          
          .contact-form {
            max-width: 360px;
            width: 100%;
          }
          
          .input-group {
            display: flex;
            gap: var(--foundation-space-3);
            align-items: flex-start;
          }
          
          .input-field {
            flex: 1;
            min-width: 0;
          }
          
          .submit-button {
            flex-shrink: 0;
          }
          
          .submit-button button {
            background-color: var(--button-primary-background, var(--primary-500)) !important;
            color: white !important;
          }
          
          .submit-button button:hover {
            background-color: var(--button-primary-background-hover, var(--primary-600)) !important;
          }
          
          .submit-button button:disabled {
            opacity: 0.6;
          }
          
          .image-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: var(--foundation-space-3);
            max-width: 300px;
            margin: 0 auto;
          }
          
          .image-item {
            position: relative;
            border-radius: var(--radius-md);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            border: 1px solid var(--border-light);
            transition: transform var(--foundation-motion-fast);
          }
          
          .image-item:hover {
            transform: translateY(-2px);
          }
          
          .image-item:nth-child(1) {
            grid-row: 1 / 3;
            transform: translateY(var(--foundation-space-2));
          }
          
          .image-item:nth-child(2) {
            grid-row: 1;
            transform: translateY(calc(-1 * var(--foundation-space-2)));
          }
          
          .image-item:nth-child(3) {
            grid-row: 2;
            transform: translateY(var(--foundation-space-1));
          }
          
          .portrait-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
          }
          
          .fade-in-up {
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @media (max-width: 768px) {
            .contact-assessment-card {
              padding: var(--foundation-space-8);
            }
            
            .contact-form {
              max-width: 100%;
            }
            
            .input-group {
              flex-direction: column;
              gap: var(--foundation-space-4);
            }
            
            .input-field {
              width: 100%;
            }
            
            .submit-button {
              width: 100%;
            }
            
            .image-grid {
              max-width: 250px;
              margin-top: var(--foundation-space-8);
            }
            
            .image-item:nth-child(1),
            .image-item:nth-child(2),
            .image-item:nth-child(3) {
              transform: none;
            }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .image-grid {
              max-width: 280px;
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="section"
        style={{
          backgroundColor: 'var(--surface-page)',
          paddingTop,
          paddingBottom
        }}
      >
        <div className="contact-assessment-container">
          <div className="contact-assessment-card fade-in-up">
            <div className="contact-assessment-content">
              <Grid 
                columns={2} 
                gap="xl" 
                alignItems="center"
                collapseOn="tablet"
                minItemWidth="300px"
              >
                {/* Left Side - Text and Form */}
                <Stack spacing="lg" align="start">
                  <Typography 
                    variant={textScale === 'lg' ? 'display-md' : textScale === 'sm' ? 'h3' : 'h2'}
                    weight="semibold"
                    color="primary"
                    as="h2"
                    style={{
                      color: 'var(--text-primary)',
                      textAlign: 'left'
                    }}
                  >
                    {title}
                  </Typography>
                  
                  <Typography 
                    variant={textScale === 'lg' ? 'body-xl' : textScale === 'sm' ? 'body-sm' : 'body-md'}
                    style={{
                      color: 'var(--text-secondary)',
                      textAlign: 'left',
                      maxWidth: '400px'
                    }}
                  >
                    {subtitle}
                  </Typography>
                  
                  <form onSubmit={handleSubmit} className="contact-form">
                    <div className="input-group">
                      <div className="input-field">
                        <Input
                          type="email"
                          placeholder={inputPlaceholder}
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          style={{
                            backgroundColor: 'var(--surface-subtle)',
                            borderColor: 'var(--border-medium)',
                            color: 'var(--text-primary)'
                          }}
                        />
                      </div>
                      <div className="submit-button">
                        <Button 
                          type="submit"
                          variant="primary" 
                          size="md"
                          loading={isSubmitting}
                          disabled={!email.trim() || isSubmitting}
                        >
                          {buttonText}
                        </Button>
                      </div>
                    </div>
                  </form>
                </Stack>
                
                {/* Right Side - Image Composition */}
                <div className="image-grid">
                  {images.slice(0, 3).map((image, index) => (
                    <div key={index} className="image-item">
                      <img 
                        src={image} 
                        alt={imageAlts[index] || `Contact assessment visual ${index + 1}`}
                        className="portrait-image"
                        style={{
                          height: index === 0 ? '200px' : '120px'
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Grid>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

ContactAssessment.displayName = 'ContactAssessment';
