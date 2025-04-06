
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="focus:outline-none">
          <Avatar className="h-9 w-9 cursor-pointer bg-gradient-to-r from-carmen-blue to-carmen-light-blue">
            <AvatarFallback className="text-white font-semibold">{getInitials()}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-2">
          <p className="text-sm font-medium truncate px-2 py-1">
            {user.email}
          </p>
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
