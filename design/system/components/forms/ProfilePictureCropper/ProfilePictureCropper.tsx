// ===============================================
// design/system/components/forms/ProfilePictureCropper/ProfilePictureCropper.tsx
// PROFILE PICTURE CROPPER - Wrapper för cirkulär beskärning av profilbilder/loggor
// ===============================================

'use client';

import React from 'react';
import { ImageCropper, ImageCropperProps } from '../ImageCropper/ImageCropper';

export interface ProfilePictureCropperProps extends Omit<ImageCropperProps, 'aspect' | 'circularCrop'> {
  /** Minsta storlek i pixlar (default: 200) */
  minSize?: number;
  /** Maximal storlek i pixlar (default: 800) */
  maxSize?: number;
}

/**
 * ProfilePictureCropper - Specialiserad cropper för profilbilder och loggor
 * 
 * Förinställd för cirkulär beskärning (1:1 aspect ratio, circular crop)
 * Perfekt för användarprofiler, företagsloggor och avatarer
 * 
 * @example
 * ```tsx
 * <ProfilePictureCropper
 *   imageSrc={imageSrc}
 *   onCropComplete={handleCropComplete}
 *   onCancel={handleCancel}
 *   minSize={200}
 *   maxSize={800}
 * />
 * ```
 */
export const ProfilePictureCropper: React.FC<ProfilePictureCropperProps> = ({
  minSize = 200,
  maxSize = 800,
  ...props
}) => {
  return (
    <ImageCropper
      {...props}
      aspect={1} // Kvadratisk (1:1) för cirkulär beskärning
      circularCrop={true} // Cirkulär beskärning
      minWidth={minSize}
      minHeight={minSize}
      maxWidth={maxSize}
      maxHeight={maxSize}
    />
  );
};

ProfilePictureCropper.displayName = 'ProfilePictureCropper';

export default ProfilePictureCropper;

