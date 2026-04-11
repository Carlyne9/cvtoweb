'use client';

import React, { useRef, useState, useCallback, useId } from 'react';

/* ============================================================
   FILE UPLOAD — CVtoWeb Design System
   Variants:  default | error | success
   Sizes:     sm | md | lg
   States:    idle | dragging | uploading | complete | error
   Features:  drag-and-drop, click-to-browse, file preview,
              progress bar, multiple files, remove files
   ============================================================ */

type UploadVariant = 'default' | 'error' | 'success';
type UploadSize    = 'sm' | 'md' | 'lg';

export interface FileUploadProps {
  label?:          string;
  helperText?:     string;
  variant?:        UploadVariant;
  size?:           UploadSize;
  accept?:         string;
  acceptHint?:     string;
  multiple?:       boolean;
  maxSize?:        number;
  disabled?:       boolean;
  progress?:       number | null;
  onFilesChange?:  (files: File[]) => void;
  files?:          File[];
}

/* ── Glass tokens ────────────────────────────────────────── */
const glass = {
  bg:          'oklch(1 0 0 / 0.06)',
  bgDrag:      'oklch(0.532 0.157 278.887 / 0.14)',
  bgDisabled:  'oklch(1 0 0 / 0.02)',
  border:      'oklch(1 0 0 / 0.15)',
  borderDrag:  'oklch(0.592 0.134 278.887 / 0.7)',
  borderDisabled: 'oklch(1 0 0 / 0.07)',
  iconBg:      'oklch(1 0 0 / 0.08)',
  rowBg:       'oklch(1 0 0 / 0.07)',
  rowBorder:   'oklch(1 0 0 / 0.12)',
  progressTrack: 'oklch(1 0 0 / 0.1)',
  removeHoverBg: 'oklch(0.59 0.22 25 / 0.18)',
} as const;

/* ── Size map ────────────────────────────────────────────── */
const sizeMap: Record<UploadSize, {
  paddingY: string; paddingX: string;
  iconSize: number; borderRadius: string;
  titleSize: string; metaSize: string;
}> = {
  sm: {
    paddingY: '1.25rem', paddingX: '1.25rem',
    iconSize: 28, borderRadius: '0.75rem',
    titleSize: 'var(--type-body-sm-size)',
    metaSize:  'var(--type-caption-size)',
  },
  md: {
    paddingY: '2.25rem', paddingX: '2rem',
    iconSize: 36, borderRadius: '1rem',
    titleSize: 'var(--type-body-md-size)',
    metaSize:  'var(--type-caption-size)',
  },
  lg: {
    paddingY: '3.5rem', paddingX: '2.5rem',
    iconSize: 44, borderRadius: '1.25rem',
    titleSize: 'var(--type-body-lg-size)',
    metaSize:  'var(--type-body-sm-size)',
  },
};

/* ── Variant map ─────────────────────────────────────────── */
const variantMap: Record<UploadVariant, {
  border: string; helperColor: string;
}> = {
  default: {
    border:      glass.border,
    helperColor: 'var(--neutral-400)',
  },
  error: {
    border:      'oklch(0.49 0.19 25 / 0.7)',
    helperColor: 'var(--text-error)',
  },
  success: {
    border:      'oklch(0.52 0.17 145 / 0.7)',
    helperColor: 'var(--success-400)',
  },
};

/* ── Helpers ─────────────────────────────────────────────── */
function formatBytes(bytes: number): string {
  if (bytes < 1024)        return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Keyframe styles ─────────────────────────────────────── */
const uploadAnimStyles = `
  @keyframes uploadGlow {
    0%, 100% {
      box-shadow: 0 0 0 0 oklch(0.68 0.18 220 / 0),
                  0 0 0 0 oklch(0.532 0.157 278.887 / 0);
    }
    50% {
      box-shadow: 0 0 28px 6px oklch(0.68 0.18 220 / 0.18),
                  0 0 56px 16px oklch(0.532 0.157 278.887 / 0.09);
    }
  }
  @keyframes spinIcon {
    to { transform: rotate(360deg); }
  }
  @keyframes dot1 { 0%,20%,100%{opacity:0} 35%,80%{opacity:1} }
  @keyframes dot2 { 0%,35%,100%{opacity:0} 50%,80%{opacity:1} }
  @keyframes dot3 { 0%,50%,100%{opacity:0} 65%,80%{opacity:1} }
`;

/* ── Icons ───────────────────────────────────────────────── */
function UploadIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function SpinnerIcon({ size }: { size: number }) {
  return (
    <svg
      width={size} height={size} viewBox="0 0 24 24" fill="none"
      style={{ animation: 'spinIcon 0.9s linear infinite' }}
    >
      <circle cx="12" cy="12" r="9" stroke="oklch(1 0 0 / 0.1)" strokeWidth="2.5" />
      <path
        d="M12 3a9 9 0 019 9"
        stroke="url(#spin_grad)" strokeWidth="2.5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="spin_grad" x1="12" y1="3" x2="21" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="oklch(0.68 0.18 220)" />
          <stop offset="1" stopColor="oklch(0.592 0.134 278.887)" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function AnimatedDots() {
  const dotStyle = (anim: string): React.CSSProperties => ({
    display: 'inline-block',
    animation: `${anim} 1.6s ease-in-out infinite`,
    opacity: 0,
  });
  return (
    <>
      <span style={dotStyle('dot1')}>.</span>
      <span style={dotStyle('dot2')}>.</span>
      <span style={dotStyle('dot3')}>.</span>
    </>
  );
}

function FileIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

function CheckIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ErrorIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── FileRow ─────────────────────────────────────────────── */
function FileRow({
  file,
  onRemove,
  progress,
}: {
  file: File;
  onRemove: () => void;
  progress?: number | null;
}) {
  const [hovered, setHovered] = useState(false);
  const isUploading = typeof progress === 'number';

  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.625rem 0.875rem',
        borderRadius: '0.625rem',
        border: `1px solid ${glass.rowBorder}`,
        backgroundColor: glass.rowBg,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Icon */}
      <span style={{ color: 'var(--brand-100)', flexShrink: 0 }}>
        <FileIcon size={16} />
      </span>

      {/* Name + size + progress */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: 'var(--type-body-sm-size)',
          color: 'var(--neutral-100)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginBottom: isUploading ? '0.375rem' : 0,
        }}>
          {file.name}
        </p>

        {isUploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              flex: 1, height: '3px', borderRadius: '999px',
              backgroundColor: glass.progressTrack,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%', borderRadius: '999px',
                backgroundColor: 'var(--brand-100)',
                width: `${progress}%`,
                transition: 'width 200ms ease',
              }} />
            </div>
            <span style={{
              fontSize: 'var(--type-caption-size)',
              color: 'var(--neutral-400)',
              flexShrink: 0,
            } as React.CSSProperties}>
              {progress}%
            </span>
          </div>
        ) : (
          <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--neutral-400)' }}>
            {formatBytes(file.size)}
          </p>
        )}
      </div>

      {/* Remove button */}
      {!isUploading && (
        <button
          type="button"
          onClick={onRemove}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '1.5rem', height: '1.5rem', borderRadius: '0.375rem',
            border: 'none', cursor: 'pointer', flexShrink: 0,
            backgroundColor: hovered ? glass.removeHoverBg : 'transparent',
            color: hovered ? 'var(--error-400)' : 'var(--neutral-500)',
            transition: 'background-color 120ms ease, color 120ms ease',
          }}
          aria-label={`Remove ${file.name}`}
        >
          <XIcon size={12} />
        </button>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export function FileUpload({
  label,
  helperText,
  variant   = 'default',
  size      = 'md',
  accept,
  acceptHint,
  multiple  = false,
  maxSize,
  disabled  = false,
  progress  = null,
  onFilesChange,
  files: controlledFiles,
}: FileUploadProps) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const id         = useId();
  const [dragging,      setDragging]      = useState(false);
  const [internalFiles, setInternalFiles] = useState<File[]>([]);
  const [sizeError,     setSizeError]     = useState<string | null>(null);
  const [btnHovered,    setBtnHovered]    = useState(false);

  const files = controlledFiles ?? internalFiles;
  const sz    = sizeMap[size];
  const vt    = variantMap[variant];

  const isUploading = typeof progress === 'number';
  const isComplete  = !isUploading && files.length > 0 && variant === 'success';
  const isError     = variant === 'error';

  const borderColor = disabled
    ? glass.borderDisabled
    : dragging
      ? glass.borderDrag
      : vt.border;

  const bgColor = disabled
    ? glass.bgDisabled
    : dragging
      ? glass.bgDrag
      : glass.bg;

  const iconColor = disabled
    ? 'var(--neutral-600)'
    : dragging || isComplete
      ? 'var(--brand-100)'
      : isError
        ? 'var(--text-error)'
        : 'var(--neutral-400)';

  const addFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming);

    if (maxSize) {
      const oversized = arr.filter(f => f.size > maxSize);
      if (oversized.length) {
        setSizeError(`${oversized[0].name} exceeds the ${formatBytes(maxSize)} limit.`);
        return;
      }
    }

    setSizeError(null);
    const next = multiple ? [...files, ...arr] : arr;
    setInternalFiles(next);
    onFilesChange?.(next);
  }, [files, multiple, maxSize, onFilesChange]);

  const removeFile = useCallback((index: number) => {
    const next = files.filter((_, i) => i !== index);
    setInternalFiles(next);
    onFilesChange?.(next);
    setSizeError(null);
  }, [files, onFilesChange]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !isUploading) setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled || isUploading) return;
    addFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const hasFiles = files.length > 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
      <style>{uploadAnimStyles}</style>
      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          style={{
            display: 'block',
            fontSize: 'var(--type-label-size)',
            fontWeight: 'var(--type-label-weight)',
            letterSpacing: 'var(--type-label-ls)',
            color: disabled ? 'var(--neutral-600)' : 'var(--neutral-300)',
          }}
        >
          {label}
        </label>
      )}

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          position: 'relative',
          padding: `${sz.paddingY} ${sz.paddingX}`,
          borderRadius: sz.borderRadius,
          border: `1.5px dashed ${borderColor}`,
          backgroundColor: bgColor,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          textAlign: 'center',
          cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
          transition: 'border-color 150ms ease, background-color 150ms ease',
          animation: isUploading ? 'uploadGlow 2.2s ease-in-out infinite' : undefined,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
        onClick={() => {
          if (!disabled && !isUploading) inputRef.current?.click();
        }}
      >
        {/* Hidden input */}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled || isUploading}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          tabIndex={-1}
          aria-hidden
        />

        {/* Icon area */}
        <div style={{
          width: `${sz.iconSize + 20}px`, height: `${sz.iconSize + 20}px`,
          borderRadius: '0.75rem',
          backgroundColor: isError ? 'oklch(0.59 0.22 25 / 0.15)' : glass.iconBg,
          border: `1px solid ${isError ? 'oklch(0.49 0.19 25 / 0.4)' : glass.rowBorder}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {isError ? (
            <span style={{ color: 'var(--text-error)' }}>
              <ErrorIcon size={sz.iconSize - 8} />
            </span>
          ) : isUploading ? (
            <SpinnerIcon size={sz.iconSize - 4} />
          ) : isComplete ? (
            <span style={{ color: 'var(--brand-100)' }}>
              <CheckIcon size={sz.iconSize - 8} />
            </span>
          ) : (
            <UploadIcon size={sz.iconSize - 8} color={iconColor} />
          )}
        </div>

        {/* Text */}
        <div>
          <p style={{
            fontSize: sz.titleSize,
            fontWeight: 'var(--type-subheading-lg-weight)',
            color: disabled ? 'var(--neutral-600)' : 'var(--neutral-100)',
            marginBottom: '0.25rem',
          }}>
            {dragging
              ? 'Drop to upload'
              : isUploading
                ? <span>Parsing your CV<AnimatedDots /></span>
                : isComplete
                  ? 'Upload complete'
                  : hasFiles
                    ? 'Add more files'
                    : 'Drop your CV here or'}
          </p>

          {/* Browse link + hint */}
          {!dragging && !isUploading && !isComplete && (
            <p style={{ fontSize: sz.metaSize, color: disabled ? 'var(--neutral-600)' : 'var(--neutral-400)' }}>
              {hasFiles ? '' : (
                <>
                  <span
                    onMouseEnter={() => { if (!disabled) setBtnHovered(true); }}
                    onMouseLeave={() => setBtnHovered(false)}
                    style={{
                      color: disabled
                        ? 'var(--neutral-600)'
                        : btnHovered ? 'var(--brand-50)' : 'var(--brand-100)',
                      textDecoration: disabled ? 'none' : 'underline',
                      cursor: disabled ? 'not-allowed' : 'pointer',
                      transition: 'color 120ms ease',
                    }}
                  >
                    browse files
                  </span>
                  {acceptHint && <> · {acceptHint}</>}
                </>
              )}
            </p>
          )}
        </div>
      </div>

      {/* File list */}
      {hasFiles && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', marginTop: '0.25rem' }}>
          {files.map((file, i) => (
            <FileRow
              key={`${file.name}-${i}`}
              file={file}
              onRemove={() => removeFile(i)}
              progress={isUploading ? progress : null}
            />
          ))}
        </div>
      )}

      {/* Helper / error text */}
      {(helperText || sizeError) && (
        <p style={{
          fontSize: 'var(--type-caption-size)',
          color: sizeError ? 'var(--text-error)' : vt.helperColor,
          marginTop: '0.125rem',
        }}>
          {sizeError ?? helperText}
        </p>
      )}
    </div>
  );
}
