import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Normalize hostname: lowercase, trim, and remove port
  const host = (request.headers.get('host') || '').toLowerCase().trim();
  const hostname = host.split(':')[0];
  const url = request.nextUrl.clone();
  
  // Extract subdomain
  let subdomain: string | null = null;
  
  // Get the app domain from environment or default
  const appDomain = (process.env.NEXT_PUBLIC_APP_DOMAIN || 'cvtoweb.com').toLowerCase().trim().split(':')[0];
  
  // Detection flags
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isAppDomain = hostname === appDomain;
  const isVercelSystemDomain = hostname.endsWith('.vercel.app') || hostname.endsWith('.vercel.dev');

  console.log(`Middleware Debug: hostname=${hostname}, appDomain=${appDomain}, isAppDomain=${isAppDomain}, isVercelSystemDomain=${isVercelSystemDomain}`);

  if (isLocalhost || isAppDomain || isVercelSystemDomain) {
    // If we're on localhost but have a subdomain (e.g. user.localhost:3000)
    if (isLocalhost) {
      const parts = host.split('.'); // Use raw host to catch subdomains
      if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        subdomain = parts[0];
      }
    }
    // For Vercel/App domains, we never extract a subdomain from the host header itself
  } else {
    // For production custom domains (e.g. user.carlynesdomain.com)
    const parts = hostname.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
    } else if (parts.length === 2 && !hostname.includes(appDomain)) {
      subdomain = parts[0];
    }
  }

  // Safety: never let 'www' be a username
  if (subdomain === 'www') subdomain = null;

  console.log(`Middleware Debug: final subdomain=${subdomain}`);
  
  // If we have a subdomain, rewrite to portfolio page
  if (subdomain) {
    // Don't rewrite API routes or static files
    if (
      url.pathname.startsWith('/api') ||
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/favicon') ||
      url.pathname.includes('.')
    ) {
      return NextResponse.next();
    }
    
    console.log(`Middleware Debug: rewriting to /portfolio/${subdomain}${url.pathname}`);
    
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
