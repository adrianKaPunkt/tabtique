'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: 'admin', label: 'Dashboard' },
  { href: 'admin/products', label: 'Products' },
  { href: 'admin/orders', label: 'Orders' },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const locale = pathname.split('/').filter(Boolean)[0]; // {locale}
  const base = `/${locale}/`;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 px-4 py-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <nav></nav>
        </aside>
      </div>

      {/* Main */}
      <main className="col-span-12 md:col-span-9">
        <header className="mb-6 rounded-2xl border bg-card px-5 py-4 shadow-sm">
          <div className="text-sm font-medium">Admin</div>
          <div className="text-xs text-muted-foreground">
            Manage products & orders
          </div>
        </header>

        <section className="rounded-2xl border bg-card p-5 shadow-sm">
          {children}
        </section>
      </main>
    </div>
  );
}
