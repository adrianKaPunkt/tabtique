import TabiqueLogo from '@/public/TabiqueLogo';
import { CiMenuBurger } from 'react-icons/ci';
import HeroSection from './_sections/HeroSection';
import TreatmentSection from './_sections/TreatmentSection';
import AboutSection from './_sections/AboutSection';
import Contact from './_sections/Contact';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function Home() {
  return (
    <div>
      <header className="flex justify-between items-center p-6">
        <TabiqueLogo className="fill-gray-700 w-50" />
        <div>
          <LanguageSwitcher />
        </div>
        <CiMenuBurger size={30} className="text-gray-700 cursor-pointer" />
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
