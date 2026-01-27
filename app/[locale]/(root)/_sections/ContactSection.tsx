import Contact from './Contact';
import { getTreatmentOfferingsWithAddons } from '@/lib/server/getTreatmentOfferingsWithAddons';

const ContactSection = async () => {
  const offerings = await getTreatmentOfferingsWithAddons();
  console.log('Offerings with addons:', offerings);
  return (
    <div>
      <Contact offerings={offerings} />
    </div>
  );
};
export default ContactSection;
