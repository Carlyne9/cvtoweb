import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendWelcomeEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { portfolioId, username, email } = await request.json();

    if (!portfolioId || !username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: portfolioId, username, email' },
        { status: 400 }
      );
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9][a-z0-9-]{1,30}[a-z0-9]$/;
    if (!usernameRegex.test(username.toLowerCase())) {
      return NextResponse.json(
        { error: 'Username must be 3-32 characters, alphanumeric and hyphens only, cannot start or end with hyphen' },
        { status: 400 }
      );
    }

    // Check if username is taken
    const { data: existing } = await supabaseAdmin
      .from('portfolios')
      .select('id')
      .eq('username', username.toLowerCase())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    // Update the portfolio with username and publish it
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .update({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        is_published: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', portfolioId)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to publish portfolio' },
        { status: 500 }
      );
    }

    // Send the welcome email with the public and edit links
    try {
      await sendWelcomeEmail(email.toLowerCase(), portfolio.username, portfolio.id);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
      // We don't fail the entire publish request just because the email failed
    }

    return NextResponse.json({
      success: true,
      username: portfolio.username,
      url: `${username.toLowerCase()}.${process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}`,
    });

  } catch (error) {
    console.error('Publish error:', error);
    return NextResponse.json(
      { error: 'Failed to publish portfolio' },
      { status: 500 }
    );
  }
}
