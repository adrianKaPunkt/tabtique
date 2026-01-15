import TreatmentCard from '@/components/TreatmentCard';

const TreatmentSection = () => {
  return (
    <section className="my-15 w-[90%] mx-auto">
      <div className="relative text-center">
        <div className="absolute top-4 border-b border w-full -z-10"></div>
        <div className="flex justify-center">
          <h2 className="font-cinzel text-4xl bg-white w-fit px-5">
            BEHANDLUNGEN
          </h2>
        </div>
      </div>
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
