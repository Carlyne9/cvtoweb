'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';

function PublishedContent() {
  const searchParams = useSearchParams();
  const username = searchParams.get('username');
  const id = searchParams.get('id');
  const [portfolioUrl, setPortfolioUrl] = useState(`/portfolio/${username}`);
  const [editUrl, setEditUrl] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPortfolioUrl(`${window.location.origin}/portfolio/${username}`);
    if (id) {
      setEditUrl(`${window.location.origin}/edit/${id}`);
    }
  }, [username, id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">
          You&apos;re Live! 🎉
        </h1>
        <p className="text-slate-300 text-lg mb-8">
          Your portfolio is now published and ready to share.
        </p>

        {/* URL Display */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <p className="text-slate-400 text-sm mb-2">Your portfolio URL</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={portfolioUrl}
              readOnly
              className="flex-1 bg-slate-700 text-white px-4 py-3 rounded-lg text-center font-medium"
            />
            <button
              onClick={() => copyToClipboard(portfolioUrl)}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Secret Edit URL Display */}
        {id && (
          <div className="bg-yellow-900/40 border border-yellow-700/50 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-sm mb-1 font-bold flex items-center justify-center gap-1">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
               Your Secret Edit Link
            </p>
            <p className="text-yellow-200/70 text-xs mb-3 text-center">Save this link! You will need it to update your portfolio later.</p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editUrl}
                readOnly
                className="flex-1 bg-slate-800 text-yellow-100 px-4 py-3 rounded-lg text-center font-medium opacity-80"
              />
              <button
                onClick={() => copyToClipboard(editUrl)}
                className="px-4 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg transition-colors font-medium cursor-pointer"
              >
                Copy Edit Link
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={portfolioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-white text-slate-900 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            View Portfolio →
          </a>
          <Link
            href="/"
            className="flex-1 px-6 py-3 border border-slate-600 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Create Another
          </Link>
        </div>

        {/* Share Options */}
        <div className="mt-12">
          <p className="text-slate-400 text-sm mb-4">Share on</p>
          <div className="flex justify-center gap-4">
            <a
              href={`https://twitter.com/intent/tweet?text=Check out my new portfolio!&url=${encodeURIComponent(portfolioUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-slate-700 hover:bg-slate-600 rounded-lg flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PublishedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <PublishedContent />
    </Suspense>
  );
}
