import HeroSection from './_sections/HeroSection';
import TreatmentSection from './_sections/TreatmentSection';
import AboutSection from './_sections/AboutSection';
import ContactSection from './_sections/ContactSection';

export default function HomePage() {
  return (
    <div>
      <div className="h-16 lg:h-20"></div>
      <HeroSection />
      <TreatmentSection />
      <AboutSection />
      <ContactSection />
    </div>
  );
}
