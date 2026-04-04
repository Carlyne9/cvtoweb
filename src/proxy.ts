import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  // Get the app domain from environment or default
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'cvtoweb.com';
  
  // Handle localhost differently
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  
  // Extract subdomain
  let subdomain: string | null = null;
  
  if (isLocalhost) {
    // For local development: username.localhost:3000
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'www') {
      subdomain = parts[0].split(':')[0]; // Remove port if present
    }
  } else {
    // For production: username.cvtoweb.com
    // Skip Vercel preview/deployment URLs (*.vercel.app, *.vercel.sh)
    const isVercelUrl = hostname.endsWith('.vercel.app') || hostname.endsWith('.vercel.sh');
    if (!isVercelUrl) {
      const parts = hostname.split('.');
      if (parts.length > 2 || (parts.length === 2 && !hostname.includes(appDomain))) {
        subdomain = parts[0];
      }
    }
  }
  
  // If we have a subdomain and it's not 'www', rewrite to portfolio page
  if (subdomain && subdomain !== 'www') {
    // Don't rewrite API routes or static files
    if (
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.includes('.')
    ) {
      return NextResponse.next();
    }
    
    // Rewrite to the portfolio page
    url.pathname = `/portfolio/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
