import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// WICHTIG: Pfad relativ zum Projekt-Root (da wo package.json liegt)
const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {};
export default withNextIntl(nextConfig);
