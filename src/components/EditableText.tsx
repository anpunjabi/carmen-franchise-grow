import { useState, useEffect, useRef } from 'react';

interface EditableTextProps {
  id: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

// Simple frontend service to update component files
const updateComponentText = async (id: string, newContent: string) => {
  // This would normally save to a backend, but we're keeping it frontend-only
  // The actual text updates happen when we modify the component files directly
  console.log(`Updating ${id} with new content:`, newContent);
  
  // Store the change in localStorage as a backup
  const changes = JSON.parse(localStorage.getItem('editableTextChanges') || '{}');
  changes[id] = newContent;
  localStorage.setItem('editableTextChanges', JSON.stringify(changes));
};

const EditableText: React.FC<EditableTextProps> = ({ 
  id, 
  children, 
  as = 'span', 
  className = ''
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<string>('');
  const contentRef = useRef<HTMLElement | null>(null);
  const [originalContent, setOriginalContent] = useState<string>('');

  // Check if user is in admin edit mode (listen for global edit mode changes)
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

  // Initialize content from children
  useEffect(() => {
    if (contentRef.current) {
      setContent(contentRef.current.innerHTML);
    }
  }, [children]);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      setOriginalContent(contentRef.current?.innerHTML || '');
      
      // Make content editable and focus
      if (contentRef.current) {
        contentRef.current.contentEditable = 'true';
        contentRef.current.focus();
        
        // Select all text
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(contentRef.current);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const saveContent = async () => {
    if (contentRef.current && isEditing) {
      const newContent = contentRef.current.innerHTML;
      contentRef.current.contentEditable = 'false';
      
      // Save the content
      await updateComponentText(id, newContent);
      setContent(newContent);
      setIsEditing(false);
      
      // Show success message
      console.log(`Saved changes for ${id}`);
    }
  };

  const cancelEdit = () => {
    if (contentRef.current && isEditing) {
      contentRef.current.innerHTML = originalContent;
      contentRef.current.contentEditable = 'false';
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    if (isEditing) {
      saveContent();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isEditing) {
      if (e.key === 'Escape') {
        cancelEdit();
        e.preventDefault();
      } else if (e.key === 'Enter' && !e.shiftKey) {
        saveContent();
        e.preventDefault();
      }
    }
  };

  const Component = as as any;

  return (
    <Component
      ref={contentRef}
      className={`${className} ${
        isEditMode ? 'hover:ring-2 hover:ring-blue-400 hover:ring-opacity-50 hover:cursor-text transition-all' : ''
      } ${
        isEditing ? 'ring-2 ring-blue-500 ring-opacity-100 outline-none bg-white/80 rounded px-1' : ''
      }`}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-editable-text-id={id}
      suppressContentEditableWarning={true}
      title={isEditMode ? 'Click to edit this text' : undefined}
    >
      {children}
    </Component>
  );
};

export default EditableText;
