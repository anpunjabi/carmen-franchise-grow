
import { Grid3X3, LayoutGrid, Columns3 } from 'lucide-react';
import EditableText from './EditableText';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ElementVisibility {
  [key: string]: boolean;
}

const Features = () => {
  const [elementVisibility, setElementVisibility] = useState<ElementVisibility>({});

  // Load element visibility settings
  useEffect(() => {
    const loadElementVisibility = async () => {
      try {
        const { data, error } = await supabase
          .from('landing_page_settings')
          .select('element_visibility')
          .eq('id', 1)
          .single();
        
        if (error) {
          console.error('Error loading element visibility settings:', error);
          return;
        }

        if (data && data.element_visibility) {
          setElementVisibility(data.element_visibility as ElementVisibility);
        }
      } catch (error) {
        console.error('Error in loadElementVisibility:', error);
      }
    };

    loadElementVisibility();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('element_visibility_changes_features')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'landing_page_settings',
          filter: 'id=eq.1'
        },
        (payload) => {
          if (payload.new && payload.new.element_visibility) {
            setElementVisibility(payload.new.element_visibility as ElementVisibility);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Check if an element should be visible
  const isElementVisible = (elementId: string) => {
    return elementVisibility[elementId] !== undefined ? elementVisibility[elementId] : true;
  };

  const featuresList = [{
    icon: <Grid3X3 size={24} className="text-carmen-blue" />,
    title: 'Modular Architecture',
    description: 'Add only the modules you need, when you need them, avoiding bloated software.'
  }, {
    icon: <LayoutGrid size={24} className="text-carmen-blue" />,
    title: 'Fully Customizable',
    description: 'Tailor the workflow engine to match your exact business processes and requirements.'
  }, {
    icon: <Columns3 size={24} className="text-carmen-blue" />,
    title: 'AI-Powered Configuration',
    description: 'Use our AI chat to effortlessly customize Carmen to fit your business needs.'
  }];
  
  return <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-carmen-sky/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-carmen-soft-teal/10 blur-3xl rounded-full"></div>
        <div className="absolute inset-0 bg-pattern-dots opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 fade-in-up">
          {isElementVisible('features-heading-1') && (
            <h2 className="text-3xl md:text-4xl font-bold text-carmen-navy mb-4">
              <EditableText id="features-heading-1" as="span">
                Powerful Features, 
              </EditableText>
              {isElementVisible('features-heading-2') && (
                <EditableText id="features-heading-2" as="span" className="bg-carmen-gradient bg-clip-text text-transparent">
                  Limitless Flexibility
                </EditableText>
              )}
            </h2>
          )}
          {isElementVisible('features-description') && (
            <EditableText id="features-description" as="p" className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carmen combines powerful BPM capabilities with unprecedented flexibility,
              allowing you to create a solution that works exactly how you need it to.
            </EditableText>
          )}
        </div>
        
        <div className="flex flex-col md:flex-row gap-8 justify-center">
          {featuresList.map((feature, index) => (
            isElementVisible(`feature-${index}`) !== false && (
              <div key={index} className="bg-carmen-sand rounded-3xl p-6 shadow-soft border border-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 fade-in-up flex-1" style={{
                animationDelay: `${0.1 + index * 0.1}s`
              }}>
                <div className="rounded-full bg-white w-14 h-14 flex items-center justify-center mb-4 shadow-sm">
                  {feature.icon}
                </div>
                {isElementVisible(`feature-title-${index}`) !== false && (
                  <EditableText id={`feature-title-${index}`} as="h3" className="text-xl font-semibold text-carmen-navy mb-2">
                    {feature.title}
                  </EditableText>
                )}
                {isElementVisible(`feature-description-${index}`) !== false && (
                  <EditableText id={`feature-description-${index}`} as="p" className="text-gray-600">
                    {feature.description}
                  </EditableText>
                )}
              </div>
            )
          ))}
        </div>
      </div>
    </section>;
};
export default Features;
