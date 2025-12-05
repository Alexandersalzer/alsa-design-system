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
          <GridItem colSpan={get('input-name').colSpan || 1}>
            <Input
              type={get('input-name').variant || 'text'}
              name={get('input-name').name || 'name'}
              label={get('input-name').label || 'Namn'}
              placeholder={get('input-name').placeholder || 'Förnamn'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <UserIcon />
                </Icon>
              }
              required={get('input-name').required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Business Field - colSpan 1 */}
        {renderIf('input-business') && (
          <GridItem colSpan={get('input-business').colSpan || 1}>
            <Input
              type={get('input-business').variant || 'text'}
              name={get('input-business').name || 'business'}
              label={get('input-business').label || 'Företag'}
              placeholder={get('input-business').placeholder || 'Företagsnamn'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <BuildingOfficeIcon />
                </Icon>
              }
              required={get('input-business').required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Email Field - colSpan 2 (full width) */}
        {renderIf('input-email') && (
          <GridItem colSpan={get('input-email').colSpan || 2}>
            <Input
              type={get('input-email').variant || 'email'}
              name={get('input-email').name || 'email'}
              label={get('input-email').label || 'E-post'}
              placeholder={get('input-email').placeholder || 'din@email.com'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <EnvelopeIcon />
                </Icon>
              }
              required={get('input-email').required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Message Field - colSpan 2 (full width) */}
        {renderIf('textarea-message') && (
          <GridItem colSpan={get('textarea-message').colSpan || 2}>
            <Textarea
              name={get('textarea-message').name || 'message'}
              label={get('textarea-message').label || 'Meddelande'}
              placeholder={get('textarea-message').placeholder || 'Skriv ditt meddelande här...'}
              rows={get('textarea-message').rows || 4}
              required={get('textarea-message').required || true}
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Submit Button - colSpan 2 (full width) */}
        {renderIf('button-submit') && (
          <GridItem colSpan={get('button-submit').colSpan || 2}>
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
              {get('button-submit').content || 'Skicka'}
            </Button>
          </GridItem>
        )}

      </Grid>
    </form>
  );
};

GridForm.displayName = 'GridForm';

export default GridForm;