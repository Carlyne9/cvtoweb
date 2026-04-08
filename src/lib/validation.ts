import type { PortfolioData } from '@/types/portfolio';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.every((item) => typeof item === 'string')
  );
}

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidUuid(value: string): boolean {
  return UUID_REGEX.test(value);
}

export function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

export function validatePortfolioData(input: unknown): {
  valid: boolean;
  error?: string;
  data?: PortfolioData;
} {
  if (!input || typeof input !== 'object') {
    return { valid: false, error: 'Portfolio data must be an object' };
  }

  const value = input as Record<string, unknown>;

  if (!isString(value.name)) {
    return { valid: false, error: 'Portfolio name must be a string' };
  }
  if (!isString(value.title)) {
    return { valid: false, error: 'Portfolio title must be a string' };
  }
  if (!isString(value.summary)) {
    return { valid: false, error: 'Portfolio summary must be a string' };
  }
  if (!Array.isArray(value.experience)) {
    return { valid: false, error: 'Experience must be an array' };
  }
  if (!Array.isArray(value.education)) {
    return { valid: false, error: 'Education must be an array' };
  }
  if (!isStringArray(value.skills)) {
    return { valid: false, error: 'Skills must be a string array' };
  }
  if (!value.contact || typeof value.contact !== 'object') {
    return { valid: false, error: 'Contact must be an object' };
  }

  for (const exp of value.experience as unknown[]) {
    if (!exp || typeof exp !== 'object') {
      return { valid: false, error: 'Each experience item must be an object' };
    }
    const expItem = exp as Record<string, unknown>;
    if (
      !isString(expItem.company) ||
      !isString(expItem.role) ||
      !isString(expItem.dates) ||
      !isStringArray(expItem.bullets)
    ) {
      return {
        valid: false,
        error: 'Experience items must include company, role, dates, and bullets',
      };
    }
  }

  for (const edu of value.education as unknown[]) {
    if (!edu || typeof edu !== 'object') {
      return { valid: false, error: 'Each education item must be an object' };
    }
    const eduItem = edu as Record<string, unknown>;
    if (
      !isString(eduItem.institution) ||
      !isString(eduItem.degree) ||
      !isString(eduItem.dates)
    ) {
      return {
        valid: false,
        error: 'Education items must include institution, degree, and dates',
      };
    }
  }

  return { valid: true, data: input as PortfolioData };
}
