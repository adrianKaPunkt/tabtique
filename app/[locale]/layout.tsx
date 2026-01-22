import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import localFont from 'next/font/local';
import { Inter, Cormorant } from 'next/font/google';
import './globals.css';

const cinzel = localFont({
  src: '../../public/fonts/CinzelVariable.ttf',
  variable: '--font-cinzel',
  display: 'swap',
  weight: '400 900',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500'],
  display: 'swap',
});

const cormorant = Cormorant({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TABTIQUE',
  description: 'Advanced Korean Facial Treatments',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = (await import(`@/i18n/messages/${locale}.json`))
    .default;
  return (
    <html
      lang={locale}
      className={`${cinzel.variable} ${inter.variable} ${cormorant.variable} antialiased`}>
      <body>
        <NextIntlClientProvider
          locale={locale}
          messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Toaster position="bottom-center" theme="light"></Toaster>
      </body>
    </html>
  );
}
