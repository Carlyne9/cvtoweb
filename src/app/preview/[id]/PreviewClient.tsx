'use client';

import { useState } from 'react';
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

  const handlePublishSuccess = (username: string) => {
    router.push(`/published?username=${username}`);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    try {
      const response = await fetch('/api/update-portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId: portfolio.id,
          portfolioData: localData,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setSaveStatus('success');
      setIsEditing(false);
      
      // Update the page data to reflect the new saved state
      router.refresh(); 
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const publicUrl = portfolio.username ? getPortfolioUrl(portfolio.username) : null;

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
              {portfolio.is_published 
                ? (isEditing ? 'Editing Live Site' : 'Live Preview')
                : (isEditing ? 'Editing Draft' : 'Draft Preview')}
            </span>
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
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  portfolio.is_published ? 'Update Live Site' : 'Save Changes'
                )}
              </button>
            </>
          ) : (
            <>
              {saveStatus === 'success' && (
                <span className="text-green-400 text-sm font-medium animate-fade-in">Changes saved!</span>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Edit Content
              </button>
              
              {portfolio.is_published ? (
                <a
                  href={publicUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md flex items-center gap-2"
                >
                  View Live Site
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ) : (
                <button
                  onClick={() => setShowPublishModal(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-md"
                >
                  Publish Site
                </button>
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

