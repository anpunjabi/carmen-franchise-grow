import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Palette, Save, RotateCcw } from 'lucide-react';

interface ColorSchemeEditorProps {
  isVisible: boolean;
  onClose: () => void;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  [key: string]: string;
}

const defaultColors: ColorScheme = {
  primary: '212 100% 45%',
  secondary: '240 80% 87%',
  accent: '240 80% 87%',
  background: '0 0% 100%',
  foreground: '222.2 84% 4.9%',
  muted: '210 30% 96%'
};

export const ColorSchemeEditor: React.FC<ColorSchemeEditorProps> = ({ isVisible, onClose }) => {
  const [colors, setColors] = useState<ColorScheme>(defaultColors);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isVisible) {
      loadCurrentTheme();
    }
  }, [isVisible]);

  const loadCurrentTheme = async () => {
    try {
      const { data, error } = await supabase
        .from('bpm_theme_settings')
        .select('theme')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.theme && typeof data.theme === 'object') {
        // Ensure all color values are strings and validate them
        const themeColors = data.theme as Record<string, any>;
        const validatedColors: ColorScheme = { ...defaultColors };
        
        Object.entries(themeColors).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim()) {
            validatedColors[key] = value;
          }
        });
        
        setColors(validatedColors);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  };

  const applyColors = (newColors: ColorScheme) => {
    const root = document.documentElement;
    Object.entries(newColors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  };

  const handleColorChange = (colorKey: keyof ColorScheme, value: string) => {
    const newColors = { ...colors, [colorKey]: value };
    setColors(newColors);
    applyColors(newColors);
  };

  const saveTheme = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('bpm_theme_settings')
        .upsert({
          bpm_id: '00000000-0000-0000-0000-000000000001', // Default BPM ID
          theme: colors as any,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Theme saved",
        description: "Your color scheme has been saved successfully.",
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast({
        title: "Error",
        description: "Failed to save color scheme.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetToDefault = () => {
    setColors(defaultColors);
    applyColors(defaultColors);
  };

  const hslToHex = (hsl: string): string => {
    // Validate input - ensure it's a string and has content
    if (!hsl || typeof hsl !== 'string') {
      console.warn('Invalid HSL value provided to hslToHex:', hsl);
      return '#000000'; // Return black as fallback
    }
    
    const parts = hsl.trim().split(' ');
    if (parts.length !== 3) {
      console.warn('Invalid HSL format:', hsl);
      return '#000000';
    }
    
    const [h, s, l] = parts.map(v => parseFloat(v.replace('%', '')));
    
    // Validate parsed values
    if (isNaN(h) || isNaN(s) || isNaN(l)) {
      console.warn('Invalid HSL values after parsing:', { h, s, l });
      return '#000000';
    }
    
    const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = (l / 100) - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-gray-900">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Palette className="w-5 h-5" />
            Color Scheme Editor
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800">
            ×
          </Button>
        </CardHeader>
        <CardContent className="space-y-6 bg-white dark:bg-gray-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(colors).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id={key}
                    type="color"
                    value={hslToHex(value)}
                    onChange={(e) => handleColorChange(key as keyof ColorScheme, hexToHsl(e.target.value))}
                    className="w-16 h-10 p-1 rounded"
                  />
                  <Input
                    value={value}
                    onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                    placeholder="HSL values (e.g., 212 100% 45%)"
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={saveTheme} disabled={isLoading} className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save Theme
            </Button>
            <Button onClick={resetToDefault} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};