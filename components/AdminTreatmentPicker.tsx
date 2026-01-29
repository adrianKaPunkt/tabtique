'use client';

import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import { useEffect, useMemo, useState } from 'react';

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
  resetKey?: string;
};

export function AdminTreatmentPicker({
  offerings,
  value,
  onChange,
  resetKey,
}: {
  offerings: TreatmentOfferingDTO[];
  value: AdminTreatmentPickerValue;
  onChange: (next: AdminTreatmentPickerValue) => void;
  resetKey: string; // event.id
}) {
  function normalizeTreatment(code: string): Treatment | null {
    const v = code.toLowerCase();
    if (
      v === 'signature' ||
      v === 'microneedling' ||
      v === 'aquafacial' ||
      v === 'ultimate'
    ) {
      return v;
    }
    return null;
  }

  const offeringFromValue = useMemo(() => {
    if (!value.offeringId) return undefined;
    return offerings.find((o) => o.offeringId === value.offeringId);
  }, [offerings, value.offeringId]);

  // UI state + "owner"
  const [uiOwner, setUiOwner] = useState<string | null>(null);
  const [treatmentUi, setTreatmentUi] = useState<Treatment | null>(null);
  const [variantUi, setVariantUi] = useState<string | null>(null);
  const [addonCodesUi, setAddonCodesUi] = useState<string[]>([]);

  const uiIsActive = uiOwner === resetKey;

  const selectedTreatment =
    (uiIsActive ? treatmentUi : null) ??
    (offeringFromValue
      ? normalizeTreatment(offeringFromValue.treatmentCode)
      : null) ??
    null;

  const selectedVariant =
    (uiIsActive ? variantUi : null) ?? offeringFromValue?.variantCode ?? null;

  const variantsForTreatment = useMemo(() => {
    if (!selectedTreatment) return [];
    const set = new Set(
      offerings
        .filter(
          (o) => normalizeTreatment(o.treatmentCode) === selectedTreatment,
        )
        .map((o) => o.variantCode),
    );
    return Array.from(set);
  }, [offerings, selectedTreatment]);

  const selectedOffering = useMemo(() => {
    if (!selectedTreatment || !selectedVariant) return undefined;
    return offerings.find(
      (o) =>
        normalizeTreatment(o.treatmentCode) === selectedTreatment &&
        o.variantCode === selectedVariant,
    );
  }, [offerings, selectedTreatment, selectedVariant]);

  function pickTreatment(next: Treatment) {
    setUiOwner(resetKey);
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
    const base = uiIsActive ? addonCodesUi : (value.addonCodes ?? []);

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
    uiIsActive,
    addonCodesUi,
    value.addonCodes,
    includedAddonCodes,
    selectedOffering,
  ]);

  function pickVariant(nextVariant: string) {
    if (!selectedTreatment) return;

    setUiOwner(resetKey);
    setVariantUi(nextVariant);

    const off = offerings.find(
      (o) =>
        normalizeTreatment(o.treatmentCode) === selectedTreatment &&
        o.variantCode === nextVariant,
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

    setUiOwner(resetKey);

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
      <div className="flex justify-center gap-4">
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
      <div className="mt-3 flex justify-center gap-4">
        {variantsForTreatment.map((v) => {
          const isOn = selectedVariant === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => pickVariant(v)}
              className={cn(
                'h-9 w-9 rounded-full border grid place-items-center text-[10px] transition',
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

      {/* Addon-Buttons */}
      {selectedOffering ? (
        <div className="mt-4 w-full">
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
                    <div>
                      <div className="font-medium">{a.addonLabel}</div>
                      <div className="text-xs text-neutral-500">
                        {a.isIncluded ? 'inklusive' : 'optional'}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-500 text-right">
                    <div>{a.priceDeltaCents / 100} €</div>
                    <div>{a.durationDeltaMin} min</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {/* Info (optional) */}
      <div style={{ marginTop: 12, opacity: 0.8 }}>
        {selectedOffering ? (
          <div>
            {selectedOffering.treatmentLabel} –{' '}
            {selectedOffering.variantLabel}{' '}
          </div>
        ) : null}
      </div>
    </div>
  );
}
