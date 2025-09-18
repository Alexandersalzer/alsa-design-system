import React, { useState, useRef, useCallback } from 'react';

export interface ImageCropperProps {
  src: string;
  onCrop: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // width/height ratio, undefined för fri proportion
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  className?: string;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({
  src,
  onCrop,
  onCancel,
  aspectRatio,
  minWidth = 100,
  minHeight = 100,
  maxWidth = 2000,
  maxHeight = 2000,
  className = ''
}) => {
  const [cropArea, setCropArea] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Ladda bild och sätt initial crop area
  const handleImageLoad = useCallback(() => {
    if (imageRef.current) {
      const { naturalWidth, naturalHeight } = imageRef.current;
      setImageSize({ width: naturalWidth, height: naturalHeight });
      
      // Sätt initial crop area till mitten av bilden
      const initialSize = Math.min(naturalWidth, naturalHeight) * 0.6;
      const initialWidth = aspectRatio ? initialSize * aspectRatio : initialSize;
      const initialHeight = aspectRatio ? initialSize : initialSize;
      
      setCropArea({
        x: (naturalWidth - initialWidth) / 2,
        y: (naturalHeight - initialHeight) / 2,
        width: initialWidth,
        height: initialHeight
      });
    }
  }, [aspectRatio]);

  // Hantera musdrag för att flytta crop area
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - cropArea.x,
        y: e.clientY - cropArea.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Begränsa till bildens gränser
      const maxX = imageSize.width - cropArea.width;
      const maxY = imageSize.height - cropArea.height;
      
      setCropArea(prev => ({
        ...prev,
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
  };

  // Hantera resize handles
  const handleResizeStart = (handle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizing && resizeHandle) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      let newCropArea = { ...cropArea };
      
      switch (resizeHandle) {
        case 'se': // Southeast
          newCropArea.width = Math.max(minWidth, Math.min(cropArea.width + deltaX, maxWidth));
          newCropArea.height = aspectRatio ? newCropArea.width / aspectRatio : Math.max(minHeight, Math.min(cropArea.height + deltaY, maxHeight));
          break;
        case 'sw': // Southwest
          newCropArea.width = Math.max(minWidth, Math.min(cropArea.width - deltaX, maxWidth));
          newCropArea.height = aspectRatio ? newCropArea.width / aspectRatio : Math.max(minHeight, Math.min(cropArea.height + deltaY, maxHeight));
          newCropArea.x = cropArea.x + (cropArea.width - newCropArea.width);
          break;
        case 'ne': // Northeast
          newCropArea.width = Math.max(minWidth, Math.min(cropArea.width + deltaX, maxWidth));
          newCropArea.height = aspectRatio ? newCropArea.width / aspectRatio : Math.max(minHeight, Math.min(cropArea.height - deltaY, maxHeight));
          newCropArea.y = cropArea.y + (cropArea.height - newCropArea.height);
          break;
        case 'nw': // Northwest
          newCropArea.width = Math.max(minWidth, Math.min(cropArea.width - deltaX, maxWidth));
          newCropArea.height = aspectRatio ? newCropArea.width / aspectRatio : Math.max(minHeight, Math.min(cropArea.height - deltaY, maxHeight));
          newCropArea.x = cropArea.x + (cropArea.width - newCropArea.width);
          newCropArea.y = cropArea.y + (cropArea.height - newCropArea.height);
          break;
      }
      
      // Begränsa till bildens gränser
      newCropArea.x = Math.max(0, Math.min(newCropArea.x, imageSize.width - newCropArea.width));
      newCropArea.y = Math.max(0, Math.min(newCropArea.y, imageSize.height - newCropArea.height));
      
      setCropArea(newCropArea);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  // Skapa beskuren bild
  const handleCrop = () => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      if (ctx) {
        // Sätt canvas storlek till crop area
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;
        
        // Rita beskuren del av bilden
        ctx.drawImage(
          img,
          cropArea.x, cropArea.y, cropArea.width, cropArea.height,
          0, 0, cropArea.width, cropArea.height
        );
        
        // Konvertera till blob och skapa URL
        canvas.toBlob((blob) => {
          if (blob) {
            const croppedUrl = URL.createObjectURL(blob);
            onCrop(croppedUrl);
          }
        }, 'image/png', 0.9);
      }
    }
  };

  // Konvertera crop area till CSS pixels
  const getCropStyle = () => {
    if (!imageRef.current) return {};
    
    const rect = imageRef.current.getBoundingClientRect();
    const scaleX = rect.width / imageSize.width;
    const scaleY = rect.height / imageSize.height;
    
    return {
      left: cropArea.x * scaleX,
      top: cropArea.y * scaleY,
      width: cropArea.width * scaleX,
      height: cropArea.height * scaleY
    };
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Beskär bilden</h3>
          <p className="text-sm text-gray-600">
            Dra för att flytta området eller använd hörnen för att ändra storlek
          </p>
        </div>
        
        <div className="relative mb-4">
          <div 
            ref={containerRef}
            className="relative inline-block border-2 border-gray-300 rounded-lg overflow-hidden"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imageRef}
              src={src}
              alt="Beskär"
              className="max-w-full max-h-[60vh] block"
              onLoad={handleImageLoad}
              draggable={false}
            />
            
            {/* Crop overlay */}
            <div
              className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-20 cursor-move"
              style={getCropStyle()}
              onMouseMove={handleResizeMove}
            >
              {/* Resize handles */}
              <div
                className="absolute w-3 h-3 bg-blue-500 border border-white cursor-se-resize"
                style={{ right: -6, bottom: -6 }}
                onMouseDown={(e) => handleResizeStart('se', e)}
              />
              <div
                className="absolute w-3 h-3 bg-blue-500 border border-white cursor-sw-resize"
                style={{ left: -6, bottom: -6 }}
                onMouseDown={(e) => handleResizeStart('sw', e)}
              />
              <div
                className="absolute w-3 h-3 bg-blue-500 border border-white cursor-ne-resize"
                style={{ right: -6, top: -6 }}
                onMouseDown={(e) => handleResizeStart('ne', e)}
              />
              <div
                className="absolute w-3 h-3 bg-blue-500 border border-white cursor-nw-resize"
                style={{ left: -6, top: -6 }}
                onMouseDown={(e) => handleResizeStart('nw', e)}
              />
            </div>
          </div>
        </div>
        
        {/* Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Beskärningsområde:</strong> {Math.round(cropArea.width)} × {Math.round(cropArea.height)} pixlar
          </p>
          {aspectRatio && (
            <p className="text-sm text-gray-600">
              <strong>Proportioner:</strong> {aspectRatio.toFixed(2)}:1
            </p>
          )}
        </div>
        
        {/* Knappar */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Avbryt
          </button>
          <button
            onClick={handleCrop}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
          >
            Beskär och använd
          </button>
        </div>
        
        {/* Dold canvas för bildbehandling */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};
