'use client';

import { useEffect, useMemo, useState } from 'react';
import type { CalEvent } from '@/lib/constants/calendar';
import {
  TREATMENT_STATUS,
  type TreatmentStatus,
} from '@/lib/constants/treatments';
import { TreatmentOfferingOption } from '@/lib/server/getTreatmentOfferings';

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
  offerings: TreatmentOfferingOption[];
}) => {
  const [status, setStatus] = useState<TreatmentStatus>('new');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string>('');
  const [priceEuros, setPriceEuros] = useState<string>(''); // UI in €
  const [durationMin, setDurationMin] = useState<string>(''); // UI in Minuten
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
        className="w-[560px] rounded-xl bg-white p-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-lg font-semibold">{title}</div>
            <div className="text-sm text-neutral-500">
              {event.start.toLocaleString('de-DE')} –{' '}
              {event.end.toLocaleTimeString('de-DE')}
            </div>
          </div>
          <button
            className="rounded-md px-2 py-1 hover:bg-neutral-100"
            onClick={() => onOpenChange(false)}>
            ✕
          </button>
        </div>

        <div className="my-3 h-px bg-neutral-200" />

        <div className="grid gap-1 text-sm">
          <div>
            <span className="font-medium">Name:</span> {event.name}
          </div>
          <div>
            <span className="font-medium">E-Mail:</span> {event.email}
          </div>
          <div>
            <span className="font-medium">Telefon:</span> {event.phone}
          </div>
          {event.message ? (
            <div className="mt-2 whitespace-pre-wrap rounded-md bg-neutral-50 p-2">
              {event.message}
            </div>
          ) : null}
        </div>

        <div className="my-3 h-px bg-neutral-200" />
        <div className="mt-3 flex items-center gap-3">
          <div className="my-3 h-px bg-neutral-200" />

          <div className="flex items-center gap-3">
            <div className="w-20 text-sm font-medium">Treatment</div>
            <select
              className="w-full rounded-md border border-neutral-300 px-2 py-1"
              value={treatmentOfferingId}
              onChange={(e) => setTreatmentOfferingId(e.target.value)}>
              {offerings.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="w-20 text-sm font-medium">Termin</div>
          <input
            type="datetime-local"
            className="rounded-md border border-neutral-300 px-2 py-1"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="w-20 text-sm font-medium">Preis</div>
          <div className="flex items-center gap-2">
            <input
              inputMode="decimal"
              className="w-32 rounded-md border border-neutral-300 px-2 py-1"
              value={priceEuros}
              onChange={(e) => setPriceEuros(e.target.value)}
              placeholder="z.B. 175,00"
            />
            <span className="text-sm text-neutral-500">€</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-3">
          <div className="w-20 text-sm font-medium">Dauer</div>
          <div className="flex items-center gap-2">
            <input
              inputMode="numeric"
              className="w-24 rounded-md border border-neutral-300 px-2 py-1"
              value={durationMin}
              onChange={(e) => setDurationMin(e.target.value)}
              placeholder="z.B. 80"
            />
            <span className="text-sm text-neutral-500">min</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-20 text-sm font-medium">Status</div>
          <select
            className="rounded-md border border-neutral-300 px-2 py-1"
            value={status}
            onChange={(e) => setStatus(e.target.value as TreatmentStatus)}>
            {TREATMENT_STATUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
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
          <button
            className="rounded-md bg-black px-3 py-2 text-white hover:bg-black/90 disabled:opacity-50"
            onClick={save}
            disabled={saving}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreatmentRequestModal;
