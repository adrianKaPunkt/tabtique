'use client';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useTranslations } from 'next-intl';
import Logo from '@/public/Logo';
import TabiqueLogo from '@/public/TabiqueLogo';
import { useState, useEffect } from 'react';
import { CiMenuBurger } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { SiInstagram } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('navbar');

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className="fixed bg-white w-full mx-auto px-2 lg:px-0 py-4 lg:p-6 z-50 shadow-xl">
      <nav>
        <div className="relative flex justify-between items-center w-[90%] xl:w-300 mx-auto">
          <TabiqueLogo className="fill-gray-700 w-30 lg:w-50" />
          <div>
            <LanguageSwitcher />
          </div>
          <div></div>
          <div className="absolute right-0 top-1 lg:top-3 z-60">
            <button
              className="cursor-pointer"
              onClick={() => setMenuOpen(!menuOpen)}>
              {!menuOpen ? (
                <CiMenuBurger size={22} className="text-gray-700" />
              ) : (
                <IoCloseOutline size={22} className="text-gray-700" />
              )}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="absolute flex flex-col items-center bg-white top-0 left-0 w-screen h-screen">
            <Logo className="fill-gray-700 w-14 mt-20" />
            <TabiqueLogo className="fill-gray-700 w-50 mt-4 ml-5" />
            <div className="mt-20 flex flex-col space-y-8 text-gray-700 font-light text-lg text-center">
              <Link href="/" onClick={() => setMenuOpen(!menuOpen)}>
                {t('home')}
              </Link>
              <Link href="#treatments" onClick={() => setMenuOpen(!menuOpen)}>
                {t('treatments')}
              </Link>
              <Link href="#about" onClick={() => setMenuOpen(!menuOpen)}>
                {t('about')}
              </Link>
              <Link href="#contact" onClick={() => setMenuOpen(!menuOpen)}>
                {t('contact')}
              </Link>
            </div>
            <div className="mt-10">
              <LanguageSwitcher />
            </div>
            <Link
              href="https://www.instagram.com/tabtique?igsh=a3psdDUxdWY0azg%3D&utm_source=qr"
              target="_blank"
              aria-label="Instagram"
              className="mt-10">
              <SiInstagram size={25} className="text-gray-700 cursor-pointer" />
            </Link>
            <p className="mt-10 text-xs text-gray-500">
              © {new Date().getFullYear()} TÂBTIQUE - {t('rights')}
            </p>
          </div>
        )}
      </nav>
    </header>
  );
};
export default Navbar;
