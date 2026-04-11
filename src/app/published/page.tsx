'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

/* ── Icons ───────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width={22} height={22} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width={16} height={16} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/* ── Copy button with feedback ───────────────────────────── */
function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant={copied ? 'secondary' : 'primary'}
      size="md"
      iconLeft={copied ? <CheckIcon /> : <CopyIcon />}
      onClick={handleCopy}
      style={{ flexShrink: 0 }}
    >
      {copied ? 'Copied' : label}
    </Button>
  );
}

/* ── Glass card ──────────────────────────────────────────── */
function GlassCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        backgroundColor: 'oklch(1 0 0 / 0.05)',
        border: '1px solid oklch(1 0 0 / 0.1)',
        borderRadius: '1rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        padding: '1.25rem',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Edit link card ──────────────────────────────────────── */
function EditLinkCard({ editUrl }: { editUrl: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(editUrl);
    setCopied(true);
  };

  // Revert once the user clicks anywhere else
  useEffect(() => {
    if (!copied) return;
    const reset = () => setCopied(false);
    document.addEventListener('click', reset, { once: true });
    return () => document.removeEventListener('click', reset);
  }, [copied]);

  return (
    <GlassCard
      style={{
        width: '100%',
        marginBottom: '1.5rem',
        backgroundColor: 'oklch(0.78 0.17 75 / 0.05)',
        borderColor: 'oklch(0.78 0.17 75 / 0.2)',
      }}
    >
      <div className="flex items-start gap-3">
        <span
          style={{
            marginTop: '2px',
            color: 'oklch(0.78 0.17 75)',
            flexShrink: 0,
          }}
        >
          <LockIcon />
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: 'var(--type-body-sm-size)',
              color: 'var(--neutral-300)',
              lineHeight: 'var(--type-body-sm-lh)',
              marginBottom: '0.5rem',
              textAlign: 'left',
            }}
          >
            We&apos;ve sent your edit link to your email. You can also{' '}
            <button
              onClick={handleCopy}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                fontSize: 'inherit',
                fontFamily: 'inherit',
                fontWeight: 600,
                color: copied ? 'var(--success-400)' : 'oklch(0.78 0.17 75)',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                transition: 'color 150ms ease',
              }}
            >
              {copied ? 'copied to clipboard' : 'copy it now'}
            </button>{' '}
            to save it somewhere safe — you&apos;ll need it to edit your portfolio later.
          </p>
        </div>
      </div>
    </GlassCard>
  );
}

/* ── Main content ────────────────────────────────────────── */
function PublishedContent() {
  const searchParams  = useSearchParams();
  const username      = searchParams.get('username');
  const id            = searchParams.get('id');
  const token         = searchParams.get('token');

  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [editUrl,      setEditUrl]      = useState('');

  useEffect(() => {
    setPortfolioUrl(`${window.location.origin}/portfolio/${username}`);
    if (id && token) {
      setEditUrl(`${window.location.origin}/edit/${id}?token=${encodeURIComponent(token)}`);
    }
  }, [username, id, token]);

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--brand-800)', color: 'var(--text-primary)' }}
    >
      {/* ── Nav ─────────────────────────────────────────────── */}
      <nav
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <Link
          href="/"
          className="font-semibold tracking-tight"
          style={{ fontSize: 'var(--type-h6-size)', color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          CV<span style={{ color: 'var(--text-brand)' }}>to</span>Web
        </Link>
      </nav>

      {/* ── Hero ────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">

        {/* Radial glow */}
        <div
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: '600px', height: '500px',
            background: 'radial-gradient(ellipse at center, oklch(0.52 0.17 145 / 0.12) 0%, oklch(0.68 0.18 220 / 0.06) 50%, transparent 75%)',
          }}
        />

        <div className="relative w-full max-w-lg flex flex-col items-center text-center">

          {/* Success badge */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8"
            style={{
              backgroundColor: 'oklch(0.52 0.17 145 / 0.15)',
              border: '1px solid oklch(0.52 0.17 145 / 0.35)',
              color: 'var(--success-400)',
            }}
          >
            <CheckIcon />
          </div>

          {/* Headline */}
          <h1
            className="mb-3"
            style={{
              fontSize: 'var(--type-display-size)',
              fontWeight: 'var(--type-display-weight)',
              lineHeight: 'var(--type-display-lh)',
              letterSpacing: 'var(--type-display-ls)',
              color: 'var(--text-primary)',
            }}
          >
            You&apos;re live
          </h1>
          <p
            className="mb-10"
            style={{
              fontSize: 'var(--type-body-lg-size)',
              lineHeight: 'var(--type-body-lg-lh)',
              color: 'var(--text-secondary)',
            }}
          >
            Your portfolio is published and ready to share.
          </p>

          {/* ── Portfolio URL card ─────────────────────────── */}
          <GlassCard style={{ width: '100%', marginBottom: '1rem' }}>
            <p
              className="mb-3 text-left"
              style={{ fontSize: 'var(--type-label-size)', fontWeight: 'var(--type-label-weight)', letterSpacing: 'var(--type-label-ls)', color: 'var(--text-muted)', textTransform: 'uppercase' }}
            >
              Your portfolio URL
            </p>
            <div className="flex items-center gap-2">
              <Input
                size="md"
                value={portfolioUrl}
                readOnly
                style={{ flex: 1 }}
              />
              <CopyButton text={portfolioUrl} />
            </div>
          </GlassCard>

          {/* ── Secret edit link card ──────────────────────── */}
          {id && token && editUrl && (
            <EditLinkCard editUrl={editUrl} />
          )}

          {/* ── Actions ───────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 w-full mb-12">
            <Button
              variant="primary"
              size="md"
              fullWidth
              iconRight={<ExternalLinkIcon />}
              onClick={() => window.open(portfolioUrl, '_blank')}
            >
              View Portfolio
            </Button>
            <Link href="/" style={{ flex: 1, display: 'flex' }}>
              <Button variant="secondary" size="md" fullWidth iconLeft={<PlusIcon />}>
                Create Another
              </Button>
            </Link>
          </div>

          {/* ── Share ─────────────────────────────────────── */}
          <div className="flex flex-col items-center gap-4">
            <p style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}>
              Share your portfolio
            </p>
            <div className="flex gap-3">
              <a
                href={`https://twitter.com/intent/tweet?text=Check out my new portfolio!&url=${encodeURIComponent(portfolioUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '2.75rem', height: '2.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'oklch(1 0 0 / 0.06)',
                  border: '1px solid oklch(1 0 0 / 0.12)',
                  borderRadius: '0.75rem',
                  color: 'var(--text-secondary)',
                  transition: 'background-color 150ms ease, color 150ms ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(1 0 0 / 0.1)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(1 0 0 / 0.06)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <XIcon />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '2.75rem', height: '2.75rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: 'oklch(1 0 0 / 0.06)',
                  border: '1px solid oklch(1 0 0 / 0.12)',
                  borderRadius: '0.75rem',
                  color: 'var(--text-secondary)',
                  transition: 'background-color 150ms ease, color 150ms ease',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(1 0 0 / 0.1)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'oklch(1 0 0 / 0.06)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                <LinkedInIcon />
              </a>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

/* ── Page export ─────────────────────────────────────────── */
export default function PublishedPage() {
  return (
    <Suspense
      fallback={
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ backgroundColor: 'var(--brand-800)' }}
        >
          <svg width={32} height={32} viewBox="0 0 16 16" fill="none"
            style={{ animation: 'btn-spin 0.7s linear infinite' }}>
            <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
            <circle cx="8" cy="8" r="6" stroke="var(--brand-400)" strokeOpacity="0.25" strokeWidth="2.5" />
            <path d="M14 8a6 6 0 00-6-6" stroke="var(--brand-300)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      }
    >
      <PublishedContent />
    </Suspense>
  );
}
