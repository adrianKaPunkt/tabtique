import { cn } from '@/lib/utils';
import AquafacialIcon from '@/public/AquafacialIcon';
import MicroneedlingIcon from '@/public/MicroneedlingIcon';
import SignatureIcon from '@/public/SignatureIcon';
import UltimateIcon from '@/public/UltimateIcon';
import useTreatmentStore from '@/store/treatment-store';

const TreatmentPicker = () => {
  const treatment = useTreatmentStore((state) => state.treatment);
  const setTreatment = useTreatmentStore((state) => state.setTreatment);
  return (
    <>
      <SignatureIcon
        className={cn(
          'w-10 h-10 cursor-pointer transition-[fill] duration-700',
          treatment === 'signature' ? 'fill-gray-700' : 'fill-gray-300',
        )}
        onClick={() => {
          setTreatment('signature');
        }}
      />
      <AquafacialIcon
        className={cn(
          'w-10 h-10 cursor-pointer transition-[fill] duration-700',
          treatment === 'aquafacial' ? 'fill-gray-700' : 'fill-gray-300',
        )}
        onClick={() => {
          setTreatment('aquafacial');
        }}
      />
      <MicroneedlingIcon
        className={cn(
          'w-10 h-10 cursor-pointer transition-[fill] duration-700',
          treatment === 'microneedling' ? 'fill-gray-700' : 'fill-gray-300',
        )}
        onClick={() => {
          setTreatment('microneedling');
        }}
      />
      <UltimateIcon
        className={cn(
          'w-10 h-10 cursor-pointer transition-[fill] duration-700',
          treatment === 'ultimate' ? 'fill-gray-700' : 'fill-gray-300',
        )}
        onClick={() => {
          setTreatment('ultimate');
        }}
      />
    </>
  );
};
export default TreatmentPicker;
