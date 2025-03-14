import { TravelFormData, TravelPlan } from '../types';

// Use environment variable for API key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const generateTravelPlan = async (formData: TravelFormData): Promise<TravelPlan> => {
  try {
    console.log('Generating travel plan with data:', formData);
    
    // Format dates for the prompt
    const startDateStr = formData.startDate ? formData.startDate.toLocaleDateString() : 'flexible';
    const endDateStr = formData.endDate ? formData.endDate.toLocaleDateString() : 'flexible';
    const durationDays = formData.startDate && formData.endDate 
      ? Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 'flexible';

    // Construct our prompt
    const prompt = `
      Create a detailed travel itinerary as a JSON object with the following structure:
      {
        "destination": "${formData.destination}",
        "duration": ${typeof durationDays === 'number' ? durationDays : '"flexible"'},
        "totalBudget": ${formData.budget},
        "summary": "Brief 2-3 sentence overview of the trip",
        "days": [
          {
            "day": 1,
            "date": "${startDateStr}",
            "activities": [
              {
                "time": "Time format like 9:00 AM",
                "description": "Detailed description of activity",
                "type": "One of: transportation, sightseeing, meal, accommodation, other",
                "cost": estimated cost as number,
                "location": "Name of location"
              }
            ]
          }
        ],
        "tips": ["Tip 1", "Tip 2", "Tip 3"],
        "flightInfo": {
          "departureTime": "Departure time",
          "arrivalTime": "Arrival time",
          "airline": "Airline name",
          "price": estimated price as number
        },
        "accommodation": {
          "name": "Accommodation name",
          "location": "Accommodation location",
          "pricePerNight": price per night as number,
          "totalCost": total accommodation cost as number
        }
      }

      Create a travel plan from ${formData.source} to ${formData.destination} for ${formData.travelers} travelers.
      Trip dates: ${startDateStr} to ${endDateStr}.
      Budget: $${formData.budget}.
      Interests: ${formData.interests.join(', ')}.
      
      Create a detailed day-by-day itinerary with activities that match the interests.
      Include estimated costs for each activity to help stay within the budget.
      Suggest realistic and specific places to visit, restaurants to try, and things to do.
      Include practical travel tips specific to the destination.
      If the budget is too low for the destination and duration, suggest ways to economize.
    `;

    // For demo purposes, we'll simulate the API call with a 2-second delay
    // In a real implementation, we would make the actual call to Gemini API
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a full implementation, replace this with actual API call
        const mockResponse: TravelPlan = generateMockTravelPlan(formData);
        resolve(mockResponse);
      }, 2000);
    });
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw new Error('Failed to generate travel plan. Please try again later.');
  }
};

// This function will be replaced with the actual API call in a production environment
const generateMockTravelPlan = (formData: TravelFormData): TravelPlan => {
  const { destination, startDate, endDate, budget, travelers, interests } = formData;
  
  const startDateObj = startDate || new Date();
  const endDateObj = endDate || new Date(startDateObj.getTime() + 7 * 24 * 60 * 60 * 1000);
  const duration = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24));
  
  const days: any[] = [];
  
  // Generate mock days
  for (let i = 0; i < duration; i++) {
    const currentDate = new Date(startDateObj);
    currentDate.setDate(startDateObj.getDate() + i);
    
    days.push({
      day: i + 1,
      date: currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
      activities: [
        {
          time: '9:00 AM',
          description: `Visit ${interests[i % interests.length]} themed attraction in ${destination}`,
          type: 'sightseeing',
          cost: Math.floor(50 + Math.random() * 50),
          location: `${destination} Downtown`
        },
        {
          time: '12:00 PM',
          description: 'Lunch at a local restaurant',
          type: 'meal',
          cost: Math.floor(20 + Math.random() * 30) * travelers,
          location: 'Local Cuisine Restaurant'
        },
        {
          time: '2:00 PM',
          description: 'Guided tour of historical sites',
          type: 'sightseeing',
          cost: Math.floor(30 + Math.random() * 40) * travelers,
          location: 'Historical District'
        },
        {
          time: '7:00 PM',
          description: 'Dinner and local entertainment',
          type: 'meal',
          cost: Math.floor(40 + Math.random() * 60) * travelers,
          location: 'Cultural Center'
        }
      ]
    });
  }
  
  const dailyBudget = budget / duration / travelers;
  
  return {
    destination,
    duration,
    totalBudget: budget,
    summary: `A ${duration}-day journey to ${destination} focusing on ${interests.join(', ')}. This trip is designed for ${travelers} travelers with a budget of $${budget}.`,
    days,
    tips: [
      `${destination} is best explored on foot, bring comfortable walking shoes.`,
      `Local currency is recommended for small vendors and shops.`,
      `Try the local specialties like ${destination} famous dish.`
    ],
    flightInfo: {
      departureTime: '10:00 AM',
      arrivalTime: '2:00 PM',
      airline: 'Global Airways',
      price: Math.floor(budget * 0.3)
    },
    accommodation: {
      name: `${destination} Central Hotel`,
      location: `Downtown ${destination}`,
      pricePerNight: Math.floor(dailyBudget * 0.4),
      totalCost: Math.floor(dailyBudget * 0.4 * duration)
    }
  };
};

// In a real implementation, this function would make an actual API call to Gemini
export const callGeminiAPI = async (apiKey: string, prompt: string) => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};
