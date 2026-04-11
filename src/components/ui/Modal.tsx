'use client';

import React, { useEffect, useRef } from 'react';

/* ============================================================
   MODAL — CVtoWeb Design System
   Sizes:    sm | md | lg
   Slots:    title, description, children (body), footer
   Behaviour: escape to close, optional backdrop-click to close,
              focus trap, scroll lock
   ============================================================ */

type ModalSize = 'sm' | 'md' | 'lg';

export interface ModalProps {
  isOpen:           boolean;
  onClose:          () => void;
  title?:           React.ReactNode;
  description?:     React.ReactNode;
  size?:            ModalSize;
  children?:        React.ReactNode;
  footer?:          React.ReactNode;
  closeOnBackdrop?: boolean;
}

const sizeMap: Record<ModalSize, string> = {
  sm: '400px',
  md: '480px',
  lg: '560px',
};

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
  closeOnBackdrop = true,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  /* ── Escape to close ────────────────────────────────────── */
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  /* ── Scroll lock ────────────────────────────────────────── */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  /* ── Focus trap — move focus into panel on open ─────────── */
  useEffect(() => {
    if (isOpen) {
      const frame = requestAnimationFrame(() => panelRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-desc' : undefined}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        backgroundColor: 'oklch(0 0 0 / 0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={closeOnBackdrop ? (e) => { if (e.target === e.currentTarget) onClose(); } : undefined}
    >
      {/* ── Panel ───────────────────────────────────────────── */}
      <div
        ref={panelRef}
        tabIndex={-1}
        style={{
          width: '100%',
          maxWidth: sizeMap[size],
          backgroundColor: 'var(--brand-800)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1.25rem',
          boxShadow: '0 24px 64px oklch(0 0 0 / 0.5), 0 8px 24px oklch(0 0 0 / 0.3)',
          outline: 'none',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* ── Decorative glow ─────────────────────────────────── */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: 0, right: 0,
            width: '280px', height: '200px',
            background: 'radial-gradient(ellipse at top right, oklch(0.68 0.18 220 / 0.18) 0%, transparent 70%)',
            borderRadius: '0 1.25rem 0 0',
            pointerEvents: 'none',
          }}
        />

        {/* ── Header ──────────────────────────────────────────── */}
        {(title || description) && (
          <div
            style={{
              padding: '1.5rem 1.5rem 1.25rem',
              borderBottom: children || footer ? '1px solid var(--border-subtle)' : undefined,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {title && (
                <h2
                  id="modal-title"
                  style={{
                    fontSize: 'var(--type-h5-size)',
                    fontWeight: 'var(--type-h5-weight)',
                    lineHeight: 'var(--type-h5-lh)',
                    color: 'var(--text-primary)',
                    margin: 0,
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-desc"
                  style={{
                    fontSize: 'var(--type-body-sm-size)',
                    color: 'var(--neutral-400)',
                    marginTop: '0.375rem',
                    lineHeight: 'var(--type-body-sm-lh)',
                  }}
                >
                  {description}
                </p>
              )}
            </div>

            {/* Close button */}
            <CloseButton onClick={onClose} />
          </div>
        )}

        {/* ── Body ──────────────────────────────────────────── */}
        {children && (
          <div
            style={{
              padding: '1.5rem',
              flex: 1,
              overflowY: 'auto',
              /* Remap only the tokens that affect the input field track itself.
                 Labels and helper text sit against the dark modal surface so
                 they keep their original light values (--neutral-300 / --neutral-500). */
              ['--bg-surface'     as string]: 'var(--neutral-100)',
              ['--bg-subtle'      as string]: 'var(--neutral-200)',
              ['--text-primary'   as string]: 'var(--neutral-900)',
              ['--text-muted'     as string]: 'var(--neutral-400)',
              ['--border-default' as string]: 'var(--neutral-300)',
              ['--border-strong'  as string]: 'var(--neutral-400)',
            }}
          >
            {children}
          </div>
        )}

        {/* ── Footer ────────────────────────────────────────── */}
        {footer && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'flex-end',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Close button ─────────────────────────────────────────── */
function CloseButton({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = React.useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label="Close"
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '2rem', height: '2rem',
        borderRadius: '0.5rem',
        border: 'none',
        cursor: 'pointer',
        flexShrink: 0,
        backgroundColor: hovered ? 'oklch(1 0 0 / 0.08)' : 'transparent',
        color: hovered ? 'var(--text-primary)' : 'var(--text-muted)',
        transition: 'background-color 120ms ease, color 120ms ease',
        outline: 'none',
      }}
    >
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2} strokeLinecap="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  );
}
