import Image from 'next/image';
import Button from './Button';

interface TreatmentCardProps {
  image: string;
  title: string;
  text: string;
}

const TreatmentCard = ({ image, title, text }: TreatmentCardProps) => {
  return (
    <div className="cursor-pointer rounded-lg overflow-hidden shadow-lg grayscale-100 hover:grayscale-0 transition-all duration-500">
      <Image src={image} alt="" width={300} height={400} className="w-full" />
      <div className="flex flex-col items-center p-7 text-center">
        <h3 className="mt-3 text-center font-cinzel text-2xl">{title}</h3>
        <p className="my-7 font-light">{text}</p>
        <Button text="Behandlung ansehen" width={300} />
      </div>
    </div>
  );
};
export default TreatmentCard;
