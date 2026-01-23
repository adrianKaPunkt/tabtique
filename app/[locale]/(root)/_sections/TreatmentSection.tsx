'use client';

import { useTranslations } from 'next-intl';
import Headline from '@/components/Headline';
import TreatmentCard from '@/components/TreatmentCard';

const TreatmentSection = () => {
  const t = useTranslations('treatment-section');
  return (
    <section
      id="treatments"
      className="my-25 w-[90%] xl:w-300 mx-auto scroll-mt-40">
      <Headline title={t('title')} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 w-full gap-8 justify-between mt-7">
        <TreatmentCard
          image="/treatment-1.jpg"
          title="SIGNATURE COMBINATION"
          text={t('signature.text')}
          modalText={t('signature.modalText')}
          modalDescription={t('signature.modalDescription')}
          modalSuitable={t('signature.modalSuitable')}
        />
        <TreatmentCard
          image="/treatment-2.jpg"
          title="MICRONEEDLING"
          text={t('microneedling.text')}
          modalText={t('microneedling.modalText')}
          modalDescription={t('microneedling.modalDescription')}
          modalSuitable={t('microneedling.modalSuitable')}
        />
        <TreatmentCard
          image="/treatment-3.jpg"
          title="AQUAFACIAL"
          text={t('aquafacial.text')}
          modalText={t('aquafacial.modalText')}
          modalDescription={t('aquafacial.modalDescription')}
          modalSuitable={t('aquafacial.modalSuitable')}
        />
        <div className="lg:col-start-2">
          <TreatmentCard
            image="/treatment-4.jpg"
            title="THE ULTIMATE RITUAL"
            text={t('ultimate.text')}
            modalText={t('ultimate.modalText')}
            modalDescription={t('ultimate.modalDescription')}
            modalSuitable={t('ultimate.modalSuitable')}
          />
        </div>
      </div>
    </section>
  );
};
export default TreatmentSection;
