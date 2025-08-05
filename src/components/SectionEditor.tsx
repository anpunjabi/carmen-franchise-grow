
import { useEffect, useState } from 'react';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionManagerSidebar from './SectionManagerSidebar';

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
      // No longer saving to database - changes are only in memory
      console.log('Save changes event received - changes stored in memory');
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
          onSectionVisibilityChange(sectionId, isVisible);
        }}
        onToggleElementVisibility={(elementId, isVisible) => {
          console.log('Element visibility changed:', elementId, isVisible);
          onElementVisibilityChange(elementId, isVisible);
        }}
        onUpdateSectionOrder={(updatedOrder) => {
          console.log('Section order changed:', updatedOrder);
          onSectionOrderChange(updatedOrder);
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
