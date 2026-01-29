'use client';

import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import { useMemo, useState } from 'react';
import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferingsWithAddons';

type AdminTreatmentPickerValue = {
  offeringId: string | null;
  addonCodes?: string[];
};

type Treatment = TreatmentOfferingDTO['treatmentCode'];

interface AdminTreatmentPickerProps {
  offerings: TreatmentOfferingDTO[]; // getTreatmentOfferingsWithAddons()
  value: AdminTreatmentPickerValue;
  onChange: (next: AdminTreatmentPickerValue) => void;
}

const AdminTreatmentPicker = ({
  offerings,
  value,
  onChange,
}: AdminTreatmentPickerProps) => {
  //
  // sucht nach dem Offering anhand der value.offeringId
  const offeringFromValue = useMemo(() => {
    if (!value.offeringId) return undefined;
    return offerings.find((o) => o.offeringId === value.offeringId);
  }, [offerings, value.offeringId]);
  //

  const [treatmentUi, setTreatmentUi] = useState<Treatment | null>(null);
  const [variantUi, setVariantUi] = useState<string | null>(null);
  const [addonCodesUi, setAddonCodesUi] = useState<string[]>([]);

  const isDerived = value.offeringId != null;
  const selectedTreatment =
    (isDerived ? offeringFromValue?.treatmentCode : treatmentUi) ?? null;
  const selectedVariant =
    (isDerived ? offeringFromValue?.variantCode : variantUi) ?? null;

  const variantsForTreatment = useMemo(() => {
    if (!selectedTreatment) return [];
    const set = new Set(
      offerings
        .filter((o) => o.treatmentCode === selectedTreatment)
        .map((o) => o.variantCode),
    );
    return Array.from(set);
  }, [offerings, selectedTreatment]);

  const selectedOffering = useMemo(() => {
    if (!selectedTreatment || !selectedVariant) return undefined;
    return offerings.find(
      (o) =>
        o.treatmentCode === selectedTreatment &&
        o.variantCode === selectedVariant,
    );
  }, [offerings, selectedTreatment, selectedVariant]);

  function pickTreatment(next: Treatment) {
    setTreatmentUi(next);
    setVariantUi(null);
    setAddonCodesUi([]);
    onChange({ offeringId: null, addonCodes: [] });
  }

  const includedAddonCodes = useMemo(() => {
    if (!selectedOffering) return [];
    return selectedOffering.addons
      .filter((a) => a.isIncluded)
      .map((a) => a.addonCode);
  }, [selectedOffering]);

  const selectedAddonCodes = useMemo(() => {
    const base = isDerived ? (value.addonCodes ?? []) : addonCodesUi;

    // immer included erzwingen
    const merged = new Set([...base, ...includedAddonCodes]);

    // optional: nur Codes behalten, die es beim Offering überhaupt gibt
    if (selectedOffering) {
      const allowed = new Set(selectedOffering.addons.map((a) => a.addonCode));
      for (const c of Array.from(merged)) {
        if (!allowed.has(c)) merged.delete(c);
      }
    }

    return Array.from(merged);
  }, [
    isDerived,
    addonCodesUi,
    value.addonCodes,
    includedAddonCodes,
    selectedOffering,
  ]);

  function pickVariant(nextVariant: string) {
    if (!selectedTreatment) return;
    setVariantUi(nextVariant);

    const off = offerings.find(
      (o) =>
        o.treatmentCode === selectedTreatment && o.variantCode === nextVariant,
    );
    const nextAddonCodes = off
      ? off.addons.filter((a) => a.isIncluded).map((a) => a.addonCode)
      : [];

    setAddonCodesUi(nextAddonCodes);
    onChange({
      offeringId: off?.offeringId ?? null,
      addonCodes: nextAddonCodes,
    });
  }

  function toggleAddon(code: string) {
    if (!selectedOffering) return;
    const isIncluded = selectedOffering.addons.some(
      (a) => a.addonCode === code && a.isIncluded,
    );
    if (isIncluded) return; // included nicht änderbar

    const current = new Set(selectedAddonCodes);
    if (current.has(code)) current.delete(code);
    else current.add(code);

    // included wieder erzwingen
    for (const c of includedAddonCodes) current.add(c);

    const next = Array.from(current);
    setAddonCodesUi(next);
    onChange({ offeringId: selectedOffering.offeringId, addonCodes: next });
  }

  return (
    <div>
      {/* Treatment-Buttons */}
      <div className="flex justify-center gap-6">
        <SignatureIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            selectedTreatment === 'signature'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('signature')}
        />
        <MicroneedlingIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            selectedTreatment === 'microneedling'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('microneedling')}
        />
        <AquafacialIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            selectedTreatment === 'aquafacial'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('aquafacial')}
        />
        <UltimateIcon
          className={cn(
            'w-9 h-9 cursor-pointer transition-[fill] duration-700',
            selectedTreatment === 'ultimate'
              ? 'fill-gray-700'
              : 'fill-gray-300',
          )}
          onClick={() => pickTreatment('ultimate')}
        />
      </div>

      {/* Variant-Buttons */}
      <div className="mt-5 flex justify-center gap-4">
        {variantsForTreatment.map((v) => {
          const isOn = selectedVariant === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => pickVariant(v)}
              className={cn(
                'h-12 w-12 rounded-full border grid place-items-center text-[10px] transition cursor-pointer',
                isOn
                  ? 'border-neutral-900 bg-neutral-900 text-white'
                  : 'border-neutral-300 text-neutral-600 hover:border-neutral-400',
              )}
              aria-pressed={isOn}>
              {v.toUpperCase()}
            </button>
          );
        })}
      </div>

      {/* Info (optional) */}
      <div className="mt-4">
        {selectedOffering ? (
          <div className="font-light text-xs text-center">
            {selectedOffering.treatmentLabel} – {selectedOffering.variantLabel}{' '}
            <p>
              {selectedOffering.priceCents / 100} € -{' '}
              {selectedOffering.durationMin} min
            </p>
          </div>
        ) : null}
      </div>

      {/* Addon-Buttons */}
      <div>
        {selectedOffering ? (
          <div className="mt-4 w-75">
            <div className="space-y-2">
              {selectedOffering.addons.map((a) => {
                const checked = selectedAddonCodes.includes(a.addonCode);
                const disabled = a.isIncluded;

                return (
                  <label
                    key={a.addonId}
                    className={cn(
                      'flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm',
                      disabled ? 'opacity-70' : 'cursor-pointer',
                    )}>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={() => toggleAddon(a.addonCode)}
                      />
                      <div className="pl-2">
                        <div className="text-xs font-medium">
                          {a.addonLabel}
                        </div>
                        <div className="text-xs text-neutral-500">
                          {a.isIncluded ? 'inklusive' : 'optional'}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-500 text-right">
                      <div>+ {a.priceDeltaCents / 100} €</div>
                      <div>+ {a.durationDeltaMin} min</div>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AdminTreatmentPicker;
