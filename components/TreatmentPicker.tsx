import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import TreatmentVariantIcon from '@/components/TreatmentVariantIcon';
import useTreatmentStore from '@/store/treatment-store';
import { useTranslations } from 'next-intl';

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

type TreatmentPickerProps = {
  offerings: TreatmentOfferingDTO[];
  onSelect?: () => void;
  errorTreatment?: string;
};

const TreatmentPicker = ({
  offerings,
  onSelect,
  errorTreatment,
}: TreatmentPickerProps) => {
  const t = useTranslations('form');

  const treatment = useTreatmentStore((s) => s.treatment);
  const treatmentVariant = useTreatmentStore((s) => s.treatmentVariant);
  const treatmentOfferingId = useTreatmentStore((s) => s.treatmentOfferingId);

  const selectedAddonCodes = useTreatmentStore((s) => s.selectedAddonCodes);
  const toggleAddonCode = useTreatmentStore((s) => s.toggleAddonCode);
  const clearAddonCodes = useTreatmentStore((s) => s.clearAddonCodes);

  const setTreatment = useTreatmentStore((s) => s.setTreatment);
  const setTreatmentVariant = useTreatmentStore((s) => s.setTreatmentVariant);
  const setTreatmentOfferingId = useTreatmentStore(
    (s) => s.setTreatmentOfferingId,
  );

  const clearTreatmentVariant = useTreatmentStore(
    (s) => s.clearTreatmentVariant,
  );
  const clearTreatmentOfferingId = useTreatmentStore(
    (s) => s.clearTreatmentOfferingId,
  );

  const offeringsForTreatment = treatment
    ? offerings.filter((o) => o.treatmentCode === treatment)
    : [];

  const variantsForTreatment = offeringsForTreatment.map((o) => o.variantCode);

  const selectedOffering =
    treatment && treatmentVariant
      ? offerings.find(
          (o) =>
            o.treatmentCode === treatment && o.variantCode === treatmentVariant,
        )
      : undefined;

  const formatEUR = (cents: number) =>
    (cents / 100).toFixed(2).replace('.', ',') + ' €';

  const handlePick = (key: Treatment) => {
    setTreatment(key);

    clearTreatmentVariant();
    clearTreatmentOfferingId();
    clearAddonCodes();

    onSelect?.();
  };

  const handleVariantPick = (variant: string) => {
    setTreatmentVariant(variant);

    const off = offerings.find(
      (o) => o.treatmentCode === treatment && o.variantCode === variant,
    );

    setTreatmentOfferingId(off?.offeringId ?? null);
    clearAddonCodes();

    onSelect?.();
  };

  // ---- Addons + totals (derived) ----
  const availableAddons = selectedOffering?.addons ?? [];
  const includedAddons = availableAddons.filter((a) => a.isIncluded);
  const optionalAddons = availableAddons.filter(
    (a) => a.isOptional && !a.isIncluded,
  );

  const includedDeltaCents = includedAddons.reduce(
    (sum, a) => sum + a.priceDeltaCents,
    0,
  );
  const includedDeltaMin = includedAddons.reduce(
    (sum, a) => sum + a.durationDeltaMin,
    0,
  );

  const selectedOptionalAddons = optionalAddons.filter((a) =>
    selectedAddonCodes.includes(a.addonCode),
  );

  const optionalDeltaCents = selectedOptionalAddons.reduce(
    (sum, a) => sum + a.priceDeltaCents,
    0,
  );
  const optionalDeltaMin = selectedOptionalAddons.reduce(
    (sum, a) => sum + a.durationDeltaMin,
    0,
  );

  const totalPriceCents =
    (selectedOffering?.priceCents ?? 0) +
    includedDeltaCents +
    optionalDeltaCents;
  const totalDurationMin =
    (selectedOffering?.durationMin ?? 0) + includedDeltaMin + optionalDeltaMin;

  return (
    <div>
      <div className="flex flex-col gap-1">
        <div
          id="treatment-picker"
          className={cn('flex justify-between mt-7 mb-3 w-70 mx-auto')}>
          <SignatureIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'signature' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => handlePick('signature')}
          />
          <MicroneedlingIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'microneedling' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => handlePick('microneedling')}
          />
          <AquafacialIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'aquafacial' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => handlePick('aquafacial')}
          />
          <UltimateIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'ultimate' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => handlePick('ultimate')}
          />
        </div>

        {treatment && (
          <div id="treatment-variant-picker" className="w-full">
            <div className="flex gap-7 items-center justify-center">
              {variantsForTreatment.map((variant) => (
                <TreatmentVariantIcon
                  key={variant}
                  variant={variant}
                  treatmentVariant={treatmentVariant ?? ''}
                  handleVariantPick={handleVariantPick}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3">
        {errorTreatment ? (
          <p className="text-center text-xs font-light text-red-500">
            {t(errorTreatment)}
          </p>
        ) : selectedOffering ? (
          <div className="text-center font-light">
            <p className="text-sm">
              {selectedOffering.treatmentLabel} +{' '}
              {selectedOffering.variantLabel}
            </p>

            {/* Add-ons */}
            {availableAddons.length > 0 && (
              <div className="mt-3 flex flex-col gap-2 items-center">
                {/* Included */}
                {includedAddons.map((a) => (
                  <p key={a.addonCode} className="text-xs">
                    {a.addonLabel}{' '}
                    <span className="opacity-70">(inklusive)</span>
                  </p>
                ))}

                {/* Optional */}
                {optionalAddons.map((a) => (
                  <label
                    key={a.addonCode}
                    className="text-xs flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedAddonCodes.includes(a.addonCode)}
                      onChange={() => toggleAddonCode(a.addonCode)}
                    />
                    <span>
                      {a.addonLabel}{' '}
                      <span className="opacity-70">
                        (+{formatEUR(a.priceDeltaCents)})
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            )}

            {/* Totals */}
            <p className="text-xs mt-3">
              {totalDurationMin} min · {formatEUR(totalPriceCents)}
            </p>

            {/* Optional debug */}
            {/* <p className="text-[10px] mt-1 opacity-60">
              offeringId: {treatmentOfferingId}
            </p> */}
          </div>
        ) : (
          treatment &&
          treatmentVariant && (
            <p className="text-center text-xs font-light text-red-500">
              Diese Kombination ist nicht verfügbar.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default TreatmentPicker;
