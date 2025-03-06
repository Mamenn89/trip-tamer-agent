
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingIndicatorProps {
  message?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message = 'Processing your request...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-blue-200 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-pulse-slow" />
        </div>
      </div>
      <p className="text-gray-600 text-center max-w-sm animate-pulse-slow">{message}</p>
    </div>
  );
};

export default LoadingIndicator;
