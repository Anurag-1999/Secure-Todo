
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { Todo } from '@/hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newTitle: string) => void;
}

export const TodoItem = ({ todo, onToggle, onDelete, onEdit }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editTitle.trim()) {
      onEdit(editTitle);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditTitle(todo.title);
      setIsEditing(false);
    }
  };

  return (
    <div className={`p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group ${
      todo.isCompleted ? 'opacity-75' : ''
    }`}>
      <Checkbox
        checked={todo.isCompleted}
        onCheckedChange={onToggle}
        className="w-5 h-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={() => {
                if (editTitle.trim()) {
                  onEdit(editTitle);
                } else {
                  setEditTitle(todo.title);
                }
                setIsEditing(false);
              }}
              onKeyDown={handleKeyDown}
              className="w-full"
              autoFocus
            />
          </form>
        ) : (
          <div 
            onClick={() => setIsEditing(true)}
            className="cursor-pointer"
          >
            <p className={`text-lg truncate transition-all ${
              todo.isCompleted 
                ? 'line-through text-gray-500' 
                : 'text-gray-900 hover:text-blue-600'
            }`}>
              {todo.title}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {todo.createdAt.toLocaleDateString()} at {todo.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600 hover:bg-red-50"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
};
