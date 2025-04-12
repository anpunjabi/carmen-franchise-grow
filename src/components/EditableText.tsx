
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EditableTextProps {
  id: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

// Define the content_edits interface to match our database structure
interface ContentEdit {
  id: string;
  content: string;
  created_at?: string;
  updated_at: string;
}

const EditableText: React.FC<EditableTextProps> = ({ 
  id, 
  children, 
  as = 'span', 
  className = ''
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const contentRef = useRef<HTMLElement | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');
  const [contentLoaded, setContentLoaded] = useState(false);
  const [loadedContent, setLoadedContent] = useState<string | null>(null);

  // Check if user is in admin edit mode
  useEffect(() => {
    const handleEditModeChange = (event: CustomEvent) => {
      setIsEditMode(event.detail.isEditMode);
      if (!event.detail.isEditMode && isEditing) {
        setIsEditing(false);
      }
    };
    
    window.addEventListener('editmodechange', handleEditModeChange as EventListener);
    
    return () => {
      window.removeEventListener('editmodechange', handleEditModeChange as EventListener);
    };
  }, [isEditing]);
  
  // Check if user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('users')
            .select('"Carmen Admin"')
            .eq('user_id', user.id)
            .single();
          
          if (data && !error) {
            setIsAdmin(data['Carmen Admin'] === true);
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  const handleClick = () => {
    if (isEditMode && isAdmin && !isEditing) {
      setIsEditing(true);
      // Store original content for potential cancel
      setOriginalContent(contentRef.current?.innerHTML || '');
      
      // Make content editable and focus
      if (contentRef.current) {
        contentRef.current.contentEditable = 'true';
        contentRef.current.focus();
        
        // Select all text to make it easier to replace
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const handleBlur = async () => {
    if (isEditing) {
      // Make content non-editable
      if (contentRef.current) {
        contentRef.current.contentEditable = 'false';
        
        // Save the edited content to Supabase
        const newContent = contentRef.current.innerHTML;
        
        if (newContent !== originalContent) {
          try {
            console.log('Saving content for ID:', id, 'Content:', newContent);
            
            // Use type assertion to tell TypeScript about our content_edits table
            const { error } = await (supabase as any)
              .from('content_edits')
              .upsert(
                { 
                  id, 
                  content: newContent,
                  updated_at: new Date().toISOString()
                } as ContentEdit,
                { onConflict: 'id' }
              );
            
            if (error) {
              console.error('Error saving edited content:', error);
              throw error;
            }
            
            // Update the loadedContent state with the new content
            setLoadedContent(newContent);
            
            toast({
              title: "Content updated",
              description: "Text has been saved successfully.",
            });
          } catch (error) {
            console.error('Error saving edited content:', error);
            
            // Revert to original content on error
            if (contentRef.current) {
              contentRef.current.innerHTML = originalContent;
            }
            
            toast({
              title: "Error saving changes",
              description: "There was a problem updating the text.",
              variant: "destructive",
            });
          }
        }
      }
      
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Escape') {
        // Cancel edit and revert to original content
        if (contentRef.current) {
          contentRef.current.innerHTML = originalContent;
          contentRef.current.contentEditable = 'false';
        }
        setIsEditing(false);
        e.preventDefault();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        // Save on Enter (unless Shift is held for newline)
        handleBlur();
        e.preventDefault();
      }
    }
  };

  // Load saved content from Supabase
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log('Loading content for ID:', id);
        
        const { data, error } = await (supabase as any)
          .from('content_edits')
          .select('content')
          .eq('id', id)
          .single();
        
        if (data && !error) {
          console.log('Content loaded:', data.content);
          setLoadedContent(data.content);
        } else if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error code
          console.error('Error loading content:', error);
        } else {
          console.log('No saved content found, using default');
        }
        
        setContentLoaded(true);
      } catch (error) {
        console.error('Error loading content:', error);
        setContentLoaded(true);
      }
    };
    
    loadContent();
  }, [id]);

  // Update the ref content when loadedContent changes
  useEffect(() => {
    if (contentRef.current && loadedContent) {
      contentRef.current.innerHTML = loadedContent;
    }
  }, [loadedContent, contentRef]);

  // Create the element based on the "as" prop
  const Component = as as any;

  return (
    <Component
      ref={contentRef}
      className={`${className} ${isEditMode && isAdmin ? 'hover:ring-2 hover:ring-carmen-teal hover:ring-opacity-50 hover:cursor-text' : ''} ${isEditing ? 'ring-2 ring-carmen-teal ring-opacity-100 outline-none' : ''}`}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-editable-text-id={id}
      suppressContentEditableWarning={true}
    >
      {(!loadedContent && contentLoaded) ? children : null}
    </Component>
  );
};

export default EditableText;
