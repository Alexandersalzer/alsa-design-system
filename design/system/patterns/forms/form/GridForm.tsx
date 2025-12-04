'use client';

import React from 'react';
import { Grid, GridItem } from '../../../components/layout';
import { Button, Input, Textarea, Icon } from '../../../components';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { PatternNode } from '../../../core/types/nodes';
import { 
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// ===== MAIN KJ FORM COMPONENT =====
const GridForm = ({ components = {} }: PatternNode) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Form submitted:', Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="kj-contact-form">
      <Grid columns={2} gap="md">
        
        {/* Name Field - colSpan 1 */}
        {renderIf('input-name') && (
          <GridItem colSpan={get('input-name').props.colSpan || 1}>
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
              required={get('input-name').props.required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Business Field - colSpan 1 */}
        {renderIf('input-business') && (
          <GridItem colSpan={get('input-business').props.colSpan || 1}>
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
              required={get('input-business').props.required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Email Field - colSpan 2 (full width) */}
        {renderIf('input-email') && (
          <GridItem colSpan={get('input-email').props.colSpan || 2}>
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
              required={get('input-email').props.required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Message Field - colSpan 2 (full width) */}
        {renderIf('textarea-message') && (
          <GridItem colSpan={get('textarea-message').props.colSpan || 2}>
            <Textarea
              name={get('textarea-message').props.name || 'message'}
              label={get('textarea-message').props.label || 'Meddelande'}
              placeholder={get('textarea-message').props.placeholder || 'Skriv ditt meddelande här...'}
              rows={get('textarea-message').props.rows || 4}
              required={get('textarea-message').props.required || true}
            />
          </GridItem>
        )}

        {/* Submit Button - colSpan 2 (full width) */}
        {renderIf('button-submit') && (
          <GridItem colSpan={get('button-submit').props.colSpan || 2}>
            <Button
              type="submit"
              variant="accent"
              size="lg"
              radius="md"
              rightIcon={
                <Icon size="sm" color="button-primary">
                  <ArrowRightIcon />
                </Icon>
              }
              style={{ width: '100%' }}
            >
              {get('button-submit').props.content || 'Skicka'}
            </Button>
          </GridItem>
        )}

      </Grid>
    </form>
  );
};

GridForm.displayName = 'GridForm';

export default GridForm;