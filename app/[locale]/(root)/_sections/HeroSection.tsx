'use client';

import { useTranslations } from 'next-intl';
import Button from '@/components/Button';
import Logo from '@/public/Logo';
import TabiqueLogo from '@/public/TabiqueLogo';
import Image from 'next/image';

const HeroSection = () => {
  const t = useTranslations('hero');

  return (
    <section
      id="hero-section"
      className="relative w-full h-screen overflow-hidden flex justify-center items-center text-center">
      <Image
        src="/hero-image.jpg"
        alt="tabtique-image"
        width={600}
        height={400}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="flex relative flex-col justify-between items-center h-105 lg:h-150">
        <div className="flex flex-col items-center">
          <Logo className="fill-white w-30 md:w-45 mb-5" />
          <TabiqueLogo className="w-75 lg:w-130 fill-white" />
        </div>
        <div className="text-white w-75 lg:w-full text-xl font-light">
          <p>{t('subtitle')}</p>
        </div>
        <Button
          text={t('cta')}
          onClick={() => {
            document
              .getElementById('contact')
              ?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      </div>
    </section>
  );
};
export default HeroSection;
