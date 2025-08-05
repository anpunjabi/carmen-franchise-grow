import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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
      const { exportContentConfig } = require('@/data/contentConfig');
      const configCode = exportContentConfig();
      
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