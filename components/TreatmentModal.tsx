'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Button from './Button';

interface TreatmentModalProps {
  title: string;
  text?: string;
  description?: string;
  suitable?: string;
}

export function TreatmentModal({
  title,
  text,
  description,
  suitable,
}: TreatmentModalProps) {
  const t = useTranslations('treatment-modal');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="font-light cursor-pointer">
          {t('moreInfo')}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg h-[90%] overflow-y-scroll ">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-cinzel font-light">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-2 text-light mt-4 space-y-4 text-sm leading-relaxed whitespace-pre-line whitespace-pre-wrap">
          {text}
          <h3 className="text-xl mt-6">{t('description')}</h3>
          <p className="whitespace-pre-line whitespace-pre-wrap">
            {description}
          </p>
          <h3 className="text-xl mt-6">{t('suitable')}</h3>
          <p className="whitespace-pre-line whitespace-pre-wrap">{suitable}</p>
        </div>
        <div className="mt-5 text-center">
          <Button text={t('button')} width={300} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
