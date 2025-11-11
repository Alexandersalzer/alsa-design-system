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
    <>
      <Navbar
        {...props}
        className={`${styles['navbar-bar']} ${props.className || ''}`}
        // Replace default toggle logic with drawer control
        renderMobileMenu={(items) => (
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
                    className={styles['navbar-bar__drawer-link']}
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
                    className={styles['navbar-bar__drawer-button']}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </VStack>
          </Drawer>
        )}
      />

      {/* Drawer toggle passed to Navbar via props (open/close controlled externally) */}
      <Button
        variant="ghost"
        size="md"
        aria-label="Toggle menu"
        className="navbar-bar__mobile-toggle"
        onClick={() => setDrawerOpen(true)}
      >
        ☰
      </Button>
    </>
  );
};
