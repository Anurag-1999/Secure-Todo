
import React from 'react';

interface TodoStatsProps {
  totalCount: number;
  activeCount: number;
  completedCount: number;
}

export const TodoStats = ({ totalCount, activeCount, completedCount }: TodoStatsProps) => {
  if (totalCount === 0) return null;

  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-6">
          <span className="text-gray-600">
            <span className="font-medium text-gray-900">{activeCount}</span> active
          </span>
          <span className="text-gray-600">
            <span className="font-medium text-gray-900">{completedCount}</span> completed
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <span className="text-gray-600 font-medium">{completionRate}%</span>
        </div>
      </div>
    </div>
  );
};
