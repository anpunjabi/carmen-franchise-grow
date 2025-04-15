
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

interface VisibilitySettings {
  section_visibility?: Record<string, boolean>;
  element_visibility?: Record<string, boolean>;
}

const SectionManagerSidebar = ({ isOpen, onOpenChange, isEditMode }: SectionManagerSidebarProps) => {
  const [sections, setSections] = useState<Section[]>([]);
  const [editableElements, setEditableElements] = useState<EditableElement[]>([]);
  const [showElementsOnly, setShowElementsOnly] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const sectionElements = document.querySelectorAll('[data-section-id]');
      const sectionsMap = new Map<string, Section>();
      
      sectionElements.forEach((section, index) => {
        const sectionId = section.getAttribute('data-section-id') || '';
        const isVisible = !section.classList.contains('hidden');
        const sectionName = section.getAttribute('data-section-name') || sectionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        const order = parseInt(section.getAttribute('data-section-order') || `${index}`);
        
        if (!sectionsMap.has(sectionId)) {
          sectionsMap.set(sectionId, {
            id: sectionId,
            name: sectionName,
            isVisible,
            order
          });
        }
      });
      
      const sectionsArray = Array.from(sectionsMap.values());
      sectionsArray.sort((a, b) => (a.order || 0) - (b.order || 0));
      setSections(sectionsArray);

      const editableElementNodes = document.querySelectorAll('[data-editable-id]');
      const elementsMap = new Map<string, EditableElement>();
      
      editableElementNodes.forEach(element => {
        const elementId = element.getAttribute('data-editable-id') || '';
        const isVisible = !element.classList.contains('hidden');
        
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
    }
  }, [isOpen, isEditMode]);

  const toggleSectionVisibility = async (sectionId: string) => {
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    if (!section) return;
    
    const isCurrentlyVisible = !section.classList.contains('hidden');
    
    try {
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('section_visibility')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Error fetching current visibility settings:', error);
        return;
      }

      if (isCurrentlyVisible) {
        section.classList.add('hidden');
      } else {
        section.classList.remove('hidden');
      }
      
      setSections(prev => 
        prev.map(s => 
          s.id === sectionId ? { ...s, isVisible: !isCurrentlyVisible } : s
        )
      );
      
      // Create a properly typed section_visibility object
      const currentVisibility: Record<string, boolean> = {};
      
      // Safely handle the data.section_visibility value
      if (data && data.section_visibility && typeof data.section_visibility === 'object') {
        // Convert to Record<string, boolean>
        Object.entries(data.section_visibility as Record<string, any>).forEach(([key, value]) => {
          currentVisibility[key] = !!value; // Convert any type to boolean
        });
      }
      
      const updatedVisibility: Record<string, boolean> = {
        ...currentVisibility,
        [sectionId]: !isCurrentlyVisible
      };
      
      const { error: updateError } = await supabase
        .from('landing_page_settings')
        .update({ section_visibility: updatedVisibility })
        .eq('id', 1);
      
      if (updateError) {
        console.error('Error updating section visibility:', updateError);
        if (isCurrentlyVisible) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
        setSections(prev => 
          prev.map(s => 
            s.id === sectionId ? { ...s, isVisible: isCurrentlyVisible } : s
          )
        );
      }
    } catch (error) {
      console.error('Error saving section visibility:', error);
    }
  };

  const toggleElementVisibility = async (elementId: string) => {
    const element = document.querySelector(`[data-editable-id="${elementId}"]`);
    if (!element) return;
    
    const isCurrentlyVisible = !element.classList.contains('hidden');
    
    try {
      const { data, error } = await supabase
        .from('landing_page_settings')
        .select('element_visibility')
        .eq('id', 1)
        .single();
      
      if (error) {
        console.error('Error fetching current element visibility settings:', error);
        return;
      }

      if (isCurrentlyVisible) {
        element.classList.add('hidden');
      } else {
        element.classList.remove('hidden');
      }
      
      setEditableElements(prev => 
        prev.map(e => 
          e.id === elementId ? { ...e, isVisible: !isCurrentlyVisible } : e
        )
      );
      
      // Create a properly typed element_visibility object
      const currentVisibility: Record<string, boolean> = {};
      
      // Safely handle the data.element_visibility value
      if (data && data.element_visibility && typeof data.element_visibility === 'object') {
        // Convert to Record<string, boolean>
        Object.entries(data.element_visibility as Record<string, any>).forEach(([key, value]) => {
          currentVisibility[key] = !!value; // Convert any type to boolean
        });
      }
      
      const updatedVisibility: Record<string, boolean> = {
        ...currentVisibility,
        [elementId]: !isCurrentlyVisible
      };
      
      const { error: updateError } = await supabase
        .from('landing_page_settings')
        .update({ element_visibility: updatedVisibility })
        .eq('id', 1);
      
      if (updateError) {
        console.error('Error updating element visibility:', updateError);
        if (isCurrentlyVisible) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
        setEditableElements(prev => 
          prev.map(e => 
            e.id === elementId ? { ...e, isVisible: isCurrentlyVisible } : e
          )
        );
      }
    } catch (error) {
      console.error('Error saving element visibility:', error);
    }
  };

  const moveSectionUp = (sectionId: string, currentIndex: number) => {
    if (currentIndex <= 0) return;
    
    const prevSection = sections[currentIndex - 1];
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    const prevSectionEl = document.querySelector(`[data-section-id="${prevSection.id}"]`);
    
    if (!section || !prevSectionEl || !section.parentNode) return;
    
    section.parentNode.insertBefore(section, prevSectionEl);
    
    section.setAttribute('data-section-order', `${currentIndex - 1}`);
    prevSectionEl.setAttribute('data-section-order', `${currentIndex}`);
    
    const updatedSections = [...sections];
    [updatedSections[currentIndex - 1], updatedSections[currentIndex]] = 
      [updatedSections[currentIndex], updatedSections[currentIndex - 1]];
    
    setSections(updatedSections);
  };
  
  const moveSectionDown = (sectionId: string, currentIndex: number) => {
    if (currentIndex >= sections.length - 1) return;
    
    const nextSection = sections[currentIndex + 1];
    const section = document.querySelector(`[data-section-id="${sectionId}"]`);
    const nextSectionEl = document.querySelector(`[data-section-id="${nextSection.id}"]`);
    
    if (!section || !nextSectionEl || !section.parentNode) return;
    
    if (nextSectionEl.nextSibling) {
      section.parentNode.insertBefore(section, nextSectionEl.nextSibling);
    } else {
      section.parentNode.appendChild(section);
    }
    
    section.setAttribute('data-section-order', `${currentIndex + 1}`);
    nextSectionEl.setAttribute('data-section-order', `${currentIndex}`);
    
    const updatedSections = [...sections];
    [updatedSections[currentIndex], updatedSections[currentIndex + 1]] = 
      [updatedSections[currentIndex + 1], updatedSections[currentIndex]];
    
    setSections(updatedSections);
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
