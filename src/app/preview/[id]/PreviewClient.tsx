'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio, PortfolioData } from '@/types/portfolio';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import PublishModal from '@/components/PublishModal';
import { getPortfolioUrl } from '@/lib/urls';
import { Button } from '@/components/ui/Button';

interface Props {
  portfolio: Portfolio;
  editToken: string;
}

/* ── Icons ───────────────────────────────────────────────── */
function ChevronLeft() {
  return (
    <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function PublishIcon() {
  return (
    <svg width={15} height={15} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width={14} height={14} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function PreviewClient({ portfolio, editToken }: Props) {
  const router = useRouter();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<PortfolioData>(portfolio.portfolio_data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  const isFirstRender = useRef(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePublishSuccess = (username: string) => {
    router.push(
      `/published?username=${username}&id=${portfolio.id}&token=${encodeURIComponent(editToken)}`
    );
  };

  const performSave = async (data: PortfolioData, silent = false) => {
    if (!silent) {
      setIsSaving(true);
      setSaveStatus('saving');
    } else {
      setSaveStatus('saving');
    }

    try {
      const response = await fetch('/api/update-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          editToken,
          portfolioData: data,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Failed to save');
      }

      setSaveStatus('success');

      if (!silent) router.refresh();

      setTimeout(() => setSaveStatus('idle'), 3000);
      return true;
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      return false;
    } finally {
      if (!silent) setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    const success = await performSave(localData);
    if (success) {
      setIsEditing(false);
      if (isPublished && publicUrl) {
        window.open(publicUrl, '_blank');
      }
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isEditing) return;

    if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);

    autoSaveTimeoutRef.current = setTimeout(() => {
      performSave(localData, true);
    }, 1500);

    return () => {
      if (autoSaveTimeoutRef.current) clearTimeout(autoSaveTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localData, isEditing]);

  const publicUrl = portfolio.username ? getPortfolioUrl(portfolio.username) : null;
  const isPublished = !!portfolio.is_published || !!portfolio.username;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--neutral-950, #0a0a0f)' }}
    >
      {/* ── Top Bar ─────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-2.5"
        style={{
          backgroundColor: 'var(--brand-800)',
          borderBottom: '1px solid var(--border-subtle)',
          minHeight: '52px',
        }}
      >
        {/* Left: logo + status */}
        <div className="flex items-center gap-3">
          {/* Back home */}
          <Button
            variant="ghost"
            size="sm"
            iconLeft={<ChevronLeft />}
            onClick={() => router.push('/')}
            style={{ color: 'var(--text-muted)' }}
          >
            Home
          </Button>

          {/* Divider */}
          <div style={{ width: '1px', height: '18px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Status pill */}
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: isEditing
                  ? 'var(--warning-400, oklch(0.78 0.17 75))'
                  : 'var(--success-400)',
                animation: isEditing ? 'pulse 1.5s ease-in-out infinite' : undefined,
              }}
            />
            <span
              style={{
                fontSize: 'var(--type-body-sm-size)',
                fontWeight: 600,
                color: 'var(--text-secondary)',
              }}
            >
              {isPublished
                ? (isEditing ? 'Editing Live Site' : 'Live Preview')
                : (isEditing ? 'Editing Draft' : 'Draft Preview')}
            </span>
          </div>

          {/* Auto-save status */}
          <div className="hidden md:flex items-center gap-1.5 ml-2">
            {saveStatus === 'saving' && (
              <span
                style={{
                  fontSize: 'var(--type-caption-size)',
                  color: 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', gap: '6px',
                }}
              >
                <svg width={12} height={12} viewBox="0 0 16 16" fill="none"
                  style={{ animation: 'btn-spin 0.7s linear infinite' }}>
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
                  <path d="M14 8a6 6 0 00-6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Saving…
              </span>
            )}
            {saveStatus === 'success' && (
              <span
                style={{
                  fontSize: 'var(--type-caption-size)',
                  color: 'var(--success-400)',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <CheckIcon /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span
                style={{
                  fontSize: 'var(--type-caption-size)',
                  color: 'var(--text-error)',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}
              >
                <AlertIcon /> Save failed
              </span>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              {/* Theme selector */}
              <div
                className="flex items-center gap-1.5 mr-1"
                style={{
                  backgroundColor: 'oklch(1 0 0 / 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '0.625rem',
                  padding: '0 0.625rem',
                  height: '2.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                  }}
                >
                  Theme
                </span>
                <select
                  value={localData.theme || 'midnight'}
                  onChange={(e) =>
                    setLocalData({ ...localData, theme: e.target.value as 'midnight' | 'snow' | 'cobalt' })
                  }
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: 'var(--type-body-sm-size)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    paddingRight: '0.25rem',
                  }}
                >
                  <option value="midnight" style={{ backgroundColor: 'var(--brand-900)' }}>Midnight</option>
                  <option value="snow"     style={{ backgroundColor: 'var(--brand-900)' }}>Snow</option>
                  <option value="cobalt"   style={{ backgroundColor: 'var(--brand-900)' }}>Cobalt</option>
                </select>
              </div>

              <Button
                variant="ghost"
                size="md"
                disabled={isSaving}
                onClick={() => {
                  setLocalData(portfolio.portfolio_data);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="primary"
                size="md"
                loading={isSaving}
                onClick={handleManualSave}
              >
                {isPublished ? 'Save Updates' : 'Save Changes'}
              </Button>

              {isPublished && (
                <Button
                  variant="secondary"
                  size="md"
                  iconRight={<ExternalLinkIcon />}
                  onClick={() => window.open(publicUrl || '#', '_blank')}
                >
                  Visit Live Site
                </Button>
              )}
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                size="md"
                iconLeft={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Content
              </Button>

              {!isPublished && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setShowPublishModal(true)}
                >
                  Publish Site
                </Button>
              )}

              {isPublished && (
                <Button
                  variant="secondary"
                  size="md"
                  iconRight={<ExternalLinkIcon />}
                  onClick={() => window.open(publicUrl || '#', '_blank')}
                >
                  Visit Live Site
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Working Area ────────────────────────────────────── */}
      <div className="flex-1 overflow-auto">
        <PortfolioTemplate
          data={localData}
          isEditing={isEditing}
          onUpdate={setLocalData}
        />
      </div>

      {/* ── Publish Modal ────────────────────────────────────── */}
      {showPublishModal && (
        <PublishModal
          portfolioId={portfolio.id}
          editToken={editToken}
          suggestedUsername={localData.name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 20)}
          onClose={() => setShowPublishModal(false)}
          onSuccess={handlePublishSuccess}
        />
      )}
    </div>
  );
}
