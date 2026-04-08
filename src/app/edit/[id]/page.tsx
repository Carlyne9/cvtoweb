import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Portfolio } from '@/types/portfolio';
import EditClient from './EditClient';
import { verifyEditToken } from '@/lib/edit-token';

export default async function EditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { id } = await params;
  const { token } = await searchParams;

  if (!verifyEditToken(id, token)) {
    notFound();
  }

  const { data: portfolio, error } = await supabaseAdmin
    .from('portfolios')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !portfolio) {
    notFound();
  }

  // Safety guard: if for some reason this portfolio isn't published yet,
  // redirect to the standard preview/draft page instead.
  if (!portfolio.is_published && !portfolio.username) {
    redirect(`/preview/${id}`);
  }

  return <EditClient portfolio={portfolio as Portfolio} editToken={token!} />;
}
