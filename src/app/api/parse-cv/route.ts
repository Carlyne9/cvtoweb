import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
import { parseCV } from '@/lib/parse-cv';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'File must be a PDF' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text and annotations from PDF using pdfjs-dist
    const uint8Array = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data: uint8Array, useSystemFonts: true });
    const pdfDocument = await loadingTask.promise;
    
    let cvText = '';
    const extractedUrls = new Set<string>();

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      
      // Extract text
      const textContent = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      cvText += pageText + '\n';
      
      // Extract annotations (hidden links)
      try {
        const annotations = await page.getAnnotations();
        for (const annotation of annotations) {
          // Check for standard Link subtype
          if (annotation.subtype === 'Link') {
            // Links can be in .url, .unsafeUrl, or within an .action object (A.URI)
            const url = annotation.url || annotation.unsafeUrl || (annotation.action && (annotation.action.url || annotation.action.URI));
            if (url && typeof url === 'string' && url.startsWith('http')) {
              extractedUrls.add(url);
            }
          }
        }
      } catch (e) {
        console.warn('Could not extract annotations for page', i, e);
      }
    }

    // Fallback: Also look for URLs in the text itself via regex
    const textUrls = cvText.match(/https?:\/\/[^\s)]+/g);
    if (textUrls) {
      textUrls.forEach(url => extractedUrls.add(url));
    }

    if (extractedUrls.size > 0) {
      cvText += '\n\n--- Links Extracted from PDF ---\n';
      Array.from(extractedUrls).forEach(url => {
        cvText += `- ${url}\n`;
      });
    }

    if (!cvText || cvText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF. Please ensure the PDF contains selectable text.' },
        { status: 400 }
      );
    }

    // Parse CV with AI
    const portfolioData = await parseCV(cvText);

    // Create a temporary portfolio entry (not published yet)
    const { data: portfolio, error } = await supabaseAdmin
      .from('portfolios')
      .insert({
        portfolio_data: portfolioData,
        template: 'default',
        is_published: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save portfolio' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      portfolioId: portfolio.id,
      data: portfolioData,
    });

  } catch (error) {
    console.error('Parse CV error:', error);
    return NextResponse.json(
      { error: 'Failed to parse CV' },
      { status: 500 }
    );
  }
}
