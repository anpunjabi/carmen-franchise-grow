import { useTextStore } from '@/contexts/TextStore';
import { Button } from '@/components/ui/button';
import { Edit3, Save } from 'lucide-react';

export const EditModeToggle: React.FC = () => {
  const { isEditMode, setEditMode } = useTextStore();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setEditMode(!isEditMode)}
      className="fixed top-4 right-4 z-50"
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
  );
};