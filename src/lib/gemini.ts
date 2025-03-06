
import { TravelPlanData } from '../types';

// Pre-populated API key
let GEMINI_API_KEY = "AIzaSyBZrt40nmkkMUcYM-cbYKXWCeqDNF3evr0";

export const setApiKey = (key: string) => {
  GEMINI_API_KEY = key;
};

export const generateTravelPlan = async (prompt: string): Promise<TravelPlanData | string> => {
  try {
    console.log('Generating travel plan with prompt:', prompt);
    
    if (!GEMINI_API_KEY) {
      // For development/demo if no API key is provided
      return generateMockTravelPlanData();
    }
    
    // Update to use Gemini 2.0 Pro API endpoint
    const response = await fetch('https://generativelanguage.googleapis.com/v2/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
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
    
    // Extract the text from the response
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Try to parse the response as JSON
    try {
      // First, try to extract JSON if it's within markdown code blocks
      const jsonMatch = generatedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonStr = jsonMatch ? jsonMatch[1] : generatedText;
      
      return JSON.parse(jsonStr);
    } catch (jsonError) {
      console.error('Failed to parse Gemini response as JSON:', jsonError);
      console.log('Raw Gemini response:', generatedText);
      
      // Return the raw text if we can't parse it
      return generatedText;
    }
  } catch (error) {
    console.error('Error generating travel plan:', error);
    throw error;
  }
};

// This function generates a mock TravelPlanData for development
const generateMockTravelPlanData = (): TravelPlanData => {
  return {
    destination: "Paris, France",
    duration: "7 days",
    overview: "Experience the magic of Paris, the City of Light! This 7-day journey will take you through iconic landmarks, world-class museums, charming neighborhoods, and delectable cuisine. From the Eiffel Tower to the Louvre, from Montmartre to the Seine River, immerse yourself in the romance and beauty that Paris has to offer.",
    dailyItinerary: [
      {
        day: 1,
        title: "Arrival and Eiffel Tower",
        activities: [
          "Arrive at Charles de Gaulle Airport and transfer to hotel",
          "Lunch at a local café near your accommodation",
          "Visit the Eiffel Tower in the afternoon",
          "Evening Seine River cruise with dinner"
        ],
        meals: ["Lunch: Café croissants and coffee", "Dinner: Seine River cruise dining"]
      },
      {
        day: 2,
        title: "Louvre and Latin Quarter",
        activities: [
          "Morning visit to the Louvre Museum",
          "Lunch in the Tuileries Garden",
          "Explore the Latin Quarter and Notre-Dame Cathedral (exterior)",
          "Evening stroll along the Seine with street food dinner"
        ],
        meals: ["Breakfast at hotel", "Lunch: Picnic in Tuileries", "Dinner: Street food"]
      },
      {
        day: 3,
        title: "Montmartre and Sacré-Cœur",
        activities: [
          "Morning exploration of Montmartre neighborhood",
          "Visit Sacré-Cœur Basilica",
          "Lunch at a traditional Parisian bistro",
          "Afternoon at Musée d'Orsay",
          "Evening at a local jazz club"
        ],
        meals: ["Breakfast at hotel", "Lunch: Traditional bistro", "Dinner: Light fare at jazz club"]
      },
      {
        day: 4,
        title: "Versailles Day Trip",
        activities: [
          "Full day excursion to Palace of Versailles",
          "Explore the palace and gardens",
          "Lunch at Versailles town",
          "Return to Paris for evening leisure time"
        ],
        meals: ["Breakfast at hotel", "Lunch: Versailles cafe", "Dinner: Local restaurant"]
      },
      {
        day: 5,
        title: "Champs-Élysées and Arc de Triomphe",
        activities: [
          "Shopping along Champs-Élysées",
          "Visit Arc de Triomphe",
          "Lunch at a fashionable café",
          "Afternoon at Centre Pompidou",
          "Fine dining experience for dinner"
        ],
        meals: ["Breakfast at hotel", "Lunch: Café on Champs-Élysées", "Dinner: Fine dining"]
      },
      {
        day: 6,
        title: "Parisian Food and Culture",
        activities: [
          "Morning food tour in a local market",
          "Cooking class to learn French cuisine",
          "Lunch - Enjoy your own French cooking",
          "Afternoon visit to Père Lachaise Cemetery",
          "Evening show at Moulin Rouge"
        ],
        meals: ["Breakfast at hotel", "Lunch: Self-cooked French meal", "Dinner at Moulin Rouge"]
      },
      {
        day: 7,
        title: "Departure Day",
        activities: [
          "Morning at Luxembourg Gardens",
          "Last-minute souvenir shopping at Le Marais",
          "Lunch at a historic café",
          "Transfer to airport for departure"
        ],
        meals: ["Breakfast at hotel", "Lunch: Historic café"]
      }
    ],
    budgetBreakdown: {
      accommodation: 1200,
      transportation: 300,
      food: 700,
      activities: 500,
      miscellaneous: 300,
      total: 3000
    },
    travelTips: [
      "Learn a few basic French phrases - locals appreciate the effort even if you're not fluent.",
      "The Paris Museum Pass can save money if you plan to visit multiple museums.",
      "Metro is the most efficient way to travel around the city.",
      "Always keep a copy of your passport and important documents.",
      "Restaurants typically serve lunch from 12-2pm and dinner from 7:30-10pm.",
      "Tipping is not required as service is included, but rounding up the bill is appreciated.",
      "Be aware of pickpockets in tourist areas and crowded metros."
    ],
    accommodations: [
      {
        name: "Hotel des Arts Montmartre",
        description: "Charming boutique hotel in the artistic Montmartre district, close to Sacré-Cœur Basilica and local cafes.",
        priceRange: "$150-200 per night"
      },
      {
        name: "Le Marais Residence",
        description: "Modern apartments in the trendy Le Marais district with kitchen facilities and proximity to shopping and dining.",
        priceRange: "$180-240 per night"
      },
      {
        name: "Left Bank Saint Germain",
        description: "Classic Parisian hotel in Saint-Germain-des-Prés, walking distance to Notre-Dame and Latin Quarter.",
        priceRange: "$160-220 per night"
      }
    ],
    localCuisine: [
      {
        name: "Croissants and Pain au Chocolat",
        description: "Start your day with freshly baked French pastries from a local boulangerie."
      },
      {
        name: "Steak Frites",
        description: "A Parisian classic featuring a perfectly cooked steak with crispy French fries."
      },
      {
        name: "Coq au Vin",
        description: "Traditional French dish of chicken braised with wine, mushrooms, and garlic."
      },
      {
        name: "Crêpes",
        description: "Try both sweet dessert crêpes and savory galettes at a traditional crêperie."
      },
      {
        name: "Cheese Plate",
        description: "Sample a variety of French cheeses like Camembert, Brie, and Roquefort with fresh baguette."
      }
    ],
    imagePrompt: "The iconic Eiffel Tower in Paris at sunset with the city lights beginning to twinkle, viewed from Trocadéro Gardens with beautiful fountains in the foreground."
  };
};
