/**
 * Centralized utility for generating URLs across the application.
 * This ensures consistency between emails, UI, and API responses.
 */

export function getAppDomain(): string {
  return process.env.NEXT_PUBLIC_APP_DOMAIN || 'cvtoweb.vercel.app';
}

export function getPortfolioUrl(username: string): string {
  const appDomain = getAppDomain();
  const lowerUsername = username.toLowerCase();
  
  // Detect environment
  const isVercel = appDomain.includes('.vercel.app') || appDomain.includes('.vercel.sh');
  const isLocal = appDomain.includes('localhost') || appDomain.includes('127.0.0.1');

  // Subdomains don't work on *.vercel.app or localhost by default.
  // We use path-based URLs for these environments.
  if (isLocal || isVercel) {
    const protocol = isLocal ? 'http' : 'https';
    return `${protocol}://${appDomain}/portfolio/${lowerUsername}`;
  }

  // For custom domains (e.g., cvtoweb.com), we use subdomains.
  // This requires wildcard DNS and SSL configuration on your hosting provider.
  return `https://${lowerUsername}.${appDomain}`;
}

export function getEditUrl(portfolioId: string): string {
  const appDomain = getAppDomain();
  const isLocal = appDomain.includes('localhost') || appDomain.includes('127.0.0.1');
  const protocol = isLocal ? 'http' : 'https';
  
  return `${protocol}://${appDomain}/preview/${portfolioId}`;
}

/**
 * Returns the dedicated edit URL for returning users who already have a live site.
 * Points to /edit/[id] — a focused editor with no publish flow.
 */
export function getLiveEditUrl(portfolioId: string): string {
  const appDomain = getAppDomain();
  const isLocal = appDomain.includes('localhost') || appDomain.includes('127.0.0.1');
  const protocol = isLocal ? 'http' : 'https';

  return `${protocol}://${appDomain}/edit/${portfolioId}`;
}

export function isSubdomainEnabled(): boolean {
  const appDomain = getAppDomain();
  const isVercel = appDomain.includes('.vercel.app') || appDomain.includes('.vercel.sh');
  const isLocal = appDomain.includes('localhost') || appDomain.includes('127.0.0.1');
  
  return !isLocal && !isVercel;
}
