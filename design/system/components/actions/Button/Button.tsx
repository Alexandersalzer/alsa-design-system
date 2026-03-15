// ===============================================
// src/design-system/components/primitives/Button/Button.tsx
// CLEAN BUTTON - USES LABEL WITHOUT COLOR PROP
// ===============================================

'use client';

import React, { forwardRef, ReactNode, useState } from 'react';
import Link from 'next/link';
import { cn } from '../../../utils/cn';
import { Label } from '../../Typography/Typography';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { useHref } from '../../../hooks/useHref';
import { Component } from '../../frames/component/Component';
import { IconByName } from '../../media/IconByName/IconByName';
import { useAction } from '../../../core/actions/useAction';
import type { ActionConfig, NavigationActionConfig, BookingActionConfig } from '../../../core/actions/types';
import { openCalendlyPopup, buildCalendlyUrl } from '../../thirdparty/calendly/CalendlyModal';
import { openCalPopup } from '../../thirdparty/cal/CalModal';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
  content?: string; // For JSON-driven rendering
  href?: string;
  target?: string;
  variant?: 'brand' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive' | 'secondary-glass' | 'ghost-glass' | 'accent-glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  loading?: boolean;
  leftIcon?: ReactNode | string; /** string = icon name (e.g. "arrow-right") for JSON */
  rightIcon?: ReactNode | string;
  fullWidth?: boolean;
  componentKey?: string;
  action?: ActionConfig;
  formData?: Record<string, any>;
}

export const Button = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      href,
      target,
      variant = 'primary',
      size = 'md',
      radius = 'md',
      children,
      content,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      componentKey,
      action,
      formData,
      onClick,
      ...props
    },
    ref
  ) => {
    const { buildHref } = useHref();
    const [internalLoading, setInternalLoading] = useState(false);

    // useAction must always be called (Rules of Hooks — no conditional calls).
    // Pass a dummy no-op config when action is absent so hooks run unconditionally.
    const _actionHook = useAction(action ?? { type: 'navigation' as const, settings: { href: '' } });
    const actionHook = action ? _actionHook : null;
    const isDisabled = disabled || loading || internalLoading;
    
    // Success state from action hook - only for form actions (contact, newsletter)
    const isSuccess = actionHook?.success && action?.type !== 'navigation' && action?.type !== 'booking';
    const successMessage = actionHook?.message;
    
    // Use content prop if provided, otherwise use children
    const displayContent = content || children;
    
    const getEffectiveHref = () => {
      if (action?.type === 'navigation') {
        const navSettings = (action as NavigationActionConfig).settings;
        // pageId takes precedence, buildHref will resolve it
        return navSettings.pageId || navSettings.href;
      }
      return href;
    };
    
    const getPageId = () => {
      if (action?.type === 'navigation') {
        return (action as NavigationActionConfig).settings.pageId;
      }
      return undefined;
    };
    
    const effectiveHref = getEffectiveHref();
    const pageId = getPageId();
    const localeAwareHref = (effectiveHref || pageId) ? buildHref(effectiveHref, pageId) : undefined;
    
    const effectiveTarget = 
      (action?.type === 'navigation' && (action as NavigationActionConfig).settings.openInNewTab) 
        ? '_blank' 
        : target;

    // Map button size to Label size
    const getLabelSize = (btnSize: string): 'sm' | 'md' | 'lg' => {
      const sizeMap = { 
        sm: 'sm' as const, 
        md: 'md' as const, 
        lg: 'lg' as const, 
        xl: 'lg' as const // xl buttons use lg label
      };
      return sizeMap[btnSize as keyof typeof sizeMap] || 'md';
    };

    // Map button size to Label weight
    const getLabelWeight = (btnSize: string) => {
      return (btnSize === 'sm' || btnSize === 'md') ? 'semibold' : 'bold';
    };

    /** Resolve icon from JSON (string name) to ReactNode */
    const resolveIcon = (icon: ReactNode | string | undefined, iconSize: 'sm' | 'md' = 'sm'): ReactNode => {
      if (!icon) return null;
      if (typeof icon === 'string') {
        return <IconByName name={icon} size={iconSize} />;
      }
      return icon;
    };
    const resolvedLeftIcon = resolveIcon(leftIcon, size === 'lg' || size === 'xl' ? 'md' : 'sm');
    const resolvedRightIcon = resolveIcon(rightIcon, size === 'lg' || size === 'xl' ? 'md' : 'sm');

    const buttonClasses = cn(
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      `btn-radius-${radius}`,
      fullWidth && 'btn-full-width',
      className,
      isDisabled && 'pointer-events-none opacity-60'
    );

    const handleActionClick = async (e: React.MouseEvent) => {
      if (action?.type === 'navigation' && actionHook) {
        e.preventDefault();
        // Pass ownerDocument so section/anchor navigation works inside iframe (e.g. editor preview)
        const targetDoc = (e.currentTarget as HTMLElement).ownerDocument;
        await actionHook.execute({}, { targetDocument: targetDoc });
        onClick?.(e as any); // Call parent onClick after navigation
        return;
      }

      // If it's a booking action with Calendly or Cal.com URL, open modal
      if (action?.type === 'booking') {
        e.preventDefault();
        const bookingConfig = action as BookingActionConfig;
        
        // Check if it's Cal.com or Calendly
        const calUrl = bookingConfig.settings?.calUrl;
        const calendlyUrl = bookingConfig.settings?.calendlyUrl;

        if (calUrl) {
          // Cal.com booking
          openCalPopup(calUrl, {
            brandColor: bookingConfig.settings?.brandColor || bookingConfig.settings?.primaryColor,
            theme: bookingConfig.settings?.theme,
            layout: bookingConfig.settings?.layout,
          });
        } else if (calendlyUrl) {
          // Calendly booking
          const fullUrl = buildCalendlyUrl(calendlyUrl, {
            primaryColor: bookingConfig.settings?.primaryColor,
            hideEventTypeDetails: bookingConfig.settings?.hideEventTypeDetails,
            hideGdprBanner: bookingConfig.settings?.hideGdprBanner,
            prefill: formData,
          });

          openCalendlyPopup(fullUrl);
        }
        onClick?.(e as any); // Call parent onClick after booking
        return;
      }

      // If no action but has href, let default link behavior handle it
      if (!action) {
        onClick?.(e as any);
        return;
      }

      // Other actions (contact, newsletter)
      e.preventDefault();
      setInternalLoading(true);

      try {
        // Auto-collect form data from parent <form> if no formData prop provided
        let dataToSubmit = formData;
        const form = (e.currentTarget as HTMLButtonElement).closest('form');
        if (!dataToSubmit || Object.keys(dataToSubmit).length === 0) {
          if (form) {
            dataToSubmit = Object.fromEntries(new FormData(form).entries()) as Record<string, any>;
          }
        }
        const result = await actionHook!.execute(dataToSubmit || {});
        
        // Clear form inputs on success
        if (result?.success && form) {
          form.reset();
        }
        
        onClick?.(e as any); // Call parent onClick after other actions
      } finally {
        setInternalLoading(false);
      }
    };

    // ✅ SOLUTION: Use Label component but WITHOUT color prop
    // Color is inherited from parent .btn-{variant} via CSS
    const buttonContent = (
      <>
        {(loading || internalLoading) && (
          <span className="btn-spinner" aria-hidden="true">
            <Spinner
              size={size === 'sm' ? 'xs' : 'sm'}
              variant={variant}
              disabled={disabled}
              animationDuration="0.6s"
            />
          </span>
        )}
        {!loading && !internalLoading && resolvedLeftIcon && (
          <span className="flex-shrink-0">{resolvedLeftIcon}</span>
        )}
        {/* ✅ Label without color prop - inherits from parent */}
        <Label
          size={getLabelSize(size)}
          weight={getLabelWeight(size)}
          as="span"
          className="btn-text"
        >
          {displayContent}
        </Label>
        {!loading && !internalLoading && resolvedRightIcon && (
          <span className="flex-shrink-0">{resolvedRightIcon}</span>
        )}
      </>
    );

    // Render as Link or <a>
    if (localeAwareHref && !action) {
      const isInternal = localeAwareHref.startsWith('/');
      const linkProps = {
        className: buttonClasses,
        target: effectiveTarget,
        rel: effectiveTarget === '_blank' ? 'noopener noreferrer' : undefined,
      };

      if (isInternal) {
        return (
          <Component componentKey={componentKey}>
            <Link href={localeAwareHref} {...linkProps}>
              {buttonContent}
            </Link>
          </Component>
        );
      }

      return (
        <Component componentKey={componentKey}>
          <a href={localeAwareHref} {...linkProps}>
            {buttonContent}
          </a>
        </Component>
      );
    }

    // Render as <button>
    // If success, show success message instead of button
    if (isSuccess) {
      return (
        <Component componentKey={componentKey}>
          <div className="text-green-600">
            <Label size={getLabelSize(size)} weight={getLabelWeight(size)} as="span">
              {successMessage || 'Skickat!'}
            </Label>
          </div>
        </Component>
      );
    }

    return (
      <Component componentKey={componentKey}>
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type={action ? 'button' : (props.type as any)}
          className={buttonClasses}
          disabled={isDisabled}
          aria-busy={loading || internalLoading}
          onClick={handleActionClick}
          {...props}
        >
          {buttonContent}
        </button>
      </Component>
    );
  }
);

Button.displayName = 'Button';

export default Button;