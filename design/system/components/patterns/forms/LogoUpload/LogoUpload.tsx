import React, { useState, useRef } from 'react';
import { FileUploader } from '../../../primitives/FileUploader';
import { Logo } from '../../../primitives/Logo';
import { ImageCropper } from '../../../primitives/ImageCropper';

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
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Kontrollera filstorlek
    if (file.size > maxSize * 1024 * 1024) {
      return `Filen är för stor (${(file.size / (1024 * 1024)).toFixed(1)}MB). Max ${maxSize}MB tillåtet för snabbare uppladdning.`;
    }

    // Kontrollera filformat
    if (!allowedFormats.includes(file.type)) {
      const supportedFormats = allowedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ');
      return `Formatet ${file.type.split('/')[1].toUpperCase()} stöds inte. Använd ${supportedFormats} istället.`;
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

    // Skapa preview och visa cropper för bilder som behöver beskärning
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setPreviewUrl(imageUrl);
      
      // Kontrollera om bilden behöver beskärning (för stora dimensioner eller fel proportioner)
      const img = new Image();
      img.onload = () => {
        // Mer aggressiv crop-detektering för testning
        const needsCropping = img.width > 1000 || img.height > 1000 || 
                             (img.width / img.height) > 3 || (img.height / img.width) > 3;
        
        console.log('Bildanalys:', {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          needsCropping
        });
        
        if (needsCropping) {
          console.log('Visar crop-komponent');
          setImageToCrop(imageUrl);
          setPendingFile(file);
          setShowCropper(true);
        } else {
          console.log('Laddar upp direkt utan beskärning');
          // Ladda upp direkt om ingen beskärning behövs
          uploadFile(file);
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      // Skapa en FileList från filen
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      await onUpload(dataTransfer.files);
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

  const handleCropComplete = async (croppedImageUrl: string) => {
    setShowCropper(false);
    
    // Konvertera cropped URL till File
    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const croppedFile = new File([blob], pendingFile?.name || 'cropped-logo.png', {
        type: blob.type || 'image/png'
      });
      
      // Uppdatera preview
      setPreviewUrl(croppedImageUrl);
      
      // Ladda upp den beskurna bilden
      await uploadFile(croppedFile);
      
      // Rensa upp
      URL.revokeObjectURL(croppedImageUrl);
    } catch (error) {
      setUploadError('Kunde inte bearbeta den beskurna bilden');
    }
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setImageToCrop('');
    setPendingFile(null);
    setPreviewUrl('');
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
          <div className="flex gap-2">
            {displayLogoUrl && !showCropper && (
              <button
                type="button"
                onClick={() => {
                  console.log('Manuell crop aktiverad');
                  setImageToCrop(displayLogoUrl);
                  setShowCropper(true);
                }}
                disabled={disabled || isUploading}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
              >
                Beskär bild
              </button>
            )}
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
        </div>
      )}

      {/* Upload Area */}
      <div className="space-y-2">
        <FileUploader
          ref={fileInputRef}
          onFilesSelected={handleFileSelect}
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
              <p className="text-xs text-gray-400 mt-1">
                Dra och släpp en fil här eller klicka för att välja
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
        <div className="text-xs text-gray-500 space-y-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium text-blue-900 mb-2">Varför kan vissa filer inte laddas upp?</p>
            <ul className="list-disc list-inside space-y-1 text-blue-800">
              <li><strong>För stora filer:</strong> Över 5MB tar för lång tid att ladda upp och kan orsaka problem</li>
              <li><strong>Fel format:</strong> Endast JPG, PNG, SVG och WebP stöds för bästa kompatibilitet</li>
              <li><strong>För små bilder:</strong> Under 100x100 pixlar blir suddiga när de skalas upp</li>
              <li><strong>För stora bilder:</strong> Över 2000x2000 pixlar är onödigt stora och långsamma</li>
              <li><strong>Extrema proportioner:</strong> Bilder som är för långa eller höga (mer än 4:1) ser konstiga ut</li>
              <li><strong>Lösning:</strong> Använd beskärningsverktyget för att justera bilden direkt här!</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium text-gray-700 mb-1">Rekommenderade specifikationer:</p>
            <ul className="list-disc list-inside space-y-0.5 ml-2">
              <li>Minst 100x100 pixlar</li>
              <li>Max 2000x2000 pixlar</li>
              <li>Proportioner mellan 1:4 och 4:1</li>
              <li>Transparent bakgrund (PNG/SVG) för bästa resultat</li>
              <li>Kvadratisk eller rektangulär form fungerar bäst</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Image Cropper Modal */}
      {showCropper && imageToCrop && (
        <ImageCropper
          src={imageToCrop}
          onCrop={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio={undefined} // Fri proportion för logotyper
          minWidth={100}
          minHeight={100}
          maxWidth={2000}
          maxHeight={2000}
        />
      )}
    </div>
  );
};
