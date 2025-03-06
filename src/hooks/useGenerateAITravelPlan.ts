import { useState } from 'react';
import { TravelFormData, TravelPlanData } from '../types';
import { generateTravelPlan } from '../lib/deepseekAI';

export const useGenerateAITravelPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (formData: TravelFormData): Promise<TravelPlanData> => {
    setLoading(true);
    setError(null);
    
    try {
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
      
      let duration = 'flexible';
      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        duration = `${days} days`;
      }
      
      const prompt = `
        Create a detailed travel plan from ${formData.source} to ${formData.destination}.
        
        Trip Details:
        - Departure City: ${formData.source}
        - Destination: ${formData.destination}
        - Start Date: ${startDateStr}
        - End Date: ${endDateStr}
        - Duration: ${duration}
        - Budget: $${formData.budget}
        - Number of Travelers: ${formData.travelers}
        - Interests: ${formData.interests.join(', ')}
        
        Please provide a detailed itinerary with the following sections:
        1. Trip Overview: A brief introduction to the destination with key highlights and summary.
        2. Day-by-Day Itinerary: Detailed schedule for each day with activities, attractions, and estimated times.
        3. Estimated Budget Breakdown: Costs for accommodation, transportation, food, activities, and miscellaneous expenses.
        4. Travel Tips: Local customs, weather expectations, packing suggestions, and safety advice.
        5. Recommended Accommodations: 3 options that fit the budget.
        6. Must-Try Local Cuisine: At least 5 dishes or restaurants to experience.
        
        Format the response in JSON with the following structure:
        {
          "destination": "string",
          "duration": "string",
          "overview": "string",
          "dailyItinerary": [
            {
              "day": "number",
              "title": "string",
              "activities": ["string"],
              "meals": ["string"]
            }
          ],
          "budgetBreakdown": {
            "accommodation": "number",
            "transportation": "number",
            "food": "number",
            "activities": "number",
            "miscellaneous": "number",
            "total": "number"
          },
          "travelTips": ["string"],
          "accommodations": [
            {
              "name": "string",
              "description": "string",
              "priceRange": "string"
            }
          ],
          "localCuisine": [
            {
              "name": "string",
              "description": "string"
            }
          ],
          "imagePrompt": "string"
        }
        
        Make sure the budget breakdown totals to approximately the provided budget of $${formData.budget}.
        For the imagePrompt field, create a descriptive prompt that could be used to generate an image of a notable landmark or scenery from the destination.
      `;

      const result = await generateTravelPlan(prompt);
      
      let planData: TravelPlanData;
      
      if (typeof result === 'string') {
        const jsonString = result as string;
        const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : jsonString;
        
        try {
          planData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error('Failed to parse JSON from API response:', parseError);
          throw new Error('Invalid JSON response from the AI service');
        }
      } else if (result && typeof result === 'object') {
        planData = result as TravelPlanData;
      } else {
        console.error('Unexpected result type from API:', typeof result);
        throw new Error('Received invalid response from the AI service');
      }
      
      if (!planData.destination || !planData.overview || !planData.dailyItinerary) {
        throw new Error('Incomplete data returned from AI');
      }
      
      return planData;
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
