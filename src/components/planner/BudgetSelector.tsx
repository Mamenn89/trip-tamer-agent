
import React from 'react';
import { Tag, Wallet, Diamond } from 'lucide-react';

interface BudgetOption {
  value: number;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface BudgetSelectorProps {
  selectedBudget: number;
  onChange: (budget: number) => void;
}

const BudgetSelector: React.FC<BudgetSelectorProps> = ({ selectedBudget, onChange }) => {
  const budgetOptions: BudgetOption[] = [
    {
      value: 500,
      label: 'Backpacker',
      icon: <Tag className="w-5 h-5" />,
      description: 'Budget-friendly essentials'
    },
    {
      value: 1500,
      label: 'Moderate',
      icon: <Wallet className="w-5 h-5" />,
      description: 'Balanced comfort & value'
    },
    {
      value: 5000,
      label: 'Luxury',
      icon: <Diamond className="w-5 h-5" />,
      description: 'High-end experience'
    }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-3">Budget Range</label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {budgetOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`flex flex-col items-center p-4 rounded-lg border-2 transition-all ${
              selectedBudget === option.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className={`p-2 rounded-full mb-2 ${
              selectedBudget === option.value ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              {option.icon}
            </div>
            <span className="font-medium">{option.label}</span>
            <span className="text-xs text-gray-500 mt-1">${option.value}</span>
            <span className="text-xs text-gray-500 mt-1">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BudgetSelector;
