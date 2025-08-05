import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface TextStoreContextType {
  getText: (id: string, defaultText: string) => string;
  setText: (id: string, text: string) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
}

const TextStoreContext = createContext<TextStoreContextType | undefined>(undefined);

export const useTextStore = () => {
  const context = useContext(TextStoreContext);
  return context; // Return undefined if not within provider instead of throwing
};

export const TextStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isEditMode, setEditMode] = useState(false);
  const { user } = useAuth() || {};

  // Load texts from Supabase on mount
  useEffect(() => {
    const loadTexts = async () => {
      try {
        // Try to get from landing_page_settings table using element_visibility column for text data
        const { data, error } = await supabase
          .from('landing_page_settings')
          .select('element_visibility')
          .eq('page_identifier', 'home_texts')
          .maybeSingle();

        if (error) {
          console.warn('Error loading texts from database:', error);
          // Fallback to localStorage
          const saved = localStorage.getItem('editableTexts');
          if (saved) {
            try {
              setTexts(JSON.parse(saved));
            } catch (e) {
              console.warn('Failed to load saved texts from localStorage:', e);
            }
          }
          return;
        }

        if (data?.element_visibility) {
          const textsFromDb = data.element_visibility as Record<string, string>;
          setTexts(textsFromDb);
          
          // Also save to localStorage as cache
          localStorage.setItem('editableTexts', JSON.stringify(textsFromDb));
        } else {
          // Fallback to localStorage if no data in database
          const saved = localStorage.getItem('editableTexts');
          if (saved) {
            try {
              setTexts(JSON.parse(saved));
            } catch (e) {
              console.warn('Failed to load saved texts from localStorage:', e);
            }
          }
        }
      } catch (error) {
        console.warn('Error in loadTexts:', error);
        // Fallback to localStorage
        const saved = localStorage.getItem('editableTexts');
        if (saved) {
          try {
            setTexts(JSON.parse(saved));
          } catch (e) {
            console.warn('Failed to load saved texts from localStorage:', e);
          }
        }
      }
    };

    loadTexts();
  }, []);

  const getText = (id: string, defaultText: string): string => {
    return texts[id] || defaultText;
  };

  const setText = async (id: string, text: string) => {
    // Update local state immediately
    setTexts(prev => ({ ...prev, [id]: text }));
    
    // Save to localStorage as cache
    const updatedTexts = { ...texts, [id]: text };
    localStorage.setItem('editableTexts', JSON.stringify(updatedTexts));

    // Save to Supabase if user is super admin
    if (user?.user_metadata?.is_super_admin) {
      try {
        const { error } = await supabase
          .from('landing_page_settings')
          .upsert({
            page_identifier: 'home_texts',
            element_visibility: updatedTexts,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving text to database:', error);
        }
      } catch (error) {
        console.error('Error in setText database save:', error);
      }
    }
  };

  return (
    <TextStoreContext.Provider value={{ getText, setText, isEditMode, setEditMode }}>
      {children}
    </TextStoreContext.Provider>
  );
};