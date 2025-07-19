import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const ThemeLoader = () => {
  useEffect(() => {
    const loadAndApplyTheme = async () => {
      try {
        const { data, error } = await supabase
          .from('bpm_theme_settings')
          .select('theme')
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading theme:', error);
          return;
        }

        if (data?.theme && typeof data.theme === 'object') {
          const theme = data.theme as Record<string, string>;
          const root = document.documentElement;
          
          Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
          });
        }
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    };

    loadAndApplyTheme();
  }, []);

  return null;
};