'use client';

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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="font-light cursor-pointer">
          Mehr erfahren
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center font-cinzel font-light">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-sm leading-relaxed">
          {text}
          <h3 className="text-xl mt-6">Beschreibung</h3>
          <p className="whitespace-pre-line whitespace-pre-wrap">
            {description}
          </p>
          <h3 className="text-xl mt-6">Für wen geeignet?</h3>
          <p className="whitespace-pre-line whitespace-pre-wrap">{suitable}</p>
        </div>
        <div className="mt-5 text-center">
          <Button text="Termin buchen" width={200} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
