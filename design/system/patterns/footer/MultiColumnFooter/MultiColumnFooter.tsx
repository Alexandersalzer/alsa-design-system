// ===============================================
// MultiColumnFooter.tsx - Multi-column footer with navigation and actions
// ===============================================

'use client';

import React from 'react';
import { HStack, VStack, Typography, Button } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { TextLink } from '../../../components/actions/TextLink';
import { PatternNode } from '../../../core/types/nodes';
import { CDN_BASE_URL } from '../../../core/utils/env';
import './MultiColumnFooter.css';

interface MultiColumnFooterProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

export const MultiColumnFooter: React.FC<MultiColumnFooterProps> = ({
  components = {},
  sectionKey,
  patternKey
}) => {
  // Helper to safely get component by key
  const getComp = (key: string) => components[key];
  const hasComp = (key: string) => !!components[key];

  // Check if there are any legal links
  const legalLinks = Object.keys(components).filter(key => key.startsWith('legal-link-'));
  const hasLegalLinks = legalLinks.length > 0;

  // Build logo props
  const logoProps = {
    src: hasComp('logo') && getComp('logo').props?.src ? `${CDN_BASE_URL}${getComp('logo').props.src}` : undefined,
    alt: hasComp('logo') ? (getComp('logo').props?.alt || 'Logo') : undefined,
    text: hasComp('logo-text') ? getComp('logo-text').props?.content : undefined,
    href: '/',
    width: hasComp('logo') ? (getComp('logo').props?.width || 40) : undefined,
    height: hasComp('logo') ? (getComp('logo').props?.height || 40) : undefined,
    color: hasComp('logo') ? (getComp('logo').props?.color || 'light') : 'light' as const,
    textSize: 'md' as const,
    textWeight: 'semibold' as const,
    gap: 'md' as const,
    loading: 'lazy' as const,
    componentKey: hasComp('logo') ? 'logo' : undefined,
    textComponentKey: hasComp('logo-text') ? 'logo-text' : undefined,
  };

  return (
    <div className="modern-footer">
      {/* Top Section - Multi Column Layout */}
      <div className="modern-footer__top">
        {/* Column 1 - Logo + Description */}
        <VStack spacing="md" align="start" className="modern-footer__column">
          <Logo {...logoProps} />
          {hasComp('description') && getComp('description').props.content && (
            <Typography
              variant="body-sm"
              color="tertiary"
              componentKey="description"
            >
              {getComp('description').props.content}
            </Typography>
          )}
        </VStack>

        {/* Column 2 - Pages/Links */}
        {hasComp('link-group-1') && (
          <VStack spacing="md" align="start" className="modern-footer__column">
            {hasComp('link-heading-1') && getComp('link-heading-1').props.content && (
              <Typography
                variant="body-md"
                weight="semibold"
                color="secondary"
                componentKey="link-heading-1"
              >
                {getComp('link-heading-1').props.content}
              </Typography>
            )}
            <VStack spacing="xs" align="start">
              {Object.keys(components).filter(key => key.startsWith('link-1-')).map(key => {
                const linkComp = getComp(key);
                return linkComp && linkComp.props.content ? (
                  <TextLink
                    key={key}
                    href={linkComp.props.href || '#'}
                    variant="ghost"
                    size="sm"
                    componentKey={key}
                  >
                    {linkComp.props.content}
                  </TextLink>
                ) : null;
              })}
            </VStack>
          </VStack>
        )}

        {/* Column 3 - Services/Links */}
        {hasComp('link-group-2') && (
          <VStack spacing="md" align="start" className="modern-footer__column">
            {hasComp('link-heading-2') && getComp('link-heading-2').props.content && (
              <Typography
                variant="body-md"
                weight="semibold"
                color="secondary"
                componentKey="link-heading-2"
              >
                {getComp('link-heading-2').props.content}
              </Typography>
            )}
            <VStack spacing="xs" align="start">
              {Object.keys(components).filter(key => key.startsWith('link-2-')).map(key => {
                const linkComp = getComp(key);
                return linkComp && linkComp.props.content ? (
                  <TextLink
                    key={key}
                    href={linkComp.props.href || '#'}
                    variant="ghost"
                    size="sm"
                    componentKey={key}
                  >
                    {linkComp.props.content}
                  </TextLink>
                ) : null;
              })}
            </VStack>
          </VStack>
        )}

        {/* Column 4 - Contact + Actions */}
        <VStack spacing="lg" align="start" className="modern-footer__column modern-footer__column--actions">
          {hasComp('contact-heading') && getComp('contact-heading').props.content && (
            <Typography
              variant="body-md"
              weight="semibold"
              color="secondary"
              componentKey="contact-heading"
            >
              {getComp('contact-heading').props.content}
            </Typography>
          )}

          {/* Contact Info */}
          <VStack spacing="xs" align="start">
            {hasComp('contact-email') && getComp('contact-email').props.content && (
              <TextLink
                href={`mailto:${getComp('contact-email').props.content}`}
                variant="ghost"
                size="sm"
                componentKey="contact-email"
              >
                {getComp('contact-email').props.content}
              </TextLink>
            )}
            {hasComp('contact-phone') && getComp('contact-phone').props.content && (
              <TextLink
                href={`tel:${getComp('contact-phone').props.content}`}
                variant="ghost"
                size="sm"
                componentKey="contact-phone"
              >
                {getComp('contact-phone').props.content}
              </TextLink>
            )}
          </VStack>

          {/* Action Buttons */}
          <VStack spacing="sm" align="start" fullWidth>
            {hasComp('button-primary') && getComp('button-primary').props.content && (
              <Button
                variant="accent"
                size="md"
                href={getComp('button-primary').props.href}
                action={getComp('button-primary').props.action}
                fullWidth
                componentKey="button-primary"
              >
                {getComp('button-primary').props.content}
              </Button>
            )}
            {hasComp('button-secondary') && getComp('button-secondary').props.content && (
              <Button
                variant="secondary"
                size="md"
                href={getComp('button-secondary').props.href}
                action={getComp('button-secondary').props.action}
                fullWidth
                componentKey="button-secondary"
              >
                {getComp('button-secondary').props.content}
              </Button>
            )}
          </VStack>
        </VStack>
      </div>

      {/* Bottom Section - Legal + Copyright */}
      <div className="modern-footer__bottom">
        <HStack
          spacing="md"
          justify={hasLegalLinks ? "between" : "center"}
          align="center"
          className="modern-footer__bottom-content"
        >
          {/* Legal Links - Hidden if none exist */}
          {hasLegalLinks && (
            <HStack spacing="md" align="center">
              {legalLinks.map(key => {
                const linkComp = getComp(key);
                return linkComp && linkComp.props.content ? (
                  <TextLink
                    key={key}
                    href={linkComp.props.href || '#'}
                    variant="ghost"
                    size="sm"
                    componentKey={key}
                  >
                    {linkComp.props.content}
                  </TextLink>
                ) : null;
              })}
            </HStack>
          )}

          {/* Copyright - Centered when no legal links */}
          {hasComp('copyright') && getComp('copyright').props.content && (
            <Typography
              variant="body-sm"
              color="tertiary"
              componentKey="copyright"
            >
              {getComp('copyright').props.content}
            </Typography>
          )}
        </HStack>
      </div>
    </div>
  );
};

export default MultiColumnFooter;
