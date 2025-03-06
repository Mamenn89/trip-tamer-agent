
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, DollarSign, Plane, Hotel, Info, Download, Share2 } from 'lucide-react';
import { TravelPlan as TravelPlanType, TravelPlanData } from '../types';
import TravelCard from './TravelCard';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlightSuggestions from './FlightSuggestions';

interface TravelPlanProps {
  plan: TravelPlanData;
  onStartOver: () => void;
}

const TravelPlan: React.FC<TravelPlanProps> = ({ plan, onStartOver }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentDay, setCurrentDay] = useState(1);
  
  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };
  
  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };
  
  const selectDay = (day: number) => {
    setCurrentDay(day);
    
    // Find the card element and scroll to it
    const element = document.getElementById(`day-card-${day}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Convert TravelPlanData to format expected by TravelCard
  const getDays = () => {
    if (!plan.dailyItinerary) return [];
    
    return plan.dailyItinerary.map(day => ({
      day: day.day,
      date: day.title,
      activities: day.activities.map((activity, index) => ({
        time: `${index + 8}:00 ${index + 8 >= 12 ? 'PM' : 'AM'}`,
        description: activity,
        type: 'sightseeing' as const,
        location: plan.destination
      }))
    }));
  };
  
  const days = getDays();
  
  // Parse the departure date from the first day's title if available
  const getDepartureDate = () => {
    if (plan.dailyItinerary && plan.dailyItinerary.length > 0) {
      return plan.dailyItinerary[0].title;
    }
    return "flexible";
  };
  
  return (
    <div className="max-w-4xl mx-auto animate-reveal">
      <div className="bg-white rounded-xl shadow-subtle overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Your Trip to {plan.destination}</h2>
          <div className="flex flex-wrap gap-y-2 gap-x-4 text-blue-100 mb-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1.5" />
              <span>{plan.duration}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5" />
              <span>Budget: ${plan.budgetBreakdown?.total || 0}</span>
            </div>
          </div>
          <p className="text-blue-50 max-w-3xl">{plan.overview}</p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button 
              onClick={onStartOver} 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Start Over
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="mr-1 h-4 w-4" />
              Save Itinerary
            </Button>
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="mr-1 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="itinerary" className="mb-8">
        <TabsList className="w-full bg-white shadow-sm border border-gray-100 p-1">
          <TabsTrigger value="itinerary" className="flex-1">Itinerary</TabsTrigger>
          <TabsTrigger value="flights" className="flex-1">Flights</TabsTrigger>
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="tips" className="flex-1">Travel Tips</TabsTrigger>
        </TabsList>
        
        <TabsContent value="itinerary" className="pt-6">
          {/* Day selection */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-subtle border-gray-200"
                onClick={handleScrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            
            <div 
              ref={scrollContainerRef}
              className="flex space-x-2 overflow-x-auto py-2 px-10 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {days.map((day) => (
                <button
                  key={day.day}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    currentDay === day.day
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => selectDay(day.day)}
                >
                  Day {day.day}
                </button>
              ))}
            </div>
            
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-white shadow-subtle border-gray-200"
                onClick={handleScrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Day cards */}
          <div className="space-y-8">
            {days.map((day) => (
              <div key={day.day} id={`day-card-${day.day}`}>
                <TravelCard day={day.day} date={day.date} activities={day.activities} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="flights" className="pt-6">
          <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center space-x-2">
                <Plane className="text-blue-600 w-5 h-5" />
                <h3 className="font-medium text-gray-900">Flight Options</h3>
              </div>
            </div>
            
            <div className="p-6">
              <FlightSuggestions
                source={plan.flightSuggestions?.source || "Unknown"}
                destination={plan.destination}
                date={getDepartureDate()}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="overview" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Breakdown */}
            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center space-x-2">
                  <DollarSign className="text-blue-600 w-5 h-5" />
                  <h3 className="font-medium text-gray-900">Budget Breakdown</h3>
                </div>
              </div>
              
              <div className="p-6">
                {plan.budgetBreakdown && (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Accommodation</span>
                        <span className="font-medium">${plan.budgetBreakdown.accommodation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transportation</span>
                        <span className="font-medium">${plan.budgetBreakdown.transportation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Food</span>
                        <span className="font-medium">${plan.budgetBreakdown.food}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Activities</span>
                        <span className="font-medium">${plan.budgetBreakdown.activities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Miscellaneous</span>
                        <span className="font-medium">${plan.budgetBreakdown.miscellaneous}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold text-lg">${plan.budgetBreakdown.total}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Accommodation Information */}
            <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
              <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
                <div className="flex items-center space-x-2">
                  <Hotel className="text-blue-600 w-5 h-5" />
                  <h3 className="font-medium text-gray-900">Recommended Accommodations</h3>
                </div>
              </div>
              
              <div className="p-6">
                {plan.accommodations && plan.accommodations.map((accommodation, index) => (
                  <div key={index} className={`${index > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''}`}>
                    <div className="font-medium">{accommodation.name}</div>
                    <p className="text-sm text-gray-600 mt-1">{accommodation.description}</p>
                    <div className="text-sm text-blue-600 mt-1">{accommodation.priceRange}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Local Cuisine */}
          <div className="mt-6 bg-white rounded-xl shadow-subtle overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center space-x-2">
                <Info className="text-blue-600 w-5 h-5" />
                <h3 className="font-medium text-gray-900">Must-Try Local Cuisine</h3>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {plan.localCuisine && plan.localCuisine.map((cuisine, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-medium">{cuisine.name}</div>
                    <p className="text-sm text-gray-600 mt-1">{cuisine.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="tips" className="pt-6">
          <div className="bg-white rounded-xl shadow-subtle overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center space-x-2">
                <Info className="text-blue-600 w-5 h-5" />
                <h3 className="font-medium text-gray-900">Travel Tips for {plan.destination}</h3>
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4">
                {plan.travelTips && plan.travelTips.map((tip, index) => (
                  <li key={index} className="flex">
                    <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm mr-3">
                      {index + 1}
                    </span>
                    <p className="text-gray-700">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TravelPlan;
