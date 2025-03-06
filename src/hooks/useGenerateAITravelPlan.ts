
import { useState } from 'react';
import { TravelFormData, TravelPlanData } from '../types';
import { generateTravelPlan } from '../lib/gemini';

export const useGenerateAITravelPlan = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePlan = async (formData: TravelFormData): Promise<TravelPlanData> => {
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
      
      // Create the prompt for the AI
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

      // Call the Gemini API with the prompt string
      const result = await generateTravelPlan(prompt);
      
      // In case the API returns text that is not properly formatted JSON
      let planData: TravelPlanData;
      
      // Process the result based on its type
      if (typeof result === 'string') {
        // Try to extract JSON if it's within markdown code blocks
        const jsonString = result as string; // Explicit casting to help TypeScript
        const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : jsonString;
        
        try {
          planData = JSON.parse(jsonStr);
        } catch (parseError) {
          console.error('Failed to parse JSON from API response:', parseError);
          throw new Error('Invalid JSON response from the AI service');
        }
      } else if (result && typeof result === 'object') {
        // If the result is already an object, use it
        planData = result as TravelPlanData;
      } else {
        // Handle unexpected result type
        console.error('Unexpected result type from API:', typeof result);
        throw new Error('Received invalid response from the AI service');
      }
      
      // Ensure all required fields exist
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
