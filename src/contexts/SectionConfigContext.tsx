import React, { createContext, useContext, useState } from 'react';
import { getContentConfig, updateContentConfig } from '@/data/contentConfig';

interface SectionConfigContextType {
  sectionVisibility: Record<string, boolean>;
  sectionOrder: Record<string, number>;
  updateSectionVisibility: (sectionId: string, visible: boolean) => void;
  updateSectionOrder: (newOrder: Record<string, number>) => void;
}

const SectionConfigContext = createContext<SectionConfigContextType | undefined>(undefined);

export const useSectionConfig = () => {
  const context = useContext(SectionConfigContext);
  if (!context) {
    throw new Error('useSectionConfig must be used within a SectionConfigProvider');
  }
  return context;
};

export const SectionConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state directly from config to avoid timing issues
  const config = getContentConfig();
  const [sectionVisibility, setSectionVisibility] = useState<Record<string, boolean>>(config.sections.visibility);
  const [sectionOrder, setSectionOrder] = useState<Record<string, number>>(config.sections.order);

  const updateSectionVisibility = (sectionId: string, visible: boolean) => {
    const updatedVisibility = { ...sectionVisibility, [sectionId]: visible };
    setSectionVisibility(updatedVisibility);
    
    updateContentConfig({
      sections: {
        ...getContentConfig().sections,
        visibility: updatedVisibility
      }
    });
  };

  const updateSectionOrder = (newOrder: Record<string, number>) => {
    setSectionOrder(newOrder);
    
    updateContentConfig({
      sections: {
        ...getContentConfig().sections,
        order: newOrder
      }
    });
  };

  return (
    <SectionConfigContext.Provider value={{
      sectionVisibility,
      sectionOrder,
      updateSectionVisibility,
      updateSectionOrder
    }}>
      {children}
    </SectionConfigContext.Provider>
  );
};