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
              TABTIQUE steht für moderne Hautpflege auf medizinisch-ästhetischem
              Niveau – reduziert, präzise und bewusst ausgewählt. Im Mittelpunkt
              steht nicht Quantität, sondern Qualität: individuelle
              Behandlungen, performed mit höchster Sorgfalt, fundiertem Wissen
              und einem tiefen Verständnis für Hautgesundheit.
            </li>
            <li className="leading-7 mb-4">
              Alle Treatments basieren auf professionellen Schulungen und
              koreanisch inspirierten Methoden, mit Fokus auf Aquafacial,
              Microneedling und gezielten Hautbehandlungen zur Regeneration,
              Verfeinerung und Revitalisierung der Haut.
            </li>
            <li className="leading-7 mb-4">
              TABTIQUE verbindet technisches Know-how mit einem ruhigen,
              geschützten Raum – für Ergebnisse, die sichtbar sind, und ein
              Erlebnis, das wirkt. Jede Behandlung ist bewusst reduziert, klar
              strukturiert und auf die Hautbedürfnisse abgestimmt.
            </li>
            <li className="leading-7 mb-4">
              Luxus bei TABTIQUE bedeutet: Zeit, Präzision und Vertrauen.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;
