"use client";

import React, { useState } from 'react';
import { VStack, Body, Checkbox } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function CheckboxPage() {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);

  return (
    <ComponentDocPage
      componentName="Checkbox"
      description="Checkbox input for binary choices, confirmations, and multi-select preference groups"
      importStatement={`import { Checkbox } from '../../../design/index';`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Controlled checkbox with label',
          preview: (
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              label="Accept terms and conditions"
            />
          ),
          code: `import { useState } from 'react';
import { Checkbox } from '../../../design/index';

export function BasicCheckbox() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      label="Accept terms and conditions"
    />
  );
}`,
        },

        {
          title: 'States',
          description: 'Unchecked, checked, and disabled checkbox states',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 360 }}>
              <Checkbox checked={false} label="Unchecked" />
              <Checkbox checked={true} label="Checked" />
              <Checkbox checked={false} disabled label="Disabled" />
            </VStack>
          ),
          code: `import { Checkbox } from '../../../design/index';

export function CheckboxStates() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Checkbox checked={false} label="Unchecked" />
      <Checkbox checked={true} label="Checked" />
      <Checkbox checked={false} disabled label="Disabled" />
    </div>
  );
}`,
        },

        {
          title: 'Practical Examples',
          description: 'Common checkbox group pattern for user preferences',
          preview: (
            <VStack spacing="md" align="stretch" style={{ width: '100%', maxWidth: 420 }}>
              <Body weight="medium">Notification Preferences</Body>

              <Checkbox
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                label="Email notifications"
              />

              <Checkbox
                checked={checked2}
                onChange={(e) => setChecked2(e.target.checked)}
                label="Push notifications"
              />

              <Checkbox
                checked={false}
                label="SMS notifications"
              />
            </VStack>
          ),
          code: `import { useState } from 'react';
import { Checkbox, Body, VStack } from '../../../design/index';

export function NotificationPreferences() {
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);

  return (
    <VStack spacing="md" align="stretch">
      <Body weight="medium">Notification Preferences</Body>

      <Checkbox
        checked={emailEnabled}
        onChange={(e) => setEmailEnabled(e.target.checked)}
        label="Email notifications"
      />

      <Checkbox
        checked={pushEnabled}
        onChange={(e) => setPushEnabled(e.target.checked)}
        label="Push notifications"
      />

      <Checkbox
        checked={smsEnabled}
        onChange={(e) => setSmsEnabled(e.target.checked)}
        label="SMS notifications"
      />
    </VStack>
  );
}`,
        },
      ]}
      properties={[
        { name: 'checked', type: 'boolean', description: 'Controlled checked state' },
        { name: 'defaultChecked', type: 'boolean', description: 'Initial checked state for uncontrolled usage' },
        { name: 'onChange', type: '(event: ChangeEvent<HTMLInputElement>) => void', description: 'Change handler fired when checked state changes' },
        { name: 'label', type: 'string', description: 'Text label shown next to the checkbox' },
        { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the checkbox' },
        { name: 'name', type: 'string', description: 'Native input name attribute' },
        { name: 'value', type: 'string', description: 'Native input value attribute' },
        { name: 'required', type: 'boolean', default: 'false', description: 'Marks the checkbox as required' },
        { name: 'className', type: 'string', description: 'Optional class name for custom styling' },
        { name: 'style', type: 'React.CSSProperties', description: 'Optional inline styles' },
      ]}
    />
  );
}