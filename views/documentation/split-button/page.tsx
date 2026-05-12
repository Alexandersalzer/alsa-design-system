"use client";

import React, { useState } from 'react';
import {
  Box,
  Body,
  SplitButton,
  Icon,
} from '../../../design/index';

import {
  DocumentDuplicateIcon,
  CloudArrowDownIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';

export default function SplitButtonPage() {
  const [lastAction, setLastAction] = useState<string>('');

  const saveOptions = [
    { value: 'save', label: 'Save', onClick: () => setLastAction('Saved') },
    { value: 'save-draft', label: 'Save as Draft', onClick: () => setLastAction('Saved as Draft') },
    { value: 'save-publish', label: 'Save & Publish', onClick: () => setLastAction('Saved & Published') },
  ];

  const exportOptions = [
    { value: 'pdf', label: 'Export as PDF', onClick: () => setLastAction('Exported as PDF') },
    { value: 'csv', label: 'Export as CSV', onClick: () => setLastAction('Exported as CSV') },
    { value: 'json', label: 'Export as JSON', onClick: () => setLastAction('Exported as JSON') },
  ];

  const editOptions = [
    { value: 'edit', label: 'Edit', onClick: () => setLastAction('Edit') },
    { value: 'duplicate', label: 'Duplicate', onClick: () => setLastAction('Duplicated') },
    { value: 'delete', label: 'Delete', description: 'Permanently remove', onClick: () => setLastAction('Deleted') },
  ];

  return (
    <ComponentDocPage
      componentName="SplitButton"
      description="A button with a primary action on the left and a dropdown menu on the right for additional options"
      importStatement={`import { SplitButton } from '../../../design/index'`}
      sections={[
        // ===== BASIC USAGE =====
        {
          title: 'Basic Usage',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <SplitButton
                onClick={() => setLastAction('Primary: Saved')}
                options={saveOptions}
              >
                Save
              </SplitButton>
              {lastAction && (
                <Body size="sm" color="secondary">
                  Last action: {lastAction}
                </Body>
              )}
            </Box>
          ),
          code: `const saveOptions = [
  { value: 'save', label: 'Save', onClick: () => save() },
  { value: 'save-draft', label: 'Save as Draft', onClick: () => saveDraft() },
  { value: 'save-publish', label: 'Save & Publish', onClick: () => savePublish() },
];

<SplitButton
  onClick={() => save()}
  options={saveOptions}
>
  Save
</SplitButton>`,
        },

        // ===== SIZES =====
        {
          title: 'Sizes',
          preview: (
            <Box
              display="grid"
              gap="md"
              className="grid-cols-1 sm:grid-cols-3"
            >
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  size="sm"
                  onClick={() => setLastAction('Small: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">size="sm"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  size="md"
                  onClick={() => setLastAction('Medium: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">size="md"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  size="lg"
                  onClick={() => setLastAction('Large: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">size="lg"</Body>
              </Box>
            </Box>
          ),
          code: `<SplitButton size="sm" onClick={save} options={opts}>Save</SplitButton>

<SplitButton size="md" onClick={save} options={opts}>Save</SplitButton>

<SplitButton size="lg" onClick={save} options={opts}>Save</SplitButton>`        },

        // ===== VARIANTS =====
        {
          title: 'Variants',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  variant="primary"
                  onClick={() => setLastAction('Primary: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">variant="primary"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  variant="secondary"
                  onClick={() => setLastAction('Secondary: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">variant="secondary"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  variant="accent"
                  onClick={() => setLastAction('Accent: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">variant="accent"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  variant="ghost"
                  onClick={() => setLastAction('Ghost: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">variant="ghost"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  variant="outline"
                  onClick={() => setLastAction('Outline: Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">variant="outline"</Body>
              </Box>
            </Box>
          ),
          code: `<SplitButton variant="primary" onClick={save} options={opts}>Save</SplitButton>

<SplitButton variant="secondary" onClick={save} options={opts}>Save</SplitButton>

<SplitButton variant="accent" onClick={save} options={opts}>Save</SplitButton>

<SplitButton variant="ghost" onClick={save} options={opts}>Save</SplitButton>

<SplitButton variant="outline" onClick={save} options={opts}>Save</SplitButton>`        },

        // ===== USE CASES =====
        {
          title: 'Common Use Cases',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  onClick={() => setLastAction('Downloaded')}
                  options={exportOptions}
                >
                  Export
                </SplitButton>
                <Body size="xs" color="secondary">Export with formats</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  variant="secondary"
                  onClick={() => setLastAction('Edited')}
                  options={editOptions}
                >
                  Edit
                </SplitButton>
                <Body size="xs" color="secondary">Edit with actions</Body>
              </Box>
            </Box>
          ),
          code: `const exportOptions = [
  { value: 'pdf', label: 'Export as PDF' },
  { value: 'csv', label: 'Export as CSV' },
  { value: 'json', label: 'Export as JSON' },
];

<SplitButton onClick={download} options={exportOptions}>
  Export
</SplitButton>

const editOptions = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete', description: 'Permanently remove' },
];

<SplitButton variant="secondary" onClick={edit} options={editOptions}>
  Edit
</SplitButton>`        },

        // ===== WITH DESCRIPTIONS =====
        {
          title: 'Options with Descriptions',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="md"
              align="center"
              justify="center"
            >
              <SplitButton
                onClick={() => setLastAction('Published Now')}
                options={[
                  { 
                    value: 'now', 
                    label: 'Publish Now', 
                    description: 'Available immediately',
                    onClick: () => setLastAction('Published Now') 
                  },
                  { 
                    value: 'schedule', 
                    label: 'Schedule', 
                    description: 'Set a future date',
                    onClick: () => setLastAction('Scheduled') 
                  },
                  { 
                    value: 'draft', 
                    label: 'Save as Draft', 
                    description: 'Not visible to public',
                    onClick: () => setLastAction('Saved as Draft') 
                  },
                ]}
              >
                Publish
              </SplitButton>
              {lastAction && (
                <Body size="sm" color="secondary">
                  Last action: {lastAction}
                </Body>
              )}
            </Box>
          ),
          code: `const options = [
  { 
    value: 'now', 
    label: 'Publish Now', 
    description: 'Available immediately',
    onClick: () => publishNow() 
  },
  { 
    value: 'schedule', 
    label: 'Schedule', 
    description: 'Set a future date',
    onClick: () => schedule() 
  },
];

<SplitButton onClick={publish} options={options}>
  Publish
</SplitButton>`,
        },

        // ===== MENU ALIGNMENT =====
        {
          title: 'Menu Alignment',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1 sm:grid-cols-2">
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  menuAlignment="bottom-start"
                  onClick={() => setLastAction('Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">menuAlignment="bottom-start"</Body>
              </Box>
              <Box display="flex" direction="column" gap="sm" align="center" justify="center">
                <SplitButton
                  menuAlignment="bottom-end"
                  onClick={() => setLastAction('Saved')}
                  options={saveOptions}
                >
                  Save
                </SplitButton>
                <Body size="xs" color="secondary">menuAlignment="bottom-end"</Body>
              </Box>
            </Box>
          ),
          code: `<SplitButton menuAlignment="bottom-start" options={opts}>Save</SplitButton>

<SplitButton menuAlignment="bottom-end" options={opts}>Save</SplitButton>`        },

        // ===== DISABLED =====
        {
          title: 'Disabled State',
          preview: (
            <Box
              display="flex"
              direction="column"
              gap="sm"
              align="center"
              justify="center"
            >
              <SplitButton
                disabled
                onClick={() => {}}
                options={saveOptions}
              >
                Save
              </SplitButton>
              <Body size="xs" color="secondary">disabled</Body>
            </Box>
          ),
          code: `<SplitButton disabled onClick={save} options={opts}>
  Save
</SplitButton>`,
        },
      ]}
    />
  );
}
