'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/ui/FileUpload';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFile = async (file: File) => {
    const isPdf = file.type === 'application/pdf';
    const isDocx =
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.toLowerCase().endsWith('.docx');

    if (!isPdf && !isDocx) {
      setError('Please upload a PDF or Word document (.pdf or .docx)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to parse CV');
      }

      router.push(`/preview/${data.portfolioId}?token=${encodeURIComponent(data.editToken)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--brand-800)', color: 'var(--text-primary)' }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span
          className="font-semibold tracking-tight"
          style={{ fontSize: 'var(--type-h6-size)', color: 'var(--text-primary)' }}
        >
          CV<span style={{ color: 'var(--text-brand)' }}>to</span>Web
        </span>
        <a
          href="/design-system"
          className="transition-colors"
          style={{ fontSize: 'var(--type-body-sm-size)', color: 'var(--text-muted)' }}
        >
          Design System
        </a>
      </nav>

      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-20">

        {/* Info-400 radial glow — centred on card 2, bleeding through text + upload */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 55% 70% at 50% 52%, oklch(0.68 0.18 220 / 0.12) 0%, oklch(0.68 0.18 220 / 0.05) 45%, transparent 75%)',
            zIndex: 0,
          }}
        />
        <div className="relative z-10 w-full max-w-2xl flex flex-col items-center text-center">

          {/* Eyebrow */}
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8"
            style={{
              fontSize: 'var(--type-overline-size)',
              fontWeight: 'var(--type-overline-weight)',
              letterSpacing: 'var(--type-overline-ls)',
              textTransform: 'uppercase',
              color: 'var(--text-brand)',
              borderColor: 'var(--border-brand)',
              backgroundColor: 'var(--bg-brand-muted)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'var(--text-brand)' }}
            />
            AI-powered · No sign up required
          </span>

          {/* Headline */}
          <h1
            className="mb-5"
            style={{
              fontSize: 'var(--type-display-size)',
              fontWeight: 'var(--type-display-weight)',
              lineHeight: 'var(--type-display-lh)',
              letterSpacing: 'var(--type-display-ls)',
              color: 'var(--text-primary)',
            }}
          >
            Your CV,{' '}
            <span style={{ color: 'var(--text-brand)' }}>instantly</span>
            <br />a website.
          </h1>

          {/* Subheadline */}
          <p
            className="mb-12 max-w-md"
            style={{
              fontSize: 'var(--type-body-lg-size)',
              lineHeight: 'var(--type-body-lg-lh)',
              color: 'var(--text-secondary)',
            }}
          >
            Upload your CV and get a live, shareable portfolio in seconds.
            No account needed.
          </p>

        </div>{/* close max-w-2xl text column */}

        {/* ── Hero illustration — breaks out of narrow text column ── */}
        <div className="relative z-10 w-full" style={{ height: '340px', maxWidth: '900px', marginTop: '24px', marginBottom: '0px' }}>

          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 90% at 50% 60%, oklch(0.231 0.083 278.887 / 0.35) 0%, transparent 70%)',
            }}
          />

          {/* ── Card 1: CV Document ── */}
          <div
            className="absolute overflow-hidden shadow-2xl"
            style={{
              top: '30px', left: '0%', width: '260px',
              borderRadius: '16px', transform: 'rotate(-8deg)',
              border: '1px solid var(--neutral-700)', zIndex: 1,
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--neutral-800)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--neutral-400)' }}>
                Resume.pdf
              </span>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--neutral-600)' }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--neutral-600)' }} />
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--neutral-600)' }} />
              </div>
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--neutral-900)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--neutral-600)' }} />
                <div>
                  <div className="h-2.5 rounded-sm mb-1.5" style={{ width: '90px', backgroundColor: 'var(--neutral-400)' }} />
                  <div className="h-2 rounded-sm" style={{ width: '64px', backgroundColor: 'var(--neutral-600)' }} />
                </div>
              </div>
              <div className="mb-3" style={{ height: '1px', backgroundColor: 'var(--neutral-700)' }} />
              <div className="mb-3">
                <div className="h-2 rounded-sm mb-2" style={{ width: '72px', backgroundColor: 'var(--neutral-500)' }} />
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-sm" style={{ backgroundColor: 'var(--neutral-700)' }} />
                  <div className="h-2 rounded-sm" style={{ width: '85%', backgroundColor: 'var(--neutral-700)' }} />
                  <div className="h-2 rounded-sm" style={{ width: '65%', backgroundColor: 'var(--neutral-700)' }} />
                </div>
              </div>
              <div>
                <div className="h-2 rounded-sm mb-2" style={{ width: '48px', backgroundColor: 'var(--neutral-500)' }} />
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-5 rounded-sm" style={{ width: '48px', backgroundColor: 'var(--neutral-800)', border: '1px solid var(--neutral-700)' }} />
                  <div className="h-5 rounded-sm" style={{ width: '60px', backgroundColor: 'var(--neutral-800)', border: '1px solid var(--neutral-700)' }} />
                  <div className="h-5 rounded-sm" style={{ width: '40px', backgroundColor: 'var(--neutral-800)', border: '1px solid var(--neutral-700)' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Curly arrow — below CV card toward processing card ── */}
          <svg
            width="110" height="62"
            viewBox="0 0 103 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: '240px', left: '225px', zIndex: 2, opacity: 0.9, transform: 'rotate(-35deg)' }}
          >
            <path d="M2.00006 2.00005C3.00006 21 11.5001 34 38.5001 32.5C53.0001 33 57.5001 25.5 50.0001 19C39.5001 14.5 38.3012 27.8133 38.5001 43C38.7816 64.5 77.0001 59 100.5 31.5M100.5 31.5L98.0001 49M100.5 31.5H86.0001" stroke="url(#curly_grad)" strokeWidth="4" strokeLinecap="round"/>
            <defs>
              <linearGradient id="curly_grad" x1="2.00006" y1="4.50005" x2="100" y2="35.5" gradientUnits="userSpaceOnUse">
                <stop offset="0.0147654" stopColor="#3D3B9E"/>
                <stop offset="0.361046" stopColor="#6D73D2"/>
                <stop offset="0.846154" stopColor="#89EDFF"/>
              </linearGradient>
            </defs>
          </svg>

          {/* ── Card 2: AI Processing ── */}
          <div
            className="absolute overflow-hidden shadow-2xl"
            style={{
              top: '20px', left: '50%', width: '300px',
              borderRadius: '16px', transform: 'translateX(-50%) rotate(-2deg)',
              border: '1px solid var(--brand-600)', zIndex: 4,
            }}
          >
            <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: 'var(--brand-700)', borderBottom: '1px solid var(--brand-600)' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-200)' }}>
                AI Parsing
              </span>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--brand-200)' }} />
            </div>
            <div className="p-4" style={{ backgroundColor: 'var(--brand-900)' }}>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: '0.6rem', color: 'var(--brand-300)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Extracting</span>
                  <span style={{ fontSize: '0.6rem', color: 'var(--brand-200)' }}>65%</span>
                </div>
                <div style={{ height: '5px', borderRadius: '999px', backgroundColor: 'var(--brand-800)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: '65%', borderRadius: '999px', background: 'linear-gradient(90deg, var(--brand-300), var(--brand-100))' }} />
                </div>
              </div>
              <div className="space-y-2.5">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '2px', backgroundColor: 'var(--brand-300)', flexShrink: 0 }} />
                  <div className="h-2 rounded-sm flex-1" style={{ backgroundColor: 'var(--brand-700)' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '2px', backgroundColor: 'var(--brand-400)', flexShrink: 0 }} />
                  <div className="h-2 rounded-sm" style={{ width: '75%', backgroundColor: 'var(--brand-700)' }} />
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ width: '9px', height: '9px', borderRadius: '2px', backgroundColor: 'var(--brand-600)', flexShrink: 0 }} />
                  <div className="h-2 rounded-sm" style={{ width: '55%', backgroundColor: 'var(--brand-800)' }} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                <div style={{ fontSize: '0.55rem', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'var(--brand-800)', border: '1px solid var(--brand-600)', color: 'var(--brand-200)', fontWeight: 600 }}>name</div>
                <div style={{ fontSize: '0.55rem', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'var(--brand-800)', border: '1px solid var(--brand-600)', color: 'var(--brand-200)', fontWeight: 600 }}>exp</div>
                <div style={{ fontSize: '0.55rem', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'var(--brand-800)', border: '1px solid var(--brand-600)', color: 'var(--brand-200)', fontWeight: 600 }}>skills</div>
                <div style={{ fontSize: '0.55rem', padding: '3px 8px', borderRadius: '5px', backgroundColor: 'var(--brand-800)', border: '1px solid var(--brand-600)', color: 'var(--brand-200)', fontWeight: 600 }}>education</div>
              </div>
            </div>
          </div>

          {/* ── Curve arrow — above AI parsing card, sweeping to portfolio card ── */}
          <svg
            width="90" height="62"
            viewBox="0 0 83 58"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: 'absolute', top: '-40px', right: '250px', zIndex: 5, opacity: 0.9, transform: 'rotate(18deg)' }}
          >
            <path d="M2.06637 55.7496C0.0663757 10.2495 43.5664 -18.7505 80.5664 20.2496M80.5664 20.2496L63.5664 17.7495M80.5664 20.2496L77.5664 2.24953" stroke="url(#curve_grad)" strokeWidth="4" strokeLinecap="round"/>
            <defs>
              <linearGradient id="curve_grad" x1="1.99988" y1="58.0033" x2="80.9999" y2="18.5033" gradientUnits="userSpaceOnUse">
                <stop stopColor="#89EDFF"/>
                <stop offset="1" stopColor="#6D73D2"/>
              </linearGradient>
            </defs>
          </svg>

          {/* ── Card 3: Live Portfolio ── */}
          <div
            className="absolute overflow-hidden shadow-2xl"
            style={{
              top: '25px', right: '0%', width: '260px',
              borderRadius: '16px', transform: 'rotate(6deg)',
              border: '1px solid var(--brand-600)', zIndex: 1,
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3" style={{ backgroundColor: 'var(--brand-700)', borderBottom: '1px solid var(--brand-600)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--brand-400)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--brand-400)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--brand-400)' }} />
              <div className="flex-1 mx-1.5 h-3.5 rounded-full" style={{ backgroundColor: 'var(--brand-600)' }} />
            </div>
            <div className="px-4 pt-4 pb-3" style={{ backgroundColor: 'var(--brand-600)' }}>
              <span style={{ fontSize: '0.55rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-200)', display: 'block', marginBottom: '8px' }}>
                yourname.cvtoweb.com
              </span>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--brand-300)' }} />
                <div>
                  <div className="h-2.5 rounded-sm mb-1.5" style={{ width: '100px', backgroundColor: 'var(--brand-100)' }} />
                  <div className="h-2 rounded-sm" style={{ width: '72px', backgroundColor: 'var(--brand-300)' }} />
                </div>
              </div>
            </div>
            <div className="px-4 py-4" style={{ backgroundColor: 'var(--brand-800)' }}>
              <div className="h-2 rounded-sm mb-3" style={{ width: '56px', backgroundColor: 'var(--brand-400)' }} />
              <div className="space-y-2 mb-4">
                <div className="h-2 w-full rounded-sm" style={{ backgroundColor: 'var(--brand-700)' }} />
                <div className="h-2 rounded-sm" style={{ width: '80%', backgroundColor: 'var(--brand-700)' }} />
                <div className="h-2 rounded-sm" style={{ width: '60%', backgroundColor: 'var(--brand-700)' }} />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: 'var(--success-400)' }} />
                <div className="h-2 rounded-sm" style={{ width: '64px', backgroundColor: 'var(--brand-600)' }} />
              </div>
            </div>
          </div>

        </div>
        {/* ── /Hero illustration ── */}

        <div className="relative z-10 w-full flex flex-col items-center" style={{ maxWidth: '850px' }}>
          {/* Upload zone */}
          <div className={`w-full ${isLoading ? 'pointer-events-none' : ''}`} style={{ maxWidth: '900px' }}>
            <FileUpload
              size="lg"
              accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              acceptHint="PDF or Word · Max 5MB"
              maxSize={5 * 1024 * 1024}
              progress={isLoading ? 0 : null}
              onFilesChange={(files) => {
                if (files[0]) handleFile(files[0]);
              }}
            />
          </div>

          {/* Error */}
          {error && (
            <div
              className="w-full max-w-lg mt-3 px-4 py-3 rounded-xl border text-center"
              style={{
                fontSize: 'var(--type-body-sm-size)',
                color: 'var(--text-error)',
                backgroundColor: 'var(--error-900)',
                borderColor: 'var(--error-600)',
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>

    </main>
  );
}
