'use client';

import { forwardRef } from 'react';

/* ============================================================
   BUTTON — CVtoWeb Design System
   Variants:  primary | secondary | ghost | danger
   Sizes:     sm | md | lg
   States:    default | hover | active | disabled | loading
   ============================================================ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<Variant, React.CSSProperties> = {
  primary: {
    backgroundColor: 'var(--interactive-primary)',
    color:           'var(--neutral-50)',
    border:          'none',
  },
  secondary: {
    backgroundColor: 'var(--interactive-secondary)',
    color:           'var(--text-primary)',
    border:          '1px solid var(--border-strong)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color:           'var(--text-secondary)',
    border:          '1px solid transparent',
  },
  danger: {
    backgroundColor: 'var(--error-900)',
    color:           'var(--text-error)',
    border:          '1px solid var(--error-600)',
  },
};

const variantHover: Record<Variant, React.CSSProperties> = {
  primary:   { backgroundColor: 'var(--interactive-primary-hover)' },
  secondary: { backgroundColor: 'var(--interactive-secondary-hover)', borderColor: 'var(--neutral-600)' },
  ghost:     { backgroundColor: 'var(--interactive-ghost-hover)', color: 'var(--text-primary)' },
  danger:    { backgroundColor: 'var(--error-600)', color: 'var(--neutral-0)' },
};

const variantActive: Record<Variant, React.CSSProperties> = {
  primary:   { backgroundColor: 'var(--interactive-primary-active)' },
  secondary: { backgroundColor: 'var(--interactive-secondary-active)' },
  ghost:     { backgroundColor: 'var(--interactive-ghost-hover)' },
  danger:    { backgroundColor: 'var(--error-500)', color: 'var(--neutral-0)' },
};

const sizeStyles: Record<Size, React.CSSProperties> = {
  sm: {
    fontSize:      'var(--type-btn-sm-size)',
    fontWeight:    'var(--type-btn-sm-weight)',
    letterSpacing: 'var(--type-btn-sm-ls)',
    padding:       '0.375rem 0.75rem',
    gap:           '0.375rem',
    borderRadius:  '0.5rem',
    height:        '2rem',
  },
  md: {
    fontSize:      'var(--type-btn-md-size)',
    fontWeight:    'var(--type-btn-md-weight)',
    letterSpacing: 'var(--type-btn-md-ls)',
    padding:       '0.5rem 1rem',
    gap:           '0.5rem',
    borderRadius:  '0.625rem',
    height:        '2.5rem',
  },
  lg: {
    fontSize:      'var(--type-btn-lg-size)',
    fontWeight:    'var(--type-btn-lg-weight)',
    letterSpacing: 'var(--type-btn-lg-ls)',
    padding:       '0.625rem 1.375rem',
    gap:           '0.625rem',
    borderRadius:  '0.75rem',
    height:        '3rem',
  },
};

const iconSizes: Record<Size, number> = { sm: 14, md: 16, lg: 18 };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = 'primary',
      size     = 'md',
      loading  = false,
      iconLeft,
      iconRight,
      fullWidth = false,
      children,
      disabled,
      style,
      onMouseEnter,
      onMouseLeave,
      onMouseDown,
      onMouseUp,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    // Inline hover/active state via React — no Tailwind needed
    const [hovered,  setHovered]  = React.useState(false);
    const [active,   setActive]   = React.useState(false);

    const computedStyle: React.CSSProperties = {
      // Base
      display:        'inline-flex',
      alignItems:     'center',
      justifyContent: 'center',
      lineHeight:     1,
      whiteSpace:     'nowrap',
      cursor:         isDisabled ? 'not-allowed' : 'pointer',
      userSelect:     'none',
      transition:     'background-color 120ms ease, border-color 120ms ease, color 120ms ease, opacity 120ms ease, box-shadow 120ms ease',
      outline:        'none',
      width:          fullWidth ? '100%' : undefined,
      opacity:        isDisabled ? 0.45 : 1,
      // Variant base
      ...variantStyles[variant],
      // Interaction overrides
      ...(hovered && !isDisabled  ? variantHover[variant]  : {}),
      ...(active  && !isDisabled  ? variantActive[variant] : {}),
      // Focus ring applied via onFocus/onBlur below
      // Size
      ...sizeStyles[size],
      // Caller overrides
      ...style,
    };

    const spinnerSize = iconSizes[size];

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={computedStyle}
        onMouseEnter={(e) => { setHovered(true);  onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setHovered(false); setActive(false); onMouseLeave?.(e); }}
        onMouseDown={(e)  => { setActive(true);   onMouseDown?.(e); }}
        onMouseUp={(e)    => { setActive(false);  onMouseUp?.(e); }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = `0 0 0 3px var(${
            variant === 'danger' ? '--ring-error' : '--ring-brand'
          })`;
        }}
        onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        {...props}
      >
        {/* Left icon / spinner */}
        {loading ? (
          <Spinner size={spinnerSize} />
        ) : (
          iconLeft && <span style={{ display: 'flex', flexShrink: 0 }}>{iconLeft}</span>
        )}

        {/* Label */}
        {children && (
          <span style={{ display: 'flex', alignItems: 'center' }}>{children}</span>
        )}

        {/* Right icon (hidden while loading) */}
        {!loading && iconRight && (
          <span style={{ display: 'flex', flexShrink: 0 }}>{iconRight}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/* ── Spinner ──────────────────────────────────────────────── */
function Spinner({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ animation: 'btn-spin 0.7s linear infinite', flexShrink: 0 }}
    >
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// Pull React into scope for useState (needed in .tsx with forwardRef pattern)
import React from 'react';
