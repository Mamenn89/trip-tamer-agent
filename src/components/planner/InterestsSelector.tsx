
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Common interests
const commonInterests = [
  'Sightseeing', 'Food', 'History', 'Art', 'Nature', 'Adventure', 
  'Relaxation', 'Shopping', 'Nightlife', 'Cultural', 'Museums', 
  'Beach', 'Photography', 'Architecture', 'Local Markets'
];

interface InterestsSelectorProps {
  selectedInterests: string[];
  onChange: (interests: string[]) => void;
}

const InterestsSelector: React.FC<InterestsSelectorProps> = ({ selectedInterests, onChange }) => {
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  
  const toggleInterest = (interest: string) => {
    const exists = selectedInterests.includes(interest);
    
    if (exists) {
      onChange(selectedInterests.filter(item => item !== interest));
    } else {
      onChange([...selectedInterests, interest]);
    }
  };
  
  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      onChange([...selectedInterests, customInterest.trim()]);
      setCustomInterest('');
      setShowInterestInput(false);
    }
  };
  
  return (
    <div className="mb-8">
      <label className="block text-sm font-medium text-gray-700 mb-2">What are your interests?</label>
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedInterests.map((interest) => (
          <div 
            key={interest}
            className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
            <span>{interest}</span>
            <button
              type="button"
              onClick={() => toggleInterest(interest)}
              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-blue-200/50"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        
        {showInterestInput ? (
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              className="h-8 px-3 py-1 text-sm bg-white"
              placeholder="Add custom interest"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
            />
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={addCustomInterest}
              className="h-8 px-2"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setShowInterestInput(false);
                setCustomInterest('');
              }}
              className="h-8 px-2"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowInterestInput(true)}
            className="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Add Interest</span>
          </button>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Suggested interests:</p>
        <div className="flex flex-wrap gap-2">
          {commonInterests
            .filter(interest => !selectedInterests.includes(interest))
            .slice(0, 10)
            .map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
              >
                {interest}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default InterestsSelector;
