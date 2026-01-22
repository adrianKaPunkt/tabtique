import Image from 'next/image';
import { TreatmentModal } from './TreatmentModal';

interface TreatmentCardProps {
  image: string;
  title: string;
  text: string;
  modalText?: string;
  modalDescription?: string;
  modalSuitable?: string;
}

const TreatmentCard = ({
  image,
  title,
  text,
  modalText,
  modalDescription,
  modalSuitable,
}: TreatmentCardProps) => {
  return (
    <div className="h-full cursor-pointer rounded-lg overflow-hidden shadow-lg grayscale-100 hover:grayscale-0 transition-all duration-500">
      <Image src={image} alt="" width={300} height={400} className="w-full" />
      <div className="h-full flex flex-col items-center p-7 text-center">
        <h3 className="mt-3 text-center font-cinzel text-2xl">{title}</h3>
        <p className="my-7 font-light">{text}</p>
        <TreatmentModal
          title={title}
          text={modalText}
          description={modalDescription}
          suitable={modalSuitable}
        />
      </div>
    </div>
  );
};
export default TreatmentCard;
