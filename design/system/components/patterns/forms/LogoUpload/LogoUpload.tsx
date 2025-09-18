import React, { useState, useRef } from 'react';
import { FileUploader } from '../../primitives/FileUploader';
import { Logo } from '../../primitives/Logo';

export interface LogoUploadProps {
  currentLogoUrl?: string;
  onUpload: (files: FileList | null) => Promise<void>;
  onRemove?: () => void;
  maxSize?: number; // i MB
  allowedFormats?: string[];
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  previewSize?: 'sm' | 'md' | 'lg';
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  currentLogoUrl,
  onUpload,
  onRemove,
  maxSize = 5,
  allowedFormats = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp'],
  className = '',
  disabled = false,
  showPreview = true,
  previewSize = 'md'
}) => {
  const [uploadError, setUploadError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Kontrollera filstorlek
    if (file.size > maxSize * 1024 * 1024) {
      return `Filen är för stor. Max ${maxSize}MB tillåtet.`;
    }

    // Kontrollera filformat
    if (!allowedFormats.includes(file.type)) {
      return `Endast ${allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} format tillåts.`;
    }

    return null;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadError('');

    // Validera fil
    const validationError = validateFile(file);
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    // Skapa preview
    if (showPreview) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Ladda upp fil
    setIsUploading(true);
    try {
      await onUpload(files);
      setUploadError('');
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Uppladdning misslyckades');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    setUploadError('');
    if (onRemove) {
      onRemove();
    }
  };

  const displayLogoUrl = previewUrl || currentLogoUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview */}
      {showPreview && displayLogoUrl && (
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <Logo
            src={displayLogoUrl}
            alt="Logotyp preview"
            size={previewSize}
            variant="contain"
            maxWidth="120px"
            maxHeight="60px"
            className="border border-gray-200 rounded"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Nuvarande logotyp</p>
            <p className="text-xs text-gray-500">
              {previewUrl ? 'Ny uppladdad bild' : 'Befintlig logotyp'}
            </p>
          </div>
          {onRemove && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={disabled || isUploading}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
            >
              Ta bort
            </button>
          )}
        </div>
      )}

      {/* Upload Area */}
      <div className="space-y-2">
        <FileUploader
          ref={fileInputRef}
          onFileSelect={handleFileSelect}
          accept={allowedFormats.join(',')}
          disabled={disabled || isUploading}
          className="w-full"
          multiple={false}
        >
          <div className="text-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-900">
                {isUploading ? 'Laddar upp...' : 'Klicka för att ladda upp logotyp'}
              </p>
              <p className="text-xs text-gray-500">
                {allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} • Max {maxSize}MB
              </p>
            </div>
          </div>
        </FileUploader>

        {/* Error Message */}
        {uploadError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{uploadError}</p>
            </div>
          </div>
        )}

        {/* Guidelines */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>Rekommenderade specifikationer:</strong></p>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Minst 100x100 pixlar</li>
            <li>Max 2000x2000 pixlar</li>
            <li>Proportioner mellan 1:4 och 4:1</li>
            <li>Transparent bakgrund (PNG/SVG) för bästa resultat</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
