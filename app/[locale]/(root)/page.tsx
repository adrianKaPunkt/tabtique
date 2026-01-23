import HeroSection from './_sections/HeroSection';
import TreatmentSection from './_sections/TreatmentSection';
import AboutSection from './_sections/AboutSection';
import Contact from './_sections/Contact';
import Navbar from '../Navbar';

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <div className="h-16 lg:h-20"></div>
        <HeroSection />
        <TreatmentSection />
        <AboutSection />
        <Contact />
      </main>
    </div>
  );
}
