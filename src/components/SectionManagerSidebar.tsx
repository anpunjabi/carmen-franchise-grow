import { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff, MoveUp, MoveDown, RefreshCw } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';

interface Section {
  id: string;
  name: string;
  isVisible: boolean;
  order?: number;
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
  settingsLoaded?: boolean;
}

const SectionManagerSidebar = ({ 
  isOpen, 
  onOpenChange, 
  isEditMode, 
  settingsLoaded = false 
}: SectionManagerSidebarProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [showElementsOnly, setShowElementsOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Check if user is in admin edit mode
  useEffect(() => {
    if (isOpen && isEditMode) {
      loadSectionsAndElements();
    }
  }, [isOpen, isEditMode, settingsLoaded]);

  const loadSectionsAndElements = useCallback(() => {
    setIsLoading(true);
    console.log('Loading sections and elements...');
    
    // Use a timeout to ensure the DOM is ready
    setTimeout(() => {
      try {
        // Get sections
        const sectionElements = Array.from(document.querySelectorAll('[data-section-id]'));
        const sectionsArray: Section[] = [];
        
        sectionElements.forEach((section, index) => {
          const sectionId = section.getAttribute('data-section-id') || '';
          const isVisible = !section.classList.contains('hidden');
          const name = sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
          const order = parseInt(section.getAttribute('data-section-order') || `${index}`);
          
          sectionsArray.push({
            id: sectionId,
            name,
            isVisible,
            order
          });
        });
        
        // Sort sections by order
        sectionsArray.sort((a, b) => (a.order || 0) - (b.order || 0));
        setSections(sectionsArray);
        console.log('Loaded sections:', sectionsArray.length, sectionsArray.map(s => s.id));

        // Get editable elements
        const editableElementNodes = Array.from(document.querySelectorAll('[data-editable-id]'));
        const elementsArray: EditableElement[] = [];
        
        editableElementNodes.forEach(element => {
          const elementId = element.getAttribute('data-editable-id') || '';
          const isVisible = !element.classList.contains('hidden');
          
          // Find the nearest section parent
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
          
          // Format name from ID
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
          
          elementsArray.push({
            id: elementId,
            name,
            isVisible,
            parentSection
          });
        });
        
        setEditableElements(elementsArray);
        console.log('Loaded elements:', elementsArray.length, elementsArray.map(e => e.id));
        
        if (sectionsArray.length === 0 && elementsArray.length === 0) {
          toast({
            title: "No sections or elements found",
            description: "Make sure your components have data-section-id or data-editable-id attributes.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Loaded successfully",
            description: `Found ${sectionsArray.length} sections and ${elementsArray.length} elements.`,
            variant: "default"
          });
        }
      } catch (error) {
        console.error('Error loading sections and elements:', error);
        toast({
          title: "Error",
          description: "Failed to load sections and elements.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }, [toast]);

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
  };

  // Move section up in the DOM order
  const moveSectionUp = (sectionId: string, currentIndex: number) => {
    if (currentIndex <= 0) return;
    
    const prevSection = sections[currentIndex - 1];
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    const prevSectionEl = document.querySelector(`[data-section-id="${prevSection.id}"]`);
    
    if (!section || !prevSectionEl || !section.parentNode) return;
    
    // Move in the DOM
    section.parentNode.insertBefore(section, prevSectionEl);
    
    // Update order attributes
    section.setAttribute('data-section-order', `${currentIndex - 1}`);
    prevSectionEl.setAttribute('data-section-order', `${currentIndex}`);
    
    // Update our state to reflect the new order
    const updatedSections = [...sections];
    [updatedSections[currentIndex - 1], updatedSections[currentIndex]] = 
      [updatedSections[currentIndex], updatedSections[currentIndex - 1]];
    
    setSections(updatedSections);
  };
  
  // Move section down in the DOM order
  const moveSectionDown = (sectionId: string, currentIndex: number) => {
    if (currentIndex >= sections.length - 1) return;
    
    const nextSection = sections[currentIndex + 1];
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    const nextSectionEl = document.querySelector(`[data-section-id="${nextSection.id}"]`);
    
    if (!section || !nextSectionEl || !section.parentNode) return;
    
    // Move in the DOM
    if (nextSectionEl.nextSibling) {
      section.parentNode.insertBefore(section, nextSectionEl.nextSibling);
    } else {
      section.parentNode.appendChild(section);
    }
    
    // Update order attributes
    section.setAttribute('data-section-order', `${currentIndex + 1}`);
    nextSectionEl.setAttribute('data-section-order', `${currentIndex}`);
    
    // Update our state to reflect the new order
    const updatedSections = [...sections];
    [updatedSections[currentIndex], updatedSections[currentIndex + 1]] = 
      [updatedSections[currentIndex + 1], updatedSections[currentIndex]];
    
    setSections(updatedSections);
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
      <SheetContent side="left" className="w-80 p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <div className="flex justify-between items-center">
            <SheetTitle>Element and Section Manager</SheetTitle>
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={loadSectionsAndElements} 
              className="h-8 w-8" 
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </SheetHeader>
        
        <div className="flex items-center justify-between p-4 pb-2">
          <span className="text-sm font-medium">Show Elements Only</span>
          <Switch 
            checked={showElementsOnly}
            onCheckedChange={setShowElementsOnly}
          />
        </div>
        
        <ScrollArea className="flex-1 overflow-auto px-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <p className="text-sm text-muted-foreground">Loading sections and elements...</p>
            </div>
          ) : (
            <>
              {!showElementsOnly && (
                <>
                  <h3 className="text-sm font-medium mb-2">Page Sections ({sections.length})</h3>
                  <div className="flex flex-col space-y-2 mb-4">
                    {sections.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No sections found. Try refreshing.</p>
                    ) : (
                      sections.map((section, index) => (
                        <div 
                          key={section.id} 
                          className="flex items-center justify-between p-2 rounded-md hover:bg-muted"
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
                      ))
                    )}
                  </div>
                  <Separator className="my-4" />
                </>
              )}
              
              <h3 className="text-sm font-medium mb-2">Elements ({editableElements.length})</h3>
              
              {Object.entries(groupedElements).length === 0 && ungroupedElements.length === 0 && (
                <p className="text-sm text-muted-foreground">No elements found. Try refreshing.</p>
              )}
              
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
            </>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default SectionManagerSidebar;
