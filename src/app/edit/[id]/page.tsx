import { notFound, redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { Portfolio } from '@/types/portfolio';
import EditClient from './EditClient';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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

  return <EditClient portfolio={portfolio as Portfolio} />;
}
