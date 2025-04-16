
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import HeroSecondary from '@/components/HeroSecondary';
import HeroTertiary from '@/components/HeroTertiary';
import HeroQuaternary from '@/components/HeroQuaternary';
import HeroQuinary from '@/components/HeroQuinary';
import Features from '@/components/Features';
import Modules from '@/components/Modules';
import Partnerships from '@/components/Partnerships';
import Partner from '@/components/Partner';
import Footer from '@/components/Footer';
import SectionEditor from '@/components/SectionEditor';
import BookingSection from '@/components/BookingSection';
import { supabase } from '@/integrations/supabase/client';

interface SectionData {
  id: string;
  component: React.ReactNode;
  defaultOrder: number;
}

interface SectionVisibility {
  [key: string]: boolean;
}

interface SectionOrder {
  [key: string]: number;
}

const Index = () => {
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({});
  const [sectionOrder, setSectionOrder] = useState<SectionOrder>({});
  const [isLoading, setIsLoading] = useState(true);

  // Define all sections with their default order
  const allSections: SectionData[] = [
    { id: 'hero', component: <Hero />, defaultOrder: 0 },
    { id: 'hero-secondary', component: <HeroSecondary />, defaultOrder: 1 },
    { id: 'hero-tertiary', component: <HeroTertiary />, defaultOrder: 2 },
    { id: 'features', component: <Features />, defaultOrder: 3 },
    { id: 'hero-quaternary', component: <HeroQuaternary />, defaultOrder: 4 },
    { id: 'modules', component: <Modules />, defaultOrder: 5 },
    { id: 'booking', component: <BookingSection />, defaultOrder: 6 },
    { id: 'hero-quinary', component: <HeroQuinary />, defaultOrder: 7 },
    { id: 'partnerships', component: <Partnerships />, defaultOrder: 8 },
    { id: 'partner', component: <Partner />, defaultOrder: 9 }
  ];

  // Load settings from the database on component mount
  useEffect(() => {
    const loadVisibilitySettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('landing_page_settings')
          .select('section_visibility, section_order')
          .eq('id', 1)
          .single();
        
        if (error) {
          console.error('Error loading visibility settings:', error);
          return;
        }

        if (data) {
          console.log('Loaded settings:', data);
          setSectionVisibility(data.section_visibility);
          
          // If section_order exists and has values, use them; otherwise use default order
          if (data.section_order && Object.keys(data.section_order).length > 0) {
            setSectionOrder(data.section_order);
          } else {
            // Create default order object
            const defaultOrder = allSections.reduce((acc, section) => {
              acc[section.id] = section.defaultOrder;
              return acc;
            }, {} as SectionOrder);
            setSectionOrder(defaultOrder);
          }
        }
      } catch (error) {
        console.error('Error in loadVisibilitySettings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVisibilitySettings();
    
    // Listen for database changes to update settings in real-time
    const channel = supabase
      .channel('landing_page_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'landing_page_settings',
          filter: 'id=eq.1'
        },
        (payload) => {
          console.log('Settings updated in database:', payload);
          if (payload.new) {
            setSectionVisibility(payload.new.section_visibility);
            if (payload.new.section_order && Object.keys(payload.new.section_order).length > 0) {
              setSectionOrder(payload.new.section_order);
            }
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    // Intersection Observer for animation triggers
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

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in, .fade-in-up, .slide-in-right').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Sort sections based on the section_order values
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
      <SectionEditor />
      <main className="flex-grow">
        {sortedSections.map((section) => {
          const isVisible = sectionVisibility[section.id] !== undefined 
            ? sectionVisibility[section.id] 
            : true; // Default to visible if not specified
            
          if (!isVisible) return null;
          
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
      <Footer />
    </div>
  );
};

export default Index;
