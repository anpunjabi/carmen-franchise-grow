
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
  onSectionVisibilityChange: (sectionId: string, isVisible: boolean) => void;
  onElementVisibilityChange: (elementId: string, isVisible: boolean) => void;
  onSectionOrderChange: (newOrder: SectionOrder) => void;
}

const SectionEditor = ({ 
  allSections, 
  sectionVisibility, 
  elementVisibility, 
  sectionOrder,
  onSectionVisibilityChange,
  onElementVisibilityChange,
  onSectionOrderChange
}: SectionEditorProps) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Save settings to database and update parent component state
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
          section_visibility: updatedSettings.section_visibility || sectionVisibility,
          element_visibility: updatedSettings.element_visibility || elementVisibility,
          section_order: updatedSettings.section_order || sectionOrder,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);
        
      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings');
        return false;
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
        section_visibility: sectionVisibility,
        element_visibility: elementVisibility,
        section_order: sectionOrder
      });
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    window.addEventListener('savechanges', handleSaveChanges);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
      window.removeEventListener('savechanges', handleSaveChanges);
    };
  }, [sectionVisibility, elementVisibility, sectionOrder]);
  
  return (
    <>
      <SectionManagerSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isEditMode={isEditMode}
        allSections={allSections}
        sectionVisibility={sectionVisibility}
        elementVisibility={elementVisibility}
        sectionOrder={sectionOrder}
        onToggleSectionVisibility={(sectionId, isVisible) => {
          console.log('Section visibility changed:', sectionId, isVisible);
          const updatedSectionVisibility = {
            ...sectionVisibility,
            [sectionId]: isVisible
          };
          
          onSectionVisibilityChange(sectionId, isVisible);
          saveSettings({ section_visibility: updatedSectionVisibility });
        }}
        onToggleElementVisibility={(elementId, isVisible) => {
          console.log('Element visibility changed:', elementId, isVisible);
          const updatedElementVisibility = {
            ...elementVisibility,
            [elementId]: isVisible
          };
          
          onElementVisibilityChange(elementId, isVisible);
          saveSettings({ element_visibility: updatedElementVisibility });
        }}
        onUpdateSectionOrder={(updatedOrder) => {
          console.log('Section order changed:', updatedOrder);
          onSectionOrderChange(updatedOrder);
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
