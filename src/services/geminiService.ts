import { TravelFormData, TravelPlan } from '../types';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from '../contexts/AuthContext';

// Get API key from Vite environment variables
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

console.log('Environment check:', {
  hasApiKey: !!GEMINI_API_KEY,
  apiKeyLength: GEMINI_API_KEY?.length
});

if (!GEMINI_API_KEY) {
  throw new Error('VITE_GEMINI_API_KEY environment variable is not set');
}

export const generateTravelPlanWithGemini = async (formData: TravelFormData): Promise<TravelPlan> => {
  try {
    console.log('Starting travel plan generation with form data:', formData);

    const startDate = formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'flexible';
    const endDate = formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'flexible';

    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

    // Single, clear prompt for travel plan generation
    const prompt = `Create a detailed travel plan for a trip to ${formData.destination} from ${formData.source}. The trip will start on ${startDate} and end on ${endDate}, with a budget of $${formData.budget}. The travelers are interested in: ${formData.interests.join(', ')}.

Important: Respond ONLY with a valid JSON object. Do not include any text before or after the JSON. Do not include markdown formatting. The JSON must follow this exact structure and MUST include exactly 3 hotel recommendations and 3 flight options:

{
  "summary": "Brief overview of the trip",
  "daily_itinerary": [
    {
      "date": "YYYY-MM-DD",
      "places": [
        {
          "name": "Location Name",
          "details": {
            "morning": {
              "place_name": "Morning Activity Name",
              "place_details": "Description of morning activity",
              "place_image_url": "URL to activity image",
              "coordinates": {
                "latitude": 0.0,
                "longitude": 0.0
              },
              "ticket_price": 0,
              "rating": 4.5,
              "best_time_to_visit": "Morning"
            },
            "afternoon": {
              "place_name": "Afternoon Activity Name",
              "place_details": "Description of afternoon activity",
              "place_image_url": "URL to activity image",
              "coordinates": {
                "latitude": 0.0,
                "longitude": 0.0
              },
              "ticket_price": 0,
              "rating": 4.5,
              "best_time_to_visit": "Afternoon"
            },
            "evening": {
              "place_name": "Evening Activity Name",
              "place_details": "Description of evening activity",
              "place_image_url": "URL to activity image",
              "coordinates": {
                "latitude": 0.0,
                "longitude": 0.0
              },
              "ticket_price": 0,
              "rating": 4.5,
              "best_time_to_visit": "Evening"
            },
            "night": {
              "place_name": "Night Activity Name",
              "place_details": "Description of night activity",
              "place_image_url": "URL to activity image",
              "coordinates": {
                "latitude": 0.0,
                "longitude": 0.0
              },
              "ticket_price": 0,
              "rating": 4.5,
              "best_time_to_visit": "Night"
            }
          },
          "imageUrl": "URL to location image",
          "coordinates": {
            "lat": 0.0,
            "lng": 0.0
          },
          "ticketPrice": 0,
          "rating": 4.5,
          "bestTimeToVisit": "Recommended time"
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Hotel Name",
      "address": "Hotel Address",
      "price": 100,
      "imageUrl": "URL to hotel image",
      "coordinates": {
        "lat": 0.0,
        "lng": 0.0
      },
      "rating": 4.5,
      "description": "Hotel description"
    }
  ],
  "flights": [
    {
      "departureAirport": "Source Airport Code",
      "arrivalAirport": "Destination Airport Code",
      "flightDuration": "X hours Y minutes",
      "airplaneType": "Aircraft type",
      "airlineName": "Airline Name",
      "airlineLogoUrl": "URL to airline logo",
      "flightNumber": "XX123",
      "flightTime": "Flight Time"
    }
  ],
  "tips": [
    "Travel tip 1",
    "Travel tip 2"
  ]
}`;

    // Generate content with a single call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    console.log('Received raw response from Gemini');

    // Clean and parse the response
    let jsonString = responseText;
    
    // Extract JSON from markdown if present
    if (responseText.includes('```json')) {
      const matches = responseText.match(/```json\n([\s\S]*?)\n```/);
      if (matches && matches[1]) {
        jsonString = matches[1];
      }
    }

    // Clean up the JSON string
    jsonString = jsonString
      .replace(/^[^{]*/, '') // Remove anything before first {
      .replace(/[^}]*$/, '') // Remove anything after last }
      .replace(/[^\x20-\x7E]+/g, '') // Replace control and non-printable characters
      .replace(/\\[rnt]/g, '') // Remove escaped whitespace
      .replace(/,(\s*[}\]])/g, '$1') // Remove trailing commas
      .trim();

    // Validate JSON structure
    if (!jsonString.startsWith('{') || !jsonString.endsWith('}')) {
      throw new Error('Invalid JSON structure in response');
    }

    // Parse the response
    const parsedResponse = JSON.parse(jsonString);
    console.log('Successfully parsed response');

    // Extract travel plan data
    const travelPlanData = parsedResponse.travel_plan || parsedResponse;
    
    // Log flight data for debugging
    console.log('Raw flight data:', travelPlanData.flights);
    if (Array.isArray(travelPlanData.flights)) {
      console.log('Number of flights found:', travelPlanData.flights.length);
      travelPlanData.flights.forEach((flight, index) => {
        console.log(`Flight ${index + 1}:`, {
          airline: flight.airlineName,
          from: flight.departureAirport,
          to: flight.arrivalAirport,
          duration: flight.flightDuration
        });
      });
    }

    // Calculate duration
    const duration = formData.startDate && formData.endDate ? 
      Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 
      3;

    // Create travel plan object
    const travelPlan: TravelPlan = {
      id: crypto.randomUUID(),
      userId: formData.userId || '',
      destination: travelPlanData.destination || formData.destination,
      source: travelPlanData.origin || formData.source,
      startDate: formData.startDate,
      endDate: formData.endDate,
      duration,
      totalBudget: formData.budget,
      travelers: formData.travelers, // Add the missing travelers property
      summary: travelPlanData.summary || `${duration} day trip to ${formData.destination}`,
      hotels: travelPlanData.hotels?.map(hotel => ({
        name: hotel.name,
        address: hotel.address,
        price: hotel.price,
        imageUrl: hotel.imageUrl,
        coordinates: {
          lat: hotel.coordinates?.lat || 0,
          lng: hotel.coordinates?.lng || 0
        },
        rating: hotel.rating,
        description: hotel.description
      })) || [],
      flights: Array.isArray(travelPlanData.flights) ? 
        travelPlanData.flights.slice(0, 3).map(flight => ({
          departureAirport: flight.departureAirport || '',
          arrivalAirport: flight.arrivalAirport || '',
          flightDuration: flight.flightDuration || '',
          airplaneType: flight.airplaneType || '',
          airlineName: flight.airlineName || '',
          airlineLogoUrl: flight.airlineLogoUrl || '',
          flightNumber: flight.flightNumber || '',
          flightTime: flight.flightTime || ''
        })).filter(flight => 
          flight.departureAirport && 
          flight.arrivalAirport && 
          flight.flightDuration && 
          flight.airlineName
        ) : [],
      dayPlans: (travelPlanData.daily_itinerary || []).map((day, index) => ({
        date: day.date || `Day ${index + 1}`,
        places: day.places?.map(place => ({
          name: place.name,
          details: typeof place.details === 'object' ? {
            morning: place.details?.morning || null,
            afternoon: place.details?.afternoon || null,
            evening: place.details?.evening || null,
            night: place.details?.night || null
          } : place.details || '',
          imageUrl: place.imageUrl || '',
          coordinates: {
            lat: place.coordinates?.lat || 0,
            lng: place.coordinates?.lng || 0
          },
          ticketPrice: place.ticketPrice || 0,
          rating: place.rating || 0,
          bestTimeToVisit: place.bestTimeToVisit || ''
        })) || []
      })),
      tips: travelPlanData.tips || []
    };

    // Validate the travel plan
    if (!travelPlan.hotels?.length || !travelPlan.flights?.length || !travelPlan.dayPlans?.length) {
      throw new Error('Generated travel plan is missing required data');
    }

    // Remove this duplicate save - it's already being saved in Planner.tsx
    
    return travelPlan;
  } catch (error) {
    console.error('Error in travel plan generation:', error);
    throw error;
  }
}; 