'use client';

import { useTranslations } from 'next-intl';
import Logo from '@/public/Logo';
import TabiqueLogo from '@/public/TabiqueLogo';
import Link from 'next/link';
import { ImpressumModal } from '@/components/ImpressumModal';
import { SiInstagram } from '@icons-pack/react-simple-icons';

const Footer = () => {
  const t = useTranslations('footer');
  return (
    <footer className="bg-black text-white flex flex-col items-center justify-between pt-15 pb-10">
      <Logo className="w-10 mb-7" />
      <TabiqueLogo className="fill-white w-80 mb-3" />
      <div className="flex flex-col items-center font-light">
        <Link
          href="https://www.google.com/maps/search/?api=1&query=Hochstraße+43,+60313+Frankfurt+am+Main"
          target="_blank"
          rel="noopener noreferrer">
          <p>Hochstraße 43 &nbsp;&nbsp;|&nbsp;&nbsp; 60313 Frankfurt am Main</p>
        </Link>
        <div className="mt-11 text-center">
          <p>{t('openingHours')}:</p>
          <p>{t('hours')}</p>
        </div>
      </div>
      <div className="flex gap-14 mt-15">
        <Link
          href="https://www.instagram.com/tabtique?igsh=a3psdDUxdWY0azg%3D&utm_source=qr"
          target="_blank"
          aria-label="Instagram">
          <SiInstagram className="h-7 w-7 text-white" />
        </Link>
      </div>
      <div className="mt-15 font-light">
        <ImpressumModal />
      </div>
      <p className="mt-10 text-xs text-gray-500">
        © {new Date().getFullYear()} TABTIQUE - {t('rights')}
      </p>
    </footer>
  );
};
export default Footer;
