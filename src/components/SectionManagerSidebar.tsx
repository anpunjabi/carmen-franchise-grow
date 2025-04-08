
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

interface Section {
  id: string;
  name: string;
  isVisible: boolean;
}

interface EditableElement {
  id: string;
  name: string;
  isVisible: boolean;
  parentSection?: string;
}

interface SectionManagerSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
}

const SectionManagerSidebar = ({ isOpen, onOpenChange, isEditMode }: SectionManagerSidebarProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [showElementsOnly, setShowElementsOnly] = useState(false);

  // Get all sections and editable elements from the document when the sidebar opens or edit mode changes
  useEffect(() => {
    if (isEditMode) {
      // Get sections
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

      // Get editable elements
      const editableElementNodes = document.querySelectorAll('[data-editable-id]');
      const elementsArray: EditableElement[] = [];
      
      editableElementNodes.forEach(element => {
        const elementId = element.getAttribute('data-editable-id') || '';
        const isVisible = !element.classList.contains('hidden');
        
        // Try to find the nearest section for grouping
        let parentSection = '';
        let parent = element.parentElement;
        while (parent) {
          if (parent.hasAttribute('data-section-id')) {
            parentSection = parent.getAttribute('data-section-id') || '';
            break;
          }
          parent = parent.parentElement;
        }
        
        // Format name from ID
        let name = elementId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        
        // Special formatting for specific patterns
        if (name.includes('Link ')) {
          name = name.replace('Link ', '');
        }
        
        if (name.includes('Nav ')) {
          name = name.replace('Nav ', '');
        }
        
        if (name.includes('Mobile')) {
          name = name.replace('Mobile', ' (Mobile)');
        }
        
        if (name.includes('Social ')) {
          name = name.replace('Social ', '') + ' Icon';
        }
        
        elementsArray.push({
          id: elementId,
          name,
          isVisible,
          parentSection
        });
      });
      
      setEditableElements(elementsArray);
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

  // Toggle element visibility
  const toggleElementVisibility = (elementId: string) => {
    const element = document.querySelector(`[data-editable-id="${elementId}"]`);
    if (!element) return;
    
    const isCurrentlyVisible = !element.classList.contains('hidden');
    
    if (isCurrentlyVisible) {
      element.classList.add('hidden');
    } else {
      element.classList.remove('hidden');
    }
    
    // Update our local state
    setEditableElements(prev => 
      prev.map(e => 
        e.id === elementId ? { ...e, isVisible: !isCurrentlyVisible } : e
      )
    );
    
    console.log(`Toggled element "${elementId}" visibility to:`, !isCurrentlyVisible);
  };

  if (!isEditMode) return null;

  // Group elements by section
  const groupedElements: Record<string, EditableElement[]> = {};
  const ungroupedElements: EditableElement[] = [];
  
  editableElements.forEach(element => {
    if (element.parentSection) {
      if (!groupedElements[element.parentSection]) {
        groupedElements[element.parentSection] = [];
      }
      groupedElements[element.parentSection].push(element);
    } else {
      ungroupedElements.push(element);
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80">
        <SheetHeader className="mb-4">
          <SheetTitle>Manage Visibility</SheetTitle>
        </SheetHeader>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium">Show Elements Only</span>
          <Switch 
            checked={showElementsOnly}
            onCheckedChange={setShowElementsOnly}
          />
        </div>
        
        {!showElementsOnly && (
          <>
            <h3 className="text-sm font-medium mb-2">Page Sections</h3>
            <div className="flex flex-col space-y-2 mb-4">
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
            <Separator className="my-4" />
          </>
        )}
        
        <h3 className="text-sm font-medium mb-2">Elements</h3>
        
        {/* Grouped elements */}
        {Object.entries(groupedElements).map(([sectionId, elements]) => {
          // Find the section name
          const sectionName = sections.find(s => s.id === sectionId)?.name || sectionId;
          
          return (
            <div key={sectionId} className="mb-4">
              <h4 className="text-xs font-medium text-gray-500 mb-1 pl-2">{sectionName}</h4>
              <div className="flex flex-col space-y-1 pl-2">
                {elements.map(element => (
                  <div 
                    key={element.id} 
                    className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted"
                  >
                    <span className="text-sm">{element.name}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleElementVisibility(element.id)}
                            className="p-0 w-7 h-7"
                          >
                            {element.isVisible ? 
                              <Eye className="h-3.5 w-3.5 text-green-500" /> : 
                              <EyeOff className="h-3.5 w-3.5 text-red-500" />
                            }
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {element.isVisible ? 'Hide Element' : 'Show Element'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        
        {/* Ungrouped elements */}
        {ungroupedElements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 mb-1 pl-2">Other Elements</h4>
            <div className="flex flex-col space-y-1 pl-2">
              {ungroupedElements.map(element => (
                <div 
                  key={element.id} 
                  className="flex items-center justify-between p-1.5 rounded-md hover:bg-muted"
                >
                  <span className="text-sm">{element.name}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleElementVisibility(element.id)}
                          className="p-0 w-7 h-7"
                        >
                          {element.isVisible ? 
                            <Eye className="h-3.5 w-3.5 text-green-500" /> : 
                            <EyeOff className="h-3.5 w-3.5 text-red-500" />
                          }
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {element.isVisible ? 'Hide Element' : 'Show Element'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default SectionManagerSidebar;
