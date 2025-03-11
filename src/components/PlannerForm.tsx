
import React, { useState } from 'react';
import { MapPin, Compass } from 'lucide-react';
import { TravelFormData } from '../types';
import LocationInput from './planner/LocationInput';
import DateSelector from './planner/DateSelector';
import BudgetSelector from './planner/BudgetSelector';
import TravelersSelector from './planner/TravelersSelector';
import InterestsSelector from './planner/InterestsSelector';
import SubmitButton from './planner/SubmitButton';

interface PlannerFormProps {
  onSubmit: (data: TravelFormData) => void;
  loading?: boolean;
}

const PlannerForm: React.FC<PlannerFormProps> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    startDate: null,
    endDate: null,
    budget: 1500, // Default to moderate
    travelers: 1,
    interests: ['Sightseeing', 'Food']
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBudgetChange = (value: number) => {
    setFormData(prev => ({ ...prev, budget: value }));
  };
  
  const handleTravelersChange = (value: number) => {
    setFormData(prev => ({ ...prev, travelers: value }));
  };
  
  const handleInterestsChange = (interests: string[]) => {
    setFormData(prev => ({ ...prev, interests }));
  };
  
  const handleStartDateChange = (date: Date | null) => {
    setFormData(prev => ({ 
      ...prev, 
      startDate: date,
      // Reset end date if it's before the new start date
      endDate: prev.endDate && date && prev.endDate < date ? null : prev.endDate
    }));
  };
  
  const handleEndDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, endDate: date }));
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
        <LocationInput
          label="Departure City"
          name="source"
          value={formData.source}
          placeholder="Where are you starting from?"
          icon={MapPin}
          onChange={handleChange}
          required
        />
        
        {/* Destination */}
        <LocationInput
          label="Destination"
          name="destination"
          value={formData.destination}
          placeholder="Where are you going?"
          icon={Compass}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Start Date */}
        <DateSelector
          label="Start Date"
          date={formData.startDate}
          onSelect={handleStartDateChange}
          disabled={(date) => date < new Date()}
        />
        
        {/* End Date */}
        <DateSelector
          label="End Date"
          date={formData.endDate}
          onSelect={handleEndDateChange}
          disabled={(date) => date < (formData.startDate || new Date())}
        />
      </div>
      
      {/* Budget Selector */}
      <BudgetSelector 
        selectedBudget={formData.budget}
        onChange={handleBudgetChange}
      />
      
      {/* Travelers Selector */}
      <TravelersSelector
        travelers={formData.travelers}
        onChange={handleTravelersChange}
      />
      
      {/* Interests Selector */}
      <InterestsSelector
        selectedInterests={formData.interests}
        onChange={handleInterestsChange}
      />
      
      {/* Submit Button */}
      <SubmitButton
        loading={loading}
        disabled={!formData.source || !formData.destination}
      />
    </form>
  );
};

export default PlannerForm;
