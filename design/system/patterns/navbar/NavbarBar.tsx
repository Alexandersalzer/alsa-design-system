'use client';

import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Drawer } from '../../components/overlays/Drawer/Drawer';
import { VStack } from '../../components/layout/vStack/VStack';
import { Button, TextLink } from '../../components';
import styles from './NavbarBar.module.css';

export const NavbarBar = (props: any) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  return (
    <Navbar
      {...props}
      className={`${styles['navbar-bar']} ${props.className || ''}`}
      // Override mobile menu render
      renderMobileMenu={(items) => (
        <>
          {/* Mobile toggle (replaces base’s) */}
          <Button
            variant="ghost"
            size="md"
            aria-label="Toggle menu"
            className={`${styles['navbar-bar__mobile-toggle']} navbar__mobile-toggle`}
            onClick={() => setDrawerOpen(true)}
          >
            ☰
          </Button>

          {/* Drawer itself */}
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setDrawerOpen(false)}
            mobileOverlay
            placement="bottom"
            showCloseButton={false}
            className={styles['navbar-bar__drawer']}
          >
            <VStack spacing="md" align="stretch">
              {items.map((item: any, i: number) =>
                item.componentType === 'textlink' ? (
                  <TextLink
                    key={i}
                    href={item.href}
                    variant="primary"
                    size="lg"
                    onClick={() => setDrawerOpen(false)}
                    className={styles['navbar-bar__mobile-link']}
                  >
                    {item.label}
                  </TextLink>
                ) : (
                  <Button
                    key={i}
                    href={item.href}
                    variant={item.variant || 'primary'}
                    size="lg"
                    onClick={() => setDrawerOpen(false)}
                    className={styles['navbar-bar__mobile-button']}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </VStack>
          </Drawer>
        </>
      )}
    />
  );
};
