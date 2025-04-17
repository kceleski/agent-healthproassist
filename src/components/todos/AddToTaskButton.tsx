
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export interface AddToTaskButtonProps {
  actionText: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick?: (e: React.MouseEvent, actionText: string, priority?: 'low' | 'medium' | 'high') => void;
}

const AddToTaskButton: React.FC<AddToTaskButtonProps> = ({
  actionText,
  size = "default",
  variant = "default",
  onClick
}) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      // Default to medium priority if not specified
      onClick(e, actionText, 'medium');
    }
  };

  return (
    <Button
      onClick={handleClick}
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
