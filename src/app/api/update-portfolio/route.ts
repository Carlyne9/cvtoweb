import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { isValidUuid, validatePortfolioData } from '@/lib/validation';
import { verifyEditToken } from '@/lib/edit-token';

export async function POST(request: NextRequest) {
  try {
    const { portfolioId, editToken, portfolioData } = await request.json();

    if (!portfolioId || !editToken || !portfolioData) {
      return NextResponse.json(
        { error: 'Missing required fields: portfolioId, editToken, portfolioData' },
        { status: 400 }
      );
    }

    if (typeof portfolioId !== 'string' || !isValidUuid(portfolioId)) {
      return NextResponse.json(
        { error: 'Invalid portfolioId format' },
        { status: 400 }
      );
    }

    if (!verifyEditToken(portfolioId, editToken)) {
      return NextResponse.json(
        { error: 'Invalid edit token' },
        { status: 403 }
      );
    }

    const validation = validatePortfolioData(portfolioData);
    if (!validation.valid) {
      return NextResponse.json(
        { error: `Invalid portfolio data: ${validation.error}` },
        { status: 422 }
      );
    }

    // Update the portfolio data in Supabase
    const { error } = await supabaseAdmin
      .from('portfolios')
      .update({
        portfolio_data: validation.data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', portfolioId);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to update portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}
