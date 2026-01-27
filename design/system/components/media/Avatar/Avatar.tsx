// ===============================================
// design/system/components/media/Avatar/Avatar.tsx
// Avatar component using Image component internally
// ===============================================

import React, { forwardRef, ReactElement } from 'react';
import { cn } from '../../../utils/cn';
import { UserIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media/Icon';
import { Image } from '../../media/Image';
import { Box } from '../../layout/box/Box';

// ===== TYPE DEFINITIONS =====
export type AvatarSize =
  | 'full'
  | '2xs'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl';

export type AvatarVariant = 'solid' | 'subtle' | 'outline';
export type AvatarShape = 'square' | 'rounded' | 'full';
export type AvatarColorPalette =
  | 'gray'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'cyan'
  | 'purple'
  | 'pink';

export interface AvatarRootProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  variant?: AvatarVariant;
  shape?: AvatarShape;
  colorPalette?: AvatarColorPalette;
  borderless?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// ===== SIZE MAP =====
const SIZE_MAP: Record<
  Exclude<AvatarSize, 'full'>,
  {
    width: number;
    height: number;
    fontSize: number;
  }
> = {
  '2xs': { width: 24, height: 24, fontSize: 10 },
  xs: { width: 32, height: 32, fontSize: 12 },
  sm: { width: 40, height: 40, fontSize: 14 },
  md: { width: 48, height: 48, fontSize: 16 },
  lg: { width: 56, height: 56, fontSize: 18 },
  xl: { width: 64, height: 64, fontSize: 20 },
  '2xl': { width: 80, height: 80, fontSize: 24 },
};

// ===== AVATAR ROOT COMPONENT =====
export const AvatarRoot = forwardRef<HTMLDivElement, AvatarRootProps>(
  (
    {
      size = 'md',
      variant = 'subtle',
      shape = 'full',
      colorPalette = 'gray',
      borderless = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isFullSize = size === 'full';
    const boxSize = !isFullSize ? SIZE_MAP[size] : undefined;

    const avatarClasses = cn(
      `avatar-${variant}`,
      `avatar-${colorPalette}`,
      borderless && 'avatar-borderless',
      className
    );

    return (
      <Box
        ref={ref}
        display="flex"
        align="center"
        justify="center"
        width={isFullSize ? 'full' : undefined}
        height={isFullSize ? 'full' : undefined}
        radius={shape === 'full' ? 'full' : shape === 'rounded' ? 'md' : 'sm'}
        className={cn('avatar', avatarClasses)}
        style={
          !isFullSize
            ? {
                width: boxSize?.width,
                height: boxSize?.height,
                fontSize: boxSize?.fontSize,
                overflow: 'hidden',
                position: 'relative',
              }
            : { position: 'relative', overflow: 'hidden' }
        }
        role="img"
        {...props}
      >
        {children}
      </Box>
    );
  }
);

AvatarRoot.displayName = 'AvatarRoot';

// ===== AVATAR FALLBACK COMPONENT =====
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  icon?: ReactElement;
  children?: React.ReactNode;
  className?: string;
}

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ name, icon, children, className, ...props }, ref) => {
    const getInitials = (n: string): string => {
      const parts = n.trim().split(' ').filter(Boolean);
      if (parts.length === 0) return '?';
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (
        parts[0].charAt(0).toUpperCase() +
        parts[parts.length - 1].charAt(0).toUpperCase()
      );
    };

    const label = name ? `Avatar for ${name}` : 'User avatar';

    const content = children ? (
      children
    ) : icon ? (
      icon
    ) : name ? (
      <span
        className="avatar-initials"
        style={{
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {getInitials(name)}
      </span>
    ) : (
      // Slightly stronger default color than "muted" to avoid "dot" contrast issues
      <Icon size="md" color="secondary">
        <UserIcon />
      </Icon>
    );

    return (
      <Box
        ref={ref}
        display="flex"
        align="center"
        justify="center"
        className={cn('avatar-fallback', className)}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          zIndex: 1, // ✅ ensure fallback is visible
          pointerEvents: 'none',
        }}
        aria-label={label}
        {...props}
      >
        {content}
      </Box>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';

// ===== AVATAR GROUP COMPONENT =====
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: AvatarSize;
  spacing?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max, size = 'md', spacing = 'md', children, className, ...props }, ref) => {
    const childArray = React.Children.toArray(children);
    const visible = max ? childArray.slice(0, max) : childArray;
    const remaining = max && childArray.length > max ? childArray.length - max : 0;

    return (
      <Box
        ref={ref}
        display="flex"
        direction="row-reverse"
        align="center"
        justify="end"
        className={cn('avatar-group', `avatar-group-${spacing}`, className)}
        role="group"
        {...props}
      >
        {visible}
        {remaining > 0 && (
          <AvatarRoot size={size} variant="subtle" colorPalette="gray">
            <AvatarFallback>
              <span className="avatar-initials" style={{ lineHeight: 1 }}>
                +{remaining}
              </span>
            </AvatarFallback>
          </AvatarRoot>
        )}
      </Box>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';

// ===== FALLBACK MODE TYPE =====
export type AvatarFallbackMode = 'icon' | 'initials' | 'none';

// ===== COMPOSITE AVATAR COMPONENT =====
export interface AvatarProps extends AvatarRootProps {
  name?: string;
  src?: string;
  alt?: string;
  loading?: 'eager' | 'lazy';
  icon?: ReactElement;
  fallback?: React.ReactNode;
  fallbackMode?: AvatarFallbackMode;
  backgroundColor?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(props, ref) {
  const {
    name,
    src,
    alt,
    loading = 'lazy',
    icon,
    fallback,
    fallbackMode,
    backgroundColor,
    children,
    size = 'md',
    variant = 'subtle',
    shape = 'full',
    colorPalette = 'gray',
    borderless = false,
    className,
    style,
    ...rest
  } = props;

  const isFullSize = size === 'full';
  const boxSize = !isFullSize ? SIZE_MAP[size] : undefined;

  const imageAlt = alt || (name ? `${name}'s avatar` : 'User avatar');

  const actualFallbackMode: AvatarFallbackMode = fallbackMode ?? (name ? 'initials' : 'icon');

  const bgColor = backgroundColor ?? (src ? 'var(--surface-page)' : undefined);

  const mergedStyle = {
    ...style,
    ...(bgColor ? { backgroundColor: bgColor } : {}),
  };

  return (
    <AvatarRoot
      ref={ref}
      size={size}
      variant={variant}
      shape={shape}
      colorPalette={colorPalette}
      borderless={borderless}
      className={className}
      style={Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined}
      {...rest}
    >
      {/* ✅ Fallback only when NO src */}
      {!src && actualFallbackMode !== 'none' && (
        <AvatarFallback
          name={actualFallbackMode === 'initials' ? name : undefined}
          icon={
            actualFallbackMode === 'icon'
              ? icon ?? (
                  <Icon size="md" color="secondary">
                    <UserIcon />
                  </Icon>
                )
              : undefined
          }
        >
          {fallback}
        </AvatarFallback>
      )}

      {/* ✅ Image layer */}
      {src && (
        <Image
          className="avatar-image" // ✅ required by your CSS
          src={src}
          alt={imageAlt}
          width={isFullSize ? '100%' : boxSize?.width}
          height={isFullSize ? '100%' : boxSize?.height}
          radius={shape === 'full' ? 'full' : shape === 'rounded' ? 'md' : 'sm'}
          objectFit="cover"
          loading={loading}
          priority={loading === 'eager'}
          showSkeleton={false}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 2,
          }}
        />
      )}

      {children}
    </AvatarRoot>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;

export const AvatarNamespace = Object.assign(Avatar, {
  Root: AvatarRoot,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
});
