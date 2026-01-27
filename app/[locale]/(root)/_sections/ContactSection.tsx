import Contact from './Contact';
import { getTreatmentOfferings } from '@/lib/server/getTreatmentOfferings';

const ContactSection = async () => {
  const offerings = await getTreatmentOfferings();
  return (
    <div>
      <Contact offerings={offerings} />
    </div>
  );
};
export default ContactSection;
