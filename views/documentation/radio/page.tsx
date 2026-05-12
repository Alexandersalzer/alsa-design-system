"use client";

import React, { useState } from 'react';
import { Box, Body, Radio } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function RadioPage() {
  const [selected, setSelected] = useState('option1');

  return (
    <ComponentDocPage
      componentName="Radio"
      description="Radio button for selecting a single option from a group of choices"
      importStatement={`import { Radio } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="sm">
                <Radio
                  name="example"
                  value="option1"
                  checked={selected === 'option1'}
                  onChange={() => setSelected('option1')}
                  label="Option 1"
                />
                <Radio
                  name="example"
                  value="option2"
                  checked={selected === 'option2'}
                  onChange={() => setSelected('option2')}
                  label="Option 2"
                />
                <Radio
                  name="example"
                  value="option3"
                  checked={selected === 'option3'}
                  onChange={() => setSelected('option3')}
                  label="Option 3"
                />
              </Box>
            </Box>
          ),
          code: `const [selected, setSelected] = useState('option1');

<Box display="flex" direction="column" gap="sm">
  <Radio name="group" value="option1" checked={selected === 'option1'} onChange={() => setSelected('option1')} label="Option 1" />
  <Radio name="group" value="option2" checked={selected === 'option2'} onChange={() => setSelected('option2')} label="Option 2" />
</Box>`,
        },
        {
          title: 'Practical Example',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="md">
                <Body weight="medium">Shipping Method</Body>
                <Radio name="shipping" value="standard" checked={selected === 'standard'} onChange={() => setSelected('standard')} label="Standard Shipping (5-7 days)" />
                <Radio name="shipping" value="express" checked={selected === 'express'} onChange={() => setSelected('express')} label="Express Shipping (2-3 days)" />
                <Radio name="shipping" value="overnight" checked={selected === 'overnight'} onChange={() => setSelected('overnight')} label="Overnight Shipping" />
              </Box>
            </Box>
          ),
          code: `<Box display="flex" direction="column" gap="md">
  <Body weight="medium">Shipping Method</Body>
  <Radio name="shipping" value="standard" checked={method === 'standard'} onChange={() => setMethod('standard')} label="Standard (5-7 days)" />
  <Radio name="shipping" value="express" checked={method === 'express'} onChange={() => setMethod('express')} label="Express (2-3 days)" />
</Box>`,
        },
      ]}
    />
  );
}
