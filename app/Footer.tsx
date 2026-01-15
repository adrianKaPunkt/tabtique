import Logo from '@/public/Logo';
import TabiqueLogo from '@/public/TabiqueLogo';
import Link from 'next/link';
import { SiInstagram, SiFacebook, SiX } from '@icons-pack/react-simple-icons';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white flex flex-col items-center justify-between pt-15 pb-10">
      <Logo className="w-10 mb-7" />
      <TabiqueLogo className="fill-white w-80 mb-15" />
      <p>Hochstraße 43, 60313 Frankfurt am Main</p>
      <div className="flex gap-14 mt-15">
        <Link
          href="https://www.instagram.com/tabtique?igsh=a3psdDUxdWY0azg%3D&utm_source=qr"
          aria-label="Instagram">
          <SiInstagram className="h-7 w-7 text-white" />
        </Link>
        <Link href="#" aria-label="Facebook">
          <SiFacebook className="h-7 w-7 text-white" />
        </Link>
        <Link href="#" aria-label="X">
          <SiX className="h-7 w-7 text-white" />
        </Link>
      </div>
      <div className="mt-15">
        <Link href="/imprint">Impressum</Link>
      </div>
      <p className="mt-10 text-xs text-gray-500">TABIQUE 2026</p>
    </footer>
  );
};
export default Footer;
