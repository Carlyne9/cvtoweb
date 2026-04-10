'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      {/* Nav */}
      <nav
        className="flex items-center justify-between px-8 py-5 border-b"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span
          className="font-semibold tracking-tight"
          style={{
            fontSize: 'var(--type-h6-size)',
            color: 'var(--text-primary)',
          }}
        >
          CV<span style={{ color: 'var(--text-brand)' }}>to</span>Web
        </span>
        <a
          href="/design-system"
          className="transition-colors"
          style={{
            fontSize: 'var(--type-body-sm-size)',
            color: 'var(--text-muted)',
          }}
        >
          Design System
        </a>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl flex flex-col items-center text-center">

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
            className="mb-6"
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
            {' '}a website.
          </h1>

          {/* Subheadline */}
          <p
            className="mb-12 max-w-lg"
            style={{
              fontSize: 'var(--type-body-lg-size)',
              lineHeight: 'var(--type-body-lg-lh)',
              color: 'var(--text-secondary)',
            }}
          >
            Upload your CV and get a live, shareable portfolio in seconds.
            No account needed.
          </p>

          {/* Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full rounded-2xl border-2 border-dashed p-14 text-center transition-all duration-200 ${isLoading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
            style={{
              borderColor: isDragging ? 'var(--border-brand)' : 'var(--border-default)',
              backgroundColor: isDragging ? 'var(--bg-brand-muted)' : 'var(--bg-subtle)',
            }}
          >
            <input
              type="file"
              accept="application/pdf,.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isLoading}
            />

            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div
                  className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: 'var(--border-brand)', borderTopColor: 'transparent' }}
                />
                <p style={{ fontSize: 'var(--type-body-md-size)', color: 'var(--text-secondary)' }}>
                  Analysing your CV…
                </p>
                <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
                  This usually takes 10–20 seconds
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-2"
                  style={{ backgroundColor: 'var(--bg-brand-subtle)' }}
                >
                  <svg
                    className="w-7 h-7"
                    style={{ color: 'var(--text-brand)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <p
                  style={{
                    fontSize: 'var(--type-body-md-size)',
                    fontWeight: 'var(--type-subheading-lg-weight)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {isDragging ? 'Drop it here' : 'Drop your CV or click to upload'}
                </p>

                <p style={{ fontSize: 'var(--type-caption-size)', color: 'var(--text-muted)' }}>
                  PDF or Word (.docx) · Max 5MB
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              className="w-full mt-4 px-4 py-3 rounded-xl border text-center"
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

      {/* Feature strip */}
      <div
        className="border-t px-8 py-10"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              ),
              title: 'Instant',
              body: 'AI extracts your info and builds your site in seconds.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              ),
              title: 'Shareable',
              body: 'Get your own link like yourname.cvtoweb.com.',
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              ),
              title: 'Free',
              body: 'No sign up to preview. Free subdomain included.',
            },
          ].map(({ icon, title, body }) => (
            <div key={title} className="flex flex-col items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'var(--bg-brand-subtle)' }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: 'var(--text-brand)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
              </div>
              <p
                style={{
                  fontSize: 'var(--type-subheading-lg-size)',
                  fontWeight: 'var(--type-subheading-lg-weight)',
                  color: 'var(--text-primary)',
                }}
              >
                {title}
              </p>
              <p
                style={{
                  fontSize: 'var(--type-body-sm-size)',
                  color: 'var(--text-muted)',
                  lineHeight: 'var(--type-body-sm-lh)',
                }}
              >
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
