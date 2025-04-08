
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Eye, EyeOff, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SectionManagerSidebar from './SectionManagerSidebar';

// Define interfaces for our data types
interface SectionVisibility {
  [key: string]: boolean;
}

interface ElementVisibility {
  [key: string]: boolean;
}

interface LandingPageSettings {
  id: number;
  section_visibility: SectionVisibility;
  element_visibility: ElementVisibility;
  created_at?: string;
  updated_at?: string;
}

const SectionEditor = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
    // Load saved section visibility settings from Supabase
    const loadVisibilitySettings = async () => {
      try {
        console.log('Loading visibility settings from landing_page_settings');
        // Use 'any' type assertion to bypass TypeScript table name checking
        const { data, error } = await (supabase as any)
          .from('landing_page_settings')
          .select('*')
          .eq('id', 1)
          .single();
        
        console.log('Visibility settings data:', data, 'Error:', error);
        
        if (data && !error) {
          // Use type assertion to safely convert the data
          const settings = data as unknown as LandingPageSettings;
          if (settings.section_visibility) {
            console.log('Applying section visibility:', settings.section_visibility);
            applySectionVisibility(settings.section_visibility);
          }
          
          if (settings.element_visibility) {
            console.log('Applying element visibility:', settings.element_visibility);
            applyElementVisibility(settings.element_visibility);
          }
        }
      } catch (error) {
        console.error('Error loading visibility settings:', error);
      }
    };
    
    loadVisibilitySettings();
    
    // Listen for edit mode changes
    const handleEditModeChange = (event: CustomEvent) => {
      console.log('Edit mode changed:', event.detail.isEditMode);
      setIsEditMode(event.detail.isEditMode);
      
      // Open sidebar automatically when entering edit mode
      if (event.detail.isEditMode) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
    };
  }, []);
  
  // Apply stored visibility settings to sections
  const applySectionVisibility = (visibilitySettings: SectionVisibility) => {
    Object.entries(visibilitySettings).forEach(([sectionId, isVisible]) => {
      const section = document.querySelector(`[data-section-id="${sectionId}"]`);
      if (section) {
        if (isVisible) {
          section.classList.remove('hidden');
        } else {
          section.classList.add('hidden');
        }
      }
    });
  };
  
  // Apply stored visibility settings to editable elements
  const applyElementVisibility = (visibilitySettings: ElementVisibility) => {
    Object.entries(visibilitySettings).forEach(([elementId, isVisible]) => {
      const element = document.querySelector(`[data-editable-id="${elementId}"]`);
      if (element) {
        if (isVisible) {
          element.classList.remove('hidden');
        } else {
          element.classList.add('hidden');
        }
      }
    });
  };
  
  useEffect(() => {
    if (isEditMode) {
      console.log('Entering edit mode, adding section and element controls');
      
      // Add edit controls to each section when in edit mode
      document.querySelectorAll('[data-section-id]').forEach(section => {
        const sectionId = section.getAttribute('data-section-id');
        console.log('Setting up controls for section:', sectionId);
        
        // Check if controls already exist
        if (!section.querySelector('.section-edit-controls')) {
          const controlsDiv = document.createElement('div');
          controlsDiv.className = 'section-edit-controls absolute top-4 right-4 z-50 bg-white/80 backdrop-blur-sm rounded-md shadow-md p-2 flex items-center';
          
          const toggleButton = document.createElement('button');
          toggleButton.className = 'p-1 rounded-full hover:bg-gray-100';
          toggleButton.innerHTML = `<span class="sr-only">Toggle Visibility</span>`;
          
          // Set initial icon based on current visibility
          const isVisible = !section.classList.contains('hidden');
          const icon = isVisible ? 
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>` : 
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>`;
          
          toggleButton.innerHTML += icon;
          
          toggleButton.addEventListener('click', () => {
            const isSectionVisible = !section.classList.contains('hidden');
            console.log('Toggle section visibility for:', sectionId, 'current:', isSectionVisible);
            
            if (isSectionVisible) {
              section.classList.add('hidden');
              toggleButton.innerHTML = `<span class="sr-only">Toggle Visibility</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>`;
            } else {
              section.classList.remove('hidden');
              toggleButton.innerHTML = `<span class="sr-only">Toggle Visibility</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }
          });
          
          controlsDiv.appendChild(toggleButton);
          
          // Add section name label
          const label = document.createElement('span');
          label.className = 'ml-2 text-xs font-medium text-gray-700';
          label.textContent = sectionId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          controlsDiv.appendChild(label);
          
          // Use setAttribute for setting style instead of direct property assignment
          const sectionElement = section as HTMLElement;
          sectionElement.style.position = 'relative';
          section.appendChild(controlsDiv);
        }
      });

      // Add edit controls to each editable element when in edit mode
      document.querySelectorAll('[data-editable-id]').forEach(element => {
        const elementId = element.getAttribute('data-editable-id');
        console.log('Setting up controls for editable element:', elementId);
        
        // Check if controls already exist
        if (!element.querySelector('.element-edit-controls')) {
          const controlsDiv = document.createElement('div');
          controlsDiv.className = 'element-edit-controls absolute top-0 right-0 z-50 bg-white/80 backdrop-blur-sm rounded-md shadow-md p-1 flex items-center';
          
          const toggleButton = document.createElement('button');
          toggleButton.className = 'p-1 rounded-full hover:bg-gray-100';
          toggleButton.innerHTML = `<span class="sr-only">Toggle Visibility</span>`;
          
          // Set initial icon based on current visibility
          const isVisible = !element.classList.contains('hidden');
          const icon = isVisible ? 
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>` : 
            `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>`;
          
          toggleButton.innerHTML += icon;
          
          toggleButton.addEventListener('click', () => {
            const isElementVisible = !element.classList.contains('hidden');
            console.log('Toggle element visibility for:', elementId, 'current:', isElementVisible);
            
            if (isElementVisible) {
              element.classList.add('hidden');
              toggleButton.innerHTML = `<span class="sr-only">Toggle Visibility</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-600"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path><line x1="2" x2="22" y1="2" y2="22"></line></svg>`;
            } else {
              element.classList.remove('hidden');
              toggleButton.innerHTML = `<span class="sr-only">Toggle Visibility</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-600"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
            }
          });
          
          controlsDiv.appendChild(toggleButton);
          
          // Use setAttribute for setting style instead of direct property assignment
          const elementParent = element.parentElement;
          if (elementParent) {
            elementParent.style.position = 'relative';
            elementParent.appendChild(controlsDiv);
          }
        }
      });

      // Add the sidebar toggle button if it doesn't exist
      if (!document.querySelector('#section-sidebar-toggle')) {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'section-sidebar-toggle';
        toggleButton.className = 'fixed left-4 top-20 z-50 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-gray-100';
        toggleButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M9 3v18"/></svg>
          <span class="sr-only">Toggle Section Manager</span>
        `;
        
        toggleButton.addEventListener('click', () => {
          setIsSidebarOpen(prevState => !prevState);
        });
        
        document.body.appendChild(toggleButton);
      }
    } else {
      console.log('Leaving edit mode, removing section controls');
      // Remove edit controls when not in edit mode
      document.querySelectorAll('.section-edit-controls, .element-edit-controls').forEach(control => {
        control.remove();
      });
      
      // Remove the sidebar toggle button
      const toggleButton = document.querySelector('#section-sidebar-toggle');
      if (toggleButton) {
        toggleButton.remove();
      }
    }
    
    // Clean up function to remove controls and button when component unmounts
    return () => {
      document.querySelectorAll('.section-edit-controls, .element-edit-controls').forEach(control => {
        control.remove();
      });
      
      const toggleButton = document.querySelector('#section-sidebar-toggle');
      if (toggleButton) {
        toggleButton.remove();
      }
    };
  }, [isEditMode]);
  
  return (
    <>
      <SectionManagerSidebar 
        isOpen={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen} 
        isEditMode={isEditMode} 
      />
    </>
  );
};

export default SectionEditor;
