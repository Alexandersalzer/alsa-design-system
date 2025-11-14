'use client';

import React from 'react';
import { Grid, GridItem } from '../../../components/layout';
import { Button, Input, Textarea, Icon } from '../../../components';
import { useComponentProps, componentPresent } from '../../../core/utils/helpers';
import { PatternNode } from '../../../core/types/nodes';
import { 
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// ===== MAIN KJ FORM COMPONENT =====
const KjForm = ({ components = {} }: PatternNode) => {
  const get = useComponentProps(components);
  const renderIf = componentPresent(components);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('Form submitted:', Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="kj-contact-form">
      <Grid columns={2} gap="md" className="form-grid">
        
        {/* Name Field - colSpan 1 */}
        {renderIf('name') && (
          <GridItem colSpan={1}>
            <Input
              type="text"
              name={get('name').name || 'name'}
              label={get('name').label || 'Namn'}
              placeholder={get('name').placeholder || 'Förnamn'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <UserIcon />
                </Icon>
              }
              required={get('name').required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Business Field - colSpan 1 */}
        {renderIf('business') && (
          <GridItem colSpan={1}>
            <Input
              type="text"
              name={get('business').name || 'business'}
              label={get('business').label || 'Företag'}
              placeholder={get('business').placeholder || 'Företagsnamn'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <BuildingOfficeIcon />
                </Icon>
              }
              required={get('business').required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Email Field - colSpan 2 (full width) */}
        {renderIf('email') && (
          <GridItem colSpan={2}>
            <Input
              type="email"
              name={get('email').name || 'email'}
              label={get('email').label || 'E-post'}
              placeholder={get('email').placeholder || 'din@email.com'}
              leftIcon={
                <Icon size="sm" color="secondary">
                  <EnvelopeIcon />
                </Icon>
              }
              required={get('email').required || true}
              size="md"
              radius="md"
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Message Field - colSpan 2 (full width) */}
        {renderIf('message') && (
          <GridItem colSpan={2}>
            <Textarea
              name={get('message').name || 'message'}
              label={get('message').label || 'Meddelande'}
              placeholder={get('message').placeholder || 'Skriv ditt meddelande här...'}
              rows={get('message').rows || 4}
              required={get('message').required || true}
              style={{ width: '100%' }}
            />
          </GridItem>
        )}

        {/* Submit Button - colSpan 2 (full width) */}
        {renderIf('submit') && (
          <GridItem colSpan={2}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              radius="md"
              rightIcon={
                <Icon size="sm" color="button-primary">
                  <ArrowRightIcon />
                </Icon>
              }
              style={{ width: '100%' }}
            >
              {get('submit').content?.content || 'Skicka'}
            </Button>
          </GridItem>
        )}

      </Grid>
    </form>
  );
};

KjForm.displayName = 'KjForm';

export default KjForm;