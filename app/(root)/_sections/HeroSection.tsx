import Button from '@/components/Button';
import Logo from '@/public/Logo';
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
      <div className="flex relative flex-col justify-between items-center h-105">
        <div className="flex flex-col items-center">
          <Logo className="fill-white w-12" />
          <TabiqueLogo className="fill-white w-75 lg:w-130" />
        </div>
        <div className="text-white text-xl font-light">
          <p>Advanced Korean Facial Treatments</p>
          <p className="mt-2">Frankfurt am Main</p>
        </div>
        <Button text="Termin vereinbaren" />
      </div>
    </section>
  );
};
export default HeroSection;
