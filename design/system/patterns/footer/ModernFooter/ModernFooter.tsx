// ===============================================
// ModernFooter.tsx - Modern multi-column footer
// ===============================================

'use client';

import React from 'react';
import { HStack, VStack, Typography, Button } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { PatternNode } from '../../../core/types/nodes';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './ModernFooter.css';

interface ModernFooterProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

export const ModernFooter: React.FC<ModernFooterProps> = ({
  components = {},
  sectionKey,
  patternKey
}) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // Build logo props
  const logoProps = {
    src: renderIf('logo') && get('logo').props.src ? `${CDN_BASE_URL}${get('logo').props.src}` : undefined,
    alt: renderIf('logo') ? (get('logo').props.alt || 'Logo') : undefined,
    text: renderIf('logo-text') ? get('logo-text').props.content : undefined,
    href: '/',
    width: renderIf('logo') ? (get('logo').props.width || 40) : undefined,
    height: renderIf('logo') ? (get('logo').props.height || 40) : undefined,
    color: renderIf('logo') ? (get('logo').props.color || 'light') : 'light' as const,
    textSize: 'md' as const,
    textWeight: 'semibold' as const,
    gap: 'md' as const,
    loading: 'lazy' as const,
    componentKey: renderIf('logo') ? get('logo').key : undefined,
    textComponentKey: renderIf('logo-text') ? get('logo-text').key : undefined,
  };

  return (
    <div className="modern-footer">
      {/* Top Section - Multi Column Layout */}
      <div className="modern-footer__top">
        {/* Column 1 - Logo + Description */}
        <VStack spacing="md" align="start" className="modern-footer__column">
          <Logo {...logoProps} />
          {renderIf('description') && get('description').props.content && (
            <Typography
              variant="body-sm"
              color="tertiary"
              componentKey={get('description').key}
            >
              {get('description').props.content}
            </Typography>
          )}
        </VStack>

        {/* Column 2 - Pages/Links */}
        {renderIf('link-group-1') && (
          <VStack spacing="md" align="start" className="modern-footer__column">
            {renderIf('link-heading-1') && get('link-heading-1').props.content && (
              <Typography
                variant="body-md"
                weight="semibold"
                color="secondary"
                componentKey={get('link-heading-1').key}
              >
                {get('link-heading-1').props.content}
              </Typography>
            )}
            <VStack spacing="xs" align="start">
              {Object.keys(components).filter(key => key.startsWith('link-1-')).map(key => {
                const linkComp = get(key);
                return linkComp && linkComp.props.content ? (
                  <a
                    key={key}
                    href={linkComp.props.href || '#'}
                    className="modern-footer__link"
                    data-component-key={linkComp.key}
                  >
                    <Typography variant="body-sm" color="tertiary">
                      {linkComp.props.content}
                    </Typography>
                  </a>
                ) : null;
              })}
            </VStack>
          </VStack>
        )}

        {/* Column 3 - Services/Links */}
        {renderIf('link-group-2') && (
          <VStack spacing="md" align="start" className="modern-footer__column">
            {renderIf('link-heading-2') && get('link-heading-2').props.content && (
              <Typography
                variant="body-md"
                weight="semibold"
                color="secondary"
                componentKey={get('link-heading-2').key}
              >
                {get('link-heading-2').props.content}
              </Typography>
            )}
            <VStack spacing="xs" align="start">
              {Object.keys(components).filter(key => key.startsWith('link-2-')).map(key => {
                const linkComp = get(key);
                return linkComp && linkComp.props.content ? (
                  <a
                    key={key}
                    href={linkComp.props.href || '#'}
                    className="modern-footer__link"
                    data-component-key={linkComp.key}
                  >
                    <Typography variant="body-sm" color="tertiary">
                      {linkComp.props.content}
                    </Typography>
                  </a>
                ) : null;
              })}
            </VStack>
          </VStack>
        )}

        {/* Column 4 - Contact + Actions */}
        <VStack spacing="lg" align="start" className="modern-footer__column modern-footer__column--actions">
          {renderIf('contact-heading') && get('contact-heading').props.content && (
            <Typography
              variant="body-md"
              weight="semibold"
              color="secondary"
              componentKey={get('contact-heading').key}
            >
              {get('contact-heading').props.content}
            </Typography>
          )}

          {/* Contact Info */}
          <VStack spacing="xs" align="start">
            {renderIf('contact-email') && get('contact-email').props.content && (
              <a
                href={`mailto:${get('contact-email').props.content}`}
                className="modern-footer__link"
              >
                <Typography
                  variant="body-sm"
                  color="tertiary"
                  componentKey={get('contact-email').key}
                >
                  {get('contact-email').props.content}
                </Typography>
              </a>
            )}
            {renderIf('contact-phone') && get('contact-phone').props.content && (
              <a
                href={`tel:${get('contact-phone').props.content}`}
                className="modern-footer__link"
              >
                <Typography
                  variant="body-sm"
                  color="tertiary"
                  componentKey={get('contact-phone').key}
                >
                  {get('contact-phone').props.content}
                </Typography>
              </a>
            )}
          </VStack>

          {/* Action Buttons */}
          <VStack spacing="sm" align="start" fullWidth>
            {renderIf('button-primary') && get('button-primary').props.content && (
              <Button
                variant="accent"
                size="md"
                href={get('button-primary').props.href}
                action={get('button-primary').props.action}
                fullWidth
                componentKey={get('button-primary').key}
              >
                {get('button-primary').props.content}
              </Button>
            )}
            {renderIf('button-secondary') && get('button-secondary').props.content && (
              <Button
                variant="secondary"
                size="md"
                href={get('button-secondary').props.href}
                action={get('button-secondary').props.action}
                fullWidth
                componentKey={get('button-secondary').key}
              >
                {get('button-secondary').props.content}
              </Button>
            )}
          </VStack>
        </VStack>
      </div>

      {/* Bottom Section - Legal + Copyright */}
      <div className="modern-footer__bottom">
        <HStack spacing="md" justify="between" align="center" className="modern-footer__bottom-content">
          {/* Legal Links */}
          <HStack spacing="md" align="center">
            {Object.keys(components).filter(key => key.startsWith('legal-link-')).map(key => {
              const linkComp = get(key);
              return linkComp && linkComp.props.content ? (
                <a
                  key={key}
                  href={linkComp.props.href || '#'}
                  className="modern-footer__legal-link"
                  data-component-key={linkComp.key}
                >
                  <Typography variant="body-sm" color="tertiary">
                    {linkComp.props.content}
                  </Typography>
                </a>
              ) : null;
            })}
          </HStack>

          {/* Copyright */}
          {renderIf('copyright') && get('copyright').props.content && (
            <Typography
              variant="body-sm"
              color="tertiary"
              componentKey={get('copyright').key}
            >
              {get('copyright').props.content}
            </Typography>
          )}
        </HStack>
      </div>
    </div>
  );
};

export default ModernFooter;
