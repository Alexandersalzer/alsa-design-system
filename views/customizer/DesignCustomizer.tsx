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
  Icon,
  Nav,
  SelectionCard,
  SegmentedControl,
  Picker,
  Slider,
  Divider,
  ColorPickerPanel,
} from '../../design/index';
import {
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/outline';
import {
  applyCustomizerToRoot,
  buildJsonSnippet,
  clearCustomizerOverrides,
  type CustomizerState,
} from './applyToRoot';
import {
  RADIUS_MARKS,
  radiusToIndex,
  indexToRadius,
  SPACING_OPTIONS,
  LAYOUT_OPTIONS,
  TYPOGRAPHY_SCALE_OPTIONS,
  FONT_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  THEME_MODE_CARDS,
  SECTION_NAV,
  asSpacing,
  asLayout,
  asTypographyScale,
  type CustomizerSection,
} from './customizerOptions';
import { ACCENT_PALETTE, TONE_PALETTE } from './palettes';
import './DesignCustomizer.css';

const STORAGE_KEY = 'alsa.customizer.draft';

// Mirrors current public/design/design.json globalStyles.
const DEFAULT_STATE: CustomizerState = {
  accentHex: '#F97316',
  toneHex: '#000000',
  baseColorIntensity: 0.08,
  themeMode: 'system',
  radius: 'xl',
  layoutContent: 'xl',
  layoutMedia: 'xl',
  formWidth: 'sm',
  fontPrimary: 'Outfit',
  fontSecondary: 'Outfit',
  fontWeightHeadingNumeric: 700,
  fontWeightBodyNumeric: 600,
  typographyScale: 'md',
  sectionSpacing: 'lg',
  containerSpacing: 'md',
  navbarSpacing: 'md',
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
// LAYOUT PRIMITIVES
// =============================================================================

/** Label left, control right, divider underneath. */
const SettingRow: React.FC<{ label: string; children: React.ReactNode }> = ({
  label, children,
}) => (
  <div className="dc-row">
    <Label size="sm" color="secondary" className="dc-row__label">{label}</Label>
    <div className="dc-row__control">{children}</div>
  </div>
);

/** Label on its own line, control full-width below (color grids, sliders). */
const SettingBlock: React.FC<{ label: string; children: React.ReactNode }> = ({
  label, children,
}) => (
  <div className="dc-block">
    <Label size="xs" color="tertiary" className="dc-block__label">{label}</Label>
    <div className="dc-block__control">{children}</div>
  </div>
);

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

export const DesignCustomizer: React.FC<DesignCustomizerProps> = ({
  isOpen, onClose, state, update, reset,
}) => {
  const [section, setSection] = useState<CustomizerSection>('theme');
  const [showSnippet, setShowSnippet] = useState(false);
  const [copied, setCopied] = useState(false);

  // Local radius value so dragging stays smooth; commit on release.
  const [radiusDrag, setRadiusDrag] = useState<number | null>(null);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildJsonSnippet(state));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* */ }
  };

  const themeModeIcon = (value: string) => {
    if (value === 'light') return <SunIcon />;
    if (value === 'dark') return <MoonIcon />;
    return <ComputerDesktopIcon />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" title="Design">
      <div className="dc-shell">
        {/* SIDEBAR */}
        <aside className="dc-sidebar">
          <Nav.Root layout="sidebar" surface="page" gap="sm">
            <Nav.List>
              {SECTION_NAV.map((s) => (
                <Nav.Item
                  key={s.id}
                  isActive={section === s.id}
                  onClick={() => setSection(s.id)}
                >
                  {s.label}
                </Nav.Item>
              ))}
            </Nav.List>
          </Nav.Root>

          <div className="dc-sidebar__footer">
            <Divider weight="default" spacing="sm" />
            <HStack spacing="xs" justify="between" align="center">
              <Button variant="ghost" size="sm" onClick={reset}>Reset</Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSnippet((v) => !v)}
              >
                {showSnippet ? 'Hide JSON' : 'Show JSON'}
              </Button>
            </HStack>
            {showSnippet && (
              <VStack spacing="sm" align="stretch">
                <Box className="dc-json">{buildJsonSnippet(state)}</Box>
                <Button variant="primary" size="sm" onClick={onCopy}>
                  {copied ? 'Copied!' : 'Copy design.json'}
                </Button>
              </VStack>
            )}
          </div>
        </aside>

        {/* CONTENT */}
        <section className="dc-content">
          {section === 'theme' && (
            <VStack spacing="none" align="stretch">
              <SettingBlock label="Appearance">
                <div className="dc-mode-cards">
                  {THEME_MODE_CARDS.map((m) => (
                    <SelectionCard
                      key={m.value}
                      selected={state.themeMode === m.value}
                      onChange={() => update({ themeMode: m.value })}
                      indicator="none"
                      aria-label={m.label}
                    >
                      <VStack spacing="xs" align="center">
                        <Icon size="md"><span>{themeModeIcon(m.value)}</span></Icon>
                        <Body size="sm">{m.label}</Body>
                      </VStack>
                    </SelectionCard>
                  ))}
                </div>
              </SettingBlock>

              <SettingRow label="Radius">
                <Slider
                  minValue={0}
                  maxValue={RADIUS_MARKS.length - 1}
                  step={1}
                  hideValue
                  value={radiusDrag ?? radiusToIndex(state.radius)}
                  onChange={(v) => setRadiusDrag(Array.isArray(v) ? v[0] : v)}
                  onChangeEnd={(v) => {
                    const n = Array.isArray(v) ? v[0] : v;
                    setRadiusDrag(null);
                    update({ radius: indexToRadius(n) });
                  }}
                />
              </SettingRow>

              <SettingRow label="Accent color">
                <ColorPickerPanel
                  compact
                  value={state.accentHex}
                  onChange={(hex) => update({ accentHex: hex })}
                  palette={ACCENT_PALETTE}
                />
              </SettingRow>

              <SettingRow label="Base tone">
                <ColorPickerPanel
                  compact
                  value={state.toneHex}
                  onChange={(hex) => update({ toneHex: hex })}
                  palette={TONE_PALETTE}
                />
              </SettingRow>

              <SettingRow label="Base intensity">
                <Slider
                  minValue={0}
                  maxValue={1}
                  step={0.01}
                  value={state.baseColorIntensity}
                  onChange={(v) =>
                    update({ baseColorIntensity: Array.isArray(v) ? v[0] : v })
                  }
                />
              </SettingRow>
            </VStack>
          )}

          {section === 'typography' && (
            <VStack spacing="none" align="stretch">
              <SettingRow label="Primary font">
                <Picker
                  options={FONT_OPTIONS}
                  searchable
                  searchPlaceholder="Choose a primary font…"
                  value={state.fontPrimary}
                  onChange={(v) => update({ fontPrimary: v ?? state.fontPrimary })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Secondary font">
                <Picker
                  options={FONT_OPTIONS}
                  searchable
                  searchPlaceholder="Choose a secondary font…"
                  value={state.fontSecondary}
                  onChange={(v) => update({ fontSecondary: v ?? state.fontSecondary })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Heading weight">
                <Picker
                  options={FONT_WEIGHT_OPTIONS}
                  value={String(state.fontWeightHeadingNumeric)}
                  onChange={(v) =>
                    update({ fontWeightHeadingNumeric: parseInt(v ?? '700', 10) })
                  }
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Body weight">
                <Picker
                  options={FONT_WEIGHT_OPTIONS}
                  value={String(state.fontWeightBodyNumeric)}
                  onChange={(v) =>
                    update({ fontWeightBodyNumeric: parseInt(v ?? '400', 10) })
                  }
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Type scale">
                <SegmentedControl
                  options={TYPOGRAPHY_SCALE_OPTIONS}
                  value={state.typographyScale}
                  onChange={(v) => update({ typographyScale: asTypographyScale(v) })}
                  size="sm"
                />
              </SettingRow>
            </VStack>
          )}

          {section === 'spacing' && (
            <VStack spacing="none" align="stretch">
              <SettingRow label="Section spacing">
                <SegmentedControl
                  options={SPACING_OPTIONS}
                  value={state.sectionSpacing}
                  onChange={(v) => update({ sectionSpacing: asSpacing(v) })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Container spacing">
                <SegmentedControl
                  options={SPACING_OPTIONS}
                  value={state.containerSpacing}
                  onChange={(v) => update({ containerSpacing: asSpacing(v) })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Navbar spacing">
                <SegmentedControl
                  options={SPACING_OPTIONS}
                  value={state.navbarSpacing}
                  onChange={(v) => update({ navbarSpacing: asSpacing(v) })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Content width">
                <SegmentedControl
                  options={LAYOUT_OPTIONS}
                  value={state.layoutContent}
                  onChange={(v) => update({ layoutContent: asLayout(v) })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Media width">
                <SegmentedControl
                  options={LAYOUT_OPTIONS}
                  value={state.layoutMedia}
                  onChange={(v) => update({ layoutMedia: asLayout(v) })}
                  size="sm"
                />
              </SettingRow>

              <SettingRow label="Form width">
                <SegmentedControl
                  options={LAYOUT_OPTIONS}
                  value={state.formWidth}
                  onChange={(v) => update({ formWidth: asLayout(v) })}
                  size="sm"
                />
              </SettingRow>
            </VStack>
          )}
        </section>
      </div>
    </Modal>
  );
};
