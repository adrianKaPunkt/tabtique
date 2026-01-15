import Headline from '@/components/Headline';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section id="about" className="my-15 w-[90%] mx-auto">
      <Headline title="Über Tabtique" />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
        <div>
          <Image
            src="/profile.jpg"
            alt="Tabtique"
            width={300}
            height={400}
            className="w-full"
          />
        </div>
        <div className="p-8">
          <ul className="">
            <li>Spezialisiert auf Advanced Facials</li>
            <li>Internationale Schulungen</li>
            <li>Klinische Präzision & Individuelle Hautanalyse</li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
