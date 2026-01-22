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
      <header className="fixed bg-white w-full mx-auto p-6 z-50 shadow-xl">
        <nav className="flex justify-between items-center w-[90%] xl:w-300 mx-auto">
          <TabiqueLogo className="fill-gray-700 w-50" />
          <div>
            <LanguageSwitcher />
          </div>
          <CiMenuBurger size={30} className="text-gray-700 cursor-pointer" />
        </nav>
      </header>
      <main>
        <div className="h-20"></div>
        <HeroSection />
        <TreatmentSection />
        <AboutSection />
        <Contact />
      </main>
    </div>
  );
}
