
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HeroSecondary from '@/components/HeroSecondary';
import HeroTertiary from '@/components/HeroTertiary';
import HeroQuaternary from '@/components/HeroQuaternary';
import HeroQuinary from '@/components/HeroQuinary';
import HeroSixth from '@/components/HeroSixth';
import Features from '@/components/Features';
import Modules from '@/components/Modules';
import Partnerships from '@/components/Partnerships';
import Partner from '@/components/Partner';
import Footer from '@/components/Footer';
import SectionEditor from '@/components/SectionEditor';
import BookingSection from '@/components/BookingSection';
import { useSectionConfig } from '@/contexts/SectionConfigContext';

interface SectionData {
  id: string;
  component: React.ReactNode;
  defaultOrder: number;
}

interface SectionVisibility {
  [key: string]: boolean;
}

interface ElementVisibility {
  [key: string]: boolean;
}

interface SectionOrder {
  [key: string]: number;
}

const Index = () => {
  const { sectionVisibility, sectionOrder, updateSectionVisibility, updateSectionOrder } = useSectionConfig();
  const [elementVisibility, setElementVisibility] = useState<ElementVisibility>({});
  const [isLoading, setIsLoading] = useState(false);

  const allSections: SectionData[] = [
    { id: 'hero', component: <Hero />, defaultOrder: 0 },
    { id: 'hero-secondary', component: <HeroSecondary />, defaultOrder: 1 },
    { id: 'hero-tertiary', component: <HeroTertiary />, defaultOrder: 2 },
    { id: 'features', component: <Features />, defaultOrder: 3 },
    { id: 'hero-quaternary', component: <HeroQuaternary />, defaultOrder: 4 },
    { id: 'modules', component: <Modules />, defaultOrder: 5 },
    { id: 'booking', component: <BookingSection />, defaultOrder: 6 },
    { id: 'hero-quinary', component: <HeroQuinary />, defaultOrder: 7 },
    { id: 'hero-sixth', component: <HeroSixth />, defaultOrder: 8 },
    { id: 'partnerships', component: <Partnerships />, defaultOrder: 9 },
    { id: 'partner', component: <Partner />, defaultOrder: 10 },
    { id: 'footer', component: <Footer />, defaultOrder: 11 }
  ];

  // No Supabase loading needed - data comes from config file
  useEffect(() => {
    // Add animation observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-right').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);


  const sortedSections = [...allSections].sort((a, b) => {
    const orderA = sectionOrder[a.id] !== undefined ? sectionOrder[a.id] : a.defaultOrder;
    const orderB = sectionOrder[b.id] !== undefined ? sectionOrder[b.id] : b.defaultOrder;
    return orderA - orderB;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carmen-blue"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <SectionEditor 
        allSections={allSections} 
        sectionVisibility={sectionVisibility}
        elementVisibility={elementVisibility}
        sectionOrder={sectionOrder}
        onSectionVisibilityChange={updateSectionVisibility}
        onElementVisibilityChange={(elementId, isVisible) => {
          setElementVisibility(prev => ({ ...prev, [elementId]: isVisible }));
        }}
        onSectionOrderChange={updateSectionOrder}
      />
      <main className="flex-grow">
        {sortedSections.map((section) => {
          const isVisible = sectionVisibility[section.id] !== undefined 
            ? sectionVisibility[section.id] 
            : true;
            
          if (!isVisible && section.id !== 'footer') return null;
          
          return (
            <div 
              key={section.id}
              data-section-id={section.id} 
              data-section-order={sectionOrder[section.id] || section.defaultOrder}
            >
              {section.component}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Index;
