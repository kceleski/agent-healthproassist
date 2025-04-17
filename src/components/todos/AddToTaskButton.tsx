
// This is a modified version to match the props expected in CalendarPage.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export interface AddToTaskButtonProps {
  actionText: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: (e: any) => void;
}

const AddToTaskButton: React.FC<AddToTaskButtonProps> = ({
  actionText,
  size = "default",
  variant = "default",
  onClick
}) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      variant={variant}
      className="flex items-center gap-1"
    >
      <PlusCircle className="h-4 w-4" />
      <span>{actionText}</span>
    </Button>
  );
};

export default AddToTaskButton;
