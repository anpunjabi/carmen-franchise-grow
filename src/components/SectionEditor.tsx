
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PanelLeft } from 'lucide-react';
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
        setSettings(data);
        
        // Apply settings to DOM
        applyVisibilitySettings(data.section_visibility, data.element_visibility);
      }
    } catch (error) {
      console.error('Error in loadVisibilitySettings:', error);
      toast.error('Failed to load visibility settings');
    }
  };

  const applyVisibilitySettings = (
    sectionVisibility: SectionVisibility,
    elementVisibility: ElementVisibility
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
        onSettingsChange={loadVisibilitySettings}
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
