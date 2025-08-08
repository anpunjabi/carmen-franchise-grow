import React, { createContext, useContext, useState, useEffect } from 'react';
import { getContentConfig, updateContentConfig } from '@/data/contentConfig';
import { supabase } from '@/integrations/supabase/client';
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

export const TextStoreProvider: React.FC<{ children: React.ReactNode; localOnly?: boolean }> = ({ children, localOnly = false }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isEditMode, setEditMode] = useState(false);

  // Load texts from content config and optionally Supabase on mount
  useEffect(() => {
    const config = getContentConfig();
    const pageId = typeof window !== 'undefined' ? window.location.pathname : 'global';
    
    if (localOnly) {
      // Front-end only: merge localStorage edits for this page
      try {
        const stored = localStorage.getItem(`textStore:${pageId}`);
        const localEdits = stored ? JSON.parse(stored) as Record<string, string> : {};
        const merged = { ...config.texts, ...localEdits };
        updateContentConfig({ texts: merged });
        setTexts(merged);
      } catch (e) {
        console.error('Error loading local text edits:', e);
        setTexts(config.texts);
      }
      return; // Skip Supabase fetching
    }

    setTexts(config.texts);

    // Fetch global edits from Supabase so everyone sees the same content
    const loadEdits = async () => {
      try {
        const { data, error } = await supabase
          .from('content_edits')
          .select('id, content, page_identifier');

        if (error) {
          console.error('Failed to load content edits:', error.message);
          return;
        }

        if (data) {
          // Prefer page-specific edits over global ones
          const dbTexts: Record<string, string> = {};
          for (const row of data) {
            const key = row.id as string;
            const isPageSpecific = row.page_identifier && pageId && row.page_identifier === pageId;
            if (!(key in dbTexts) || isPageSpecific) {
              dbTexts[key] = row.content as string;
            }
          }

          const merged = { ...config.texts, ...dbTexts };
          updateContentConfig({ texts: merged });
          setTexts(merged);
        }
      } catch (e) {
        console.error('Unexpected error loading content edits:', e);
      }
    };

    loadEdits();
  }, [localOnly]);
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

    const pageId = typeof window !== 'undefined' ? window.location.pathname : 'global';

    if (localOnly) {
      // Front-end only persistence
      try {
        localStorage.setItem(`textStore:${pageId}`, JSON.stringify(updatedTexts));
      } catch (e) {
        console.error('Failed to save local text edit:', e);
      }
      return;
    }

    // Persist globally via Supabase Edge Function
    supabase.functions.invoke('upsert-content-edit', {
      body: { id, content: text, page_identifier: pageId }
    }).then(({ error }) => {
      if (error) {
        console.error('Failed to persist content edit:', error.message || error);
      }
    }).catch((e) => {
      console.error('Unexpected error persisting content edit:', e);
    });
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