import HeroSection from './_sections/HeroSection';
import TreatmentSection from './_sections/TreatmentSection';
import AboutSection from './_sections/AboutSection';
import Contact from './_sections/Contact';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div>
      <div className="h-16 lg:h-20"></div>
      <HeroSection />
      <TreatmentSection />
      <AboutSection />
      <Contact />
    </div>
  );
}
