'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { Popover } from '../../components/overlays/Popover/Popover';
import { VStack } from '../../components/layout/vStack/VStack';
import { Button, TextLink } from '../../components';
import styles from './NavbarPill.module.css';

export const NavbarPill = (props: any) => {
  return (
    <Popover modal>
      <Navbar
        {...props}
        className={`${styles['navbar-pill']} ${props.className || ''}`}
        renderMobileMenu={(items) => (
          <Popover.Content
            className={styles['navbar-pill__popover']}
            positioning={{ placement: 'bottom', offset: 8 }}
          >
            <VStack spacing="md" align="stretch">
              {items.map((item: any, i: number) =>
                item.componentType === 'textlink' ? (
                  <TextLink
                    key={i}
                    href={item.href}
                    size="lg"
                    className={styles['navbar-pill__link']}
                  >
                    {item.label}
                  </TextLink>
                ) : (
                  <Button
                    key={i}
                    href={item.href}
                    variant={item.variant || 'primary'}
                    size="lg"
                    className={styles['navbar-pill__button']}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </VStack>
          </Popover.Content>
        )}
      />

      {/* Mobile toggle inside Popover.Trigger */}
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          size="md"
          aria-label="Toggle menu"
          className={styles['navbar-pill__toggle']}
        >
          ☰
        </Button>
      </Popover.Trigger>
    </Popover>
  );
};
