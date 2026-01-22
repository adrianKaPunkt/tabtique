import { getRequestConfig } from 'next-intl/server';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ locale }) => {
  const safeLocale: Locale = (routing.locales as readonly string[]).includes(
    locale ?? '',
  )
    ? (locale as Locale)
    : routing.defaultLocale;

  return {
    locale: safeLocale,
    messages: (await import(`./messages/${safeLocale}.json`)).default,
  };
});
