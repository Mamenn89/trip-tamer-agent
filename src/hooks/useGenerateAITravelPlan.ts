
import { useState } from 'react';
import { TravelFormData, TravelPlan } from '../types';
import { generateTravelPlan } from '../lib/gemini';

export const useGenerateAITravelPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (formData: TravelFormData): Promise<TravelPlan> => {
    setLoading(true);
    setError(null);
    
    try {
      // Format dates for the prompt
      const startDateStr = formData.startDate 
        ? new Date(formData.startDate).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })
        : 'flexible';
      
      const endDateStr = formData.endDate 
        ? new Date(formData.endDate).toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
          })
        : 'flexible';
      
      // Calculate trip duration if dates are provided
      let duration = 'flexible';
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        duration = `${days} days`;
      }

      // Call the Gemini API with the form data
      const result = await generateTravelPlan(formData);
      
      // In case the API returns text that is not properly formatted JSON
      let planData: TravelPlan;
      try {
        if (typeof result === 'object') {
          planData = result as TravelPlan;
        } else {
          // If we somehow got a string instead of an object, throw an error
          throw new Error('Invalid response format from API');
        }
        
        // Ensure all required fields exist
        if (!planData.destination || !planData.days) {
          throw new Error('Incomplete data returned from AI');
        }
        
        return planData;
      } catch (jsonError) {
        console.error('Failed to parse AI response:', jsonError);
        console.log('Raw response:', result);
        throw new Error('Failed to generate a valid travel plan. Please try again.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate travel plan';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generatePlan, loading, error };
};
