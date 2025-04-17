
import { Button, ButtonProps } from '@/components/ui/button';
import { CirclePlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { createTodoItem } from '@/services/todoService';

interface AddToTaskButtonProps extends Omit<ButtonProps, 'onClick'> {
  actionText: string;
  priority?: 'low' | 'medium' | 'high';
  redirectAfterAdd?: boolean;
}

const AddToTaskButton = ({ 
  actionText, 
  priority = 'medium', 
  redirectAfterAdd = false,
  ...props 
}: AddToTaskButtonProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToTasks = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to add tasks");
      return;
    }

    try {
      const todo = await createTodoItem({
        user_id: user.id,
        title: actionText,
        priority: priority,
        due_date: new Date().toISOString(),
      });

      if (todo) {
        toast.success("Added to your tasks");
        if (redirectAfterAdd) {
          navigate('/calendar?tab=todo');
        }
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    }
  };

  return (
    <Button onClick={handleAddToTasks} {...props}>
      <CirclePlus className="mr-1 h-4 w-4" />
      Add to Tasks
    </Button>
  );
};

export default AddToTaskButton;
