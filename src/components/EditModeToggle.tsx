
import { useTextStore } from '@/contexts/TextStore';
import { Button } from '@/components/ui/button';
import { Edit3, Save, Download } from 'lucide-react';

export const EditModeToggle: React.FC = () => {
  const textStore = useTextStore();
  
  // If context is not available, don't render the toggle
  if (!textStore) {
    return null;
  }
  
  const { isEditMode, setEditMode, exportConfig } = textStore;

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">
      {isEditMode && (
        <Button
          variant="outline"
          size="sm"
          onClick={exportConfig}
          className="bg-green-500 hover:bg-green-600 text-white border-green-500"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Config
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setEditMode(!isEditMode)}
      >
        {isEditMode ? (
          <>
            <Save className="w-4 h-4 mr-2" />
            Exit Edit
          </>
        ) : (
          <>
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Mode
          </>
        )}
      </Button>
    </div>
  );
};
