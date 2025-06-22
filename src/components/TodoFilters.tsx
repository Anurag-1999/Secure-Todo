
import React from 'react';
import { Button } from '@/components/ui/button';
import { FilterType } from '@/pages/Index';

interface TodoFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
  hasCompleted: boolean;
}

export const TodoFilters = ({ 
  currentFilter, 
  onFilterChange, 
  onClearCompleted, 
  hasCompleted 
}: TodoFiltersProps) => {
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
  ];

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {filters.map(({ key, label }) => (
          <Button
            key={key}
            variant={currentFilter === key ? "default" : "ghost"}
            size="sm"
            onClick={() => onFilterChange(key)}
            className={`px-4 py-2 text-sm transition-all ${
              currentFilter === key 
                ? 'bg-white shadow-sm text-gray-900' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {label}
          </Button>
        ))}
      </div>

      {hasCompleted && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCompleted}
          className="text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          Clear Completed
        </Button>
      )}
    </div>
  );
};
