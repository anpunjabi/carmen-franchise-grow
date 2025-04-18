
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

interface SectionData {
  id: string;
  component: React.ReactNode;
  defaultOrder: number;
}

interface SectionEditorProps {
  allSections: SectionData[];
  sectionVisibility: SectionVisibility;
  elementVisibility: ElementVisibility;
  sectionOrder: SectionOrder;
}

const SectionEditor = ({ 
  allSections, 
  sectionVisibility, 
  elementVisibility, 
  sectionOrder 
}: SectionEditorProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [localSectionVisibility, setLocalSectionVisibility] = useState<SectionVisibility>(sectionVisibility);
  const [localElementVisibility, setLocalElementVisibility] = useState<ElementVisibility>(elementVisibility);
  const [localSectionOrder, setLocalSectionOrder] = useState<SectionOrder>(sectionOrder);
  
  // Update local state when props change
  useEffect(() => {
    setLocalSectionVisibility(sectionVisibility);
    setLocalElementVisibility(elementVisibility);
    setLocalSectionOrder(sectionOrder);
  }, [sectionVisibility, elementVisibility, sectionOrder]);
  
  // Save settings to database whenever they change in the sidebar
  const saveSettings = async (
    updatedSettings: {
      section_visibility?: SectionVisibility,
      element_visibility?: ElementVisibility,
      section_order?: SectionOrder
    }
  ) => {
    try {
      console.log('Saving settings:', updatedSettings);
      
      const { error } = await supabase
        .from('landing_page_settings')
        .update({
          section_visibility: updatedSettings.section_visibility || localSectionVisibility,
          element_visibility: updatedSettings.element_visibility || localElementVisibility,
          section_order: updatedSettings.section_order || localSectionOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
        
      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return false;
      }
      
      // Update local state to reflect saved changes
      if (updatedSettings.section_visibility) {
        setLocalSectionVisibility(updatedSettings.section_visibility);
      }
      
      if (updatedSettings.element_visibility) {
        setLocalElementVisibility(updatedSettings.element_visibility);
      }
      
      if (updatedSettings.section_order) {
        setLocalSectionOrder(updatedSettings.section_order);
      }
      
      console.log('Settings saved successfully');
      return true;
    } catch (error) {
      console.error('Error in saveSettings:', error);
      toast.error('Failed to save settings');
      return false;
    }
  };
  
  useEffect(() => {
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
      }
    };
    
    const handleSaveChanges = () => {
      saveSettings({
        section_visibility: localSectionVisibility,
        element_visibility: localElementVisibility,
        section_order: localSectionOrder
      });
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    window.addEventListener('savechanges', handleSaveChanges);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
      window.removeEventListener('savechanges', handleSaveChanges);
    };
  }, [localSectionVisibility, localElementVisibility, localSectionOrder]);
  
  return (
    <>
      <SectionManagerSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isEditMode={isEditMode}
        allSections={allSections}
        sectionVisibility={localSectionVisibility}
        elementVisibility={localElementVisibility}
        sectionOrder={localSectionOrder}
        onToggleSectionVisibility={(sectionId, isVisible) => {
          const updatedSectionVisibility = {
            ...localSectionVisibility,
            [sectionId]: isVisible
          };
          
          setLocalSectionVisibility(updatedSectionVisibility);
          saveSettings({ section_visibility: updatedSectionVisibility });
        }}
        onToggleElementVisibility={(elementId, isVisible) => {
          // Create a copy of the current element visibility
          const updatedElementVisibility = {
            ...localElementVisibility,
            [elementId]: isVisible
          };
          
          // Update local state
          setLocalElementVisibility(updatedElementVisibility);
          
          // Save to database
          console.log('Saving element visibility for', elementId, 'to', isVisible);
          saveSettings({ element_visibility: updatedElementVisibility });
        }}
        onUpdateSectionOrder={(updatedOrder) => {
          setLocalSectionOrder(updatedOrder);
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
