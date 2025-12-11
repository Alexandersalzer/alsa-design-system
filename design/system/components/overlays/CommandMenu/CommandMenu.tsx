// ===============================================
// CommandMenu.tsx - Command Palette Component
// Keyboard-first navigation for power users
// ===============================================

import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { MagnifyingGlassIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Typography } from '../../Typography';
import { Listbox, ListboxItem } from '../../lists/Listbox';
import { Body } from '../../Typography';

// ===== TYPES =====
export interface CommandItem {
  id: string;
  title: string;
  keywords?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  section?: string;
  parent?: string;
  handler?: () => void;
}

export interface CommandMenuProps {
  /** Whether the command menu is open */
  open: boolean;
  /** Callback to set open state */
  setOpen: (open: boolean) => void;
  /** Array of command items */
  commands: CommandItem[];
  /** Placeholder text for search input */
  placeholder?: string;
  /** Footer content */
  footer?: React.ReactNode;
  /** External filtering mode */
  externalFiltering?: boolean;
  /** Exit nested view on search */
  exitNestedOnSearch?: boolean;
  /** Callback when command is selected */
  onSelect?: (command: CommandItem) => void;
  /** Custom class name */
  className?: string;
}

// ===== MAIN COMPONENT =====
export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>(({
  open,
  setOpen,
  commands,
  placeholder = 'What do you need?',
  footer,
  externalFiltering = false,
  exitNestedOnSearch = false,
  onSelect,
  className
}, ref) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentParent, setCurrentParent] = useState<string | undefined>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter commands based on search and parent
  const filteredCommands = useCallback(() => {
    if (externalFiltering) return commands;

    let items = currentParent
      ? commands.filter(cmd => cmd.parent === currentParent)
      : commands.filter(cmd => !cmd.parent);

    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(cmd => {
        const titleMatch = cmd.title.toLowerCase().includes(searchLower);
        const keywordsMatch = cmd.keywords?.toLowerCase().includes(searchLower);
        return titleMatch || keywordsMatch;
      });

      // Exit nested view if enabled
      if (exitNestedOnSearch && currentParent) {
        setCurrentParent(undefined);
      }
    }

    return items;
  }, [commands, search, currentParent, externalFiltering, exitNestedOnSearch]);

  const visibleCommands = filteredCommands();

  // Group commands by section
  const groupedCommands = useCallback(() => {
    const groups: Record<string, CommandItem[]> = {};
    visibleCommands.forEach(cmd => {
      const section = cmd.section || 'Commands';
      if (!groups[section]) groups[section] = [];
      groups[section].push(cmd);
    });
    return groups;
  }, [visibleCommands]);

  const commandGroups = groupedCommands();

  // Reset state when opening
  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
      setCurrentParent(undefined);
      // Focus input after a small delay to ensure it's rendered
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - close menu
      if (e.key === 'Escape') {
        if (currentParent) {
          // Exit nested view first
          setCurrentParent(undefined);
        } else {
          setOpen(false);
        }
        e.preventDefault();
        return;
      }

      // Backspace - go back to parent
      if (e.key === 'Backspace' && !search && currentParent) {
        setCurrentParent(undefined);
        e.preventDefault();
        return;
      }

      // Arrow Down
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev =>
          prev < visibleCommands.length - 1 ? prev + 1 : prev
        );
        e.preventDefault();
        return;
      }

      // Arrow Up
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        e.preventDefault();
        return;
      }

      // Enter - select command
      if (e.key === 'Enter') {
        const selected = visibleCommands[selectedIndex];
        if (selected) {
          handleSelect(selected);
        }
        e.preventDefault();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIndex, visibleCommands, search, currentParent, setOpen]);

  // Handle command selection
  const handleSelect = (command: CommandItem) => {
    // Check if command has children (is a parent)
    const hasChildren = commands.some(cmd => cmd.parent === command.id);

    if (hasChildren) {
      // Navigate to nested view
      setCurrentParent(command.id);
      setSearch('');
    } else {
      // Execute command
      command.handler?.();
      onSelect?.(command);
      setOpen(false);
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    const selectedElement = listRef.current?.querySelector('[data-selected="true"]');
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex]);

  if (!open) return null;

  let currentIndex = 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="command-menu__backdrop"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Command Menu */}
      <div
        ref={ref}
        className={cn('command-menu', className)}
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
      >
        {/* Search Input */}
        <div className="command-menu__header">
          <Icon size="sm" color="secondary">
            <MagnifyingGlassIcon />
          </Icon>
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={placeholder}
            className="command-menu__input"
            aria-label="Search commands"
          />
          {currentParent && (
            <Typography variant="body-xs" color="secondary" className="command-menu__breadcrumb">
              {commands.find(c => c.id === currentParent)?.title}
            </Typography>
          )}
        </div>

        {/* Command List */}
        <div ref={listRef} className="command-menu__list" role="listbox">
          {Object.keys(commandGroups).length === 0 ? (
            <div className="command-menu__empty">
              <Typography variant="body-sm" color="secondary">
                No results found
              </Typography>
              <Typography variant="body-xs" color="tertiary">
                Try searching for something else
              </Typography>
            </div>
          ) : (
            Object.entries(commandGroups).map(([section, items]) => (
              <div key={section} className="command-menu__group">
                <Typography
                  variant="label-xs"
                  color="tertiary"
                  className="command-menu__group-heading"
                >
                  {section}
                </Typography>
                <Listbox size="sm">
                {items.map((command) => {
                  const index = currentIndex++;
                  const isSelected = index === selectedIndex;
                  const hasChildren = commands.some(cmd => cmd.parent === command.id);

                  return (
                    <ListboxItem
                      key={command.id}
                      size="sm"
                      selected={isSelected}
                      onClick={() => handleSelect(command)}
                      leading={command.icon ? <span style={{ display: 'flex' }}>{command.icon}</span> : undefined}
                      trailing={
                        hasChildren ? (
                          <Icon size="xs" color="tertiary">
                            <ChevronRightIcon />
                          </Icon>
                        ) : command.shortcut ? (
                          <kbd className="command-menu__item-shortcut">
                            {command.shortcut.replace('$mod', navigator.platform.includes('Mac') ? '⌘' : 'Ctrl')}
                          </kbd>
                        ) : undefined
                      }
                      data-selected={isSelected}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <Body size="sm">{command.title}</Body>
                    </ListboxItem>
                  );
                })}
                </Listbox>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {footer || (
          <div className="command-menu__footer">
            <Typography variant="body-xs" color="tertiary">
              <kbd>↑↓</kbd> Navigate · <kbd>↵</kbd> Select · <kbd>Esc</kbd> Close
              {currentParent && <> · <kbd>⌫</kbd> Back</>}
            </Typography>
          </div>
        )}
      </div>
    </>
  );
});

CommandMenu.displayName = 'CommandMenu';
