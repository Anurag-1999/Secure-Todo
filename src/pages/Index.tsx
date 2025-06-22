
import React from 'react';
import { TodoHeader } from '@/components/TodoHeader';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { TodoFilters } from '@/components/TodoFilters';
import { TodoStats } from '@/components/TodoStats';
import { CredSetup } from '@/components/CredSetup';
import { PinEntry } from '@/components/PinEntry';
import { useTodos } from '@/hooks/useTodos';
import { usePinAccess } from '@/hooks/usePinAccess';
import { Button } from '@/components/ui/button';
import { Lock } from 'lucide-react';
import { useState } from 'react';

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

const Index = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const { isUnlocked, hasPin, loading: pinLoading, createPin, verifyPin, lock } = usePinAccess();
  const { todos, loading: todosLoading, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();

  // Show loading state while checking PIN status
  if (pinLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show PIN setup if no PIN exists
  if (!hasPin) {
    return <CredSetup  onCredCreated={createPin} />;
  }

  // Show PIN entry if locked
  if (!isUnlocked) {
    return <PinEntry onPinVerified={verifyPin} />;
  }

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.isCompleted;
      case 'completed':
        return todo.isCompleted;
      default:
        return true;
    }
  });

  const completedCount = todos.filter(todo => todo.isCompleted).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            <TodoHeader />
          </div>
          <Button
            onClick={lock}
            variant="outline"
            size="sm"
            className="ml-4 mt-4"
          >
            <Lock className="w-4 h-4 mr-2" />
            Lock
          </Button>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <TodoForm onAddTodo={addTodo} />
          </div>

          <TodoStats 
            totalCount={todos.length}
            activeCount={activeCount}
            completedCount={completedCount}
          />

          {todos.length > 0 && (
            <>
              <div className="px-6 py-4 border-b border-gray-100">
                <TodoFilters 
                  currentFilter={filter}
                  onFilterChange={setFilter}
                  onClearCompleted={clearCompleted}
                  hasCompleted={completedCount > 0}
                />
              </div>

              {todosLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading todos...</p>
                </div>
              ) : (
                <TodoList 
                  todos={filteredTodos}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onEditTodo={editTodo}
                />
              )}
            </>
          )}

          {todos.length === 0 && !todosLoading && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-gray-500">Add your first task above to get started!</p>
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Built with React & Supabase • Real-time sync enabled</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
