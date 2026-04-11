'use client';

import { useState } from 'react';
import { getAppDomain, isSubdomainEnabled } from '@/lib/urls';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
  portfolioId:       string;
  editToken:         string;
  suggestedUsername: string;
  onClose:           () => void;
  onSuccess:         (username: string) => void;
}

export default function PublishModal({
  portfolioId,
  editToken,
  suggestedUsername,
  onClose,
  onSuccess,
}: Props) {
  const [username,  setUsername]  = useState(suggestedUsername);
  const [email,     setEmail]     = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const appDomain      = getAppDomain();
  const showSubdomain  = isSubdomainEnabled();

  const isValidUsername = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/.test(username.toLowerCase());
  const isValidEmail    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSubmit       = !isLoading && isValidUsername && isValidEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/publish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          portfolioId,
          editToken,
          username: username.toLowerCase(),
          email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to publish');

      onSuccess(data.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Publish Your Portfolio"
      description="Choose your unique URL and we'll make it live."
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            loading={isLoading}
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            Publish
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* URL input */}
        <Input
          label="Your URL"
          size="md"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
          }
          placeholder="yourname"
          maxLength={32}
          prefix={!showSubdomain
            ? <span style={{ fontSize: 'var(--type-body-sm-size)', whiteSpace: 'nowrap' }}>/portfolio/</span>
            : undefined
          }
          suffix={showSubdomain
            ? <span style={{ fontSize: 'var(--type-body-sm-size)', whiteSpace: 'nowrap' }}>.{appDomain}</span>
            : undefined
          }
          variant={username && !isValidUsername ? 'error' : 'default'}
          helperText={username && !isValidUsername
            ? 'Must be 3–32 characters: letters, numbers and hyphens only'
            : undefined
          }
        />

        {/* Email input */}
        <Input
          label="Email Address"
          size="md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          helperText="We'll send you a link to edit your portfolio later"
        />

        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.625rem',
              backgroundColor: 'var(--error-900)',
              border: '1px solid var(--error-600)',
              fontSize: 'var(--type-body-sm-size)',
              color: 'var(--text-error)',
            }}
          >
            {error}
          </div>
        )}

        {/* Hidden submit so Enter key works */}
        <button type="submit" style={{ display: 'none' }} aria-hidden />
      </form>
    </Modal>
  );
}
