'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Button from './Button';
import useTreatmentStore from '@/store/treatment-store';

interface TreatmentModalProps {
  title: string;
  text?: string;
  description?: string;
  suitable?: string;
  open?: boolean;
  treatmentKey?: string;
  onOpenChange?: (open: boolean) => void;
}

export function TreatmentModal({
  title,
  text,
  description,
  suitable,
  open,
  onOpenChange,
  treatmentKey,
}: TreatmentModalProps) {
  const t = useTranslations('treatment-modal');
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg h-[90%] overflow-y-scroll md:overflow-y-hidden md:h-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-cinzel font-light">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="p-2 text-light mt-4 space-y-4 text-sm leading-relaxed whitespace-pre-wrap">
          {text}
          <h3 className="text-xl mt-6">{t('description')}</h3>
          <p className="whitespace-pre-wrap">{description}</p>
          <h3 className="text-xl mt-6">{t('suitable')}</h3>
          <p className="whitespace-pre-wrap">{suitable}</p>
        </div>
        <div className="mt-5 text-center">
          <Button
            text={t('button')}
            onClick={() => {
              useTreatmentStore.setState({ treatment: treatmentKey || '' });
              document
                .getElementById('contact')
                ?.scrollIntoView({ behavior: 'smooth' });
              onOpenChange?.(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
