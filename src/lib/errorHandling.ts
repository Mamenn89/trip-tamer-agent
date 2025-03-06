
import { TravelPlanData } from '../types';
import { generateMockTravelPlanData } from './mockTravelData';

export const handleApiError = (status: number): TravelPlanData => {
  return {
    ...generateMockTravelPlanData(),
    overview: `⚠️ NOTE: This is MOCK DATA because the API request failed with status ${status}. Please check your API key or try again later.`
  };
};

export const handleNetworkError = (): TravelPlanData => {
  return {
    ...generateMockTravelPlanData(),
    overview: "⚠️ NOTE: This is MOCK DATA because of a network error. Please check your DeepSeek API key or check your network connection."
  };
};

export const handleParsingError = (): TravelPlanData => {
  return {
    ...generateMockTravelPlanData(),
    overview: "⚠️ NOTE: This is MOCK DATA because the API response couldn't be parsed as valid JSON. Please try again with different parameters."
  };
};

export const handleNoApiKey = (): TravelPlanData => {
  return {
    ...generateMockTravelPlanData(),
    overview: "⚠️ NOTE: This is MOCK DATA because no API key was provided. Please enter a valid DeepSeek API key above."
  };
};
