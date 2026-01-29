'use client';

import { useEffect, useMemo, useState } from 'react';
import { statusClasses, type CalEvent } from '@/lib/constants/calendar';
import {
  TREATMENT_STATUS,
  type TreatmentStatus,
} from '@/lib/constants/treatments';
import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferingsWithAddons';
import Input from '@/components/admin/Input';
import TextArea from './TextArea';
import AdminTreatmentPicker from './AdminTreatmentPicker';
import Button from './Button';
import DateInput from './DateInput';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { TreatmentStatusDTO } from '@/lib/server/getTreatmentStatus';

interface TreatmentRequestModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: CalEvent | null;
  onSaved: () => void;
  offerings: TreatmentOfferingDTO[];
  statuses: TreatmentStatusDTO[];
}

const TreatmentRequestModal = ({
  open,
  onOpenChange,
  event,
  onSaved,
  offerings,
  statuses,
}: TreatmentRequestModalProps) => {
  const [status, setStatus] = useState<TreatmentStatus>('new');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateTime, setDateTime] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [priceEuros, setPriceEuros] = useState<string>('');
  const [durationMin, setDurationMin] = useState<string>('');
  const [treatmentOfferingId, setTreatmentOfferingId] = useState<string>('');
  const [addonCodes, setAddonCodes] = useState<string[]>([]);

  // Daten aus dem Event in die lokalen States übernehmen
  useEffect(() => {
    if (!event) return;
    setName(event.name);
    setEmail(event.email);
    setPhone(event.phone);
    setMessage(event.message ?? '');
    setStatus(event.status);
    setTreatmentOfferingId(event.treatmentOfferingId);
    setAddonCodes(event.addons?.map((a) => a.addonCode) ?? []);
    setPriceEuros(
      (event.priceSnapshotCents / 100).toFixed(2).replace('.', ','),
    );
    setDurationMin(String(event.durationSnapshotMin));
    // setDateTime - datetime-local Format (YYYY-MM-DDTHH:mm) für de-DE/Browser
    const d = event.start;
    const pad = (n: number) => String(n).padStart(2, '0');
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setDateTime(local);
  }, [event]);
  //

  const selectedOffering = useMemo(() => {
    if (!treatmentOfferingId) return undefined;
    return offerings.find((o) => o.offeringId === treatmentOfferingId);
  }, [offerings, treatmentOfferingId]);

  const computedTotals = useMemo(() => {
    if (!selectedOffering) return null;

    const selected = new Set(addonCodes);

    const addonsTotal = selectedOffering.addons
      .filter((a) => selected.has(a.addonCode))
      .reduce(
        (acc, a) => {
          acc.priceCents += a.priceDeltaCents;
          acc.durationMin += a.durationDeltaMin;
          return acc;
        },
        { priceCents: 0, durationMin: 0 },
      );

    return {
      priceCents: selectedOffering.priceCents + addonsTotal.priceCents,
      durationMin: selectedOffering.durationMin + addonsTotal.durationMin,
    };
  }, [selectedOffering, addonCodes]);

  useEffect(() => {
    if (!computedTotals) return;

    // Preis ins bestehende "de-DE"-Format wie bei dir (Komma)
    setPriceEuros(
      (computedTotals.priceCents / 100).toFixed(2).replace('.', ','),
    );
    setDurationMin(String(computedTotals.durationMin));
  }, [computedTotals]);

  // Early return - Modal nicht anzeigen, wenn nicht open oder kein Event - Erst die Hooks dann der Guard
  if (!open || !event) return null;

  async function save() {
    if (!event) return;

    const priceCents = Math.round(Number(priceEuros.replace(',', '.')) * 100);
    const dur = Number(durationMin);

    if (!dateTime) {
      setError('Datum/Uhrzeit ist ungültig.');
      return;
    }

    if (!Number.isFinite(priceCents) || priceCents < 0) {
      setError('Preis ist ungültig.');
      return;
    }
    if (!Number.isFinite(dur) || dur < 1) {
      setError('Dauer ist ungültig.');
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
          selectedOffering?.addons
            .filter((a) => addonCodes.includes(a.addonCode))
            .map((a) => ({
              addonCode: a.addonCode,
              isIncluded: a.isIncluded,
              priceDeltaCents: a.priceDeltaCents,
              durationDeltaMin: a.durationDeltaMin,
            })) ?? [],

        // Schema-Feldnamen (Form) -> kommen aus deinen Snapshots
        priceCents: priceCents,
        durationMin: dur,

        status,

        name: name,
        email: email,
        phone: phone,
        message: message,

        // optional: nur mitschicken, wenn du es im Event wirklich hast
        // userId: event.userId ?? undefined,
      };

      const res = await fetch(`/api/treatment-requests/${event.id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);

        const msg = data?.issues?.[0]?.message ?? 'Ungültige Eingabe';

        toast.error(msg);
        return;
      }
      onOpenChange(false);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unbekannter Fehler');
      toast.error(e instanceof Error ? e.message : 'Unbekannter Fehler');
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
            <div className="text-xl font-semibold">{event.title}</div>
            <div className="mt-1 text-xs text-neutral-500">
              {`${event.start.toLocaleDateString('de-DE', { dateStyle: 'long' })} ${'\u00A0\u00A0-\u00A0\u00A0'} ${event.start.toLocaleTimeString('de-DE', { timeStyle: 'short' })} - ${event.end.toLocaleTimeString('de-DE', { timeStyle: 'short' })}`}
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
            key={event.id}
            offerings={offerings}
            value={{ offeringId: treatmentOfferingId || null, addonCodes }}
            onChange={({ offeringId, addonCodes }) => {
              setTreatmentOfferingId(offeringId ?? '');
              setAddonCodes(addonCodes ?? []);
            }}
          />
        </div>
        <div className="mt-3 mb-3 grid grid-cols-2 gap-3 text-sm">
          <div className="flex flex-col gap-3">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              label="E-Mail"
            />
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              label="Telefon"
            />
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
        <TextArea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          label="Notiz"
        />

        <div className="flex justify-center my-8 items-center gap-5">
          {statuses.map((s) => (
            <div
              key={s.key}
              onClick={() => setStatus(s.key as TreatmentStatus)}
              className={cn(
                'h-8 w-8 rounded-full cursor-pointer transition hover:opacity-80',
                status === s.key
                  ? 'ring-4 ring-offset-1 ring-offset-black'
                  : '',
              )}
              style={{ backgroundColor: s.color }}
              title={s.labelDe} // optional
            />
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
