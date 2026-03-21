// ===============================================
// AITextarea — AI-style prompt input component
// blimpify-ui/design/system/components/ai/AITextarea/AITextarea.tsx
// ===============================================

import React, {
  ReactNode,
  useRef,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { cn } from '../../../utils/cn';
import { IconButton } from '../../actions/IconButton/IconButton';
import { Icon } from '../../media/Icon/Icon';
import { Spinner } from '../../feedback/Spinner/Spinner';
import {
  ArrowUpIcon,
  XMarkIcon,
  PaperClipIcon,
} from '@heroicons/react/24/outline';
import './AITextarea.css';

// ─────────────────────────────────────────────
// Public types
// ─────────────────────────────────────────────

export interface AttachedImage {
  id: string;
  file?: File;
  /** Always populated — blob URL or pre-supplied URL */
  url: string;
  name?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
}

export interface AITextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string, images?: AttachedImage[]) => void;
  /**
   * When true: only Cmd/Ctrl+Enter submits.
   * When false (default): Enter submits, Shift+Enter inserts a newline.
   */
  submitOnCmdEnter?: boolean;
  placeholder?: string;
  /** Streaming / thinking state — submit button shows spinner and is disabled */
  loading?: boolean;
  disabled?: boolean;
  /** Rendered left of the textarea, bottom-aligned (e.g. a ghost + button) */
  leadingActions?: ReactNode;
  /** Rendered right of the textarea, before the submit button (e.g. model switcher) */
  trailingActions?: ReactNode;
  quickActions?: QuickAction[];
  allowImages?: boolean;
  maxImages?: number;
  onImagesChange?: (images: AttachedImage[]) => void;
  className?: string;
}

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────

interface ImageThumbnailProps {
  image: AttachedImage;
  onRemove: (id: string) => void;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({ image, onRemove }) => (
  <div className="ai-textarea__thumbnail">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src={image.url}
      alt={image.name ?? 'Attached image'}
      className="ai-textarea__thumbnail-img"
    />
    <button
      type="button"
      className="ai-textarea__thumbnail-remove"
      aria-label={`Remove ${image.name ?? 'image'}`}
      onClick={() => onRemove(image.id)}
    >
      <XMarkIcon style={{ width: 10, height: 10 }} />
    </button>
  </div>
);

interface QuickActionChipProps {
  action: QuickAction;
}

const QuickActionChip: React.FC<QuickActionChipProps> = ({ action }) => (
  <button
    type="button"
    className="ai-textarea__chip"
    onClick={action.onClick}
  >
    {action.icon && (
      <span className="ai-textarea__chip-icon">{action.icon}</span>
    )}
    <span className="ai-textarea__chip-label">{action.label}</span>
  </button>
);

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────

export const AITextarea: React.FC<AITextareaProps> = ({
  value,
  onChange,
  onSubmit,
  submitOnCmdEnter = false,
  placeholder,
  loading = false,
  disabled = false,
  leadingActions,
  trailingActions,
  quickActions,
  allowImages = false,
  maxImages = 5,
  onImagesChange,
  className,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const [attachedImages, setAttachedImages] = useState<AttachedImage[]>([]);

  const effectiveValue = value !== undefined ? value : internalValue;
  const hasContent =
    effectiveValue.trim().length > 0 || attachedImages.length > 0;

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Auto-resize ──
  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const lineHeight = parseInt(getComputedStyle(el).lineHeight, 10) || 24;
    const minHeight = lineHeight * 2;
    const maxHeight = lineHeight * 8;
    el.style.height = `${Math.min(Math.max(el.scrollHeight, minHeight), maxHeight)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [effectiveValue, adjustHeight]);

  // ── Blob URL cleanup on unmount ──
  const attachedImagesRef = useRef(attachedImages);
  attachedImagesRef.current = attachedImages;

  useEffect(() => {
    return () => {
      attachedImagesRef.current.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  // ── Image helpers ──
  const addImages = useCallback(
    (files: File[]) => {
      const available = maxImages - attachedImagesRef.current.length;
      if (available <= 0) return;
      const toAdd = files.slice(0, available);
      const newImages: AttachedImage[] = toAdd.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        name: file.name,
      }));
      setAttachedImages((prev) => {
        const updated = [...prev, ...newImages];
        onImagesChange?.(updated);
        return updated;
      });
    },
    [maxImages, onImagesChange],
  );

  const removeImage = useCallback(
    (id: string) => {
      setAttachedImages((prev) => {
        const removed = prev.find((img) => img.id === id);
        if (removed?.file) URL.revokeObjectURL(removed.url);
        const updated = prev.filter((img) => img.id !== id);
        onImagesChange?.(updated);
        return updated;
      });
    },
    [onImagesChange],
  );

  // ── Paste handler ──
  const handlePaste = useCallback(
    (e: React.ClipboardEvent<HTMLDivElement>) => {
      if (!allowImages) return;
      const items = Array.from(e.clipboardData.items);
      const imageItems = items.filter((item) => item.type.startsWith('image/'));
      if (imageItems.length === 0) return;
      e.preventDefault();
      const files = imageItems
        .map((item) => item.getAsFile())
        .filter((f): f is File => f !== null);
      addImages(files);
    },
    [allowImages, addImages],
  );

  // ── File input handler ──
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []).filter((f) =>
        f.type.startsWith('image/'),
      );
      addImages(files);
      e.target.value = '';
    },
    [addImages],
  );

  // ── Submit ──
  const handleSubmit = useCallback(() => {
    if (!hasContent || loading || disabled) return;
    onSubmit?.(
      effectiveValue,
      attachedImages.length > 0 ? attachedImages : undefined,
    );
  }, [hasContent, loading, disabled, onSubmit, effectiveValue, attachedImages]);

  // ── Keyboard ──
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (submitOnCmdEnter) {
        if (e.key === 'Enter' && isCmdOrCtrl) {
          e.preventDefault();
          handleSubmit();
        }
      } else {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit();
        }
      }
    },
    [submitOnCmdEnter, handleSubmit],
  );

  const showFooter = (quickActions && quickActions.length > 0) || allowImages;

  return (
    <div
      className={cn(
        'ai-textarea',
        disabled && 'ai-textarea--disabled',
        className,
      )}
      onPaste={handlePaste}
    >
      {/* ── IMAGE THUMBNAILS ROW ── */}
      {attachedImages.length > 0 && (
        <div className="ai-textarea__images">
          {attachedImages.map((img) => (
            <ImageThumbnail key={img.id} image={img} onRemove={removeImage} />
          ))}
        </div>
      )}

      {/* ── MAIN INPUT ROW ── */}
      <div className="ai-textarea__input-row">
        {leadingActions && (
          <div className="ai-textarea__leading">{leadingActions}</div>
        )}

        <textarea
          ref={textareaRef}
          className="ai-textarea__field"
          value={effectiveValue}
          placeholder={placeholder}
          disabled={disabled || loading}
          rows={2}
          style={{ resize: 'none', overflow: 'auto' }}
          onChange={(e) => {
            const val = e.target.value;
            if (value === undefined) setInternalValue(val);
            onChange?.(val);
            adjustHeight();
          }}
          onKeyDown={handleKeyDown}
        />

        <div className="ai-textarea__trailing">
          {trailingActions}
          <IconButton
            icon={
              loading ? (
                <Spinner size="xs" />
              ) : (
                <ArrowUpIcon style={{ width: 16, height: 16 }} />
              )
            }
            variant={hasContent && !loading ? 'accent' : 'raised'}
            size="sm"
            aria-label="Submit"
            disabled={!hasContent || disabled || loading}
            onClick={handleSubmit}
          />
        </div>
      </div>

      {/* ── FOOTER ROW ── */}
      {showFooter && (
        <div className="ai-textarea__footer">
          <div className="ai-textarea__quick-actions">
            {quickActions?.map((action) => (
              <QuickActionChip key={action.id} action={action} />
            ))}
          </div>
          {allowImages && (
            <IconButton
              icon={
                <Icon size="sm" color="button-ghost">
                  <PaperClipIcon />
                </Icon>
              }
              variant="raised"
              size="sm"
              aria-label="Attach image"
              disabled={disabled || attachedImages.length >= maxImages}
              onClick={() => fileInputRef.current?.click()}
            />
          )}
        </div>
      )}

      {allowImages && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />
      )}
    </div>
  );
};
