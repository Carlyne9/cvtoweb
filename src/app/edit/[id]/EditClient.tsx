'use client';

import { useState, useEffect, useRef } from 'react';
import { Portfolio, PortfolioData } from '@/types/portfolio';
import PortfolioTemplate from '@/components/PortfolioTemplate';
import { getPortfolioUrl } from '@/lib/urls';

interface Props {
  portfolio: Portfolio;
}

export default function EditClient({ portfolio }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [localData, setLocalData] = useState<PortfolioData>(portfolio.portfolio_data);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const isFirstRender = useRef(true);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const publicUrl = getPortfolioUrl(portfolio.username!);

  // Core save function
  const performSave = async (data: PortfolioData, silent = false) => {
    if (!silent) setIsSaving(true);
    setSaveStatus('saving');

    try {
      const res = await fetch('/api/update-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId: portfolio.id, portfolioData: data }),
      });

      if (!res.ok) throw new Error('Failed to save');

      setSaveStatus('saved');
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

  // "Save Updates" — save, exit edit mode, open live site in new tab
  const handleSaveUpdates = async () => {
    const success = await performSave(localData);
    if (success) {
      setIsEditing(false);
      window.open(publicUrl, '_blank');
    }
  };

  // Auto-save while editing
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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Banner */}
      <div className="bg-slate-900 text-white py-3 px-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        {/* Left: status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isEditing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-sm font-medium">
              {isEditing ? 'Editing Live Site' : 'Live Site'}
            </span>
          </div>

          {/* Auto-save indicators */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            {saveStatus === 'saving' && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <div className="w-3 h-3 border border-slate-600 border-t-slate-300 rounded-full animate-spin" />
                Saving changes...
              </div>
            )}
            {saveStatus === 'saved' && (
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

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              {/* Theme picker */}
              <div className="flex items-center gap-2 bg-slate-800 rounded-lg px-2 mr-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold ml-1">Theme</span>
                <select
                  value={localData.theme || 'midnight'}
                  onChange={(e) => setLocalData({ ...localData, theme: e.target.value as 'midnight' | 'snow' | 'cobalt' })}
                  className="bg-transparent text-sm font-medium py-1.5 focus:outline-none cursor-pointer pr-2"
                >
                  <option value="midnight" className="bg-slate-900">Midnight</option>
                  <option value="snow" className="bg-slate-900">Snow</option>
                  <option value="cobalt" className="bg-slate-900">Cobalt</option>
                </select>
              </div>

              {/* Cancel */}
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

              {/* Visit Live Site */}
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                Visit Live Site
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>

              {/* Save Updates */}
              <button
                onClick={handleSaveUpdates}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Updates'
                )}
              </button>
            </>
          ) : (
            <>
              {/* Edit button */}
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Content
              </button>

              {/* Visit Live Site */}
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 shadow-md"
              >
                Visit Live Site
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </>
          )}
        </div>
      </div>

      {/* Portfolio */}
      <PortfolioTemplate
        data={localData}
        isEditing={isEditing}
        onUpdate={setLocalData}
      />
    </div>
  );
}
