// ===============================================
// design/system/components/actions/Kbd/Kbd.tsx
// KEYBOARD KEY COMPONENT - Display keyboard shortcuts with button-like styling
// ===============================================

import React from "react";

export type KbdVariant = "secondary" | "ghost" | "primary";

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Array of modifier keys to display (e.g., ["command", "shift"])
   */
  keys?: string[];

  /**
   * Visual style variant
   */
  variant?: KbdVariant;

  /**
   * The key or content to display
   */
  children?: React.ReactNode;
}

/**
 * Key symbol mappings for different platforms
 */
const KEY_SYMBOLS: Record<string, { mac: string; other: string }> = {
  command: { mac: "⌘", other: "Ctrl" },
  cmd: { mac: "⌘", other: "Ctrl" },
  shift: { mac: "⇧", other: "Shift" },
  option: { mac: "⌥", other: "Alt" },
  alt: { mac: "⌥", other: "Alt" },
  ctrl: { mac: "⌃", other: "Ctrl" },
  control: { mac: "⌃", other: "Ctrl" },
  enter: { mac: "↵", other: "Enter" },
  return: { mac: "↵", other: "Enter" },
  delete: { mac: "⌫", other: "Del" },
  backspace: { mac: "⌫", other: "Backspace" },
  escape: { mac: "Esc", other: "Esc" },
  esc: { mac: "Esc", other: "Esc" },
  tab: { mac: "⇥", other: "Tab" },
  capslock: { mac: "⇪", other: "Caps" },
  up: { mac: "↑", other: "↑" },
  down: { mac: "↓", other: "↓" },
  left: { mac: "←", other: "←" },
  right: { mac: "→", other: "→" },
  pageup: { mac: "⇞", other: "PgUp" },
  pagedown: { mac: "⇟", other: "PgDn" },
  home: { mac: "↖", other: "Home" },
  end: { mac: "↘", other: "End" },
};

/**
 * Detect if the user is on a Mac platform
 */
const isMac = typeof navigator !== "undefined" && navigator.platform.includes("Mac");

/**
 * Get the display symbol for a key
 */
function getKeySymbol(key: string): string {
  const normalized = key.toLowerCase();
  const mapping = KEY_SYMBOLS[normalized];

  if (mapping) {
    return isMac ? mapping.mac : mapping.other;
  }

  // Return the key as-is if no mapping exists
  return key;
}

/**
 * Get the accessibility label for a key
 */
function getKeyLabel(key: string): string {
  const normalized = key.toLowerCase();

  const labels: Record<string, string> = {
    command: "Command",
    cmd: "Command",
    shift: "Shift",
    option: "Option",
    alt: "Alt",
    ctrl: "Control",
    control: "Control",
    enter: "Enter",
    return: "Return",
    delete: "Delete",
    backspace: "Backspace",
    escape: "Escape",
    esc: "Escape",
    tab: "Tab",
    capslock: "Caps Lock",
    up: "Up Arrow",
    down: "Down Arrow",
    left: "Left Arrow",
    right: "Right Arrow",
    pageup: "Page Up",
    pagedown: "Page Down",
    home: "Home",
    end: "End",
  };

  return labels[normalized] || key;
}

export const Kbd: React.FC<KbdProps> = ({
  keys = [],
  variant = "secondary",
  className = "",
  children,
  title,
  ...rest
}) => {
  // Build the content to display
  const content = keys.length > 0
    ? keys.map(getKeySymbol).join("") + (children ? getKeySymbol(String(children)) : "")
    : children;

  // Build accessibility label
  const accessibilityLabel = title || (
    keys.length > 0
      ? keys.map(getKeyLabel).join(" + ") + (children ? ` + ${getKeyLabel(String(children))}` : "")
      : children ? getKeyLabel(String(children)) : ""
  );

  return (
    <kbd
      className={`kbd kbd-${variant} ${className}`}
      title={accessibilityLabel}
      aria-label={accessibilityLabel}
      {...rest}
    >
      {content}
    </kbd>
  );
};
