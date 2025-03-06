export interface TravelFormData {
  source: string;
  destination: string;
  startDate: Date | null;
  endDate: Date | null;
  budget: number;
  travelers: number;
  interests: string[];
}

export interface TravelPlanDay {
  day: number;
  date: string;
  activities: TravelActivity[];
}

export interface TravelActivity {
  time: string;
  description: string;
  type: 'transportation' | 'sightseeing' | 'meal' | 'accommodation' | 'other';
  cost?: number;
  location?: string;
}

export interface TravelPlan {
  destination: string;
  duration: number;
  totalBudget: number;
  summary: string;
  days: TravelPlanDay[];
  tips: string[];
  flightInfo?: {
    departureTime: string;
    arrivalTime: string;
    airline: string;
    price: number;
  };
  accommodation?: {
    name: string;
    location: string;
    pricePerNight: number;
    totalCost: number;
  };
}

export interface TravelPlanData {
  destination: string;
  duration: string;
  overview: string;
  dailyItinerary: Array<{
    day: number;
    title: string;
    activities: string[];
    meals: string[];
  }>;
  budgetBreakdown: {
    accommodation: number;
    transportation: number;
    food: number;
    activities: number;
    miscellaneous: number;
    total: number;
  };
  travelTips: string[];
  accommodations: Array<{
    name: string;
    description: string;
    priceRange: string;
  }>;
  localCuisine: Array<{
    name: string;
    description: string;
  }>;
  imagePrompt: string;
  flightSuggestions?: {
    source: string;
    destination: string;
    date: string;
  };
}
