'use client';

import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ImpressumModal() {
  const t = useTranslations('imprint-modal');
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="font-light cursor-pointer">
          {t('title')}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm leading-relaxed">
          <h3 className="font-semibold text-xl">{t('title')}</h3>
          <p>
            <strong>TÂBTIQUE</strong>
            <br />
            {t('owner')}
            <br />
            Hochstraße 43
            <br />
            60313 Frankfurt am Main
          </p>

          <p>
            <strong>Kontakt</strong>
            <br />
            {t('email')}
            <br />
            {t('phone')}
          </p>

          <p className="text-neutral-500">{t('description')}</p>
        </div>
        <h3 className="font-semibold text-xl">{t('privacy')}</h3>
        <p className="space-y-4 text-sm leading-relaxed">{t('privacyText')}</p>
      </DialogContent>
    </Dialog>
  );
}
