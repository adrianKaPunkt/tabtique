'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function ImpressumModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="font-light cursor-pointer">
          Impressum
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Impressum</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            <strong>TÂBTIQUE</strong>
            <br />
            Inhaberin: Michelle Guse
            <br />
            Hochstraße 43
            <br />
            60313 Frankfurt am Main
          </p>

          <p>
            <strong>Kontakt</strong>
            <br />
            E-Mail: info@tabtique.de
            <br />
            Telefon: +49 172 54 84 11 4
          </p>

          <p className="text-neutral-500">
            TÂBTIQUE bietet kosmetische und ästhetische Hautbehandlungen im
            nicht-medizinischen Bereich an. Es werden keine ärztlichen,
            heilkundlichen oder therapeutischen Leistungen erbracht.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
