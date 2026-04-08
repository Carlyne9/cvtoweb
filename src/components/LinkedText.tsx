'use client';

import type { ReactNode } from 'react';
import { normalizeExternalHref } from '@/lib/external-links';

/** Detects http(s):// and www. URLs in plain text for read-only display */
const URL_RE = /(https?:\/\/[^\s<]+[^\s<.,;:!?)"]*|www\.[^\s<]+[^\s<.,;:!?)"]*)/gi;

interface LinkedTextProps {
  text: string;
  className?: string;
  linkClassName?: string;
}

export function LinkedText({ text, className, linkClassName }: LinkedTextProps) {
  if (!text) return null;

  const parts: ReactNode[] = [];
  let last = 0;
  const re = new RegExp(URL_RE.source, 'gi');
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = re.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={key++}>{text.slice(last, match.index)}</span>);
    }
    const raw = match[0];
    const candidate = raw.startsWith('www.') ? `https://${raw}` : raw;
    const href = normalizeExternalHref(candidate);
    if (href) {
      parts.push(
        <a
          key={key++}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClassName ?? 'underline underline-offset-2 break-all hover:opacity-90'}
        >
          {raw}
        </a>
      );
    } else {
      parts.push(<span key={key++}>{raw}</span>);
    }
    last = match.index + raw.length;
  }

  if (last < text.length) {
    parts.push(<span key={key++}>{text.slice(last)}</span>);
  }

  return <span className={className}>{parts}</span>;
}
