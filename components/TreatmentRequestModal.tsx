'use client';

import { useEffect, useMemo, useState } from 'react';
import { statusClasses, type CalEvent } from '@/lib/constants/calendar';
import {
  TREATMENT_STATUS,
  type TreatmentStatus,
} from '@/lib/constants/treatments';
import type { TreatmentOfferingDTO } from './AdminTreatmentPicker';
import Input from './Input';
import TextArea from './TextArea';
import { AdminTreatmentPicker } from './AdminTreatmentPicker';
import Button from './Button';
import DateInput from './DateInput';
import { cn } from '@/lib/utils';

const TreatmentRequestModal = ({
  open,
  onOpenChange,
  event,
  onSaved,
  offerings,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: CalEvent | null;
  onSaved: () => void;
  offerings: TreatmentOfferingDTO[];
}) => {
  const [status, setStatus] = useState<TreatmentStatus>('new');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string>('');
  const [priceEuros, setPriceEuros] = useState<string>('');
  const [durationMin, setDurationMin] = useState<string>('');
  const [treatmentOfferingId, setTreatmentOfferingId] = useState<string>('');

  useEffect(() => {
    if (!event) return;
    setStatus(event.status);
    setTreatmentOfferingId(event.treatmentOfferingId);

    // datetime-local Format (YYYY-MM-DDTHH:mm) für de-DE/Browser
    const d = event.start;
    const pad = (n: number) => String(n).padStart(2, '0');
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setDateTime(local);
    setPriceEuros(
      (event.priceSnapshotCents / 100).toFixed(2).replace('.', ','),
    );
    setDurationMin(String(event.durationSnapshotMin));
  }, [event]);

  const title = useMemo(() => {
    if (!event) return '';
    return event.title;
  }, [event]);

  if (!open || !event) return null;

  async function save() {
    if (!event) return;

    const priceCents = Math.round(Number(priceEuros.replace(',', '.')) * 100);
    const dur = Number(durationMin);

    if (!Number.isFinite(priceCents) || priceCents < 0) {
      setError('Preis ist ungültig.');
      setSaving(false);
      return;
    }
    if (!Number.isFinite(dur) || dur < 1) {
      setError('Dauer ist ungültig.');
      setSaving(false);
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const payload = {
        dateTime: dateTime,
        treatmentOfferingId: treatmentOfferingId,

        // Addons: komplett mitschicken (auch wenn du sie noch nicht editierst)
        addons:
          event.addons?.map((a) => ({
            addonCode: a.addonCode,
            isIncluded: a.isIncluded,
            priceDeltaCents: a.priceDeltaCents,
            durationDeltaMin: a.durationDeltaMin,
          })) ?? [],

        // Schema-Feldnamen (Form) -> kommen aus deinen Snapshots
        priceCents: Math.round(Number(priceEuros.replace(',', '.')) * 100),
        durationMin: Number(durationMin),

        status,

        name: event.name,
        email: event.email,
        phone: event.phone,
        message: event.message ?? '',

        // optional: nur mitschicken, wenn du es im Event wirklich hast
        // userId: event.userId ?? undefined,
      };

      const res = await fetch(`/api/treatment-requests/${event.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err ? JSON.stringify(err) : 'Update fehlgeschlagen');
      }

      onOpenChange(false);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/40"
      onClick={() => onOpenChange(false)}>
      <div
        className="w-full overflow-y-scroll md:overflow-y-hidden md:w-150 rounded-xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-xl font-semibold">{title}</div>
            <div className="mt-1 text-xs text-neutral-500">
              {`${event.start.toLocaleDateString('de-DE', { dateStyle: 'long' })} ${'\u00A0\u00A0--\u00A0\u00A0'} ${event.start.toLocaleTimeString('de-DE', { timeStyle: 'short' })} - ${event.end.toLocaleTimeString('de-DE', { timeStyle: 'short' })}`}
            </div>
          </div>
          <button
            className="rounded-md px-2 py-1 hover:bg-neutral-100"
            onClick={() => onOpenChange(false)}>
            ✕
          </button>
        </div>

        <div className="my-3 h-px bg-neutral-200" />
        <div className="relative mt-8 w-full flex justify-center items-center border border-neutral-200 p-4 rounded-xl">
          <div className="absolute -top-2 left-2 bg-white px-2 text-[10px] text-gray-400">
            Behandlungen
          </div>
          <AdminTreatmentPicker
            offerings={offerings}
            value={{ offeringId: treatmentOfferingId }}
            onChange={({ offeringId }) =>
              setTreatmentOfferingId(offeringId ?? '')
            }
          />
        </div>
        <div className="mt-3 mb-3 grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-3">
            <Input value={event.name} label="Name" />
            <Input value={event.email} label="E-Mail" />
            <Input value={event.phone} label="Telefon" />
          </div>
          <div className="flex flex-col gap-3">
            <DateInput
              label="Termin"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
            />
            <Input
              value={priceEuros}
              onChange={(e) => setPriceEuros(e.target.value)}
              inputMode="decimal"
              label="Preis in €"
            />
            <Input
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              inputMode="numeric"
              label="Dauer in Minuten"
            />
          </div>
        </div>
        <TextArea value={event.message ?? ''} label="Notiz" />

        <div className="flex justify-center my-8 items-center gap-5">
          {TREATMENT_STATUS.map((s) => (
            <div
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                `${statusClasses[s]}`,
                'h-8 w-8 rounded-full cursor-pointer',
                status === s ? 'ring-4 ring-offset-1 ring-offset-black' : '',
              )}></div>
          ))}
        </div>

        {error ? (
          <div className="mt-3 text-sm text-red-600">{error}</div>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md px-3 py-2 hover:bg-neutral-100 disabled:opacity-50"
            onClick={() => onOpenChange(false)}
            disabled={saving}>
            Abbrechen
          </button>
          <Button
            text="Speichern"
            onClick={save}
            disabled={saving}
            width={200}
          />
        </div>
      </div>
    </div>
  );
};

export default TreatmentRequestModal;
