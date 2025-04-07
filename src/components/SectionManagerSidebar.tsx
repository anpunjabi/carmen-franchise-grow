
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Section {
  id: string;
  name: string;
  isVisible: boolean;
}

interface SectionManagerSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
}

const SectionManagerSidebar = ({ isOpen, onOpenChange, isEditMode }: SectionManagerSidebarProps) => {
  const [sections, setSections] = useState<Section[]>([]);

  // Get all sections from the document when the sidebar opens or edit mode changes
  useEffect(() => {
    if (isEditMode) {
      const sectionElements = document.querySelectorAll('[data-section-id]');
      const sectionsArray: Section[] = [];
      
      sectionElements.forEach(section => {
        const sectionId = section.getAttribute('data-section-id') || '';
        const isVisible = !section.classList.contains('hidden');
        const name = sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        sectionsArray.push({
          id: sectionId,
          name,
          isVisible
        });
      });
      
      setSections(sectionsArray);
    }
  }, [isOpen, isEditMode]);

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId: string) => {
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (!section) return;
    
    const isCurrentlyVisible = !section.classList.contains('hidden');
    
    if (isCurrentlyVisible) {
      section.classList.add('hidden');
    } else {
      section.classList.remove('hidden');
    }
    
    // Update our local state
    setSections(prev => 
      prev.map(s => 
        s.id === sectionId ? { ...s, isVisible: !isCurrentlyVisible } : s
      )
    );
    
    console.log(`Toggled section "${sectionId}" visibility to:`, !isCurrentlyVisible);
  };

  if (!isEditMode) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="mb-4">
          <SheetTitle>Manage Sections</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col space-y-2">
          {sections.map(section => (
            <div 
              key={section.id} 
              className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
            >
              <span className="font-medium">{section.name}</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSectionVisibility(section.id)}
                      className="p-0 w-8 h-8"
                    >
                      {section.isVisible ? 
                        <Eye className="h-4 w-4 text-green-500" /> : 
                        <EyeOff className="h-4 w-4 text-red-500" />
                      }
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {section.isVisible ? 'Hide Section' : 'Show Section'}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SectionManagerSidebar;

