import React, { createContext, useContext, useState, useEffect } from 'react';

interface TextStoreContextType {
  getText: (id: string, defaultText: string) => string;
  setText: (id: string, text: string) => void;
  isEditMode: boolean;
  setEditMode: (mode: boolean) => void;
}

const TextStoreContext = createContext<TextStoreContextType | undefined>(undefined);

export const useTextStore = () => {
  const context = useContext(TextStoreContext);
  if (!context) {
    throw new Error('useTextStore must be used within a TextStoreProvider');
  }
  return context;
};

export const TextStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [texts, setTexts] = useState<Record<string, string>>({});
  const [isEditMode, setEditMode] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('editableTexts');
    if (saved) {
      try {
        setTexts(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to load saved texts:', e);
      }
    }
  }, []);

  // Save to localStorage when texts change
  useEffect(() => {
    if (Object.keys(texts).length > 0) {
      localStorage.setItem('editableTexts', JSON.stringify(texts));
    }
  }, [texts]);

  const getText = (id: string, defaultText: string): string => {
    return texts[id] || defaultText;
  };

  const setText = (id: string, text: string) => {
    setTexts(prev => ({ ...prev, [id]: text }));
  };

  return (
    <TextStoreContext.Provider value={{ getText, setText, isEditMode, setEditMode }}>
      {children}
    </TextStoreContext.Provider>
  );
};