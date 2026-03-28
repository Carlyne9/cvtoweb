import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl.clone();
  
  // Extract subdomain
  let subdomain: string | null = null;
  
  // Get the app domain from environment or default
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'cvtoweb.com';
  
  // Handle localhost differently
  const isLocalhost = hostname.includes('localhost') || hostname.includes('127.0.0.1');
  
  // If the hostname is exactly the app domain or a Vercel system domain, we ignore it for subdomains
  const isAppDomain = hostname === appDomain;
  const isVercelSystemDomain = hostname.endsWith('.vercel.app') || hostname.endsWith('.vercel.dev');

  console.log(`Middleware Debug: hostname=${hostname}, appDomain=${appDomain}, isAppDomain=${isAppDomain}, isVercelSystemDomain=${isVercelSystemDomain}`);

  if (isLocalhost || isAppDomain || isVercelSystemDomain) {
    if (isLocalhost) {
      const parts = hostname.split('.');
      if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
        subdomain = parts[0].split(':')[0];
      }
    }
  } else {
    // For production custom domains: username.customdomain.com
    const parts = hostname.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
    } else if (parts.length === 2 && !hostname.includes(appDomain)) {
      subdomain = parts[0];
    }
  }

  console.log(`Middleware Debug: final subdomain=${subdomain}`);
  
  // If we have a subdomain and it's not 'www', rewrite to portfolio page
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
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
