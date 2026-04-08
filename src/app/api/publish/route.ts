import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';
import { getPortfolioUrl } from '@/lib/urls';
import {
  isValidEmail,
  isValidUuid,
  normalizeUsername,
  validatePortfolioData,
} from '@/lib/validation';
import { verifyEditToken } from '@/lib/edit-token';
import { cleanPortfolioDataForPublish } from '@/lib/portfolio-cleanup';

export async function POST(request: NextRequest) {
  try {
    const { portfolioId, editToken, username, email } = await request.json();

    if (!portfolioId || !editToken || !username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: portfolioId, editToken, username, email' },
        { status: 400 }
      );
    }

    if (typeof portfolioId !== 'string' || !isValidUuid(portfolioId)) {
      return NextResponse.json(
        { error: 'Invalid portfolioId format' },
        { status: 400 }
      );
    }

    if (typeof username !== 'string' || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'username and email must be strings' },
        { status: 400 }
      );
    }

    if (!verifyEditToken(portfolioId, editToken)) {
      return NextResponse.json(
        { error: 'Invalid edit token' },
        { status: 403 }
      );
    }

    const normalizedUsername = normalizeUsername(username);
    const normalizedEmail = email.trim().toLowerCase();

    // Validate username format
    const usernameRegex = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;
    if (!usernameRegex.test(normalizedUsername)) {
      return NextResponse.json(
        { error: 'Username must be 3-32 characters, alphanumeric and hyphens only, cannot start or end with hyphen' },
        { status: 400 }
      );
    }

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const { data: existing } = await supabaseAdmin
      .from('portfolios')
      .select('id')
      .eq('username', normalizedUsername)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    const { data: existingPortfolio, error: existingPortfolioError } = await supabaseAdmin
      .from('portfolios')
      .select('portfolio_data')
      .eq('id', portfolioId)
      .single();

    if (existingPortfolioError || !existingPortfolio) {
      console.error('Failed to load portfolio before publish:', existingPortfolioError);
      return NextResponse.json(
        { error: 'Failed to load portfolio for publishing' },
        { status: 500 }
      );
    }

    const validation = validatePortfolioData(existingPortfolio.portfolio_data);
    if (!validation.valid || !validation.data) {
      return NextResponse.json(
        { error: `Invalid portfolio data: ${validation.error || 'unknown validation error'}` },
        { status: 422 }
      );
    }

    const cleanedData = cleanPortfolioDataForPublish(validation.data);

    // Update the portfolio with username and publish it
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .update({
        username: normalizedUsername,
        email: normalizedEmail,
        portfolio_data: cleanedData,
        is_published: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', portfolioId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to publish portfolio' },
        { status: 500 }
      );
    }

    // Send the welcome email with the public and edit links
    try {
      await sendWelcomeEmail(normalizedEmail, portfolio.username, portfolio.id, editToken);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
      // We don't fail the entire publish request just because the email failed
    }

    const url = getPortfolioUrl(normalizedUsername);

    return NextResponse.json({
      success: true,
      username: portfolio.username,
      url,
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish portfolio' },
      { status: 500 }
    );
  }
}
