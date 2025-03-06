
import { TravelPlanData } from '../types';
import { handleApiError, handleNetworkError, handleParsingError, handleNoApiKey } from './errorHandling';
import { getApiKey, API_ENDPOINT } from './apiConfig';

export { setApiKey } from './apiConfig';

// Explicitly defining the return type to include string for proper type narrowing
export const generateTravelPlan = async (prompt: string): Promise<TravelPlanData | string> => {
  try {
    console.log('Generating travel plan with prompt:', prompt);
    
    const apiKey = getApiKey();
    if (!apiKey) {
      console.log('No API key provided, using mock data');
      return handleNoApiKey();
    }
    
    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
          }
        })
      });

      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        return handleApiError(response.status);
      }

      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      
      try {
        const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : generatedText;
        return JSON.parse(jsonStr);
      } catch (jsonError) {
        console.error('Failed to parse Gemini response as JSON:', jsonError);
        console.log('Raw Gemini response:', generatedText);
        
        // Return the raw text when parsing fails, so calling code can handle it
        return generatedText;
      }
    } catch (fetchError) {
      console.error('Network error while connecting to Gemini API:', fetchError);
      return handleNetworkError();
    }
  } catch (error) {
    console.error('Error generating travel plan:', error);
    return handleParsingError();
  }
};
