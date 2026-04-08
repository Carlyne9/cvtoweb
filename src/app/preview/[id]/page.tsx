import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Portfolio } from '@/types/portfolio';
import PreviewClient from './PreviewClient';
import { verifyEditToken } from '@/lib/edit-token';

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  // Await params in Next.js 15+
  const { id } = await params;
  const { token } = await searchParams;

  if (!verifyEditToken(id, token)) {
    notFound();
  }
  
  // Fetch portfolio using server-side admin client (bypasses RLS)
  const { data: portfolio, error } = await supabaseAdmin
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !portfolio) {
    notFound();
  }

  return <PreviewClient portfolio={portfolio as Portfolio} editToken={token!} />;
}
