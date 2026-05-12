"use client";

import React, { useState } from 'react';
import { Box, Body, Switch } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function SwitchPage() {
  const [enabled, setEnabled] = useState(false);
  const [enabled2, setEnabled2] = useState(true);

  return (
    <ComponentDocPage
      componentName="Switch"
      description="Toggle switch for on/off settings and feature toggles"
      importStatement={`import { Switch } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          preview: (
            <Box display="flex" justify="center">
              <Switch checked={enabled} onChange={setEnabled} label="Enable notifications" />
            </Box>
          ),
          code: `const [enabled, setEnabled] = useState(false);

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable notifications"
/>`,
        },
        {
          title: 'States',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Switch checked={false} onChange={() => {}} label="Off" />
              </Box>
              <Box>
                <Switch checked={true} onChange={() => {}} label="On" />
              </Box>
              <Box>
                <Switch checked={false} disabled onChange={() => {}} label="Disabled" />
              </Box>
            </Box>
          ),
          code: `<Switch checked={false} onChange={setOff} label="Off" />

<Switch checked={true} onChange={setOn} label="On" />

<Switch checked={false} disabled onChange={setDisabled} label="Disabled" />`,
        },
        {
          title: 'With Descriptions',
          description: 'Switches with descriptive text for better context',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  label="Email Notifications"
                  description="Receive email updates about your account activity"
                />
              </Box>
              <Box>
                <Switch
                  checked={enabled2}
                  onChange={setEnabled2}
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
              </Box>
            </Box>
          ),
          code: `const [enabled, setEnabled] = useState(false);

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Email Notifications"
  description="Receive email updates about your account activity"
/>`,
        },

        {
          title: 'Label Position',
          description: 'Control label placement relative to the switch',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box display="flex" direction="column" gap="sm">
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  label="Label on Right"
                  description="This is the default position"
                  labelPosition="right"
                />
                <Body size="xs" color="secondary">labelPosition="right" (default)</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm">
                <Switch
                  checked={enabled2}
                  onChange={setEnabled2}
                  label="Label on Left"
                  description="Label appears on the left side"
                  labelPosition="left"
                />
                <Body size="xs" color="secondary">labelPosition="left"</Body>
              </Box>
            </Box>
          ),
          code: `<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Label on Right"
  labelPosition="right"
/>

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Label on Left"
  labelPosition="left"
/>`        },

        {
          title: 'Validation States',
          description: 'Show error or success states',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Switch
                  checked={false}
                  onChange={() => {}}
                  label="Terms and Conditions"
                  description="You must accept the terms to continue"
                  error="Please accept the terms and conditions"
                />
              </Box>
              <Box>
                <Switch
                  checked={true}
                  onChange={() => {}}
                  label="Email Verified"
                  description="Your email address has been confirmed"
                  success="Email verification complete"
                />
              </Box>
            </Box>
          ),
          code: `<Switch
  checked={false}
  onChange={setChecked}
  label="Terms and Conditions"
  error="Please accept the terms and conditions"
/>

<Switch
  checked={true}
  onChange={setChecked}
  label="Email Verified"
  success="Email verification complete"
/>`        },

        {
          title: 'Practical Example',
          preview: (
            <Box>
              <Box display="flex" direction="column" gap="md">
                <Body weight="medium">Privacy Settings</Body>
                <Switch
                  checked={enabled}
                  onChange={setEnabled}
                  label="Make profile public"
                  description="Your profile will be visible to everyone"
                />
                <Switch
                  checked={enabled2}
                  onChange={setEnabled2}
                  label="Show online status"
                  description="Others can see when you're online"
                />
                <Switch
                  checked={false}
                  onChange={() => {}}
                  label="Allow messages from anyone"
                  description="Anyone can send you messages"
                />
              </Box>
            </Box>
          ),
          code: `const [publicProfile, setPublicProfile] = useState(false);
const [showOnline, setShowOnline] = useState(true);
const [allowMessages, setAllowMessages] = useState(false);

<Box display="flex" direction="column" gap="md">
  <Body weight="medium">Privacy Settings</Body>
  <Switch
    checked={publicProfile}
    onChange={setPublicProfile}
    label="Make profile public"
    description="Your profile will be visible to everyone"
  />
  <Switch
    checked={showOnline}
    onChange={setShowOnline}
    label="Show online status"
    description="Others can see when you're online"
  />
  <Switch
    checked={allowMessages}
    onChange={setAllowMessages}
    label="Allow messages from anyone"
    description="Anyone can send you messages"
  />
</Box>`,
        },
      ]}
    />
  );
}
