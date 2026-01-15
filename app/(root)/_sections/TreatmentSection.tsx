import Headline from '@/components/Headline';
import TreatmentCard from '@/components/TreatmentCard';

const TreatmentSection = () => {
  return (
    <section id="treatment" className="my-25 w-[90%] lg:w-300 mx-auto">
      <Headline title="Behandlungen" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-8 justify-between mt-7">
        <TreatmentCard
          image="/treatment-1.jpg"
          title="AQUAFACIAL"
          text="Tiefenhydration und Reinigung mit modernster Wasservert-Technologie."
        />
        <TreatmentCard
          image="/treatment-1.jpg"
          title="MICRONEEDLING"
          text="Hautverjüngung und Regeneration durch präzise Microperforationen."
        />
        <TreatmentCard
          image="/treatment-1.jpg"
          title="DERMAPLANING"
          text="Sanftes Peeling für ein seidig glattes Hautbild durch präzises Abtragen von Verhornungen."
        />
      </div>
    </section>
  );
};
export default TreatmentSection;
