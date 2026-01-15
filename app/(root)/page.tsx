import TabiqueLogo from '@/public/TabiqueLogo';
import HeroSection from './_sections/HeroSection';
import TreatmentSection from './_sections/TreatmentSection';

export default function Home() {
  return (
    <div>
      <header className="flex p-6">
        <TabiqueLogo className="fill-gray-700 w-50" />
      </header>
      <main>
        <HeroSection />
        <TreatmentSection />
      </main>
    </div>
  );
}
