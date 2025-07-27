import { useState, useRef } from 'react';
import { useTextStore } from '@/contexts/TextStore';

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
  const textStore = useTextStore();
  
  // If context is not available, render as non-editable text
  if (!textStore) {
    const Component = as as any;
    return (
      <Component className={className}>
        {children}
      </Component>
    );
  }
  
  const { getText, setText, isEditMode } = textStore;
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef<HTMLElement | null>(null);

  // Get the current text (either from store or default from children)
  const defaultText = typeof children === 'string' ? children : contentRef.current?.textContent || '';
  const currentText = getText(id, defaultText);

  const handleClick = () => {
    if (isEditMode && !isEditing) {
      setIsEditing(true);
      
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

  const saveContent = () => {
    if (contentRef.current && isEditing) {
      const newText = contentRef.current.textContent || '';
      contentRef.current.contentEditable = 'false';
      setText(id, newText);
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
        if (contentRef.current) {
          contentRef.current.textContent = currentText;
          contentRef.current.contentEditable = 'false';
        }
        setIsEditing(false);
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
        isEditMode ? 'hover:ring-2 hover:ring-primary/50 hover:cursor-text transition-all' : ''
      } ${
        isEditing ? 'ring-2 ring-primary outline-none bg-background/80 rounded px-1' : ''
      }`}
      onClick={handleClick}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      data-editable-text-id={id}
      suppressContentEditableWarning={true}
      title={isEditMode ? 'Click to edit this text' : undefined}
    >
      {currentText || children}
    </Component>
  );
};

export default EditableText;
