
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, DollarSign, MapPin, Heart, X, Plus, Compass } from 'lucide-react';
import { format } from 'date-fns';
import { TravelFormData } from '../types';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// Common interests
const commonInterests = [
  'Sightseeing', 'Food', 'History', 'Art', 'Nature', 'Adventure', 
  'Relaxation', 'Shopping', 'Nightlife', 'Cultural', 'Museums', 
  'Beach', 'Photography', 'Architecture', 'Local Markets'
];

interface PlannerFormProps {
  onSubmit: (data: TravelFormData) => void;
  loading?: boolean;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, loading = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    startDate: null,
    endDate: null,
    budget: 1000,
    travelers: 1,
    interests: ['Sightseeing', 'Food']
  });
  
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [customInterest, setCustomInterest] = useState('');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBudgetChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, budget: value[0] }));
  };
  
  const handleTravelersChange = (value: number) => {
    if (value >= 1 && value <= 10) {
      setFormData(prev => ({ ...prev, travelers: value }));
    }
  };
  
  const toggleInterest = (interest: string) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      
      if (exists) {
        return {
          ...prev,
          interests: prev.interests.filter(item => item !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...prev.interests, interest]
        };
      }
    });
  };
  
  const addCustomInterest = () => {
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, customInterest.trim()]
      }));
      setCustomInterest('');
      setShowInterestInput(false);
    }
  };
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source && formData.destination) {
      onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleFormSubmit} className="glass-panel rounded-2xl p-6 md:p-8 animate-reveal">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Plan Your Journey</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Source */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              required
              type="text"
              name="source"
              placeholder="Where are you starting from?"
              value={formData.source}
              onChange={handleChange}
              className="pl-10 bg-white focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Destination */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <div className="relative">
            <Compass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <Input
              required
              type="text"
              name="destination"
              placeholder="Where are you going?"
              value={formData.destination}
              onChange={handleChange}
              className="pl-10 bg-white focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white hover:bg-gray-50",
                  !formData.startDate && "text-gray-500"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                {formData.startDate ? (
                  format(formData.startDate, "PPP")
                ) : (
                  <span>Select start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.startDate || undefined}
                onSelect={(date) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    startDate: date as Date,
                    // Reset end date if it's before the new start date
                    endDate: prev.endDate && date && prev.endDate < date ? null : prev.endDate
                  }))
                }
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* End Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white hover:bg-gray-50",
                  !formData.endDate && "text-gray-500"
                )}
              >
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                {formData.endDate ? (
                  format(formData.endDate, "PPP")
                ) : (
                  <span>Select end date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <CalendarComponent
                mode="single"
                selected={formData.endDate || undefined}
                onSelect={(date) => 
                  setFormData(prev => ({ ...prev, endDate: date as Date }))
                }
                disabled={(date) => 
                  date < (formData.startDate || new Date())
                }
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Budget (USD)</label>
        <div className="px-3">
          <Slider
            defaultValue={[formData.budget]}
            min={100}
            max={10000}
            step={100}
            onValueChange={handleBudgetChange}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-500">
            <span>$100</span>
            <span className="font-medium text-gray-800">${formData.budget}</span>
            <span>$10,000+</span>
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
        <div className="flex items-center space-x-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-white"
            onClick={() => handleTravelersChange(formData.travelers - 1)}
            disabled={formData.travelers <= 1}
          >
            <span className="sr-only">Decrease</span>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex-1 text-center">
            <span className="text-xl font-medium">{formData.travelers}</span>
            <span className="ml-2 text-gray-500 text-sm">traveler{formData.travelers !== 1 && 's'}</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full bg-white"
            onClick={() => handleTravelersChange(formData.travelers + 1)}
            disabled={formData.travelers >= 10}
          >
            <span className="sr-only">Increase</span>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">What are your interests?</label>
        <div className="flex flex-wrap gap-2 mb-3">
          {formData.interests.map((interest) => (
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
              .filter(interest => !formData.interests.includes(interest))
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
      
      <div className="flex justify-center">
        <Button
          type="submit"
          className="w-full sm:w-auto px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white font-medium text-lg rounded-lg transition-colors shadow-sm disabled:opacity-70"
          disabled={loading || !formData.source || !formData.destination}
        >
          <Heart className="w-5 h-5 mr-2" />
          <span>Generate My Travel Plan</span>
        </Button>
      </div>
    </form>
  );
};

export default PlannerForm;
