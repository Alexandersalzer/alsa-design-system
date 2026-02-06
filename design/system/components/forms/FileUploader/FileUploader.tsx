// ===============================================
// src/design-system/components/primitives/FileUploader/FileUploader.tsx
// FILE UPLOADER COMPONENT - Integrated with Design System
// ===============================================

import React, { forwardRef, ReactNode, useRef, useState, useCallback, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { Label, TypographyColor, Avatar } from '../..';
import { AvatarSize } from '../../media/Avatar/Avatar';

export interface FileUploaderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  children?: ReactNode;
  variant?: 'dropzone' | 'button' | 'compact' | 'avatar';
  size?: 'sm' | 'md' | 'lg';
  maxSize?: number; // in bytes
  accept?: string;
  multiple?: boolean;
  dragActive?: boolean;
  onFilesSelected?: (files: FileList | null) => void;
  onDragStateChange?: (isDragging: boolean) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  error?: boolean;
  helperText?: string;
  label?: string;
  required?: boolean;
  fullscreenDropzone?: boolean; // Enable fullscreen dropzone overlay on drag
  // Avatar variant specific props
  avatarSize?: AvatarSize;
  avatarName?: string;
  avatarShape?: 'square' | 'rounded' | 'full';
  avatarVariant?: 'solid' | 'subtle' | 'outline';
  avatarColorPalette?: 'gray' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'cyan' | 'purple' | 'pink';
}

export const FileUploader = forwardRef<HTMLInputElement, FileUploaderProps>(({
  className,
  variant = 'dropzone',
  size = 'md',
  children,
  maxSize,
  accept,
  multiple = false,
  dragActive = false,
  onFilesSelected,
  onDragStateChange,
  leftIcon,
  rightIcon,
  disabled,
  error = false,
  helperText,
  label,
  required = false,
  onChange,
  fullscreenDropzone = false,
  // Avatar variant props
  avatarSize = 'xl',
  avatarName,
  avatarShape = 'full',
  avatarVariant = 'subtle',
  avatarColorPalette = 'gray',
  ...props
}, ref) => {
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [globalDragActive, setGlobalDragActive] = useState(false);

  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // Generate preview for avatar variant
    if (variant === 'avatar' && files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }

    onFilesSelected?.(files);
    onChange?.(event);
  }, [onFilesSelected, onChange, variant]);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (!isDragging) {
      setIsDragging(true);
      onDragStateChange?.(true);
    }
  }, [isDragging, onDragStateChange]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => {
      const newCount = prev - 1;
      if (newCount === 0) {
        setIsDragging(false);
        onDragStateChange?.(false);
      }
      return newCount;
    });
  }, [onDragStateChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(0);
    setIsDragging(false);
    onDragStateChange?.(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a mock event for consistency
      const mockEvent = {
        target: { files }
      } as React.ChangeEvent<HTMLInputElement>;
      
      onFilesSelected?.(files);
      onChange?.(mockEvent);
    }
  }, [onFilesSelected, onChange, onDragStateChange]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (!disabled) {
      hiddenInputRef.current?.click();
    }
  }, [disabled]);

  // Global drag event handlers for fullscreen dropzone
  useEffect(() => {
    if (!fullscreenDropzone) return;

    let dragCounter = 0;

    const handleGlobalDragEnter = (e: DragEvent) => {
      e.preventDefault();
      dragCounter++;
      if (dragCounter === 1) {
        setGlobalDragActive(true);
      }
    };

    const handleGlobalDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter--;
      if (dragCounter === 0) {
        setGlobalDragActive(false);
      }
    };

    const handleGlobalDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleGlobalDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter = 0;
      setGlobalDragActive(false);
    };

    window.addEventListener('dragenter', handleGlobalDragEnter);
    window.addEventListener('dragleave', handleGlobalDragLeave);
    window.addEventListener('dragover', handleGlobalDragOver);
    window.addEventListener('drop', handleGlobalDrop);

    return () => {
      window.removeEventListener('dragenter', handleGlobalDragEnter);
      window.removeEventListener('dragleave', handleGlobalDragLeave);
      window.removeEventListener('dragover', handleGlobalDragOver);
      window.removeEventListener('drop', handleGlobalDrop);
    };
  }, [fullscreenDropzone]);

  // Typography props for different states
  const getTypographyProps = (variant: string, size: string, error: boolean, disabled: boolean) => {
    const sizeMap = {
      sm: 'sm' as const,
      md: 'md' as const,
      lg: 'lg' as const,
    };

    const weightMap = {
      sm: 'medium' as const,
      md: 'semibold' as const,
      lg: 'semibold' as const,
    };

    const getColor = (): TypographyColor => {
      if (disabled) return 'disabled';
      if (error) return 'error';
      if (variant === 'button') return 'button-secondary';
      return 'primary';
    };

    return {
      size: sizeMap[size as keyof typeof sizeMap] || sizeMap.md,
      weight: weightMap[size as keyof typeof weightMap] || weightMap.md,
      color: getColor()
    };
  };

  const typographyProps = getTypographyProps(variant, size, error, !!disabled);
  const isActive = isDragging || dragActive;

  // Build component classes
  const uploaderClasses = cn(
    'file-uploader',
    `file-uploader--${variant}`,
    `file-uploader--${size}`,
    isActive && 'file-uploader--active',
    disabled && 'file-uploader--disabled',
    error && 'file-uploader--error',
    className
  );

  const renderContent = () => {
    if (children) {
      return children;
    }

    // Default content based on variant
    switch (variant) {
      case 'avatar':
        return (
          <div className="file-uploader__avatar-container">
            <Avatar
              size={avatarSize}
              shape={avatarShape}
              variant={avatarVariant}
              colorPalette={avatarColorPalette}
              name={avatarName}
              src={previewUrl || undefined}
              fallbackMode={previewUrl ? 'none' : 'icon'}
            />
            <div className="file-uploader__avatar-overlay">
              <svg
                className="file-uploader__avatar-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
          </div>
        );

      case 'button':
        return (
          <>
            {leftIcon && (
              <span className="file-uploader__icon file-uploader__icon--left">
                {leftIcon}
              </span>
            )}
            <Label
              size={typographyProps.size}
              weight={typographyProps.weight}
              color={typographyProps.color}
              as="span"
              className="file-uploader__text"
            >
              {multiple ? 'Choose Files' : 'Choose File'}
            </Label>
            {rightIcon && (
              <span className="file-uploader__icon file-uploader__icon--right">
                {rightIcon}
              </span>
            )}
          </>
        );

      case 'compact':
        return (
          <>
            {leftIcon && (
              <span className="file-uploader__icon file-uploader__icon--left">
                {leftIcon}
              </span>
            )}
            <Label
              size={typographyProps.size}
              weight={typographyProps.weight}
              color={typographyProps.color}
              as="span"
              className="file-uploader__text"
            >
              Upload
            </Label>
          </>
        );

      case 'dropzone':
      default:
        return (
          <div className="file-uploader__content">
            <div className="file-uploader__icon-area">
              {leftIcon || (
                <svg
                  className="file-uploader__upload-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              )}
            </div>
            <div className="file-uploader__text-area">
              <Label
                size={typographyProps.size}
                weight={typographyProps.weight}
                color={typographyProps.color}
                as="span"
                className="file-uploader__primary-text"
              >
                {isActive 
                  ? `Drop ${multiple ? 'files' : 'file'} here`
                  : `Drag and drop ${multiple ? 'files' : 'a file'} here, or click to select`
                }
              </Label>
              {helperText && (
                <Label
                  size="sm"
                  color="secondary"
                  as="span"
                  className="file-uploader__helper-text"
                >
                  {helperText}
                </Label>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="file-uploader-wrapper">
      {/* Label */}
      {label && (
        <div
          className="file-uploader-label"
          onClick={handleClick}
        >
          <Label
            size={size === 'sm' ? 'sm' : 'md'}
            weight="semibold"
            color={disabled ? 'disabled' : 'primary'}
            as="span"
          >
            {label}
            {required && (
              <span className="file-uploader-label__required">*</span>
            )}
          </Label>
        </div>
      )}

      {/* File Uploader */}
      <div
        className={uploaderClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            handleClick();
          }
        }}
        aria-label={
          label ||
          `${multiple ? 'Upload multiple files' : 'Upload file'}${
            disabled ? ' (disabled)' : ''
          }`
        }
      >
        {renderContent()}
      </div>

      {/* Hidden Input */}
      <input
        ref={hiddenInputRef}
        type="file"
        className="file-uploader__hidden-input"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleFileChange}
        {...props}
      />

      {/* Error Message */}
      {error && helperText && (
        <Label
          size="sm"
          color="error"
          className="file-uploader-error"
        >
          {helperText}
        </Label>
      )}

      {/* Fullscreen Dropzone Overlay */}
      {fullscreenDropzone && globalDragActive && (
        <div
          className="file-uploader__fullscreen-overlay"
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="file-uploader__fullscreen-content">
            <div className="file-uploader__fullscreen-icon">
              <svg
                width="64"
                height="64"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <Label size="lg" weight="semibold" color="primary" as="div" className="file-uploader__fullscreen-text">
              Drop {multiple ? 'files' : 'file'} anywhere to upload
            </Label>
          </div>
        </div>
      )}
    </div>
  );
});

FileUploader.displayName = 'FileUploader';

export default FileUploader;

// ===============================================
// USAGE EXAMPLES
// ===============================================

/*

// ✅ DROPZONE VARIANT (Default)
<FileUploader
  label="Profile Image"
  accept="image/*"
  helperText="PNG, JPG, GIF up to 10MB"
  onFilesSelected={(files) => console.log(files)}
/>

// ✅ BUTTON VARIANT
<FileUploader
  variant="button"
  size="lg"
  multiple
  accept=".pdf,.doc,.docx"
  leftIcon={<UploadIcon />}
  onFilesSelected={(files) => console.log(files)}
>
  Upload Documents
</FileUploader>

// ✅ COMPACT VARIANT
<FileUploader
  variant="compact"
  size="sm"
  accept="image/*"
  leftIcon={<ImageIcon />}
  onFilesSelected={(files) => console.log(files)}
/>

// ✅ AVATAR VARIANT
<FileUploader
  variant="avatar"
  avatarSize="xl"
  avatarShape="full"
  avatarName="John Doe"
  accept="image/*"
  onFilesSelected={(files) => console.log(files)}
  label="Profile Picture"
  helperText="Click to upload a new profile picture"
/>

// ✅ AVATAR VARIANT - Square Shape
<FileUploader
  variant="avatar"
  avatarSize="2xl"
  avatarShape="square"
  avatarVariant="outline"
  avatarColorPalette="blue"
  accept="image/*"
  onFilesSelected={(files) => console.log(files)}
/>

// ✅ WITH ERROR STATE
<FileUploader
  label="Required Document"
  required
  error
  helperText="Please select a valid file"
  accept=".pdf"
  onFilesSelected={(files) => console.log(files)}
/>

// ✅ DISABLED STATE
<FileUploader
  label="Upload Disabled"
  disabled
  helperText="Feature not available"
/>

*/