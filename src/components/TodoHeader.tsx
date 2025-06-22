
import React from 'react';

export const TodoHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
        <span className="text-3xl text-white">✓</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Todo Sync Verse
      </h1>
      <p className="text-gray-600 text-lg">
        Organize your life, one task at a time
      </p>
    </div>
  );
};
