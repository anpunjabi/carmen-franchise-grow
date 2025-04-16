
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionManagerSidebar from './SectionManagerSidebar';
import { toast } from 'sonner';

// Define proper types for the visibility states
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
  const [settings, setSettings] = useState<LandingPageSettings | null>(null);
  
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
        
        // Ensure we properly type the data from the database
        const typedSettings: LandingPageSettings = {
          id: data.id,
          section_visibility: data.section_visibility as SectionVisibility,
          element_visibility: data.element_visibility as ElementVisibility,
          section_order: data.section_order as SectionOrder,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setSettings(typedSettings);
        
        // Apply settings to DOM
        applyVisibilitySettings(
          typedSettings.section_visibility, 
          typedSettings.element_visibility,
          typedSettings.section_order
        );
      }
    } catch (error) {
      console.error('Error in loadVisibilitySettings:', error);
      toast.error('Failed to load visibility settings');
    }
  };

  const applyVisibilitySettings = (
    sectionVisibility: SectionVisibility,
    elementVisibility: ElementVisibility,
    sectionOrder: SectionOrder
  ) => {
    // Apply section visibility
    Object.entries(sectionVisibility).forEach(([sectionId, isVisible]) => {
      const section = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (section) {
        if (!isVisible) {
          section.classList.add('hidden');
          console.log(`Hiding section ${sectionId} based on saved settings`);
        } else {
          section.classList.remove('hidden');
          console.log(`Showing section ${sectionId} based on saved settings`);
        }
      }
    });

    // Apply element visibility
    Object.entries(elementVisibility).forEach(([elementId, isVisible]) => {
      const element = document.querySelector(`[data-editable-id="${elementId}"]`);
      if (element) {
        if (!isVisible) {
          element.classList.add('hidden');
          console.log(`Hiding element ${elementId}`);
        } else {
          element.classList.remove('hidden');
          console.log(`Showing element ${elementId}`);
        }
      }
    });

    // Apply section order if available
    if (Object.keys(sectionOrder).length > 0) {
      applyOrderToSections(sectionOrder);
    }
  };

  const applyOrderToSections = (sectionOrder: SectionOrder) => {
    const orderedIds = Object.entries(sectionOrder)
      .sort(([, orderA], [, orderB]) => orderA - orderB)
      .map(([id]) => id);
    
    const mainElement = document.querySelector('main');
    if (!mainElement) return;
    
    // Reorder DOM elements based on the saved order
    orderedIds.forEach(sectionId => {
      const section = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (section && mainElement.contains(section)) {
        // Move the section to the end to reorder it
        mainElement.appendChild(section);
        
        // Update the data-section-order attribute to match the saved order
        section.setAttribute('data-section-order', sectionOrder[sectionId].toString());
      }
    });
  };
  
  // Save settings to database whenever they change in the sidebar
  const saveSettings = async (
    updatedSettings: {
      section_visibility?: SectionVisibility,
      element_visibility?: ElementVisibility,
      section_order?: SectionOrder
    }
  ) => {
    try {
      if (!settings) return;
      
      const newSettings = {
        ...settings,
        ...updatedSettings,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('landing_page_settings')
        .update({
          section_visibility: newSettings.section_visibility,
          element_visibility: newSettings.element_visibility,
          section_order: newSettings.section_order,
          updated_at: newSettings.updated_at
        })
        .eq('id', 1);
        
      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return;
      }
      
      // Update local state with the new settings
      setSettings(newSettings);
      
      // Apply the updated settings
      applyVisibilitySettings(
        newSettings.section_visibility,
        newSettings.element_visibility,
        newSettings.section_order
      );
      
      console.log('Settings saved successfully:', newSettings);
    } catch (error) {
      console.error('Error in saveSettings:', error);
      toast.error('Failed to save settings');
    }
  };
  
  useEffect(() => {
    // Load settings when component mounts
    loadVisibilitySettings();
    
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
        // Reload settings after edit mode is turned off to ensure correct state
        loadVisibilitySettings();
      }
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
    };
  }, []);
  
  return (
    <>
      <SectionManagerSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isEditMode={isEditMode}
        settings={settings}
        onToggleSectionVisibility={(sectionId, isVisible) => {
          if (!settings) return;
          
          const updatedSectionVisibility = {
            ...settings.section_visibility,
            [sectionId]: isVisible
          };
          
          saveSettings({ section_visibility: updatedSectionVisibility });
        }}
        onToggleElementVisibility={(elementId, isVisible) => {
          if (!settings) return;
          
          const updatedElementVisibility = {
            ...settings.element_visibility,
            [elementId]: isVisible
          };
          
          saveSettings({ element_visibility: updatedElementVisibility });
        }}
        onUpdateSectionOrder={(updatedOrder) => {
          if (!settings) return;
          
          saveSettings({ section_order: updatedOrder });
        }}
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
