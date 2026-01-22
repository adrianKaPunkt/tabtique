'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { Button } from '@/components/ui/button';

const LOCALES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
] as const;

type Locale = (typeof LOCALES)[number]['code'];

// Erwartet: du nutzt Routing wie /de/... und /en/...
export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname(); // z.B. "/de/home" oder "/en/home"

  function switchLocale(nextLocale: Locale) {
    if (!pathname) return;

    // Ersetzt nur das erste Segment (/de oder /en)
    const segments = pathname.split('/');
    // segments[0] = "" , segments[1] = locale
    segments[1] = nextLocale;
    const nextPath = segments.join('/') || `/${nextLocale}`;

    router.push(nextPath);
  }

  const currentLabel =
    LOCALES.find((l) => l.code === currentLocale)?.label ?? currentLocale;

  return (
    <>
      {LOCALES.map((l) => (
        <span
          key={l.code}
          onClick={() => switchLocale(l.code)}
          className={l.code === currentLocale ? 'font-medium' : undefined}>
          {l.code}&nbsp;
        </span>
      ))}
    </>
  );
}
