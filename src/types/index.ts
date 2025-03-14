export interface TravelFormData {
  destination: string;
  source: string;
  startDate?: string;
  endDate?: string;
  travelers: number;
  budget: number;
  interests: string[];
  userId?: string;
}

export interface Hotel {
  name: string;
  address: string;
  price: number;
  imageUrl: string;
  coordinates: Coordinates;
  rating: number;
  description: string;
}

export interface Flight {
  departureAirport: string;
  arrivalAirport: string;
  flightDuration: string;
  airplaneType: string;
  airlineName: string;
  airlineLogoUrl: string;
  flightNumber: string;
  flightTime: string;
}

export interface Place {
  name: string;
  details: string | {
    early_morning?: Activity | null;
    morning?: Activity | null;
    afternoon?: Activity | null;
    evening?: Activity | null;
    night?: Activity | null;
  };
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  ticketPrice: number;
  rating: number;
  bestTimeToVisit: string;
}

export interface Activity {
  place_name: string;
  place_details: string;
  place_image_url: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  ticket_price: number;
  rating: number;
  best_time_to_visit: string;
}

export interface ActivityTimes {
  early_morning?: Activity;
  morning?: Activity;
  afternoon?: Activity;
  evening?: Activity;
  night?: Activity;
}

export interface DayPlan {
  date: string;
  places: Place[];
}

export interface TravelPlan {
  id: string;
  userId: string;
  destination: string;
  source: string;
  startDate: string;
  endDate: string;
  duration: number;
  totalBudget: number;
  summary: string;
  hotels: Hotel[];
  flights: Flight[];
  dayPlans: DayPlan[];
  tips: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  savedTrips: TravelPlan[];
}

export interface Coordinates {
  lat: number;
  lng: number;
}
