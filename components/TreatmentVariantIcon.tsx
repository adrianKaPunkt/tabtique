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
      className="rounded-full border border-gray-300 w-13 h-13 flex items-center justify-center cursor-pointer"
      onClick={() => handleVariantPick(variant)}>
      <p
        className={cn(
          treatmentVariant === variant ? 'font-medium' : 'font-light',
        )}>
        {variant.toUpperCase()}
      </p>
    </div>
  );
};
export default TreatmentVariantIcon;
