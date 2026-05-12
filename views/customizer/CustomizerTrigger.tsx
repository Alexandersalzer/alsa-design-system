"use client";

import React, { useState } from 'react';
import { IconButton, Icon } from '../../design/index';
import { SwatchIcon } from '@heroicons/react/24/outline';
import { DesignCustomizer, useCustomizer } from './DesignCustomizer';

/**
 * Floating trigger button — bottom-right, opens the design customizer modal.
 * Mount once near the root of the docs app.
 */
export const CustomizerTrigger: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { state, update, reset } = useCustomizer();

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
        }}
      >
        <IconButton
          variant="accent"
          size="lg"
          aria-label="Open design customizer"
          onClick={() => setOpen(true)}
          icon={<Icon><SwatchIcon /></Icon>}
        />
      </div>
      <DesignCustomizer
        isOpen={open}
        onClose={() => setOpen(false)}
        state={state}
        update={update}
        reset={reset}
      />
    </>
  );
};
