import { cn } from '@/lib/utils';

interface TreatmentVariantIconProps {
  variant: string;
  treatmentVariant?: string;
  handleVariantPick: (variant: string) => void;
}

const TreatmentVariantIcon = ({
  variant,
  treatmentVariant,
  handleVariantPick,
}: TreatmentVariantIconProps) => {
  return (
    <div
      className={cn(
        treatmentVariant === variant ? 'border-gray-500' : 'border-gray-300',
        'rounded-full border w-13 h-13 flex items-center justify-center cursor-pointer text-gray-300',
      )}
      onClick={() => handleVariantPick(variant)}>
      <p
        className={cn(
          treatmentVariant === variant
            ? 'font-normal text-gray-500'
            : 'font-light',
        )}>
        {variant.toUpperCase()}
      </p>
    </div>
  );
};
export default TreatmentVariantIcon;
