"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../utils/cn";
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
  type?: "right" | "left" | "bottom" | "top" | "navbar" | "pill";
  showCloseButton?: boolean;
  closeButtonVariant?: "icon" | "text";
  closeButtonLabel?: string;
  preventScroll?: boolean;
  style?: React.CSSProperties;
}

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
  style,
}: DrawerProps) => {
  const [mounted, setMounted] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Dynamic animation duration based on drawer type
  const ANIMATION_DURATION = type === "pill" ? 400 : 250;

  useEffect(() => setMounted(true), []);

  // Handle scroll locking & scrollbar compensation
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false); // Reset closing state when opening
      if (preventScroll) {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      if (mounted) {
        setIsClosing(true); // Start closing animation
        
        // Wait for animation to complete before cleaning up
        const timeout = setTimeout(() => {
          setIsClosing(false);
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
        }, ANIMATION_DURATION);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [isOpen, preventScroll, mounted, ANIMATION_DURATION]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Don't render until mounted
  if (!mounted) return null;
  
  // Don't render if not open and not closing (animation finished)
  if (!isOpen && !isClosing) return null;

  // Pill drawer uses simpler structure (no wrapper divs)
  const isPill = type === "pill";

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
        style={style}
        role="dialog"
        aria-modal="true"
      >
        {isPill ? (
          // Pill drawer: render children directly, no wrappers
          children
        ) : (
          // Bar/top drawer: use full wrapper structure
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
        )}
      </aside>
    </div>,
    document.body
  );
};

export default Drawer;