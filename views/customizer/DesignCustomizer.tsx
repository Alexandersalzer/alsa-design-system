"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal,
  VStack,
  HStack,
  Box,
  Body,
  Label,
  Button,
  SegmentedControl,
  ColorPickerPanel,
} from '../../design/index';
import {
  applyCustomizerToRoot,
  buildJsonSnippet,
  clearCustomizerOverrides,
  type CustomizerState,
} from './applyToRoot';
import { ACCENT_PALETTE, TONE_PALETTE } from './palettes';

const STORAGE_KEY = 'alsa.customizer.draft';

const DEFAULT_STATE: CustomizerState = {
  accentHex: '#FFA366',
  toneHex: '#000000',
  baseColorIntensity: 0.08,
  themeMode: 'system',
};

function loadDraft(): CustomizerState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

function saveDraft(state: CustomizerState) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* */ }
}

// =============================================================================
// HOOK
// =============================================================================

export function useCustomizer() {
  const [state, setState] = useState<CustomizerState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const draft = loadDraft();
    setState(draft);
    setHydrated(true);
    applyCustomizerToRoot(draft);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveDraft(state);
    applyCustomizerToRoot(state);
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<CustomizerState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const reset = useCallback(() => {
    clearCustomizerOverrides();
    setState(DEFAULT_STATE);
    saveDraft(DEFAULT_STATE);
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { state, update, reset };
}

// =============================================================================
// MODAL
// =============================================================================

export interface DesignCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  state: CustomizerState;
  update: (patch: Partial<CustomizerState>) => void;
  reset: () => void;
}

const themeModeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  isOpen, onClose, state, update, reset,
}) => {
  const [showSnippet, setShowSnippet] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const text = buildJsonSnippet(state);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* */ }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" title="Design">
      <VStack spacing="lg" align="stretch" style={{ minWidth: 380 }}>
        {/* Theme mode */}
        <FieldRow label="Theme">
          <SegmentedControl
            options={themeModeOptions}
            value={state.themeMode}
            onChange={(v) => update({ themeMode: v as CustomizerState['themeMode'] })}
            size="sm"
          />
        </FieldRow>

        {/* Accent */}
        <FieldRow label="Accent">
          <ColorPickerPanel
            value={state.accentHex}
            onChange={(hex) => update({ accentHex: hex })}
            palette={ACCENT_PALETTE}
          />
        </FieldRow>

        {/* Base */}
        <FieldRow label="Base">
          <ColorPickerPanel
            value={state.toneHex}
            onChange={(hex) => update({ toneHex: hex })}
            palette={TONE_PALETTE}
          />
        </FieldRow>

        {/* Base intensity — single inline slider */}
        <FieldRow label="Base intensity">
          <IntensitySlider
            value={state.baseColorIntensity}
            onChange={(v) => update({ baseColorIntensity: v })}
          />
        </FieldRow>

        {/* Snippet section — collapsed by default */}
        <Box style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--foundation-space-3)' }}>
          {!showSnippet && (
            <HStack spacing="sm" justify="between">
              <Body size="sm" color="secondary">Save changes by pasting JSON into design.json</Body>
              <Button variant="ghost" size="sm" onClick={() => setShowSnippet(true)}>Show JSON</Button>
            </HStack>
          )}
          {showSnippet && (
            <VStack spacing="sm" align="stretch">
              <Box
                style={{
                  background: 'var(--surface-raised)',
                  border: '1px solid var(--border-default)',
                  borderRadius: 'var(--selected-radius-scale-sm)',
                  padding: 'var(--foundation-space-3)',
                  fontFamily: 'var(--font-mono-family, ui-monospace, monospace)',
                  fontSize: 12,
                  whiteSpace: 'pre',
                  overflow: 'auto',
                  maxHeight: 200,
                  color: 'var(--text-default)',
                }}
              >
                {buildJsonSnippet(state)}
              </Box>
              <HStack spacing="sm" justify="between">
                <Button variant="ghost" size="sm" onClick={() => setShowSnippet(false)}>Hide</Button>
                <Button variant="primary" size="sm" onClick={onCopy}>{copied ? 'Copied!' : 'Copy JSON'}</Button>
              </HStack>
            </VStack>
          )}
        </Box>

        {/* Footer actions */}
        <HStack spacing="sm" justify="end" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--foundation-space-3)' }}>
          <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
          <Button variant="secondary" size="sm" onClick={onClose}>Close</Button>
        </HStack>
      </VStack>
    </Modal>
  );
};

// =============================================================================
// SUB COMPONENTS
// =============================================================================

const FieldRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <VStack spacing="xs" align="stretch">
    <Label size="xs" color="tertiary" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</Label>
    {children}
  </VStack>
);

const IntensitySlider: React.FC<{ value: number; onChange: (v: number) => void }> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-2)' }}>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ flex: 1, accentColor: 'var(--surface-accent)' }}
      />
      <span style={{
        minWidth: 36,
        textAlign: 'right',
        fontFamily: 'var(--font-mono-family, ui-monospace, monospace)',
        fontSize: 12,
        color: 'var(--text-muted)',
      }}>
        {value.toFixed(2)}
      </span>
    </div>
  );
};
