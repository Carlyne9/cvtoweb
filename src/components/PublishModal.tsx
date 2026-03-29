'use client';

import { useState } from 'react';
import { getAppDomain, isSubdomainEnabled } from '@/lib/urls';

interface Props {
  portfolioId: string;
  suggestedUsername: string;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export default function PublishModal({ portfolioId, suggestedUsername, onClose, onSuccess }: Props) {
  const [username, setUsername] = useState(suggestedUsername);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appDomain = getAppDomain();
  const showSubdomain = isSubdomainEnabled();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId,
          username: username.toLowerCase(),
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to publish');
      }

      onSuccess(data.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidUsername = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(username.toLowerCase());
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Publish Your Portfolio</h2>
        <p className="text-slate-500 mb-6">Choose your unique URL and we&apos;ll make it live.</p>

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Your URL
            </label>
            <div className="flex items-center">
              {!showSubdomain ? (
                <>
                  <span className="px-4 py-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-slate-500 text-sm">
                    /portfolio/
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-4 py-3 border border-l-0 border-slate-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                    placeholder="yourname"
                    maxLength={32}
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 px-4 py-3 border border-r-0 border-slate-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                    placeholder="yourname"
                    maxLength={32}
                  />
                  <span className="px-4 py-3 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg text-slate-500 text-sm">
                    .{appDomain}
                  </span>
                </>
              )}
            </div>
            {username && !isValidUsername && (
              <p className="text-red-500 text-sm mt-1">
                Must be 3-32 characters, letters, numbers, and hyphens only
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
              placeholder="you@example.com"
            />
            <p className="text-slate-400 text-sm mt-1">
              We&apos;ll send you a link to edit your portfolio later
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !isValidUsername || !isValidEmail}
              className="flex-1 px-4 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
