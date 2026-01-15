import Button from '@/components/Button';
import TabiqueLogo from '@/public/TabiqueLogo';
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section
      id="hero-section"
      className="relative w-full h-screen overflow-hidden flex justify-center items-center text-center">
      <Image
        src="/hero-image.jpg"
        alt="tabtique-image"
        width={600}
        height={400}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="flex relative flex-col justify-between items-center h-90">
        <TabiqueLogo className="fill-white w-60 lg:w-130" />
        <div className="text-white font-cormorant text-xl">
          <p>Advanced Korean Facial Treatments</p>
          <p className="mt-2">Frankfurt am Main</p>
        </div>
        <Button text="Termin vereinbaren" />
      </div>
    </section>
  );
};
export default HeroSection;
