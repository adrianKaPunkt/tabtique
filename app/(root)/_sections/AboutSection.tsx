import Headline from '@/components/Headline';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section id="about" className="my-15 w-[90%] mx-auto">
      <Headline title="Über Tabtique" />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 w-[90%] md:max-w-300 mx-auto">
        <div>
          <Image
            src="/profile.jpg"
            alt="Tabtique"
            width={300}
            height={400}
            className="w-full"
          />
        </div>
        <div className="px-15 pt-15 md:py-2 flex items-center">
          <ul className="">
            <li className="leading-7 mb-4">
              Internationale Expertise trifft koreanische Hautphilosophie.
            </li>
            <li className="leading-7 mb-4">
              TABTIQUE ist spezialisiert auf koreanisch inspirierte
              Facial-Behandlungen mit Fokus auf Hautgesundheit, nachhaltige
              Ergebnisse und präzise Wirkstoffarbeit.
            </li>
            <li className="leading-7 mb-4">
              Meine Ausbildung in koreanischen Facial-Techniken bildet die
              Grundlage jeder Behandlung – kombiniert mit moderner Hautanalyse,
              klaren Behandlungsprotokollen und individueller Anpassung.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
