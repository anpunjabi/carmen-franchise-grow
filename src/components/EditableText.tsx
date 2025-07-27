import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface EditableTextProps {
  id: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
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
  const contentRef = useRef<HTMLElement | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');

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
            .select('is_super_admin')
            .eq('user_id', user.id)
            .single();
          
          if (data && !error) {
            setIsAdmin(data.is_super_admin === true);
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

  const handleBlur = () => {
    if (isEditing) {
      // Make content non-editable
      if (contentRef.current) {
        contentRef.current.contentEditable = 'false';
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
      {children}
    </Component>
  );
};

export default EditableText;