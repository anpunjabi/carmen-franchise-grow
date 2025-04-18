
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ElementVisibility {
  [key: string]: boolean;
}

export function useElementVisibility() {
  const [elementVisibility, setElementVisibility] = useState<ElementVisibility>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadElementVisibility = async () => {
      try {
        setIsLoading(true);
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
          console.log('Loaded element visibility settings:', data.element_visibility);
          setElementVisibility(data.element_visibility as ElementVisibility);
        }
      } catch (error) {
        console.error('Error in loadElementVisibility:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadElementVisibility();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('element_visibility_changes_hook')
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
            console.log('Real-time update to element visibility:', payload.new.element_visibility);
            setElementVisibility(payload.new.element_visibility as ElementVisibility);
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Function to check if an element should be visible
  const isElementVisible = (elementId: string) => {
    // Default to true only if the element isn't found in the visibility settings
    // or if it's explicitly set to true
    return elementVisibility[elementId] !== false;
  };

  // Get all element visibility settings (both visible and hidden)
  const getAllElementVisibility = () => {
    return elementVisibility;
  };

  return { elementVisibility, isElementVisible, getAllElementVisibility, isLoading };
}
