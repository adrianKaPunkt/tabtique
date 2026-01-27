import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import useTreatmentStore from '@/store/treatment-store';
import { Treatment, VARIANTS_BY_TREATMENT } from '@/lib/constants/treatments';
import { useTranslations } from 'next-intl';
import TreatmentVariantIcon from '@/components/TreatmentVariantIcon';
import type { TreatmentOfferingDTO } from '@/lib/server/getTreatmentOfferings';

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
  const treatment = useTreatmentStore((state) => state.treatment);
  const treatmentVariant = useTreatmentStore((state) => state.treatmentVariant);
  const setTreatment = useTreatmentStore((state) => state.setTreatment);
  const setTreatmentVariant = useTreatmentStore(
    (state) => state.setTreatmentVariant,
  );
  const clearTreatmentVariant = useTreatmentStore(
    (state) => state.clearTreatmentVariant,
  );

  const handlePick = (key: Treatment) => {
    setTreatment(key);
    clearTreatmentVariant();
    onSelect?.();
  };

  const handleVariantPick = (variant: string) => {
    setTreatmentVariant(variant);
    onSelect?.();
  };

  const variantsForTreatment = (treatmentCode: string) => {
    return offerings
      .filter((offer) => offer.treatmentCode === treatmentCode)
      .map((offer) => offer.variantCode);
  };

  const selectedOffering =
    treatment && treatmentVariant
      ? offerings.find(
          (o) =>
            o.treatmentCode === treatment && o.variantCode === treatmentVariant,
        )
      : undefined;

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
            onClick={() => {
              handlePick('signature');
            }}
          />
          <MicroneedlingIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'microneedling' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => {
              handlePick('microneedling');
            }}
          />
          <AquafacialIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'aquafacial' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => {
              handlePick('aquafacial');
            }}
          />
          <UltimateIcon
            className={cn(
              'w-10 h-10 cursor-pointer transition-[fill] duration-700',
              treatment === 'ultimate' ? 'fill-gray-700' : 'fill-gray-300',
            )}
            onClick={() => {
              handlePick('ultimate');
            }}
          />
        </div>
        {treatment && (
          <div id="treatment-variant-picker" className="w-full">
            <div className="flex gap-7 items-center justify-center">
              {variantsForTreatment(treatment).map((variant) => (
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
        ) : (
          treatment &&
          treatmentVariant && (
            <div className="mt-5">
              <p className="text-center text-sm font-light">
                {t(`selected.treatment.${treatment}`) || ''} +{' '}
                {treatmentVariant.toUpperCase()}
              </p>
              {selectedOffering && (
                <p className="text-center text-xs font-light mt-1">
                  {selectedOffering.durationMin} min ·{' '}
                  {(selectedOffering.priceCents / 100).toFixed(2)} €
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default TreatmentPicker;
