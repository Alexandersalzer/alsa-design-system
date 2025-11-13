'use client';

import React, { useState } from 'react';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { MenuIcon } from 'lucide-react';
import { Modal } from '../../../components/overlays/Modal/Modal';
import { useComponentProps, componentPresent, usePatternProps, useMapComponents, CDN_BASE_URL } from '../../../core/utils/helpers';
import { alignMap } from '../utils';
import './NavbarPill.css';
import { PatternNode } from '../../../core/types/nodes';

const NavbarPill = (patternNode: PatternNode) => {
  const { components = {} } = patternNode;
  const getComponent = useComponentProps(components);
  const getPatternProps = usePatternProps(patternNode);
  const renderIf = componentPresent(components);
  const mapComponentIndices = useMapComponents(components);

  const [mobileOpen, setMobileOpen] = useState(false);
  const align = alignMap[getPatternProps().menuAlign] || 'center';

  return (
    <>
      <nav className="navbar-pill">
        <Box className="navbar-pill__container">
          {/* LEFT */}
          <HStack align="center" spacing="sm" className="navbar-pill__left">
            {renderIf('logo') && (
              <img
                src={`${CDN_BASE_URL}${getComponent('logo').src}`}
                alt={getComponent('logo').alt || 'Logo'}
                className="navbar-pill__logo"
                width={getComponent('logo').width || 40}
                height={getComponent('logo').height || 40}
              />
            )}
            {renderIf('typography', 'businessName') && (
              <TextLink href="/" className="navbar-pill__brand">
                {getComponent('typography', 'businessName').content}
              </TextLink>
            )}
          </HStack>

          {/* MIDDLE */}
          {renderIf('textlink', 'menuItem') && (
            <HStack
              className={`navbar-pill__middle navbar-pill__middle--${align}`}
              spacing="lg"
            >
              {mapComponentIndices('textlink', 'menuItem')
                .slice(0, getPatternProps().maxMenuItems)
                .map((props, i) => (
                <TextLink
                  key={i}
                  href={props.href || '/'}
                  size="md"
                  underline="hover"
                >
                  {props.content}
                </TextLink>
              ))}
            </HStack>
          )}

          {/* RIGHT */}
          <HStack spacing="sm" className="navbar-pill__right">
            {renderIf('button', 'secondaryAction') && (
              <Button variant="ghost" href={getComponent('button', 'secondaryAction').href}>
                {getComponent('button', 'secondaryAction').content}
              </Button>
            )}
            {renderIf('button', 'primaryAction') && (
              <Button variant="primary" href={getComponent('button', 'primaryAction').href}>
                {getComponent('button', 'primaryAction').content}
              </Button>
            )}
          </HStack>

          {/* MOBILE TOGGLE - separate from right group */}
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(true)}
            className="navbar-pill__mobile-toggle"
            icon={<MenuIcon />}
          />
        </Box>
      </nav>

      {/* MOBILE MODAL MENU */}
      <Modal
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        size="full"
        title={getComponent('typography', 'businessName').content || 'Meny'}
        showCloseButton
      >
        <VStack spacing="xl" align="center" className="navbar-pill__modal-menu">
          {renderIf('textlink', 'menuItem') && mapComponentIndices('textlink', 'menuItem')
            .map((props, i) => (
            <TextLink
              key={i}
              href={props.href || '/'}
              onClick={() => setMobileOpen(false)}
              className="navbar-pill__modal-link"
            >
              {props.content}
            </TextLink>
          ))}

          <VStack spacing="sm" className="navbar-pill__modal-actions">
            {renderIf('button', 'secondaryAction') && (
              <Button
                variant="ghost"
                href={getComponent('button', 'secondaryAction').href}
                onClick={() => setMobileOpen(false)}
              >
                {getComponent('button', 'secondaryAction').content}
              </Button>
            )}
            {renderIf('button', 'primaryAction') && (
              <Button
                variant="primary"
                href={getComponent('button', 'primaryAction').href}
                onClick={() => setMobileOpen(false)}
              >
                {getComponent('button', 'primaryAction').content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Modal>
    </>
  );
};

export default NavbarPill;
