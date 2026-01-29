'use client';

import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import { useMemo, useState } from 'react';

type Treatment = 'signature' | 'microneedling' | 'aquafacial' | 'ultimate';

export type OfferingAddonDTO = {
  addonId: string;
  addonCode: string;
  addonLabel: string;
  isIncluded: boolean;
  isOptional: boolean;
  priceDeltaCents: number;
  durationDeltaMin: number;
};

export type TreatmentOfferingDTO = {
  offeringId: string;
  treatmentCode: string;
  treatmentLabel: string;
  variantCode: string;
  variantLabel: string;
  priceCents: number;
  durationMin: number;
  addons: OfferingAddonDTO[];
};

export type AdminTreatmentPickerValue = {
  offeringId: string | null;
  addonCodes?: string[];
};

export function AdminTreatmentPicker({
  offerings,
  value,
  onChange,
}: {
  offerings: TreatmentOfferingDTO[];
  value: AdminTreatmentPickerValue;
  onChange: (next: AdminTreatmentPickerValue) => void;
}) {
  // UI state: nur das, was der Nutzer gerade auswählt
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [variant, setVariant] = useState<string | null>(null);

  // Wenn offeringId von außen gesetzt ist (Modal öffnet),
  // zeigen wir die dazugehörige Treatment/Variant Auswahl an – OHNE setState.
  const offeringFromValue = useMemo(() => {
    if (!value.offeringId) return undefined;
    return offerings.find((o) => o.offeringId === value.offeringId);
  }, [offerings, value.offeringId]);

  const effectiveTreatment =
    treatment ??
    (offeringFromValue?.treatmentCode as Treatment | undefined) ??
    null;
  const effectiveVariant = variant ?? offeringFromValue?.variantCode ?? null;

  const offeringsForTreatment = useMemo(() => {
    return effectiveTreatment
      ? offerings.filter((o) => o.treatmentCode === effectiveTreatment)
      : [];
  }, [offerings, effectiveTreatment]);

  const variantsForTreatment = useMemo(() => {
    const set = new Set(offeringsForTreatment.map((o) => o.variantCode));
    return Array.from(set);
  }, [offeringsForTreatment]);

  const selectedOffering = useMemo(() => {
    if (!effectiveTreatment || !effectiveVariant) return undefined;
    return offerings.find(
      (o) =>
        o.treatmentCode === effectiveTreatment &&
        o.variantCode === effectiveVariant,
    );
  }, [offerings, effectiveTreatment, effectiveVariant]);

  function pickTreatment(next: Treatment) {
    setTreatment(next);
    setVariant(null);

    // wir "löschen" die offeringId, bis eine Variante gewählt ist
    onChange({ offeringId: null, addonCodes: value.addonCodes ?? [] });
  }

  function pickVariant(nextVariant: string) {
    setVariant(nextVariant);

    const off = offerings.find(
      (o) =>
        o.treatmentCode === effectiveTreatment && o.variantCode === nextVariant,
    );

    onChange({
      offeringId: off?.offeringId ?? null,
      addonCodes: value.addonCodes ?? [],
    });
  }

  return (
    <div>
      {/* Treatment buttons (designst du) */}
      <div className="flex justify-center gap-4">
        <SignatureIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            effectiveTreatment === 'signature'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('signature')}
        />
        <MicroneedlingIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            effectiveTreatment === 'microneedling'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('microneedling')}
        />
        <AquafacialIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            effectiveTreatment === 'aquafacial'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('aquafacial')}
        />
        <UltimateIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            effectiveTreatment === 'ultimate'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('ultimate')}
        />
      </div>

      {/* Variant buttons (designst du) */}
      {effectiveTreatment ? (
        <div style={{ marginTop: 12 }}>
          {variantsForTreatment.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => pickVariant(v)}
              style={{ marginRight: 8 }}>
              {v}
            </button>
          ))}
        </div>
      ) : null}

      {/* Info (optional) */}
      <div style={{ marginTop: 12, opacity: 0.8 }}>
        <div>Selected offeringId: {value.offeringId ?? '—'}</div>
        {selectedOffering ? (
          <div>
            {selectedOffering.treatmentLabel} – {selectedOffering.variantLabel}{' '}
            · {selectedOffering.durationMin} min ·{' '}
            {selectedOffering.priceCents / 100} €
          </div>
        ) : null}
      </div>
    </div>
  );
}
