"use client";
import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../utils/cn";
import { HStack } from "../../layout/hStack/HStack";
import { VStack } from "../../layout/vStack/VStack";
import Button from "../../actions/Button/Button";
import { IconButton } from "../../actions/IconButton/IconButton";

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
  /** Force absolute positioning (useful for demo/docs pages) */
  absolute?: boolean;
  /** Container to portal into (defaults to document.body) */
  container?: HTMLElement | null;
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
  absolute = false,
  container,
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
      setIsClosing(false);
      // Only prevent scroll for fixed positioning (not absolute)
      if (preventScroll && !absolute) {
        const scrollbarWidth = getScrollbarWidth();
        document.body.style.overflow = "hidden";
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    } else {
      if (mounted) {
        setIsClosing(true);
        
        const timeout = setTimeout(() => {
          setIsClosing(false);
          if (!absolute) {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }
        }, ANIMATION_DURATION);
        
        return () => clearTimeout(timeout);
      }
    }
  }, [isOpen, preventScroll, mounted, ANIMATION_DURATION, absolute]);

  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;
  if (!isOpen && !isClosing) return null;

  const isPill = type === "pill";

  // Determine portal target
  const portalTarget = container || (absolute ? null : document.body);

  const drawerContent = (
    <div
      className={cn(
        "drawer-overlay",
        absolute && "drawer-overlay--absolute",
        isOpen ? "drawer-overlay--open" : "drawer-overlay--closing"
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className={cn(
          "drawer",
          `drawer--${type}`,
          absolute && "drawer--absolute",
          isOpen ? "drawer--open" : "drawer--close",
          className
        )}
        style={style}
        role="dialog"
        aria-modal="true"
      >
        {isPill ? (
          children
        ) : (
          <VStack spacing="lg" align="stretch" fullWidth className="drawer__content">
            {showCloseButton && (
              <HStack justify="end" className="drawer__header">
                {closeButtonVariant === "icon" ? (
                  <IconButton
                    icon="x"
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
    </div>
  );

  // If absolute mode, render in-place. Otherwise portal to body
  if (absolute || !portalTarget) {
    return drawerContent;
  }

  return createPortal(drawerContent, portalTarget);
};

export default Drawer;