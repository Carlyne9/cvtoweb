/**
 * Normalize user- or CV-derived URL strings into safe http(s) hrefs.
 * Rejects non-http(s) schemes.
 */
export function normalizeExternalHref(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  try {
    let u = t;
    if (!/^https?:\/\//i.test(u)) {
      u = `https://${u.replace(/^\/+/, '')}`;
    }
    const parsed = new URL(u);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
    return parsed.href;
  } catch {
    return null;
  }
}

export function mailtoHref(email: string): string | null {
  const t = email.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)) return null;
  return `mailto:${t}`;
}
