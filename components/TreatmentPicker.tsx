import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import TreatmentVariantIcon from '@/components/TreatmentVariantIcon';
import useTreatmentStore from '@/store/treatment-store';
import { useTranslations } from 'next-intl';
import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferings';

type Treatment = 'signature' | 'microneedling' | 'aquafacial' | 'ultimate';

type TreatmentPickerProps = {
  offerings: TreatmentOfferingDTO[];
  onSelect?: () => void;
  errorTreatment?: string;
  errorTreatmentVariant?: string;
};

const TreatmentPicker = ({
  offerings,
  onSelect,
  errorTreatment,
  errorTreatmentVariant,
}: TreatmentPickerProps) => {
  const t = useTranslations('form');

  const treatment = useTreatmentStore((s) => s.treatment);
  const treatmentVariant = useTreatmentStore((s) => s.treatmentVariant);
  const treatmentOfferingId = useTreatmentStore((s) => s.treatmentOfferingId);

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

  // Offerings for currently selected treatment
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

  const handlePick = (key: Treatment) => {
    setTreatment(key);

    // reset dependent selections
    clearTreatmentVariant();
    clearTreatmentOfferingId();

    onSelect?.();
  };

  const handleVariantPick = (variant: string) => {
    setTreatmentVariant(variant);

    // find offering id for (treatment + variant)
    const off = offerings.find(
      (o) => o.treatmentCode === treatment && o.variantCode === variant,
    );

    setTreatmentOfferingId(off?.offeringId ?? null);

    onSelect?.();
  };

  const formatEUR = (cents: number) =>
    (cents / 100).toFixed(2).replace('.', ',') + ' €';

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
        {errorTreatment || errorTreatmentVariant ? (
          <p className="text-center text-xs font-light text-red-500">
            {errorTreatment ? t(errorTreatment) : t(errorTreatmentVariant!)}
          </p>
        ) : selectedOffering ? (
          <div className="text-center font-light">
            <p className="text-sm">
              {selectedOffering.treatmentLabel} +{' '}
              {selectedOffering.variantLabel}
            </p>
            <p className="text-xs mt-1">
              {selectedOffering.durationMin} min ·{' '}
              {formatEUR(selectedOffering.priceCents)}
            </p>

            {/* Optional: helps debugging / confidence */}
            {/* <p className="text-[10px] mt-1 opacity-60">
              offeringId: {treatmentOfferingId}
            </p> */}
          </div>
        ) : treatment && treatmentVariant ? (
          // Fallback if something is inconsistent
          <p className="text-center text-xs font-light text-red-500">
            Diese Kombination ist nicht verfügbar.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default TreatmentPicker;
