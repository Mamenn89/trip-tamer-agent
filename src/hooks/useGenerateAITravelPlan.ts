import { useState } from 'react';
import { TravelFormData, TravelPlan } from '../types';
import { generateTravelPlanWithGemini } from '../services/geminiService';

export const useGenerateAITravelPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (formData: TravelFormData): Promise<TravelPlan> => {
    setLoading(true);
    setError(null);
    
    try {
      // Call the Gemini API with the form data
      const result = await generateTravelPlanWithGemini(formData);
      return result;
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
