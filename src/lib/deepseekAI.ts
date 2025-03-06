
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
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "system",
              content: "You are a travel planning assistant. You create detailed travel plans based on user requests. Respond only with valid JSON."
            },
            {
              role: "user", 
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        return handleApiError(response.status);
      }

      const data = await response.json();
      console.log('DeepSeek API response:', data);
      
      // Extract the content from the response
      const generatedText = data.choices?.[0]?.message?.content;
      
      if (!generatedText) {
        console.error('Unexpected API response format:', data);
        return handleParsingError();
      }
      
      try {
        const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1] : generatedText;
        return JSON.parse(jsonStr);
      } catch (jsonError) {
        console.error('Failed to parse DeepSeek response as JSON:', jsonError);
        console.log('Raw DeepSeek response:', generatedText);
        
        // Return the raw text when parsing fails, so calling code can handle it
        return generatedText;
      }
    } catch (fetchError) {
      console.error('Network error while connecting to DeepSeek API:', fetchError);
      return handleNetworkError();
    }
  } catch (error) {
    console.error('Error generating travel plan:', error);
    return handleParsingError();
  }
};
