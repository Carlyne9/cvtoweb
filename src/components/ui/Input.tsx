'use client';

import React, { forwardRef, useState, useId } from 'react';

/* ============================================================
   INPUT — CVtoWeb Design System
   Variants:  default | error | success | warning
   Sizes:     sm | md | lg
   States:    idle | focus | filled | error | success |
              disabled | readonly | loading
   Extras:    label, helper text, prefix/suffix (icon or text),
              character count, password toggle, clearable
   ============================================================ */

type InputVariant = 'default' | 'error' | 'success' | 'warning';
type InputSize    = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?:          string;
  helperText?:     string;
  variant?:        InputVariant;
  size?:           InputSize;
  prefix?:         React.ReactNode;   // icon or text on the left
  suffix?:         React.ReactNode;   // icon or text on the right
  loading?:        boolean;
  clearable?:      boolean;
  maxChars?:       number;
  onClear?:        () => void;
}

/* ── Size tokens ────────────────────────────────────────────── */
const sizeMap: Record<InputSize, {
  height: string; px: string; fontSize: string;
  fontWeight: string; letterSpacing: string;
  iconSize: number; borderRadius: string; labelSize: string;
}> = {
  sm: {
    height: '2rem', px: '0.625rem',
    fontSize: 'var(--type-body-sm-size)', fontWeight: 'var(--type-body-sm-weight)',
    letterSpacing: '0', iconSize: 14, borderRadius: '0.5rem',
    labelSize: 'var(--type-label-size)',
  },
  md: {
    height: '2.5rem', px: '0.75rem',
    fontSize: 'var(--type-body-md-size)', fontWeight: 'var(--type-body-md-weight)',
    letterSpacing: '0', iconSize: 16, borderRadius: '0.625rem',
    labelSize: 'var(--type-label-size)',
  },
  lg: {
    height: '3rem', px: '1rem',
    fontSize: 'var(--type-body-lg-size)', fontWeight: 'var(--type-body-lg-weight)',
    letterSpacing: '0', iconSize: 18, borderRadius: '0.75rem',
    labelSize: 'var(--type-body-sm-size)',
  },
};

/* ── Variant tokens ─────────────────────────────────────────── */
const variantMap: Record<InputVariant, {
  borderIdle: string; borderFocus: string; ring: string;
  helperColor: string; icon: React.ReactNode | null;
}> = {
  default: {
    borderIdle:   'var(--border-default)',
    borderFocus:  'var(--border-brand)',
    ring:         'var(--ring-brand)',
    helperColor:  'var(--text-muted)',
    icon: null,
  },
  error: {
    borderIdle:   'var(--error-600)',
    borderFocus:  'var(--error-500)',
    ring:         'var(--ring-error)',
    helperColor:  'var(--text-error)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-error)', flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 4.5v4M8 10.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  success: {
    borderIdle:   'var(--success-600)',
    borderFocus:  'var(--success-500)',
    ring:         'var(--ring-success)',
    helperColor:  'var(--text-success)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-success)', flexShrink: 0 }}>
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M5 8l2.5 2.5L11 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  warning: {
    borderIdle:   'var(--warning-600)',
    borderFocus:  'var(--warning-500)',
    ring:         'oklch(0.72 0.19 75 / 0.4)',
    helperColor:  'var(--text-warning)',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ color: 'var(--text-warning)', flexShrink: 0 }}>
        <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 6v3.5M8 11v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
};

/* ── Component ──────────────────────────────────────────────── */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, helperText, variant = 'default', size = 'md',
      prefix, suffix, loading = false, clearable = false,
      maxChars, onClear, disabled, readOnly,
      value, defaultValue, onChange, type = 'text',
      style, className, ...props
    },
    ref
  ) => {
    const id = useId();
    const [focused, setFocused]         = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const isControlled = value !== undefined;
    const currentValue = isControlled ? String(value ?? '') : String(internalValue);
    const isDisabled   = disabled || loading;
    const isPassword   = type === 'password';

    const { borderIdle, borderFocus, ring, helperColor, icon: variantIcon } = variantMap[variant];
    const sz = sizeMap[size];

    const borderColor = focused ? borderFocus : borderIdle;
    const boxShadow   = focused ? `0 0 0 3px ${ring}` : 'none';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) setInternalValue('');
      onClear?.();
    };

    /* Wrapper styles */
    const wrapperStyle: React.CSSProperties = {
      display:       'flex',
      flexDirection: 'column',
      gap:           '0.375rem',
      width:         '100%',
      opacity:       isDisabled ? 0.5 : 1,
    };

    /* Field track (the visible box) */
    const trackStyle: React.CSSProperties = {
      display:         'flex',
      alignItems:      'center',
      height:          sz.height,
      borderRadius:    sz.borderRadius,
      border:          `1px solid ${borderColor}`,
      backgroundColor: readOnly ? 'var(--bg-subtle)' : 'var(--bg-surface)',
      transition:      'border-color 150ms ease, box-shadow 150ms ease',
      boxShadow,
      overflow:        'hidden',
      cursor:          isDisabled ? 'not-allowed' : readOnly ? 'default' : 'text',
    };

    /* Native input */
    const inputStyle: React.CSSProperties = {
      flex:          1,
      height:        '100%',
      background:    'transparent',
      border:        'none',
      outline:       'none',
      paddingLeft:   prefix ? '0.25rem' : sz.px,
      paddingRight:  (suffix || variantIcon || clearable || isPassword) ? '0.25rem' : sz.px,
      fontSize:      sz.fontSize,
      fontWeight:    sz.fontWeight,
      letterSpacing: sz.letterSpacing,
      color:         readOnly ? 'var(--text-secondary)' : 'var(--text-primary)',
      cursor:        isDisabled ? 'not-allowed' : 'inherit',
      fontFamily:    'inherit',
      minWidth:      0,
    };

    /* Adornment (prefix/suffix slot) */
    const adornmentStyle = (side: 'left' | 'right'): React.CSSProperties => ({
      display:    'flex',
      alignItems: 'center',
      flexShrink: 0,
      color:      'var(--text-muted)',
      paddingLeft:  side === 'left'  ? sz.px : '0.5rem',
      paddingRight: side === 'right' ? sz.px : '0.5rem',
      fontSize:   'var(--type-body-sm-size)',
      userSelect: 'none',
    });

    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const showClear     = clearable && currentValue.length > 0 && !isDisabled && !readOnly;
    const showRightSlot = variantIcon || suffix || showClear || isPassword || loading;

    return (
      <div style={wrapperStyle}>

        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize:      sz.labelSize,
              fontWeight:    'var(--type-label-weight)',
              letterSpacing: 'var(--type-label-ls)',
              color:         isDisabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
              cursor:        isDisabled ? 'not-allowed' : 'pointer',
              userSelect:    'none',
            }}
          >
            {label}
          </label>
        )}

        {/* Field track */}
        <div style={trackStyle} onClick={() => (ref as React.RefObject<HTMLInputElement>)?.current?.focus()}>

          {/* Left prefix */}
          {prefix && <div style={adornmentStyle('left')}>{prefix}</div>}

          {/* Input */}
          <input
            ref={ref}
            id={id}
            type={inputType}
            value={isControlled ? value : internalValue}
            disabled={isDisabled}
            readOnly={readOnly}
            maxLength={maxChars}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={inputStyle}
            {...props}
          />

          {/* Right slot */}
          {showRightSlot && (
            <div style={{ ...adornmentStyle('right'), gap: '0.25rem' }}>
              {/* Loading spinner */}
              {loading && <InputSpinner size={sz.iconSize} />}

              {/* Variant icon (error/success/warning) — hidden when loading */}
              {!loading && variantIcon}

              {/* Custom suffix */}
              {!loading && suffix}

              {/* Clear button */}
              {showClear && !variantIcon && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    color: 'var(--text-muted)', borderRadius: '0.25rem',
                  }}
                  aria-label="Clear"
                >
                  <svg width={sz.iconSize - 2} height={sz.iconSize - 2} viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}

              {/* Password toggle */}
              {isPassword && !loading && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((s) => !s)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '2px',
                    color: 'var(--text-muted)', borderRadius: '0.25rem',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={sz.iconSize} /> : <Eye size={sz.iconSize} />}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Helper row: text + char count */}
        {(helperText || maxChars !== undefined) && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {helperText && (
              <span
                style={{
                  fontSize:   'var(--type-caption-size)',
                  lineHeight: 'var(--type-caption-lh)',
                  color:      isDisabled ? 'var(--text-disabled)' : helperColor,
                }}
              >
                {helperText}
              </span>
            )}
            {maxChars !== undefined && (
              <span
                style={{
                  fontSize:  'var(--type-caption-size)',
                  color:     currentValue.length >= maxChars ? 'var(--text-error)' : 'var(--text-muted)',
                  marginLeft: 'auto',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {currentValue.length}/{maxChars}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

/* ============================================================
   TEXTAREA — same token system, grows vertically
   ============================================================ */

export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'> {
  label?:      string;
  helperText?: string;
  variant?:    InputVariant;
  size?:       InputSize;
  maxChars?:   number;
  resize?:     'none' | 'vertical' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label, helperText, variant = 'default', size = 'md',
      maxChars, resize = 'vertical',
      disabled, readOnly, value, defaultValue, onChange, style, ...props
    },
    ref
  ) => {
    const id = useId();
    const [focused, setFocused] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? '');

    const isControlled  = value !== undefined;
    const currentValue  = isControlled ? String(value ?? '') : String(internalValue);
    const { borderIdle, borderFocus, ring, helperColor } = variantMap[variant];
    const sz = sizeMap[size];

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isControlled) setInternalValue(e.target.value);
      onChange?.(e);
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', opacity: disabled ? 0.5 : 1 }}>

        {label && (
          <label
            htmlFor={id}
            style={{
              fontSize: sz.labelSize, fontWeight: 'var(--type-label-weight)',
              letterSpacing: 'var(--type-label-ls)',
              color: disabled ? 'var(--text-disabled)' : 'var(--text-secondary)',
              cursor: disabled ? 'not-allowed' : 'pointer', userSelect: 'none',
            }}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          value={isControlled ? value : internalValue}
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxChars}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%', minHeight: '7rem',
            padding: `0.625rem ${sz.px}`,
            borderRadius: sz.borderRadius,
            border: `1px solid ${focused ? borderFocus : borderIdle}`,
            backgroundColor: readOnly ? 'var(--bg-subtle)' : 'var(--bg-surface)',
            boxShadow: focused ? `0 0 0 3px ${ring}` : 'none',
            fontSize: sz.fontSize, fontWeight: sz.fontWeight,
            fontFamily: 'inherit', lineHeight: '1.6',
            color: readOnly ? 'var(--text-secondary)' : 'var(--text-primary)',
            outline: 'none', resize,
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
            ...style,
          }}
          {...props}
        />

        {(helperText || maxChars !== undefined) && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {helperText && (
              <span style={{ fontSize: 'var(--type-caption-size)', color: disabled ? 'var(--text-disabled)' : helperColor }}>
                {helperText}
              </span>
            )}
            {maxChars !== undefined && (
              <span style={{
                fontSize: 'var(--type-caption-size)', marginLeft: 'auto',
                color: currentValue.length >= maxChars ? 'var(--text-error)' : 'var(--text-muted)',
                fontVariantNumeric: 'tabular-nums',
              }}>
                {currentValue.length}/{maxChars}
              </span>
            )}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

/* ── Internal icons ─────────────────────────────────────────── */
function InputSpinner({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none"
      style={{ animation: 'btn-spin 0.7s linear infinite', flexShrink: 0 }}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5"/>
      <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}

function Eye({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="10" ry="6"/>
      <circle cx="12" cy="12" r="2.5"/>
    </svg>
  );
}

function EyeOff({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10 10 0 0112 20c-5 0-9.27-3.11-11-8 .93-2.68 2.76-4.93 5.06-6.35M9.9 4.24A9.12 9.12 0 0112 4c5 0 9.27 3.11 11 8a11 11 0 01-1.88 3.37M3 3l18 18"/>
    </svg>
  );
}
