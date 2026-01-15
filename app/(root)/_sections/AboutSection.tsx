import Headline from '@/components/Headline';
import Image from 'next/image';

const AboutSection = () => {
  return (
    <section id="about" className="my-15 w-[90%] lg:w-300 mx-auto">
      <Headline title="Über Tabtique" />
      <div className="grid grid-cols-1 md:grid-cols-2 mt-8 md:max-w-300 mx-auto gap-10">
        <div>
          <Image
            src="/profile.jpg"
            alt="Tabtique"
            width={300}
            height={400}
            className="w-full"
          />
        </div>
        <div className="flex items-center font-light px-4">
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
            <li className="leading-7 mb-4">
              Für Haut, die nicht nur gepflegt aussieht, sondern gesund ist.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
