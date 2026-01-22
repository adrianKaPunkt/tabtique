import Headline from '@/components/Headline';
import TreatmentCard from '@/components/TreatmentCard';

const TreatmentSection = () => {
  return (
    <section id="treatment" className="my-25 w-[90%] lg:w-300 mx-auto">
      <Headline title="Behandlungen" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-8 justify-between mt-7">
        <TreatmentCard
          image="/treatment-1.jpg"
          title="SIGNATURE COMBINATION"
          text="Individuell abgestimmte Kombinationen aus modernster Technologie und regenerativer Pflege."
          modalText="Individuell abgestimmte Kombinationen aus modernster Technologie und regenerativer Pflege.
80 Minuten · 175 € – 190 € (je nach Wirkstoff)"
          modalDescription={`Die Signature Combinations verbinden Aquafacial mit Lichttherapie und ausgewählten regenerativen Wirkstoffen.\n\nJede Behandlung wird individuell auf den aktuellen Hautzustand abgestimmt und vereint Reinigung, Aktivierung und Beruhigung zu einer ganzheitlichen Pflege.\n\nWas diese Behandlung besonders macht\n •   Individuelle Kombination aus Technologie und Wirkstoffen\n •   Unterstützung der Hautregeneration und -balance\n •   Sichtbar verfeinerte, ausgeglichene Haut`}
          modalSuitable={`Für Kundinnen, die eine personalisierte Behandlung wünschen und Wert auf nachhaltige Hautgesundheit legen. \n\nHinweise \n •   Persönliche Hautanalyse vor jeder Behandlung\n •   Wirkstoffauswahl individuell\n •   Dermaplaning optional als Add-on`}
        />
        <TreatmentCard
          image="/treatment-2.jpg"
          title="MICRONEEDLING"
          text="Gezielte Regeneration auf medizinisch-ästhetischem Niveau für sichtbar erneuerte Haut."
        />
        <TreatmentCard
          image="/treatment-3.jpg"
          title="AQUAFACIAL"
          text="Tiefenreinigung und intensive Hydration für einen frischen, klaren Glow."
        />
        <TreatmentCard
          image="/treatment-4.jpg"
          title="THE ULTIMATE RITUAL"
          text="Das ganzheitliche Premium-Ritual für maximale Regeneration, Hautstärkung und Ruhe."
        />
      </div>
    </section>
  );
};
export default TreatmentSection;
