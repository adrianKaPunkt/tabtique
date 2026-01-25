'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

const LOCALES = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
] as const;

type Locale = (typeof LOCALES)[number]['code'];

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale(nextLocale: Locale) {
    if (!pathname) return;

    const segments = pathname.split('/');
    // segments[0] = "" , segments[1] = locale
    segments[1] = nextLocale;
    const nextPath = segments.join('/') || `/${nextLocale}`;

    router.push(nextPath, { scroll: false });
  }

  return (
    <div className="font-light">
      <span
        key={LOCALES[0].code}
        className={`${LOCALES[0].code === currentLocale ? 'font-normal' : undefined} text-sm lg:text-xl cursor-pointer`}
        onClick={() => switchLocale('de')}>
        {LOCALES[0].code}
      </span>
      <span className="text-sm lg:text-2xl">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
      <span
        key={LOCALES[1].code}
        className={`${LOCALES[1].code === currentLocale ? 'font-normal' : undefined} text-sm lg:text-xl cursor-pointer`}
        onClick={() => switchLocale('en')}>
        {LOCALES[1].code}
      </span>
    </div>
  );
}
