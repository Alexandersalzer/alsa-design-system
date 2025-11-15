"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../lib/utils";
import { HStack } from "../../layout/hStack/HStack";
import { VStack } from "../../layout/vStack/VStack";
import { Button, IconButtons } from "../../../components";

/** Get scrollbar width (safe in Next.js) */
function getScrollbarWidth() {
  if (typeof window === "undefined") return 0;
  return window.innerWidth - document.documentElement.clientWidth;
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "right" | "left" | "bottom" | "top" | "navbar";
  showCloseButton?: boolean;
  closeButtonVariant?: "icon" | "text";
  closeButtonLabel?: string;
  preventScroll?: boolean;
}

const ANIMATION_DURATION = 250;

const Drawer = ({
  isOpen,
  onClose,
  children,
  type = "right",
  showCloseButton = true,
  closeButtonVariant = "icon",
  closeButtonLabel = "Close",
  className,
  preventScroll = true,
}: DrawerProps) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  // Handle scroll locking & scrollbar compensation
  useEffect(() => {
    if (isOpen) {
      setVisible(true);

      if (preventScroll) {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";

      const t = setTimeout(() => setVisible(false), ANIMATION_DURATION);
      return () => clearTimeout(t);
    }
  }, [isOpen, preventScroll]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={cn(
        "drawer-overlay",
        isOpen ? "drawer-overlay--open" : "drawer-overlay--closing"
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className={cn(
          "drawer",
          `drawer--${type}`,
          isOpen ? "drawer--open" : "drawer--close",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <VStack spacing="lg" align="stretch" fullWidth className="drawer__content">
          {showCloseButton && (
            <HStack justify="end" className="drawer__header">
              {closeButtonVariant === "icon" ? (
                <IconButtons.Close
                  aria-label="Close menu"
                  variant="ghost"
                  size="md"
                  onClick={onClose}
                />
              ) : (
                <Button variant="ghost" size="md" onClick={onClose}>
                  {closeButtonLabel}
                </Button>
              )}
            </HStack>
          )}
          <div className="drawer__body">{children}</div>
        </VStack>
      </aside>
    </div>,
    document.body
  );
};

export default Drawer;
