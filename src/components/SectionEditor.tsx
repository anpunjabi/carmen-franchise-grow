
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionManagerSidebar from './SectionManagerSidebar';
import { useToast } from '@/hooks/use-toast';

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
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const { toast } = useToast();
  
  const findAllSectionElements = useCallback(() => {
    console.log('Finding all section elements');
    // Using querySelectorAll with a more specific selector focused on main
    const mainElement = document.querySelector('main');
    if (mainElement) {
      return Array.from(mainElement.querySelectorAll('[data-section-id]'));
    } else {
      const allSections = Array.from(document.querySelectorAll('[data-section-id]'));
      console.log('Found sections (no main element):', allSections.length);
      return allSections;
    }
  }, []);

  const findAllEditableElements = useCallback(() => {
    console.log('Finding all editable elements');
    return Array.from(document.querySelectorAll('[data-editable-id]'));
  }, []);
  
  const loadVisibilitySettings = useCallback(async () => {
    try {
      console.log('Loading visibility settings from landing_page_settings');
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('*')
        .eq('id', 1)
        .single();
      
      console.log('Visibility settings data:', data, 'Error:', error);
      
      if (data && !error) {
        const settings = data as unknown as LandingPageSettings;
        
        // Use setTimeout to ensure DOM is fully rendered
        setTimeout(() => {
          if (settings.section_visibility) {
            console.log('Applying section visibility:', settings.section_visibility);
            applySectionVisibility(settings.section_visibility);
          }
          
          if (settings.element_visibility) {
            console.log('Applying element visibility:', settings.element_visibility);
            applyElementVisibility(settings.element_visibility);
          }

          if (settings.section_order) {
            console.log('Applying section order:', settings.section_order);
            applySectionOrder(settings.section_order);
          }
          
          setSettingsLoaded(true);
        }, 500);
      }
    } catch (error) {
      console.error('Error loading visibility settings:', error);
      toast({
        title: "Error",
        description: "Could not load visibility settings.",
        variant: "destructive"
      });
    }
  }, [toast]);
  
  useEffect(() => {
    // We delay the initial load to ensure all components are mounted
    const initialLoadTimer = setTimeout(() => {
      loadVisibilitySettings();
    }, 1000);
    
    const handleEditModeChange = (event: CustomEvent) => {
      console.log('Edit mode changed:', event.detail.isEditMode);
      setIsEditMode(event.detail.isEditMode);
      
      // When entering edit mode, force a refresh of settings
      if (event.detail.isEditMode) {
        loadVisibilitySettings();
      }
      
      // Use setTimeout to ensure DOM stability
      setTimeout(() => {
        if (event.detail.isEditMode) {
          setIsSidebarOpen(true);
          const editableElements = [...findAllSectionElements(), ...findAllEditableElements()];
          editableElements.forEach((element) => {
            element.classList.add('editable-element');
          });
        } else {
          setIsSidebarOpen(false);
          document.querySelectorAll('.editable-element').forEach((element) => {
            element.classList.remove('editable-element');
          });
        }
      }, 300);
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
      clearTimeout(initialLoadTimer);
    };
  }, [findAllSectionElements, findAllEditableElements, loadVisibilitySettings]);
  
  const applySectionVisibility = (visibilitySettings: SectionVisibility) => {
    const sections = findAllSectionElements();
    console.log('Applying visibility to sections:', sections.length);
    
    sections.forEach((section) => {
      const sectionId = section.getAttribute('data-section-id');
      if (sectionId && visibilitySettings[sectionId] !== undefined) {
        if (visibilitySettings[sectionId]) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      }
    });
  };
  
  const applyElementVisibility = (visibilitySettings: ElementVisibility) => {
    const elements = findAllEditableElements();
    console.log('Applying visibility to elements:', elements.length);
    
    elements.forEach((element) => {
      const elementId = element.getAttribute('data-editable-id');
      if (elementId && visibilitySettings[elementId] !== undefined) {
        if (visibilitySettings[elementId]) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
      }
    });
  };

  const applySectionOrder = (orderSettings: SectionOrder) => {
    const mainElement = document.querySelector('main');
    if (!mainElement) {
      console.log('Main element not found');
      return;
    }

    const sections = findAllSectionElements();
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
  
  return (
    <>
      <SectionManagerSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isEditMode={isEditMode} 
        settingsLoaded={settingsLoaded}
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
