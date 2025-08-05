import React, { createContext, useContext, useState, useEffect } from 'react';
import { getContentConfig, updateContentConfig } from '@/data/contentConfig';

interface TextStoreContextType {
  getText: (id: string, defaultText: string) => string;
  setText: (id: string, text: string) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
  exportConfig: () => void;
}

const TextStoreContext = createContext<TextStoreContextType | undefined>(undefined);

export const useTextStore = () => {
  const context = useContext(TextStoreContext);
  return context; // Return undefined if not within provider instead of throwing
};

export const TextStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isEditMode, setEditMode] = useState(false);

  // Load texts from content config on mount
  useEffect(() => {
    const config = getContentConfig();
    setTexts(config.texts);
  }, []);

  const getText = (id: string, defaultText: string): string => {
    // Always read from the current runtime config to ensure freshest data
    const config = getContentConfig();
    return config.texts[id] || defaultText;
  };

  const setText = (id: string, text: string) => {
    // Update runtime config first
    const currentConfig = getContentConfig();
    const updatedTexts = { ...currentConfig.texts, [id]: text };
    
    updateContentConfig({
      texts: updatedTexts
    });
    
    // Update local state to trigger re-renders
    setTexts(updatedTexts);
  };

  const exportConfig = () => {
    const config = getContentConfig();
    const configString = `import { Module } from './moduleData';
import { modules } from './moduleData';

export interface ContentConfig {
  texts: Record<string, string>;
  sections: {
    visibility: Record<string, boolean>;
    order: Record<string, number>;
  };
  modules: Module[];
  images: Record<string, string>;
  meta: {
    version: string;
    lastUpdated: string;
  };
}

export const defaultContentConfig: ContentConfig = ${JSON.stringify(config, null, 2)};

// ... keep existing code (helper functions)`;
    
    const blob = new Blob([configString], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contentConfig.ts';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <TextStoreContext.Provider value={{ getText, setText, isEditMode, setEditMode, exportConfig }}>
      {children}
    </TextStoreContext.Provider>
  );
};