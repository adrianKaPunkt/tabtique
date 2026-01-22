'use client';

import { useTranslations } from 'next-intl';
import Headline from '@/components/Headline';
import Image from 'next/image';

const AboutSection = () => {
  const t = useTranslations('about');

  return (
    <section id="about" className="my-15 w-[90%] lg:w-300 mx-auto">
      <Headline title={t('title')} />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 md:max-w-300 mx-auto gap-10">
        <div>
          <Image
            src="/profile.jpg"
            alt="TÂBTIQUE"
            width={300}
            height={400}
            className="w-full"
          />
        </div>
        <div className="flex items-center font-light px-4">
          <ul className="">
            <li className="leading-7 mb-4">{t('para1')}</li>
            <li className="leading-7 mb-4">{t('para2')}</li>
            <li className="leading-7 mb-4">{t('para3')}</li>
            <li className="leading-7 mb-4">{t('para4')}</li>
            <li className="leading-7 mb-4">{t('para5')}</li>
            <li className="leading-7 mb-4">{t('para6')}</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
