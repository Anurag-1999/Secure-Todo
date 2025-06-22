
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
  user_id?: string;
}

export const useTodos = (userId: string = 'default_user') => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch todos from Supabase
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('To-Do List')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedTodos = data?.map(todo => ({
        id: todo.id.toString(),
        title: todo.to_do || '',
        isCompleted: todo.todo_pin === 'completed',
        createdAt: new Date(todo.created_at),
        user_id: todo.user_id
      })) || [];

      setTodos(formattedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add new todo
  const addTodo = async (title: string) => {
    try {
      const { data, error } = await supabase
        .from('To-Do List')
        .insert([
          {
            to_do: title.trim(),
            todo_pin: 'active',
            user_id: userId
          }
        ])
        .select()
        .single();

      if (error) throw error;

      const newTodo: Todo = {
        id: data.id.toString(),
        title: data.to_do || '',
        isCompleted: false,
        createdAt: new Date(data.created_at),
        user_id: data.user_id
      };

      setTodos(prev => [newTodo, ...prev]);
      
      toast({
        title: "Success",
        description: "Todo added successfully!",
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Toggle todo completion
  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const newStatus = todo.isCompleted ? 'active' : 'completed';
      
      const { error } = await supabase
        .from('To-Do List')
        .update({ todo_pin: newStatus })
        .eq('id', parseInt(id));

      if (error) throw error;

      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
        )
      );
    } catch (error) {
      console.error('Error toggling todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('To-Do List')
        .delete()
        .eq('id', parseInt(id));

      if (error) throw error;

      setTodos(prev => prev.filter(todo => todo.id !== id));
      
      toast({
        title: "Success",
        description: "Todo deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Edit todo
  const editTodo = async (id: string, newTitle: string) => {
    try {
      const { error } = await supabase
        .from('To-Do List')
        .update({ to_do: newTitle.trim() })
        .eq('id', parseInt(id));

      if (error) throw error;

      setTodos(prev => 
        prev.map(todo => 
          todo.id === id ? { ...todo, title: newTitle.trim() } : todo
        )
      );
    } catch (error) {
      console.error('Error editing todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Clear completed todos
  const clearCompleted = async () => {
    try {
      const { error } = await supabase
        .from('To-Do List')
        .delete()
        .eq('user_id', userId)
        .eq('todo_pin', 'completed');

      if (error) throw error;

      setTodos(prev => prev.filter(todo => !todo.isCompleted));
      
      toast({
        title: "Success",
        description: "Completed todos cleared!",
      });
    } catch (error) {
      console.error('Error clearing completed todos:', error);
      toast({
        title: "Error",
        description: "Failed to clear completed todos. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    fetchTodos();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'To-Do List',
          filter: `user_id=eq.${userId}`
        },
        () => {
          fetchTodos();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return {
    todos,
    loading,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    refetch: fetchTodos
  };
};
