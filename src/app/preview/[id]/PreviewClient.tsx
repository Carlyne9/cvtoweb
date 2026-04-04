'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Portfolio, PortfolioData } from '@/types/portfolio';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import PublishModal from '@/components/PublishModal';
import { getPortfolioUrl } from '@/lib/urls';

interface Props {
  portfolio: Portfolio;
}

export default function PreviewClient({ portfolio }: Props) {
  const router = useRouter();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<PortfolioData>(portfolio.portfolio_data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // Ref to track if we should skip the first render of the auto-save effect
  const isFirstRender = useRef(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePublishSuccess = (username: string) => {
    router.push(`/published?username=${username}`);
  };

  // The core save function used by both auto-save and manual save
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
          portfolioData: data,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setSaveStatus('success');
      
      // If it wasn't a silent auto-save, we might want to refresh
      if (!silent) {
        router.refresh();
      }
      
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

  // Manual save handler - now also exits edit mode and opens live site if published
  const handleManualSave = async () => {
    const success = await performSave(localData);
    if (success) {
      setIsEditing(false);
      // If the portfolio is already published, open the live site in a new tab
      if (isPublished && publicUrl) {
        window.open(publicUrl, '_blank');
      }
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Only auto-save if we are in editing mode
    if (!isEditing) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for debounced save
    autoSaveTimeoutRef.current = setTimeout(() => {
      performSave(localData, true);
    }, 1500); // 1.5s debounce

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [localData, isEditing]);

  const publicUrl = portfolio.username ? getPortfolioUrl(portfolio.username) : null;
  const isPublished = !!portfolio.is_published || !!portfolio.username;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Preview Banner */}
      <div className="bg-slate-900 text-white py-3 px-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </button>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-sm font-medium">
              {isPublished 
                ? (isEditing ? 'Editing Live Site' : 'Live Preview')
                : (isEditing ? 'Editing Draft' : 'Draft Preview')}
            </span>
          </div>

          
          {/* Status Indicators */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-3 h-3 border border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                Saving changes...
              </div>
            )}
            {saveStatus === 'success' && (
              <div className="flex items-center gap-1 text-green-400 text-xs">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Saved
              </div>
            )}
            {saveStatus === 'error' && (
              <div className="flex items-center gap-1 text-red-400 text-xs">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Save error
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              {/* Theme Selector */}
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 mr-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Theme</span>
                <select
                  value={localData.theme || 'midnight'}
                  onChange={(e) => setLocalData({ ...localData, theme: e.target.value as any })}
                  className="bg-transparent text-sm font-medium py-1.5 focus:outline-none cursor-pointer pr-2"
                >
                  <option value="midnight" className="bg-slate-900">Midnight</option>
                  <option value="snow" className="bg-slate-900">Snow</option>
                  <option value="cobalt" className="bg-slate-900">Cobalt</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setLocalData(portfolio.portfolio_data);
                  setIsEditing(false);
                }}
                className="text-slate-400 hover:text-white px-4 py-2 text-sm font-medium transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleManualSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  isPublished ? 'Save Updates' : 'Save Changes'
                )}
              </button>

              {!isPublished && (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Publish Site
                </button>
              )}

              {isPublished && (
                <a
                  href={publicUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  Visit Live Site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </>
          ) : (
            <>
              {/* Preview Mode Buttons */}
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Content
              </button>
              

               {!isPublished && (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Publish Site
                </button>
              )}

              {isPublished && (
                <a
                  href={publicUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  Visit Live Production
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </>
          )}
        </div>
      </div>

      {/* Portfolio Preview */}
      <PortfolioTemplate 
        data={localData} 
        isEditing={isEditing}
        onUpdate={setLocalData}
      />

      {/* Publish Modal */}
      {showPublishModal && (
        <PublishModal
          portfolioId={portfolio.id}
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

