import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdminContextType {
  isSuperAdmin: boolean;
  isLoading: boolean;
  publishChanges: () => Promise<boolean>;
  loadPublishedConfig: () => Promise<void>;
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
          .from('profiles')
          .select('is_super_admin')
          .eq('id', user.id)
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

  const publishChanges = async (): Promise<boolean> => {
    if (!isSuperAdmin) {
      console.error('User is not a super admin');
      return false;
    }

    try {
      // Get current runtime config
      const { getContentConfig } = await import('@/data/contentConfig');
      const config = getContentConfig();

      const { error } = await supabase
        .from('published_content_config')
        .upsert({
          id: 1,
          config: config,
          published_by: user?.id,
          published_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error publishing changes:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error publishing changes:', error);
      return false;
    }
  };

  const loadPublishedConfig = async (): Promise<void> => {
    try {
      const { data, error } = await supabase
        .from('published_content_config')
        .select('config')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error loading published config:', error);
        return;
      }

      if (data?.config) {
        const { updateContentConfig } = await import('@/data/contentConfig');
        updateContentConfig(data.config);
      }
    } catch (error) {
      console.error('Error loading published config:', error);
    }
  };

  return (
    <AdminContext.Provider value={{
      isSuperAdmin,
      isLoading,
      publishChanges,
      loadPublishedConfig
    }}>
      {children}
    </AdminContext.Provider>
  );
};