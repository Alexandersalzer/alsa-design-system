'use client';

import React, { useState } from 'react';
import { Grid, GridItem } from '../../../components/layout';
import { Button, Input, Textarea, Icon } from '../../../components';
import { Body } from '../../../components/Typography';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { PatternNode } from '../../../core/types/nodes';
import { useAction } from '../../../core/actions/useAction';
import {
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// ===== TYPES =====
interface GridFormProps extends PatternNode {
  websiteId?: string;
}

// ===== MAIN GRID FORM COMPONENT =====
const GridForm = ({ components = {}, websiteId }: GridFormProps) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Get action config from button
  const buttonAction = get('button-submit').props.action;
  const { execute, loading, success, error, message } = useAction(buttonAction || { type: 'contact', settings: {} });
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await execute(formData);
    
    // Clear form on success if setting is enabled
    if (result.success && buttonAction?.settings?.clearFormOnSuccess !== false) {
      setFormData({});
      // Reset form inputs
      const form = e.target as HTMLFormElement;
      form.reset();
    }
  };


  return (
    <form className="kj-contact-form" onSubmit={handleSubmit}>
      <Grid columns={{ base: 1, md: 2, lg: 2, xl: 2, '2xl': 2 }} gap="md">
        
        {/* Name Field - colSpan 1 */}
        {renderIf('input-name') && (
          <GridItem colSpan={get('input-name').props.colSpan || 1} data-component-key={get('input-name').key}>
            <Input
              type={get('input-name').props.variant || 'text'}
              name={get('input-name').props.name || 'name'}
              label={get('input-name').props.label || 'Namn'}
              placeholder={get('input-name').props.placeholder || 'Förnamn'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <UserIcon />
                </Icon>
              }
              required={get('input-name').props.required !== false}
              size="md"
              radius="md"
              style={{ width: '100%' }}
              onChange={handleChange}
              disabled={loading}
            />
          </GridItem>
        )}

        {/* Business Field - colSpan 1 */}
        {renderIf('input-business') && (
          <GridItem colSpan={get('input-business').props.colSpan || 1} data-component-key={get('input-business').key}>
            <Input
              type={get('input-business').props.variant || 'text'}
              name={get('input-business').props.name || 'business'}
              label={get('input-business').props.label || 'Företag'}
              placeholder={get('input-business').props.placeholder || 'Företagsnamn'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <BuildingOfficeIcon />
                </Icon>
              }
              required={get('input-business').props.required !== false}
              size="md"
              radius="md"
              style={{ width: '100%' }}
              onChange={handleChange}
              disabled={loading}
            />
          </GridItem>
        )}

        {/* Phone Field - colSpan 2 (or configurable) */}
        {renderIf('input-phone') && (
          <GridItem colSpan={get('input-phone').props.colSpan || 2} data-component-key={get('input-phone').key}>
            <Input
              type={get('input-phone').props.variant || 'tel'}
              name={get('input-phone').props.name || 'phone'}
              label={get('input-phone').props.label || 'Telefon'}
              placeholder={get('input-phone').props.placeholder || '+46 70 123 45 67'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <PhoneIcon />
                </Icon>
              }
              required={get('input-phone').props.required === true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
              onChange={handleChange}
              disabled={loading}
            />
          </GridItem>
        )}

        {/* Email Field - colSpan 2 (full width) */}
        {renderIf('input-email') && (
          <GridItem colSpan={get('input-email').props.colSpan || 2} data-component-key={get('input-email').key}>
            <Input
              type={get('input-email').props.variant || 'email'}
              name={get('input-email').props.name || 'email'}
              label={get('input-email').props.label || 'E-post'}
              placeholder={get('input-email').props.placeholder || 'din@email.com'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <EnvelopeIcon />
                </Icon>
              }
              required={get('input-email').props.required !== false}
              size="md"
              radius="md"
              style={{ width: '100%' }}
              onChange={handleChange}
              disabled={loading}
            />
          </GridItem>
        )}

        {/* Message Field - colSpan 2 (full width) */}
        {renderIf('textarea-message') && (
          <GridItem colSpan={get('textarea-message').props.colSpan || 2} data-component-key={get('textarea-message').key}>
            <Textarea
              name={get('textarea-message').props.name || 'message'}
              label={get('textarea-message').props.label || 'Meddelande'}
              placeholder={get('textarea-message').props.placeholder || 'Skriv ditt meddelande här...'}
              rows={get('textarea-message').props.rows || 4}
              required={get('textarea-message').props.required !== false}
              onChange={handleChange}
              disabled={loading}
            />
          </GridItem>
        )}

        {/* Submit Button - colSpan 2 (full width) */}
        {renderIf('button-submit') && (
          <GridItem colSpan={get('button-submit').props.colSpan || 2} data-component-key={get('button-submit').key}>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              radius="md"
              disabled={loading}
              rightIcon={
                <Icon size="sm" color="button-primary">
                  <ArrowRightIcon />
                </Icon>
              }
              style={{ width: '100%' }}
            >
              {loading ? 'Skickar...' : (get('button-submit').props.content || 'Skicka')}
            </Button>

            {/* Success Message */}
            {success && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--surface-success-subtle)',
                border: '1px solid var(--border-success)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icon size="sm" color="success">
                  <CheckCircleIcon />
                </Icon>
                <Body size="sm" color="success" style={{ margin: 0 }}>
                  {message || 'Tack! Vi har tagit emot ditt meddelande.'}
                </Body>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div style={{ 
                marginTop: '16px', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                backgroundColor: 'var(--surface-error-subtle)',
                border: '1px solid var(--border-error)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Icon size="sm" color="error">
                  <XCircleIcon />
                </Icon>
                <Body size="sm" color="error" style={{ margin: 0 }}>
                  {error}
                </Body>
              </div>
            )}
          </GridItem>
        )}

      </Grid>
    </form>
  );
};

GridForm.displayName = 'GridForm';

export default GridForm;