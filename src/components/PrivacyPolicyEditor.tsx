
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface PrivacyPolicyEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  onCancel: () => void;
}

const PrivacyPolicyEditor = ({ initialContent, onSave, onCancel }: PrivacyPolicyEditorProps) => {
  const [content, setContent] = useState(initialContent);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    onSave(content);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-2">
        <p>Use Markdown to format your content. Examples:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li># Heading 1</li>
          <li>## Heading 2</li>
          <li>**Bold text**</li>
          <li>- List item</li>
        </ul>
      </div>
      <textarea
        className="w-full h-[500px] p-4 border rounded-md focus:ring-2 focus:ring-carmen-blue focus:border-transparent"
        value={content}
        onChange={handleTextChange}
      />
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default PrivacyPolicyEditor;
