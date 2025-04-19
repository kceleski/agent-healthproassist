
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { TodoItem, createTodoItem, getTodoItems, updateTodoItem, deleteTodoItem, generateAIRecommendations } from '@/services/todoService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, Circle, List, Plus, Sparkles, Calendar as CalendarIcon, User, Building, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const TodoList = () => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const [newTodo, setNewTodo] = useState<Omit<TodoItem, 'id' | 'completed' | 'created_at'>>({
    user_id: user?.id || '',
    title: '',
    description: '',
    priority: 'medium',
    due_date: new Date().toISOString(),
  });
  const [aiRecommendations, setAiRecommendations] = useState<TodoItem[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Update the user_id in newTodo when the user changes
      setNewTodo(prev => ({ ...prev, user_id: user.id }));
      loadTodos();
    }
  }, [user]);

  const loadTodos = async () => {
    setIsLoading(true);
    try {
      if (!user?.id) return;
      
      const items = await getTodoItems(user.id);
      setTodos(items);
    } catch (error) {
      console.error("Error loading todos:", error);
      toast.error("Failed to load to-do items");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async () => {
    try {
      if (!user?.id || !newTodo.title) {
        toast.error("Please provide a task title");
        return;
      }

      const todoItem = await createTodoItem({
        ...newTodo,
        user_id: user.id,
        priority: newTodo.priority,
      });

      if (todoItem) {
        setTodos(prev => [todoItem, ...prev]);
        setIsAddDialogOpen(false);
        setNewTodo({
          user_id: user.id,
          title: '',
          description: '',
          priority: 'medium',
          due_date: new Date().toISOString(),
        });
        toast.success("Task added successfully");
      }
    } catch (error) {
      console.error("Error adding todo:", error);
      toast.error("Failed to add task");
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const success = await updateTodoItem(id, { completed: !completed });
      if (success) {
        setTodos(todos.map(todo => 
          todo.id === id ? { ...todo, completed: !completed } : todo
        ));
      }
    } catch (error) {
      console.error("Error updating todo:", error);
      toast.error("Failed to update task status");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const success = await deleteTodoItem(id);
      if (success) {
        setTodos(todos.filter(todo => todo.id !== id));
        toast.success("Task deleted");
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      toast.error("Failed to delete task");
    }
  };

  const handleGetAIRecommendations = async () => {
    if (!user?.id) return;
    
    setIsLoadingRecommendations(true);
    try {
      const recommendations = await generateAIRecommendations(user.id);
      setAiRecommendations(recommendations);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      toast.error("Failed to generate recommendations");
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const handleAddRecommendation = async (recommendation: TodoItem) => {
    try {
      if (!user?.id) return;
      
      const todoItem = await createTodoItem({
        ...recommendation,
        user_id: user.id,
      });

      if (todoItem) {
        setTodos(prev => [todoItem, ...prev]);
        setAiRecommendations(prev => prev.filter(rec => rec.title !== recommendation.title));
        toast.success("Recommendation added to your tasks");
      }
    } catch (error) {
      console.error("Error adding recommendation:", error);
      toast.error("Failed to add recommendation");
    }
  };

  const handleAddCurrentAction = (action: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    if (!user?.id) {
      toast.error("You must be logged in to add tasks");
      return;
    }
    
    setNewTodo({
      user_id: user.id,
      title: action,
      priority,
      due_date: new Date().toISOString(),
    });
    setIsAddDialogOpen(true);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-700">High</Badge>;
      case 'medium':
        return <Badge className="bg-amber-100 text-amber-700">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-700">Low</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <List className="h-5 w-5 text-healthcare-600" />
          To-Do List
        </h3>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGetAIRecommendations}
            disabled={isLoadingRecommendations}
          >
            <Sparkles className="mr-1 h-4 w-4 text-healthcare-600" />
            AI Recommendations
          </Button>
          <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-1 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>
      
      {/* AI Recommendations */}
      {aiRecommendations.length > 0 && (
        <Card className="border-dashed border-healthcare-200 bg-healthcare-50/50">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Sparkles className="mr-2 h-4 w-4 text-healthcare-600" />
              AI Recommended Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="py-0">
            <ul className="space-y-2">
              {aiRecommendations.map((recommendation, index) => (
                <li key={index} className="flex items-center justify-between p-2 border rounded-md bg-white">
                  <div>
                    <p className="font-medium text-sm">{recommendation.title}</p>
                    {recommendation.description && (
                      <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {recommendation.due_date && (
                        <span className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {format(new Date(recommendation.due_date), 'MMM d')}
                        </span>
                      )}
                      {recommendation.priority && getPriorityBadge(recommendation.priority)}
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleAddRecommendation(recommendation)}
                  >
                    Add
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Main Todo List */}
      <Card>
        <CardHeader className="py-3">
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="py-0">
          <TabsContent value="active" className="m-0 pt-1">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading tasks...</div>
            ) : todos.filter(todo => !todo.completed).length === 0 ? (
              <div className="py-8 text-center">
                <List className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No active tasks</p>
                <Button 
                  variant="outline"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add a task
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {todos
                  .filter(todo => !todo.completed)
                  .sort((a, b) => {
                    const priorityOrder = { high: 0, medium: 1, low: 2 };
                    return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
                  })
                  .map(todo => (
                    <li key={todo.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox 
                        id={`task-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleComplete(todo.id!, todo.completed)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`task-${todo.id}`}
                          className="font-medium cursor-pointer hover:text-healthcare-700"
                        >
                          {todo.title}
                        </label>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground mt-1">{todo.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                          {todo.due_date && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {format(new Date(todo.due_date), 'MMM d, yyyy')}
                            </span>
                          )}
                          {todo.related_client_id && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              Client
                            </span>
                          )}
                          {todo.related_facility_id && (
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              Facility
                            </span>
                          )}
                          {getPriorityBadge(todo.priority)}
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id!)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </li>
                  ))}
              </ul>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="m-0 pt-1">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading tasks...</div>
            ) : todos.filter(todo => todo.completed).length === 0 ? (
              <div className="py-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground">No completed tasks</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {todos
                  .filter(todo => todo.completed)
                  .map(todo => (
                    <li key={todo.id} className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30">
                      <Checkbox 
                        id={`task-${todo.id}`}
                        checked={todo.completed}
                        onCheckedChange={() => handleToggleComplete(todo.id!, todo.completed)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`task-${todo.id}`}
                          className="line-through text-muted-foreground cursor-pointer"
                        >
                          {todo.title}
                        </label>
                        {todo.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-through">{todo.description}</p>
                        )}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteTodo(todo.id!)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </li>
                  ))}
              </ul>
            )}
          </TabsContent>
        </CardContent>
      </Card>

      {/* Add Todo Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                value={newTodo.title} 
                onChange={(e) => setNewTodo({...newTodo, title: e.target.value})}
                placeholder="Enter task title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                value={newTodo.description || ''} 
                onChange={(e) => setNewTodo({...newTodo, description: e.target.value})}
                placeholder="Enter task description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTodo.priority} 
                  onValueChange={(value) => setNewTodo({...newTodo, priority: value as 'low' | 'medium' | 'high'})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newTodo.due_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTodo.due_date ? format(new Date(newTodo.due_date), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={newTodo.due_date ? new Date(newTodo.due_date) : undefined}
                      onSelect={(date) => setNewTodo({ ...newTodo, due_date: date?.toISOString() || new Date().toISOString() })}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddTodo} disabled={!newTodo.title}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;
