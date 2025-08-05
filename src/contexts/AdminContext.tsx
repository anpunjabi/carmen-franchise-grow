import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { getContentConfig } from '@/data/contentConfig';

interface AdminContextType {
  isSuperAdmin: boolean;
  isLoading: boolean;
  exportConfig: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Check if user is super admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_super_admin')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          setIsSuperAdmin(false);
        } else {
          setIsSuperAdmin(data?.is_super_admin || false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsSuperAdmin(false);
      }

      setIsLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  const exportConfig = () => {
    try {
      // Get current runtime config and export it
      const currentConfig = getContentConfig();
      console.log('Exporting config:', currentConfig);
      
      const configCode = `import { Module } from './moduleData';
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

export const defaultContentConfig: ContentConfig = ${JSON.stringify(currentConfig, null, 2)};

// Runtime storage for edits (in-memory only)
let runtimeConfig: ContentConfig = JSON.parse(JSON.stringify(defaultContentConfig));

export const getContentConfig = (): ContentConfig => {
  return runtimeConfig;
};

export const updateContentConfig = (updates: Partial<ContentConfig>): void => {
  runtimeConfig = {
    ...runtimeConfig,
    ...updates,
    meta: {
      ...runtimeConfig.meta,
      lastUpdated: new Date().toISOString(),
    }
  };
};

export const resetContentConfig = (): void => {
  runtimeConfig = JSON.parse(JSON.stringify(defaultContentConfig));
};

export const exportContentConfig = (): string => {
  return JSON.stringify(runtimeConfig, null, 2);
};`;
      
      // Create and download file
      const blob = new Blob([configCode], { type: 'text/typescript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contentConfig.ts';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Config exported successfully');
    } catch (error) {
      console.error('Error exporting config:', error);
    }
  };

  return (
    <AdminContext.Provider value={{
      isSuperAdmin,
      isLoading,
      exportConfig
    }}>
      {children}
    </AdminContext.Provider>
  );
};