'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { TreatmentModal } from './TreatmentModal';

interface TreatmentCardProps {
  image: string;
  title: string;
  text: string;
  modalText?: string;
  modalDescription?: string;
  modalSuitable?: string;
  treatmentKey?: string;
}

const TreatmentCard = ({
  image,
  title,
  text,
  modalText,
  modalDescription,
  modalSuitable,
  treatmentKey,
}: TreatmentCardProps) => {
  const [open, setOpen] = useState(false);
  const t = useTranslations('treatment-modal');
  return (
    <>
      <div
        className="h-full cursor-pointer rounded-lg overflow-hidden shadow-lg grayscale-100 hover:grayscale-0 transition-all duration-500"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen(true);
          }
        }}>
        <Image src={image} alt="" width={300} height={400} className="w-full" />
        <div className="h-full flex flex-col items-center p-7 text-center">
          <h3 className="mt-3 text-center font-cinzel text-2xl">{title}</h3>
          <p className="my-7 font-light">{text}</p>
          <span className="font-light cursor-pointer">{t('moreInfo')}</span>
        </div>
      </div>
      <TreatmentModal
        title={title}
        text={modalText}
        description={modalDescription}
        suitable={modalSuitable}
        open={open}
        onOpenChange={setOpen}
        treatmentKey={treatmentKey}
      />
    </>
  );
};
export default TreatmentCard;
