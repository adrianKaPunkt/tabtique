import TabiqueLogo from '@/public/TabiqueLogo';
import HeroSection from './_sections/HeroSection';
import TreatmentSection from './_sections/TreatmentSection';
import AboutSection from './_sections/AboutSection';
import Contact from './_sections/Contact';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Home() {
  return (
    <div>
      <header className="flex justify-between p-6">
        <TabiqueLogo className="fill-gray-700 w-50" />
        <div>
          <LanguageSwitcher />
        </div>
      </header>
      <main>
        <HeroSection />
        <TreatmentSection />
        <AboutSection />
        <Contact />
      </main>
    </div>
  );
}
