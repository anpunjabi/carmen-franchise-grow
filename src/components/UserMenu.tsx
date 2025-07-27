
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
  const { toast: uiToast } = useToast();
  const textStore = useTextStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isCarmenAdmin, setIsCarmenAdmin] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showColorEditor, setShowColorEditor] = useState(false);

  // Use TextStore's edit mode if available, otherwise fallback to false
  const isEditMode = textStore?.isEditMode || false;
  const setEditMode = textStore?.setEditMode;

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        console.log('Checking admin status for user:', user.id, user.email);
        try {
          const { data, error } = await supabase
            .from('users')
            .select('is_super_admin')
            .eq('user_id', user.id)
            .single();
          
          console.log('Admin check response:', { data, error });
          
          if (data && !error) {
            setIsCarmenAdmin(data.is_super_admin === true);
            console.log('User is_super_admin status:', data.is_super_admin);
          } else if (error) {
            console.error('Error checking admin status:', error);
          }
        } catch (e) {
          console.error('Exception checking admin status:', e);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

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
    if (setEditMode) {
      setEditMode(!isEditMode);
    }
    setIsOpen(false);
  };

  const saveEdits = async () => {
    setIsSaving(true);
    
    try {
      // Exit edit mode - TextStore will handle localStorage persistence
      if (setEditMode) {
        setEditMode(false);
      }
      
      uiToast({
        title: "Changes saved",
        description: "Your edits have been applied to the landing page.",
      });
      
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error('Error in saveEdits:', error);
      uiToast({
        title: "Error saving changes",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
      
      toast.error("Error saving changes");
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
            
            {isCarmenAdmin && (
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
