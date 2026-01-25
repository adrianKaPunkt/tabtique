import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import useTreatmentStore from '@/store/treatment-store';
import { Treatment } from '@/lib/types';
import { useTranslations } from 'next-intl';

type TreatmentPickerProps = {
  onSelect?: () => void;
  error?: string;
};

const TreatmentPicker = ({ onSelect, error }: TreatmentPickerProps) => {
  const t = useTranslations('form');
  const treatment = useTreatmentStore((state) => state.treatment);
  const setTreatment = useTreatmentStore((state) => state.setTreatment);

  const handlePick = (key: Treatment) => {
    setTreatment(key);
    onSelect?.();
  };

  return (
    <div>
      <div className="flex justify-between mt-7 mb-3 w-70 mx-auto">
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
      <div>
        {error ? (
          <p
            className="text-center text-xs font-light"
            style={{ color: 'red' }}>
            {t(error)}
          </p>
        ) : (
          <p className="text-center text-sm font-light">
            {treatment ? t(`selected.treatment.${treatment}`) : ''}
          </p>
        )}
      </div>
    </div>
  );
};
export default TreatmentPicker;
