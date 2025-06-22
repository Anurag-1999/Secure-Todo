
import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '@/hooks/useTodos';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newTitle: string) => void;
}

export const TodoList = ({ todos, onToggleTodo, onDeleteTodo, onEditTodo }: TodoListProps) => {
  return (
    <div className="divide-y divide-gray-100">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={() => onToggleTodo(todo.id)}
          onDelete={() => onDeleteTodo(todo.id)}
          onEdit={(newTitle) => onEditTodo(todo.id, newTitle)}
        />
      ))}
    </div>
  );
};
