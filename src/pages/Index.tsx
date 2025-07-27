
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { EditModeToggle } from '@/components/EditModeToggle';
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

interface ElementVisibility {
  [key: string]: boolean;
}

interface SectionOrder {
  [key: string]: number;
}

const Index = () => {
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>({});
  const [elementVisibility, setElementVisibility] = useState<ElementVisibility>({});
  const [sectionOrder, setSectionOrder] = useState<SectionOrder>({});
  const [isLoading, setIsLoading] = useState(true);

  const allSections: SectionData[] = [
    { id: 'hero', component: <Hero pagePrefix="home" />, defaultOrder: 0 },
    { id: 'hero-secondary', component: <HeroSecondary />, defaultOrder: 1 },
    { id: 'hero-tertiary', component: <HeroTertiary />, defaultOrder: 2 },
    { id: 'features', component: <Features pagePrefix="home" />, defaultOrder: 3 },
    { id: 'hero-quaternary', component: <HeroQuaternary />, defaultOrder: 4 },
    { id: 'modules', component: <Modules />, defaultOrder: 5 },
    { id: 'booking', component: <BookingSection />, defaultOrder: 6 },
    { id: 'hero-quinary', component: <HeroQuinary />, defaultOrder: 7 },
    { id: 'partnerships', component: <Partnerships />, defaultOrder: 8 },
    { id: 'partner', component: <Partner />, defaultOrder: 9 },
    { id: 'footer', component: <Footer />, defaultOrder: 10 }
  ];

  useEffect(() => {
    const loadVisibilitySettings = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('landing_page_settings')
          .select('section_visibility, element_visibility, section_order')
          .eq('page_identifier', 'home')
          .maybeSingle();
        
        if (error) {
          console.error('Error loading visibility settings:', error);
          return;
        }

        if (data) {
          console.log('Loaded settings:', data);
          
          // Handle section visibility
          if (data.section_visibility) {
            const sectionVisData: SectionVisibility = data.section_visibility as SectionVisibility;
            setSectionVisibility(sectionVisData);
          }
          
          // Handle element visibility
          if (data.element_visibility) {
            const elementVisData: ElementVisibility = data.element_visibility as ElementVisibility;
            console.log('Setting element visibility state:', elementVisData);
            setElementVisibility(elementVisData);
          }
          
          // Handle section order
          if (data.section_order && Object.keys(data.section_order).length > 0) {
            const orderData: SectionOrder = data.section_order as SectionOrder;
            setSectionOrder(orderData);
          } else {
            // Set default order if none exists in database
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
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('landing_page_settings_changes_home')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'landing_page_settings',
          filter: 'page_identifier=eq.home'
        },
        (payload) => {
          console.log('Settings updated in database:', payload);
          if (payload.new) {
            // Update section visibility
            if (payload.new.section_visibility) {
              const sectionVisData = payload.new.section_visibility as SectionVisibility;
              setSectionVisibility(sectionVisData);
            }
            
            // Update element visibility
            if (payload.new.element_visibility) {
              const elementVisData = payload.new.element_visibility as ElementVisibility;
              console.log('Realtime update of element visibility:', elementVisData);
              setElementVisibility(elementVisData);
            }
            
            // Update section order
            if (payload.new.section_order && Object.keys(payload.new.section_order).length > 0) {
              const orderData = payload.new.section_order as SectionOrder;
              setSectionOrder(orderData);
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
      <EditModeToggle />
      <Header />
      <SectionEditor 
        allSections={allSections} 
        sectionVisibility={sectionVisibility}
        elementVisibility={elementVisibility}
        sectionOrder={sectionOrder}
        onSectionVisibilityChange={(sectionId, isVisible) => {
          console.log('Parent: Section visibility changing:', sectionId, isVisible);
          setSectionVisibility(prev => ({ ...prev, [sectionId]: isVisible }));
        }}
        onElementVisibilityChange={(elementId, isVisible) => {
          console.log('Parent: Element visibility changing:', elementId, isVisible);
          setElementVisibility(prev => ({ ...prev, [elementId]: isVisible }));
        }}
        onSectionOrderChange={(newOrder) => {
          console.log('Parent: Section order changing:', newOrder);
          setSectionOrder(newOrder);
        }}
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
