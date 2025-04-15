
import { useEffect, useState } from 'react';
import { Eye, EyeOff, MoveUp, MoveDown } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

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
}

const SectionManagerSidebar = ({ isOpen, onOpenChange, isEditMode }: SectionManagerSidebarProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [showElementsOnly, setShowElementsOnly] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      // Get sections
      const sectionElements = document.querySelectorAll('[data-section-id]');
      const sectionsMap = new Map<string, Section>();
      
      sectionElements.forEach((section, index) => {
        const sectionId = section.getAttribute('data-section-id') || '';
        const isVisible = !section.classList.contains('hidden');
        const sectionName = section.getAttribute('data-section-name') || sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const order = parseInt(section.getAttribute('data-section-order') || `${index}`);
        
        // Only add if not already in the map (avoid duplicates)
        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, {
            id: sectionId,
            name: sectionName,
            isVisible,
            order
          });
        }
      });
      
      // Convert map to array and sort by order
      const sectionsArray = Array.from(sectionsMap.values());
      sectionsArray.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSections(sectionsArray);

      // Get editable elements
      const editableElementNodes = document.querySelectorAll('[data-editable-id]');
      const elementsMap = new Map<string, EditableElement>();
      
      editableElementNodes.forEach(element => {
        const elementId = element.getAttribute('data-editable-id') || '';
        const isVisible = !element.classList.contains('hidden');
        
        // Try to find the nearest section for grouping
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
        
        // Only add if not already in the map (avoid duplicates)
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
    }
  }, [isOpen, isEditMode]);

  // Toggle section visibility
  const toggleSectionVisibility = async (sectionId: string) => {
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

    // Save visibility change to database
    try {
      // First get current settings
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('section_visibility')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Error fetching current visibility settings:', error);
        return;
      }
      
      // Update the section visibility
      const currentVisibility = data?.section_visibility || {};
      const updatedVisibility = { 
        ...currentVisibility,
        [sectionId]: !isCurrentlyVisible
      };
      
      // Save back to database
      const { error: updateError } = await supabase
        .from('landing_page_settings')
        .update({ section_visibility: updatedVisibility })
        .eq('id', 1);
      
      if (updateError) {
        console.error('Error updating section visibility:', updateError);
      }
    } catch (error) {
      console.error('Error saving section visibility:', error);
    }
  };

  // Toggle element visibility
  const toggleElementVisibility = async (elementId: string) => {
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

    // Save element visibility to database
    try {
      // First get current settings
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('element_visibility')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Error fetching current element visibility settings:', error);
        return;
      }
      
      // Update the element visibility
      const currentVisibility = data?.element_visibility || {};
      const updatedVisibility = { 
        ...currentVisibility,
        [elementId]: !isCurrentlyVisible
      };
      
      // Save back to database
      const { error: updateError } = await supabase
        .from('landing_page_settings')
        .update({ element_visibility: updatedVisibility })
        .eq('id', 1);
      
      if (updateError) {
        console.error('Error updating element visibility:', updateError);
      }
    } catch (error) {
      console.error('Error saving element visibility:', error);
    }
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
