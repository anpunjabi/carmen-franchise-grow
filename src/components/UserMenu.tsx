
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import { useTextStore } from '@/contexts/TextStore';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Save, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { ColorSchemeEditor } from './ColorSchemeEditor';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { isSuperAdmin, exportConfig } = useAdmin();
  const { toast: uiToast } = useToast();
  const textStore = useTextStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showColorEditor, setShowColorEditor] = useState(false);
  
  // Get edit mode from text store
  const isEditMode = textStore?.isEditMode || false;

  // Admin status is now handled by AdminContext

  if (!user) return null;

  const getInitials = () => {
    if (!user.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const toggleEditMode = () => {
    if (textStore) {
      textStore.setEditMode(!isEditMode);
    }
    setIsOpen(false);
    
    // Still dispatch for compatibility with other components
    window.dispatchEvent(new CustomEvent('editmodechange', { 
      detail: { isEditMode: !isEditMode }
    }));
  };

  const saveEdits = async () => {
    setIsSaving(true);
    
    try {
      // Exit edit mode
      if (textStore) {
        textStore.setEditMode(false);
      }
      
      // Export current configuration to file for super admin
      exportConfig();
      
      window.dispatchEvent(new CustomEvent('editmodechange', { 
        detail: { isEditMode: false }
      }));
      
      uiToast({
        title: "Configuration exported",
        description: "Your changes have been exported to a file.",
      });
      
      toast.success("Configuration exported successfully");
    } catch (error) {
      console.error('Error in saveEdits:', error);
      uiToast({
        title: "Error exporting configuration",
        description: "There was a problem exporting your changes.",
        variant: "destructive",
      });
      
      toast.error("Error exporting configuration");
    } finally {
      setIsSaving(false);
      setIsOpen(false);
    }
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="focus:outline-none">
            <Avatar className="h-9 w-9 cursor-pointer bg-white border-2 border-carmen-blue">
              <AvatarFallback className="text-carmen-blue font-semibold">{getInitials()}</AvatarFallback>
            </Avatar>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-2" align="end">
          <div className="space-y-2">
            <p className="text-sm font-medium truncate px-2 py-1">
              {user.email}
            </p>
            
            {isSuperAdmin && (
              <>
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2"
                  onClick={isEditMode ? saveEdits : toggleEditMode}
                  disabled={isSaving}
                >
                  {isEditMode ? (
                    <>
                      <Save className="mr-2 h-4 w-4 text-green-500" />
                      {isSaving ? "Saving..." : "Save Edits"}
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start px-2"
                  onClick={() => {
                    setShowColorEditor(true);
                    setIsOpen(false);
                  }}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Colors
                </Button>
              </>
            )}
            
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 px-2"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      
      <ColorSchemeEditor 
        isVisible={showColorEditor} 
        onClose={() => setShowColorEditor(false)} 
      />
    </>
  );
};

export default UserMenu;
