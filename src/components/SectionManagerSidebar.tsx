
import { useEffect, useState } from 'react';
import { Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';


interface Section {
  id: string;
  name: string;
  isVisible: boolean;
  order: number;
}

interface EditableElement {
  id: string;
  name: string;
  isVisible: boolean;
  parentSection?: string;
}

interface SectionData {
  id: string;
  component: React.ReactNode;
  defaultOrder: number;
}

interface SectionVisibility {
  [key: string]: boolean;
}

interface ElementVisibility {
  [key: string]: boolean;
}

interface SectionOrder {
  [key: string]: number;
}

interface SectionManagerSidebarProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isEditMode: boolean;
  allSections: SectionData[];
  sectionVisibility: SectionVisibility;
  elementVisibility: ElementVisibility;
  sectionOrder: SectionOrder;
  onToggleSectionVisibility: (sectionId: string, isVisible: boolean) => void;
  onToggleElementVisibility: (elementId: string, isVisible: boolean) => void;
  onUpdateSectionOrder: (sectionOrder: SectionOrder) => void;
}

const SectionManagerSidebar = ({ 
  isOpen, 
  onOpenChange, 
  isEditMode,
  allSections,
  sectionVisibility,
  elementVisibility,
  sectionOrder,
  onToggleSectionVisibility,
  onToggleElementVisibility,
  onUpdateSectionOrder
}: SectionManagerSidebarProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [showElementsOnly, setShowElementsOnly] = useState(false);
  const isLoading = false;

  // Load sections and elements from the DOM and props
  useEffect(() => {
    if (isEditMode && isOpen && !isLoading) {
      loadSectionsAndElements();
    }
  }, [isOpen, isEditMode, allSections, sectionVisibility, elementVisibility, sectionOrder, isLoading]);

  const loadSectionsAndElements = () => {
    // Create section objects from allSections prop
    const sectionsArray: Section[] = allSections.map(section => {
      // Use the database value for visibility, falling back to true if not in database
      const isVisible = typeof sectionVisibility[section.id] !== 'undefined' 
        ? sectionVisibility[section.id] 
        : true;
      
      // Format section name from ID if needed
      let sectionName = section.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
      // Special case for footer to make it more visible in the UI
      if (section.id === 'footer') {
        sectionName = '📋 ' + sectionName;
      }
      
      // Use section_order from database if available, otherwise use default order
      const order = typeof sectionOrder[section.id] !== 'undefined'
        ? sectionOrder[section.id]
        : section.defaultOrder;
      
      return {
        id: section.id,
        name: sectionName,
        isVisible,
        order
      };
    });
    
    // Sort sections by order
    sectionsArray.sort((a, b) => a.order - b.order);
    setSections(sectionsArray);

    // Load editable elements from DOM
    const editableElementNodes = document.querySelectorAll('[data-editable-id]');
    const elementsMap = new Map<string, EditableElement>();
    
    editableElementNodes.forEach(element => {
      const elementId = element.getAttribute('data-editable-id') || '';
      // Check if this element has visibility explicitly defined in the database
      // Treat as visible by default unless explicitly set to false
      const isVisible = elementVisibility[elementId] !== false;
      
      let parentSection = '';
      let parent = element.parentElement;
      while (parent) {
        const sectionId = parent.getAttribute('data-section-id');
        if (sectionId) {
          parentSection = sectionId;
          break;
        }
        parent = parent.parentElement;
      }
      
      let name = elementId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      
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
      
      if (!elementsMap.has(elementId)) {
        elementsMap.set(elementId, {
          id: elementId,
          name,
          isVisible,
          parentSection
        });
      }
    });
    
    setEditableElements(Array.from(elementsMap.values()));
  };

  const toggleSectionVisibility = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) {
      toast.error(`Section with ID ${sectionId} not found`);
      return;
    }
    
    const isCurrentlyVisible = section.isVisible;
    const newIsVisible = !isCurrentlyVisible;
    
    // Update local state immediately for responsive feel
    setSections(prev => 
      prev.map(s => 
        s.id === sectionId ? { ...s, isVisible: newIsVisible } : s
      )
    );

    // Call parent handler to update database
    onToggleSectionVisibility(sectionId, newIsVisible);
    
    toast.success(`Section ${isCurrentlyVisible ? 'hidden' : 'shown'}`);
  };

  const moveSectionUp = (sectionId: string, currentIndex: number) => {
    if (currentIndex <= 0) return;
    
    const updatedSections = [...sections];
    
    // Swap the order values between current section and the one above it
    const currentSection = updatedSections[currentIndex];
    const prevSection = updatedSections[currentIndex - 1];
    
    const tempOrder = currentSection.order;
    currentSection.order = prevSection.order;
    prevSection.order = tempOrder;
    
    // Swap positions in array for UI update
    [updatedSections[currentIndex - 1], updatedSections[currentIndex]] = 
      [updatedSections[currentIndex], updatedSections[currentIndex - 1]];
    
    setSections(updatedSections);

    // Update section order for database
    const updatedOrder: SectionOrder = { ...sectionOrder };
    updatedSections.forEach(section => {
      updatedOrder[section.id] = section.order;
    });
    
    // Call parent handler to update database
    onUpdateSectionOrder(updatedOrder);
  };
  
  const moveSectionDown = (sectionId: string, currentIndex: number) => {
    if (currentIndex >= sections.length - 1) return;
    
    const updatedSections = [...sections];
    
    // Swap the order values between current section and the one below it
    const currentSection = updatedSections[currentIndex];
    const nextSection = updatedSections[currentIndex + 1];
    
    const tempOrder = currentSection.order;
    currentSection.order = nextSection.order;
    nextSection.order = tempOrder;
    
    // Swap positions in array for UI update
    [updatedSections[currentIndex], updatedSections[currentIndex + 1]] = 
      [updatedSections[currentIndex + 1], updatedSections[currentIndex]];
    
    setSections(updatedSections);

    // Update section order for database
    const updatedOrder: SectionOrder = { ...sectionOrder };
    updatedSections.forEach(section => {
      updatedOrder[section.id] = section.order;
    });
    
    // Call parent handler to update database
    onUpdateSectionOrder(updatedOrder);
  };

  const toggleElementVisibility = (elementId: string) => {
    const element = editableElements.find(e => e.id === elementId);
    if (!element) {
      toast.error(`Element with ID ${elementId} not found`);
      return;
    }
    
    const isCurrentlyVisible = element.isVisible;
    const newIsVisible = !isCurrentlyVisible;
    
    // Update local state immediately for responsive feel
    setEditableElements(prev => 
      prev.map(e => 
        e.id === elementId ? { ...e, isVisible: newIsVisible } : e
      )
    );
    
    // Call parent handler to update database
    onToggleElementVisibility(elementId, newIsVisible);
    
    toast.success(`Element ${isCurrentlyVisible ? 'hidden' : 'shown'}`);
  };

  if (!isEditMode) return null;

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
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Element and Section Manager</SheetTitle>
        </SheetHeader>
        
        <div className="flex items-center justify-between p-4 pb-2">
          <span className="text-sm font-medium">Show Elements Only</span>
          <Switch 
            checked={showElementsOnly}
            onCheckedChange={setShowElementsOnly}
          />
        </div>
        
        <ScrollArea className="flex-1 overflow-auto px-4">
          {!showElementsOnly && (
            <>
              <h3 className="text-sm font-medium mb-2">Page Sections</h3>
              <div className="flex flex-col space-y-2 mb-4">
                {sections.map((section, index) => (
                  <div 
                    key={section.id} 
                    className={`flex items-center justify-between p-2 rounded-md hover:bg-muted ${section.id === 'footer' ? 'bg-gray-50' : ''}`}
                  >
                    <span className="font-medium">{section.name}</span>
                    <div className="flex items-center space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveSectionUp(section.id, index)}
                              disabled={index === 0}
                              className="p-0 w-8 h-8"
                            >
                              <MoveUp className="h-4 w-4 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move Section Up</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveSectionDown(section.id, index)}
                              disabled={index === sections.length - 1}
                              className="p-0 w-8 h-8"
                            >
                              <MoveDown className="h-4 w-4 text-gray-500" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Move Section Down</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
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
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
            </>
          )}
          
          <h3 className="text-sm font-medium mb-2">Elements</h3>
          
          {Object.entries(groupedElements).map(([sectionId, elements]) => {
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
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SectionManagerSidebar;
