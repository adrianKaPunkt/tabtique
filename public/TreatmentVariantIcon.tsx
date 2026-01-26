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
    <p
      className={cn(
        'cursor-pointer',
        treatmentVariant === variant ? 'font-medium' : 'font-light',
      )}
      onClick={() => handleVariantPick(variant)}>
      {variant.toUpperCase()}
    </p>
  );
};
export default TreatmentVariantIcon;
