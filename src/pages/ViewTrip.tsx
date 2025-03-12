
import React, { useState } from "react";
import { MapPin, Calendar, Users, DollarSign, Plane, Hotel, Clock, Navigation, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data - in a real app this would come from an API or context
const tripData = {
  destination: "Paris, France",
  imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9357976b82?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80",
  dates: "Oct 15 - Oct 22, 2023",
  duration: "7 days",
  travelers: 2,
  budget: 3500,
  hotels: [
    {
      id: 1,
      name: "Le Grand Hotel",
      address: "15 Rue de la Paix, 75002 Paris, France",
      price: 250,
      rating: 4.8,
      imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      name: "Hôtel Splendide",
      address: "24 Avenue Montaigne, 75008 Paris, France",
      price: 320,
      rating: 4.9,
      imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      name: "Le Petit Château",
      address: "7 Rue Saint-Dominique, 75007 Paris, France",
      price: 180,
      rating: 4.5,
      imageUrl: "https://images.unsplash.com/photo-1584132905271-512c958d674a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    }
  ],
  flights: [
    {
      id: 1,
      date: "Oct 15",
      departureTime: "9:30 AM",
      departureAirport: "London Heathrow Airport (LHR)",
      arrivalTime: "12:30 PM",
      arrivalAirport: "Paris Charles de Gaulle Airport (CDG)",
      airline: "British Airways",
      duration: "3h 0m",
      price: 210
    },
    {
      id: 2,
      date: "Oct 16",
      departureTime: "7:00 PM",
      departureAirport: "London Heathrow Airport (LHR)",
      arrivalTime: "10:00 PM",
      arrivalAirport: "Paris Charles de Gaulle Airport (CDG)",
      airline: "Air France",
      duration: "3h 0m",
      price: 195
    },
    {
      id: 3,
      date: "Oct 18",
      departureTime: "2:15 PM",
      departureAirport: "London Heathrow Airport (LHR)",
      arrivalTime: "5:15 PM",
      arrivalAirport: "Paris Charles de Gaulle Airport (CDG)",
      airline: "Lufthansa",
      duration: "3h 0m",
      price: 240
    }
  ],
  activities: [
    {
      id: 1,
      name: "Eiffel Tower",
      description: "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris.",
      price: 25,
      duration: "2 hours",
      imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 2,
      name: "Louvre Museum",
      description: "Explore one of the world's largest art museums and see the Mona Lisa.",
      price: 17,
      duration: "3 hours",
      imageUrl: "https://images.unsplash.com/photo-1565099824688-e7a5d56220eb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
    },
    {
      id: 3,
      name: "Seine River Cruise",
      description: "Enjoy a relaxing cruise along the Seine River with commentary.",
      price: 15,
      duration: "1 hour",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80"
    }
  ]
};

const ViewTrip: React.FC = () => {
  const [selectedHotel, setSelectedHotel] = useState<number | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section with Destination Image */}
      <div className="relative h-80">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${tripData.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            {tripData.destination}
          </h1>
          <div className="flex flex-wrap gap-4 text-white">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>{tripData.dates}</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              <span>{tripData.duration}</span>
            </div>
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{tripData.travelers} travelers</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              <span>Budget: ${tripData.budget}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="hotels" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-8 bg-white">
            <TabsTrigger value="hotels" className="flex-1">
              <Hotel className="w-4 h-4 mr-2" />
              Hotels
            </TabsTrigger>
            <TabsTrigger value="flights" className="flex-1">
              <Plane className="w-4 h-4 mr-2" />
              Flights
            </TabsTrigger>
            <TabsTrigger value="activities" className="flex-1">
              <Navigation className="w-4 h-4 mr-2" />
              Activities
            </TabsTrigger>
          </TabsList>

          {/* Hotels Tab */}
          <TabsContent value="hotels" className="animate-fade-in staggered-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Hotel Recommendations
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tripData.hotels.map((hotel) => (
                <div 
                  key={hotel.id}
                  className={`bg-white rounded-lg shadow-subtle overflow-hidden transition-all hover:shadow-lg ${
                    selectedHotel === hotel.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedHotel(hotel.id)}
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={hotel.imageUrl} 
                      alt={hotel.name}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{hotel.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-start mb-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="ml-1.5 text-sm text-gray-600">{hotel.address}</p>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-blue-600 font-semibold">${hotel.price}<span className="text-gray-500 text-sm font-normal">/night</span></span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={selectedHotel === hotel.id ? "bg-blue-50" : ""}
                      >
                        {selectedHotel === hotel.id ? "Selected" : "Select"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Flights Tab */}
          <TabsContent value="flights" className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Flight Recommendations
            </h2>
            
            <div className="space-y-4">
              {tripData.flights.map((flight) => (
                <div 
                  key={flight.id} 
                  className={`bg-white rounded-lg shadow-subtle p-4 transition-all hover:shadow-md ${
                    selectedFlight === flight.id ? 'border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedFlight(flight.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Departure: {flight.date}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600"
                      >
                        Select Flight
                      </Button>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-medium">
                        ${flight.price}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-3">
                    <div className="flex flex-col">
                      <span className="text-lg font-medium">{flight.departureTime}</span>
                      <span className="text-sm text-gray-500">{flight.departureAirport}</span>
                    </div>
                    
                    <div className="hidden sm:flex items-center mx-4 text-gray-400">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <div className="w-24 h-0.5 bg-gray-300"></div>
                      <Plane className="w-4 h-4 mx-2" />
                      <div className="w-24 h-0.5 bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                    </div>
                    
                    <div className="flex flex-col mt-2 sm:mt-0">
                      <span className="text-lg font-medium">{flight.arrivalTime}</span>
                      <span className="text-sm text-gray-500">{flight.arrivalAirport}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 text-sm">
                    <div>
                      <span className="font-medium">{flight.airline}</span>
                    </div>
                    <div className="text-gray-600">
                      <span>Duration: {flight.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Recommended Activities
            </h2>
            
            <div className="space-y-4">
              {tripData.activities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg shadow-subtle overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="sm:w-1/4 h-40 sm:h-auto">
                      <img 
                        src={activity.imageUrl} 
                        alt={activity.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-4">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">{activity.name}</h3>
                      <p className="text-gray-600 mb-3">{activity.description}</p>
                      
                      <div className="flex flex-wrap gap-3 text-sm">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span>Ticket Price: ${activity.price}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Time to Travel: {activity.duration}</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <Button size="sm" variant="outline" className="flex items-center">
                          <MapPin className="mr-1.5 h-4 w-4" />
                          View on Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ViewTrip;
