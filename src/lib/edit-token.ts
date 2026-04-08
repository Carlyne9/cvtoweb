import { createHmac, timingSafeEqual } from 'crypto';

function getEditSecret(): string {
  const secret =
    process.env.EDIT_LINK_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secret) {
    throw new Error('Missing EDIT_LINK_SECRET (or SUPABASE_SERVICE_ROLE_KEY)');
  }

  return secret;
}

function signValue(portfolioId: string): string {
  return createHmac('sha256', getEditSecret())
    .update(`edit:${portfolioId}`)
    .digest('hex');
}

export function generateEditToken(portfolioId: string): string {
  return signValue(portfolioId);
}

export function verifyEditToken(
  portfolioId: string,
  token: string | null | undefined
): boolean {
  if (!token || typeof token !== 'string') return false;

  const expected = signValue(portfolioId);
  const tokenBuffer = Buffer.from(token);
  const expectedBuffer = Buffer.from(expected);

  if (tokenBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return timingSafeEqual(tokenBuffer, expectedBuffer);
}
