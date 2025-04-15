import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionManagerSidebar from './SectionManagerSidebar';
import { toast } from 'sonner';

interface SectionVisibility {
  [key: string]: boolean;
}

interface ElementVisibility {
  [key: string]: boolean;
}

interface SectionOrder {
  [key: string]: number;
}

interface LandingPageSettings {
  id: number;
  section_visibility: SectionVisibility;
  element_visibility: ElementVisibility;
  section_order: SectionOrder;
  created_at?: string;
  updated_at?: string;
}

const SectionEditor = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    const loadVisibilitySettings = async () => {
      try {
        console.log('Loading visibility settings from landing_page_settings');
        const { data, error } = await supabase
          .from('landing_page_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        if (error) {
          console.error('Error loading visibility settings:', error);
          toast.error('Failed to load visibility settings');
          return;
        }

        if (data) {
          console.log('Loaded visibility settings:', data);
          const settings = data as LandingPageSettings;
          
          // Get all sections from the DOM
          const allSections = document.querySelectorAll('[data-section-id]');
          const currentSectionIds = Array.from(allSections).map(section => 
            section.getAttribute('data-section-id')
          ).filter((id): id is string => id !== null);
          
          // Ensure all sections have an entry in section_visibility
          const updatedSectionVisibility: SectionVisibility = {};
          currentSectionIds.forEach(sectionId => {
            // If section exists in settings, use that value, otherwise default to true
            updatedSectionVisibility[sectionId] = settings.section_visibility[sectionId] ?? true;
          });
          
          // Apply visibility settings
          Object.entries(updatedSectionVisibility).forEach(([sectionId, isVisible]) => {
            const section = document.querySelector(`[data-section-id="${sectionId}"]`);
            if (section) {
              if (!isVisible) {
                section.classList.add('hidden');
                console.log(`Hiding section ${sectionId}`);
              } else {
                section.classList.remove('hidden');
                console.log(`Showing section ${sectionId}`);
              }
            }
          });

          // Update the database with complete section visibility if needed
          if (JSON.stringify(settings.section_visibility) !== JSON.stringify(updatedSectionVisibility)) {
            console.log('Updating section visibility in database to include all sections:', updatedSectionVisibility);
            const { error: updateError } = await supabase
              .from('landing_page_settings')
              .update({ 
                section_visibility: updatedSectionVisibility,
                updated_at: new Date().toISOString()
              })
              .eq('id', 1);

            if (updateError) {
              console.error('Error updating complete section visibility:', updateError);
              toast.error('Failed to update section visibility');
            }
          }
        }
      } catch (error) {
        console.error('Error in loadVisibilitySettings:', error);
        toast.error('Failed to load visibility settings');
      }
    };
    
    // Give a small delay to ensure DOM is fully loaded
    const timer = setTimeout(() => {
      loadVisibilitySettings();
    }, 300);
    
    const handleEditModeChange = (event: CustomEvent) => {
      console.log('Edit mode changed:', event.detail.isEditMode);
      setIsEditMode(event.detail.isEditMode);
      
      if (event.detail.isEditMode) {
        setIsSidebarOpen(true);
        document.querySelectorAll('[data-section-id], [data-editable-id]').forEach((element) => {
          element.classList.add('editable-element');
        });
      } else {
        setIsSidebarOpen(false);
        document.querySelectorAll('.editable-element').forEach((element) => {
          element.classList.remove('editable-element');
        });
        saveVisibilitySettings();
      }
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
      clearTimeout(timer);
    };
  }, []);
  
  const applySectionVisibility = (visibilitySettings: SectionVisibility) => {
    Object.entries(visibilitySettings).forEach(([sectionId, isVisible]) => {
      const section = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (section) {
        if (isVisible) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      }
    });
  };
  
  const applyElementVisibility = (visibilitySettings: ElementVisibility) => {
    Object.entries(visibilitySettings).forEach(([elementId, isVisible]) => {
      const element = document.querySelector(`[data-editable-id="${elementId}"]`);
      if (element) {
        if (isVisible) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
      }
    });
  };

  const applySectionOrder = (orderSettings: SectionOrder) => {
    const mainElement = document.querySelector('main');
    if (!mainElement) return;

    const sections = Array.from(mainElement.querySelectorAll('[data-section-id]'));
    if (sections.length === 0) {
      console.log('No sections found to reorder');
      return;
    }
    
    console.log('Found sections to reorder:', sections.length);
    
    // Sort sections based on the saved order
    sections.sort((a, b) => {
      const aId = a.getAttribute('data-section-id') || '';
      const bId = b.getAttribute('data-section-id') || '';
      const aOrder = orderSettings[aId] !== undefined ? orderSettings[aId] : 999;
      const bOrder = orderSettings[bId] !== undefined ? orderSettings[bId] : 999;
      return aOrder - bOrder;
    });
    
    // Apply reordering to DOM
    sections.forEach(section => {
      mainElement.appendChild(section);
    });

    // Update data-section-order attributes
    sections.forEach((section, index) => {
      section.setAttribute('data-section-order', `${index}`);
    });
    
    console.log('Section reordering applied successfully');
  };

  const saveVisibilitySettings = async () => {
    try {
      // Get all sections from the DOM and their current visibility state
      const sectionVisibility: SectionVisibility = {};
      document.querySelectorAll('[data-section-id]').forEach((section) => {
        const sectionId = section.getAttribute('data-section-id');
        if (sectionId) {
          // Explicitly set true or false for each section
          sectionVisibility[sectionId] = !section.classList.contains('hidden');
        }
      });

      console.log('Saving section visibility state:', sectionVisibility);

      // Get current element visibility from DOM
      const elementVisibility: ElementVisibility = {};
      document.querySelectorAll('[data-editable-id]').forEach((element) => {
        const elementId = element.getAttribute('data-editable-id');
        if (elementId) {
          elementVisibility[elementId] = !element.classList.contains('hidden');
        }
      });

      console.log('Saving element visibility state:', elementVisibility);

      // Check if record exists first
      const { data: existingData, error: checkError } = await supabase
        .from('landing_page_settings')
        .select('id')
        .eq('id', 1)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking landing_page_settings:', checkError);
        toast.error('Failed to check existing settings');
        return;
      }

      let saveError;
      const updateData = {
        section_visibility: sectionVisibility,
        element_visibility: elementVisibility,
        updated_at: new Date().toISOString()
      };

      if (existingData) {
        const { error } = await supabase
          .from('landing_page_settings')
          .update(updateData)
          .eq('id', 1);
          
        saveError = error;
      } else {
        const { error } = await supabase
          .from('landing_page_settings')
          .insert({
            id: 1,
            ...updateData
          });
          
        saveError = error;
      }

      if (saveError) {
        console.error('Error saving visibility settings:', saveError);
        toast.error('Failed to save visibility settings');
      } else {
        toast.success('Section and element visibility settings saved');
      }
    } catch (error) {
      console.error('Error saving visibility settings:', error);
      toast.error('Failed to save visibility settings');
    }
  };
  
  return (
    <>
      <SectionManagerSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isEditMode={isEditMode} 
      />
      {isEditMode && (
        <Button
          id="section-sidebar-toggle"
          className="fixed left-4 top-20 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-100"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Element and Section Manager</span>
        </Button>
      )}
    </>
  );
};

export default SectionEditor;
