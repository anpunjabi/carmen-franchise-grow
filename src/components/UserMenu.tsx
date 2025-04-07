
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isCarmenAdmin, setIsCarmenAdmin] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        console.log('Checking admin status for user:', user.id, user.email);
        try {
          const { data, error } = await supabase
            .from('users')
            .select('"Carmen Admin"')
            .eq('user_id', user.id)
            .single();
          
          console.log('Admin check response:', { data, error });
          
          if (data && !error) {
            setIsCarmenAdmin(data['Carmen Admin'] === true);
            console.log('User Carmen Admin status:', data['Carmen Admin']);
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

  // Generate user initials from email
  const getInitials = () => {
    if (!user.email) return '?';
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsOpen(false);
    
    // Dispatch event to notify that edit mode changed
    window.dispatchEvent(new CustomEvent('editmodechange', { 
      detail: { isEditMode: !isEditMode }
    }));
  };

  const saveEdits = async () => {
    // Show saving state
    setIsSaving(true);
    
    // Get the current visibility states of sections
    const sectionVisibility = {};
    const sections = document.querySelectorAll('[data-section-id]');
    
    sections.forEach(section => {
      const sectionId = section.getAttribute('data-section-id');
      const isVisible = !section.classList.contains('hidden');
      sectionVisibility[sectionId] = isVisible;
    });

    // Save to Supabase using the dedicated landing_page_settings table
    try {
      const { error } = await supabase
        .from('landing_page_settings')
        .update({ 
          section_visibility: sectionVisibility,
          updated_at: new Date()
        })
        .eq('id', 1); // Use the first record (we only have one)
      
      if (error) throw error;
      
      // Show success toast
      toast({
        title: "Changes saved",
        description: "Section visibility settings have been updated.",
      });
      
      // Exit edit mode
      setIsEditMode(false);
      
      // Notify other components about edit mode change
      window.dispatchEvent(new CustomEvent('editmodechange', { 
        detail: { isEditMode: false }
      }));
      
    } catch (error) {
      console.error('Error saving section visibility:', error);
      
      // Show error toast
      toast({
        title: "Error saving changes",
        description: "There was a problem saving your settings.",
        variant: "destructive",
      });
    } finally {
      // Hide saving state
      setIsSaving(false);
      // Close the menu
      setIsOpen(false);
    }
  };

  return (
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
  );
};

export default UserMenu;
