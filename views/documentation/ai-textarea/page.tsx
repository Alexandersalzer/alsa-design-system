"use client";

import React, { useState } from 'react';
import { Box, VStack, Body, IconButton, Icon } from '../../../design/index';
import { AITextarea } from '../../../design/system/components/ai';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import {
  PlusIcon,
  SparklesIcon,
  ChevronUpDownIcon,
  BoltIcon,
  LightBulbIcon,
  DocumentTextIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';

export default function AITextareaPage() {
  return (
    <ComponentDocPage
      componentName="AITextarea"
      description="AI-style prompt input with leading/trailing action slots, image attachment, quick action chips, and an animated submit button."
      importStatement={`import { AITextarea } from '../../../design/index'`}
      sections={[
        // ── BASIC ──────────────────────────────────────────────────────
        {
          title: 'Basic Usage',
          description: 'A minimal AI prompt input. Enter submits, Shift+Enter inserts a newline.',
          preview: (
            <Box padding="xl" display="flex" justify="center" align="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  placeholder="Ask anything…"
                  onSubmit={(value) => alert(`Submitted: ${value}`)}
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  placeholder="Ask anything…"
  onSubmit={(value) => console.log(value)}
/>`,
        },

        // ── LEADING + TRAILING ACTIONS ──────────────────────────────────
        {
          title: 'Leading & Trailing Actions',
          description:
            'Pass ReactNode to leadingActions (left of textarea) and trailingActions (right, before submit). Both are bottom-aligned with the text.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  placeholder="Message…"
                  leadingActions={
                    <IconButton
                      icon={
                        <Icon size="sm" color="button-ghost">
                          <PlusIcon />
                        </Icon>
                      }
                      variant="ghost"
                      size="sm"
                      aria-label="Add attachment"
                      onClick={() => {}}
                    />
                  }
                  trailingActions={
                    <IconButton
                      icon={
                        <Icon size="sm" color="button-ghost">
                          <ChevronUpDownIcon />
                        </Icon>
                      }
                      variant="ghost"
                      size="sm"
                      aria-label="Switch model"
                      onClick={() => {}}
                    />
                  }
                  onSubmit={(v) => console.log(v)}
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  placeholder="Message…"
  leadingActions={
    <IconButton
      icon={<Icon size="sm" color="button-ghost"><PlusIcon /></Icon>}
      variant="ghost"
      size="sm"
      aria-label="Add attachment"
    />
  }
  trailingActions={
    <IconButton
      icon={<Icon size="sm" color="button-ghost"><ChevronUpDownIcon /></Icon>}
      variant="ghost"
      size="sm"
      aria-label="Switch model"
    />
  }
/>`,
        },

        // ── QUICK ACTIONS ───────────────────────────────────────────────
        {
          title: 'Quick Actions',
          description:
            'Pill-shaped chips below the textarea for common prompts. Scrollable horizontally when there are many.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  placeholder="Ask anything…"
                  quickActions={[
                    {
                      id: 'summarize',
                      label: 'Summarize',
                      icon: <DocumentTextIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'improve',
                      label: 'Improve writing',
                      icon: <SparklesIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'translate',
                      label: 'Translate',
                      icon: <LanguageIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'brainstorm',
                      label: 'Brainstorm ideas',
                      icon: <LightBulbIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'fix',
                      label: 'Fix grammar',
                      icon: <BoltIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                  ]}
                  onSubmit={(v) => console.log(v)}
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  placeholder="Ask anything…"
  quickActions={[
    {
      id: 'summarize',
      label: 'Summarize',
      icon: <DocumentTextIcon style={{ width: 14, height: 14 }} />,
      onClick: () => {},
    },
    {
      id: 'improve',
      label: 'Improve writing',
      icon: <SparklesIcon style={{ width: 14, height: 14 }} />,
      onClick: () => {},
    },
    {
      id: 'translate',
      label: 'Translate',
      icon: <LanguageIcon style={{ width: 14, height: 14 }} />,
      onClick: () => {},
    },
  ]}
/>`,
        },

        // ── IMAGE ATTACHMENT ────────────────────────────────────────────
        {
          title: 'Image Attachments',
          description:
            'Enable image attachment via the paperclip button or paste. Thumbnails appear above the textarea. Max 5 images by default.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  placeholder="Describe the image…"
                  allowImages
                  maxImages={4}
                  onSubmit={(v, images) => console.log(v, images)}
                  onImagesChange={(imgs) => console.log('images:', imgs)}
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  placeholder="Describe the image…"
  allowImages
  maxImages={4}
  onSubmit={(value, images) => {
    console.log(value);
    console.log(images); // AttachedImage[]
  }}
  onImagesChange={(images) => console.log(images)}
/>`,
        },

        // ── LOADING ─────────────────────────────────────────────────────
        {
          title: 'Loading (Streaming) State',
          description:
            'Pass loading={true} during AI response streaming. The submit button shows a spinner and is disabled.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  value="What are the best practices for prompt engineering?"
                  loading
                  placeholder="Ask anything…"
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  value="What are the best practices for prompt engineering?"
  loading
  placeholder="Ask anything…"
/>`,
        },

        // ── CMD+ENTER ───────────────────────────────────────────────────
        {
          title: 'Cmd+Enter to Submit',
          description:
            'Set submitOnCmdEnter to require Cmd/Ctrl+Enter instead of plain Enter. Useful inside forms where Enter should insert newlines.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  placeholder="Press Cmd+Enter to submit…"
                  submitOnCmdEnter
                  onSubmit={(v) => alert(`Submitted: ${v}`)}
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  placeholder="Press Cmd+Enter to submit…"
  submitOnCmdEnter
  onSubmit={(value) => console.log(value)}
/>`,
        },

        // ── CONTROLLED ──────────────────────────────────────────────────
        {
          title: 'Controlled',
          description:
            'Pass value + onChange to manage state externally. Character count is displayed from the parent.',
          preview: <ControlledExample />,
          code: `function ControlledExample() {
  const [value, setValue] = useState('');

  return (
    <VStack spacing="sm">
      <AITextarea
        value={value}
        onChange={setValue}
        placeholder="Type something…"
        onSubmit={(v) => { console.log(v); setValue(''); }}
      />
      <Body size="sm" color="secondary">{value.length} characters</Body>
    </VStack>
  );
}`,
        },

        // ── DISABLED ────────────────────────────────────────────────────
        {
          title: 'Disabled',
          description: 'The disabled prop disables the textarea and all interactive elements.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 560 }}>
                <AITextarea
                  value="This field is currently disabled."
                  disabled
                  placeholder="Disabled"
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  value="This field is currently disabled."
  disabled
/>`,
        },

        // ── FULL FEATURED ───────────────────────────────────────────────
        {
          title: 'Full Featured',
          description:
            'All features combined: leading action, trailing model switcher, quick actions, and image support.',
          preview: (
            <Box padding="xl" display="flex" justify="center">
              <Box style={{ width: '100%', maxWidth: 600 }}>
                <AITextarea
                  placeholder="Ask anything or attach an image…"
                  allowImages
                  leadingActions={
                    <IconButton
                      icon={
                        <Icon size="sm" color="button-ghost">
                          <PlusIcon />
                        </Icon>
                      }
                      variant="ghost"
                      size="sm"
                      aria-label="Add"
                      onClick={() => {}}
                    />
                  }
                  trailingActions={
                    <IconButton
                      icon={
                        <Icon size="sm" color="button-ghost">
                          <ChevronUpDownIcon />
                        </Icon>
                      }
                      variant="ghost"
                      size="sm"
                      aria-label="Switch model"
                      onClick={() => {}}
                    />
                  }
                  quickActions={[
                    {
                      id: 'summarize',
                      label: 'Summarize',
                      icon: <DocumentTextIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'improve',
                      label: 'Improve writing',
                      icon: <SparklesIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'translate',
                      label: 'Translate',
                      icon: <LanguageIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                    {
                      id: 'brainstorm',
                      label: 'Brainstorm',
                      icon: <LightBulbIcon style={{ width: 14, height: 14 }} />,
                      onClick: () => {},
                    },
                  ]}
                  onSubmit={(v, imgs) => console.log(v, imgs)}
                />
              </Box>
            </Box>
          ),
          code: `<AITextarea
  placeholder="Ask anything or attach an image…"
  allowImages
  leadingActions={
    <IconButton
      icon={<Icon size="sm" color="button-ghost"><PlusIcon /></Icon>}
      variant="ghost" size="sm" aria-label="Add"
    />
  }
  trailingActions={
    <IconButton
      icon={<Icon size="sm" color="button-ghost"><ChevronUpDownIcon /></Icon>}
      variant="ghost" size="sm" aria-label="Switch model"
    />
  }
  quickActions={[
    { id: 'summarize', label: 'Summarize', icon: <DocumentTextIcon />, onClick: () => {} },
    { id: 'improve',   label: 'Improve writing', icon: <SparklesIcon />, onClick: () => {} },
    { id: 'translate', label: 'Translate', icon: <LanguageIcon />, onClick: () => {} },
  ]}
  onSubmit={(value, images) => console.log(value, images)}
/>`,
        },
      ]}
    />
  );
}

// ─────────────────────────────────────────────
// Controlled example (isolated so hooks are valid)
// ─────────────────────────────────────────────
function ControlledExample() {
  const [value, setValue] = useState('');

  return (
    <Box padding="xl" display="flex" justify="center">
      <Box style={{ width: '100%', maxWidth: 560 }}>
        <VStack spacing="sm">
          <AITextarea
            value={value}
            onChange={setValue}
            placeholder="Type something…"
            onSubmit={(v) => {
              console.log('submitted:', v);
              setValue('');
            }}
          />
          <Body size="sm" color="secondary">
            {value.length} characters
          </Body>
        </VStack>
      </Box>
    </Box>
  );
}
