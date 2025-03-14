import React from 'react';
import { TravelPlan } from '../types';

interface TravelPlanMarkdownProps {
  plan: TravelPlan;
  onStartOver: () => void;
}

const TravelPlanMarkdown: React.FC<TravelPlanMarkdownProps> = ({ plan, onStartOver }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="glass-card p-6 rounded-lg mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Raw Gemini Response</h2>
          <button
            onClick={onStartOver}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Plan Another Trip
          </button>
        </div>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-auto max-h-[80vh] text-sm">
          {JSON.stringify(plan, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default TravelPlanMarkdown; 