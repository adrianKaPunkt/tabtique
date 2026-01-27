import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AdminShell from './_components/AdminShell';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (data?.role !== 'admin') notFound();

  return <AdminShell>{children}</AdminShell>;
}
