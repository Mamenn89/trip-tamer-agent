
import React from 'react';
import { X, Plus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TravelersSelectorProps {
  travelers: number;
  onChange: (value: number) => void;
}

const TravelersSelector: React.FC<TravelersSelectorProps> = ({ travelers, onChange }) => {
  const handleTravelersChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      onChange(value);
    }
  };
  
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
      <div className="flex items-center space-x-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full bg-white"
          onClick={() => handleTravelersChange(travelers - 1)}
          disabled={travelers <= 1}
        >
          <span className="sr-only">Decrease</span>
          <X className="h-4 w-4" />
        </Button>
        <div className="flex-1 text-center">
          <span className="text-xl font-medium">{travelers}</span>
          <span className="ml-2 text-gray-500 text-sm">traveler{travelers !== 1 && 's'}</span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 rounded-full bg-white"
          onClick={() => handleTravelersChange(travelers + 1)}
          disabled={travelers >= 10}
        >
          <span className="sr-only">Increase</span>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TravelersSelector;
